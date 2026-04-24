package handlers

import(
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"lanora-backend/services"
)

func (h *APIHandler) TestAgent(w http.ResponseWriter, r *http.Request) {

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	fmt.Println("/test-agent hit")

	db := h.DB

	//parse uploaded zip

	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Cannot parse Form", http.StatusBadRequest)
		return 
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "file not received", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// save uploaded zip 

	uploadDir := "uploads"
	os.MkdirAll(uploadDir, os.ModePerm)

	filePath := filepath.Join(
		uploadDir,
		handler.Filename,
	)

	out , err := os.Create(filePath)
	if err != nil {
		http.Error(w, "cannot save the file", http.StatusInternalServerError)
		return
	}
	defer out.Close()

	_, err = io.Copy(out, file)
	if err != nil {
		http.Error(w, "failed to save the file", http.StatusInternalServerError)
		return
	}

	fmt.Println("Zip saved at : ", filePath)

	//----------------------new code ---------------------

	agentName := strings.TrimSuffix(handler.Filename, ".zip")

	startTime := time.Now()
	var runID int

	err = db.QueryRow(`
		INSERT INTO agent_runs (agent_name, run_status, started_at)
		VALUES ($1, $2, $3)
		RETURNING id
	`, agentName, "running", startTime).Scan(&runID)

	if err != nil {
	fmt.Println("DB ERROR:", err)   
	http.Error(w, err.Error(), http.StatusInternalServerError)
	return
}

	// --------------------------jev---------------------------------

	 imagename ,err := services.BuildDockerImage(filePath)

	 if err != nil {

		//update failed
		db.Exec(`
			UPDATE agent_runs
			SET run_status=$1, finished_at=$2
			WHERE id=$3
		`, "failed", time.Now(), runID)

		
	 	response := map[string] interface{} {
	 		"status": "error",
	 		"stage": "build",
	 		"error": err.Error(),
	 	}

	 	json.NewEncoder(w).Encode(response)
	 	return 
	 }

	//-----------------------------------------------------------
	
	startExec := time.Now()


	// here i will take the logs from the running container

	logs, err := services.RunDockerContainer(imagename)

	endExec := time.Now()
	runtime := int(endExec.Sub(startExec).Seconds())

	status := "success"
	if err != nil {
		status = "failed"
	}

	// ------------------ UPDATE: agent_runs ------------------

	db.Exec(`
		UPDATE agent_runs
		SET run_status=$1, finished_at=$2
		WHERE id=$3
	`, status, endExec, runID)

	// ------------------ INSERT: sandboxes ------------------

	db.Exec(`
		INSERT INTO sandboxes (name, status, runtime_seconds, storage_mb)
		VALUES ($1, $2, $3, $4)
	`, agentName, status, runtime, 200)

	// ------------------ INSERT: resource_usage ------------------

	db.Exec(`
		INSERT INTO resource_usage (memory_mb, token_count, gpu_percent, runtime_seconds)
		VALUES ($1, $2, $3, $4)
	`, 512, 1000, 20, runtime)

	// ------------------ Final Response ------------------

	response := map[string]interface{}{
		"status": status,
		"logs":   logs,
	}

	if err != nil {
		response["stage"] = "runtime"
		response["error"] = err.Error()
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)

}