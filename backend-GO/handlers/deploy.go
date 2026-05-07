package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

func (h *APIHandler) DeployAgent(w http.ResponseWriter, r *http.Request) {

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	db := h.DB

	// ------------------ 1. Parse ZIP ------------------
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Cannot parse form", 400)
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "File not received", 400)
		return
	}
	defer file.Close()

	// ------------------ 2. Save ZIP ------------------
	uploadDir := "uploads"
	os.MkdirAll(uploadDir, os.ModePerm)

	filePath := filepath.Join(uploadDir, handler.Filename)

	out, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "Cannot save file", 500)
		return
	}
	defer out.Close()

	io.Copy(out, file)

	agentName := strings.TrimSuffix(handler.Filename, ".zip")

	// ------------------ 3. INSERT run ------------------
	startTime := time.Now()
	var runID int

	err = db.QueryRow(`
		INSERT INTO agent_runs (agent_name, run_status, started_at)
		VALUES ($1, $2, $3)
		RETURNING id
	`, agentName, "deploying", startTime).Scan(&runID)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	// ------------------ 4. UNZIP ------------------
	extractDir := filepath.Join("uploads", fmt.Sprintf("agent_%d", runID))
	os.MkdirAll(extractDir, os.ModePerm)

	unzipCmd := exec.Command("unzip", filePath, "-d", extractDir)
	if err := unzipCmd.Run(); err != nil {
		http.Error(w, "Failed to unzip project", 500)
		return
	}

	// ------------------ 5. HANDLE NESTED FOLDER ------------------
	projectPath := extractDir
	files, _ := os.ReadDir(extractDir)

	if len(files) == 1 && files[0].IsDir() {
		projectPath = filepath.Join(extractDir, files[0].Name())
	}

	// ------------------ 6. CREATE DOCKERFILE (AUTO) ------------------
	dockerfilePath := filepath.Join(projectPath, "Dockerfile")

	if _, err := os.Stat(dockerfilePath); os.IsNotExist(err) {

		dockerContent := `
FROM python:3.10

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["python", "main.py"]
`

		err = os.WriteFile(dockerfilePath, []byte(dockerContent), 0644)
		if err != nil {
			http.Error(w, "Failed to create Dockerfile", 500)
			return
		}
	}

	// ------------------ 7. BUILD IMAGE ------------------
	imageName := fmt.Sprintf("lanora-%d", runID)

	buildCmd := exec.Command(
		"docker", "build", "-t", imageName, projectPath,
	)

	buildOutput, err := buildCmd.CombinedOutput()
	if err != nil {

		db.Exec(`UPDATE agent_runs SET run_status=$1 WHERE id=$2`, "failed", runID)

		json.NewEncoder(w).Encode(map[string]interface{}{
			"status": "error",
			"stage":  "build",
			"error":  string(buildOutput),
		})
		return
	}

	// ------------------ 8. ASSIGN PORT ------------------
	port := 8000 + runID

	// ------------------ 9. RUN CONTAINER ------------------
	runCmd := exec.Command(
		"docker", "run", "-d",
		"-p", fmt.Sprintf("%d:8000", port),
		imageName,
	)

	runOutput, err := runCmd.CombinedOutput()
	if err != nil {

		db.Exec(`UPDATE agent_runs SET run_status=$1 WHERE id=$2`, "failed", runID)

		json.NewEncoder(w).Encode(map[string]interface{}{
			"status": "error",
			"stage":  "runtime",
			"error":  string(runOutput),
		})
		return
	}

	containerID := strings.TrimSpace(string(runOutput))

	// ------------------ 10. UPDATE DB ------------------
	db.Exec(`
		UPDATE agent_runs 
		SET run_status=$1, port=$2, finished_at=$3
		WHERE id=$4
	`, "running", port, time.Now(), runID)

	// ------------------ 11. PUBLIC URL ------------------
	baseURL := "https://easing-monoxide-jalapeno.ngrok-free.dev"
	publicURL := fmt.Sprintf("%s/agent/%d", baseURL, runID)

	// ------------------ 12. RESPONSE ------------------
	response := map[string]interface{}{
		"status":       "deployed",
		"agent_id":     runID,
		"container_id": containerID,
		"url":          publicURL,
		"port":         port,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}