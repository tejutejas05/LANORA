package handlers

import (
	"archive/zip"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// ---------------- ZIP UNZIP ----------------
func unzip(src string, dest string) error {
	r, err := zip.OpenReader(src)
	if err != nil {
		return err
	}
	defer r.Close()

	for _, f := range r.File {

		filePath := filepath.Join(dest, f.Name)

		// security check
		if !strings.HasPrefix(filePath, filepath.Clean(dest)+string(os.PathSeparator)) {
			return fmt.Errorf("invalid file path: %s", filePath)
		}

		if f.FileInfo().IsDir() {
			os.MkdirAll(filePath, os.ModePerm)
			continue
		}

		if err := os.MkdirAll(filepath.Dir(filePath), os.ModePerm); err != nil {
			return err
		}

		outFile, err := os.Create(filePath)
		if err != nil {
			return err
		}

		rc, err := f.Open()
		if err != nil {
			outFile.Close()
			return err
		}

		_, err = io.Copy(outFile, rc)

		outFile.Close()
		rc.Close()

		if err != nil {
			return err
		}
	}

	return nil
}

// ---------------- MAIN HANDLER ----------------
func TestAgentWS(w http.ResponseWriter, r *http.Request) {

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Upgrade error:", err)
		return
	}
	defer conn.Close()

	// 1. RECEIVE ZIP
	_, zipData, err := conn.ReadMessage()
	if err != nil {
		conn.WriteMessage(websocket.TextMessage, []byte("Failed to receive zip\n"))
		return
	}

	// 2. CREATE PROJECT DIR
	projectPath := "./temp_project"
	os.RemoveAll(projectPath)
	os.MkdirAll(projectPath, os.ModePerm)

	zipPath := filepath.Join(projectPath, "project.zip")
	os.WriteFile(zipPath, zipData, 0644)

	// 3. UNZIP
	err = unzip(zipPath, projectPath)
	if err != nil {
		conn.WriteMessage(websocket.TextMessage, []byte("Unzip failed\n"))
		fmt.Println("Unzip error:", err)
		return
	}

	fmt.Println("📦 Unzip complete")

	// 4. FIND ROOT FOLDER
	entries, err := os.ReadDir(projectPath)
	if err != nil {
		fmt.Println("ReadDir error:", err)
		return
	}

	var srcPath string
	for _, e := range entries {
		if e.IsDir() {
			srcPath = filepath.Join(projectPath, e.Name())
			break
		}
	}

	if srcPath == "" {
		fmt.Println("❌ No project folder found")
		return
	}

	fmt.Println("📁 Detected project path:", srcPath)

	// 5. FLATTEN PROJECT
	fmt.Println("📦 Flattening project structure...")

	if _, err := os.Stat(filepath.Join(projectPath, "main.py")); os.IsNotExist(err) {

		filepath.Walk(srcPath, func(path string, info os.FileInfo, err error) error {

			if err != nil || info == nil {
				return nil
			}

			if !info.IsDir() {

				dest := filepath.Join(projectPath, info.Name())

				input, err := os.ReadFile(path)
				if err != nil {
					return nil
				}

				os.WriteFile(dest, input, 0644)
			}

			return nil
		})
	}

	// 6. DOCKERFILE AUTO CREATE
	dockerfilePath := filepath.Join(projectPath, "Dockerfile")

	if _, err := os.Stat(dockerfilePath); os.IsNotExist(err) {

		fmt.Println("🐳 Creating Dockerfile...")

		dockerfileContent := `FROM python:3.10

WORKDIR /app

COPY . .

RUN if [ -f requirements.txt ]; then pip install -r requirements.txt; fi

CMD ["python", "main.py"]
`

		os.WriteFile(dockerfilePath, []byte(dockerfileContent), 0644)
	}

	// 7. BUILD DOCKER IMAGE
	imageName := "lanora-test-image"

	fmt.Println("🐳 Building Docker image...")

	cmdBuild := exec.Command("docker", "build", "-t", imageName, projectPath)
	buildOutput, err := cmdBuild.CombinedOutput()

	conn.WriteMessage(websocket.TextMessage, buildOutput)

	if err != nil {
		conn.WriteMessage(websocket.TextMessage, []byte("Docker build failed\n"))
		fmt.Println(string(buildOutput))
		return
	}

	// 8. RUN CONTAINER
	fmt.Println("🚀 Running container...")

	cmd := exec.Command("docker", "run", "-i", "--rm", imageName)

	stdin, _ := cmd.StdinPipe()
	stdout, _ := cmd.StdoutPipe()
	stderr, _ := cmd.StderrPipe()

	err = cmd.Start()
	if err != nil {
		conn.WriteMessage(websocket.TextMessage, []byte("Failed to start container\n"))
		return
	}

	// 9. STREAM OUTPUT
	go func() {
		reader := io.MultiReader(stdout, stderr)
		buf := make([]byte, 1024)

		for {
			n, err := reader.Read(buf)
			if err != nil {
				break
			}
			conn.WriteMessage(websocket.TextMessage, buf[:n])
		}
	}()

	// 10. HANDLE INPUT
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			break
		}

		stdin.Write(msg)
		stdin.Write([]byte("\n"))
	}

	cmd.Wait()
}