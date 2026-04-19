package handlers

import(
	"fmt"
	"io"
	"net/http"
	"os"
	"encoding/json"
	"path/filepath"
	//"lanora-backend/models"
	"lanora-backend/services"

)

func TestAgent(w http.ResponseWriter, r *http.Request) {

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	fmt.Println("/test-agent hit")

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

	// --------------------------jev---------------------------------

	imagename ,err := services.BuildDockerImage(filePath)

	if err != nil {
		
		response := map[string] interface{} {
			"status": "error",
			"stage": "build",
			"error": err.Error(),
		}

		json.NewEncoder(w).Encode(response)
		return 
	}

	//------------------------------------------------------------------------


	// here i will take the logs from the running container

	logs, err := services.RunDockerContainer(imagename)

	response := map[string]interface{}{}

	if err != nil {

		response["status"] = "error"
		response["stage"] = "runtime"
		response["error"] = err.Error()
		response["logs"] = logs
	} else {
		response["status"] = "success"
		response["logs"] = logs
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	json.NewEncoder(w).Encode(response)

}