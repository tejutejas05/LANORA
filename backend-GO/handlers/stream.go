package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"lanora-backend/services"
)

func TestAgentStream(w http.ResponseWriter, r *http.Request) {

	//setup streaming

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming not supported", 500)
		return
	}

	w.Header().Set("Content-Type", "text/plain")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	send := func(msg string) {
		fmt.Fprintf(w, "%s", msg)
		flusher.Flush()
	}

	send("[INFO] Uploading project...\n")

	// parse file

	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("file")
	if err != nil {
		send("[ERROR] File not received\n")
		return
	}
	defer file.Close()

	// saves the files

	uploadDir := "uploads"
	os.MkdirAll(uploadDir, os.ModePerm)

	filePath := filepath.Join(uploadDir, handler.Filename)

	out, _ := os.Create(filePath)
	io.Copy(out, file)
	out.Close()

	send("[INFO] Upload complete\n")

	// image building 

	send("[INFO] Building Docker image...\n")

	imageName, err := services.BuildDockerImage(filePath)
	if err != nil {
		send("[ERROR] Build failed: " + err.Error() + "\n")
		return
	}

	send("[INFO] Build complete\n")

	// stream logs

	send("[INFO] Running container...\n")

	err = services.RunDockerContainerStream(imageName, send)
	if err != nil {
		send("[ERROR] Runtime failed: " + err.Error() + "\n")
		return
	}

	send("[SUCCESS] Execution completed\n")
}