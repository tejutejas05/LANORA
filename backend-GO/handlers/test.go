package handlers

import(
	"fmt"
	"io"
	"net/http"
	"os"
	"encoding/json"
	"path/filepath"
	"lanora-backend/models"
	"lanora-backend/services"

)

func TestAgent(w http.ResponseWriter, r *http.Request) {

	fmt.Println("/test-agent hit")

	// file, handler, err := r.FormFile("file")
	// if err != nil {
	// 	http.Error(w, "File not recevied", 400)
	// 	return
	// }
	// defer file.Close()

	// fmt.Println("file recevied:", handler.Filename)

	// // save file locally for temp
	// out, err := os.Create(handler.Filename)
	// if err != nil{
	// 	http.Error(w, "Cannot save file", 500)
	// 	return 
	// }
	// defer out.Close()

	// io.Copy(out, file)

	// Allowson,y the post request
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// file upload part
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w,"cannot parse form", http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "File not recevied", http.StatusBadRequest)
		return
	}
	defer file.Close()
	
	fmt.Println("File received:", handler.Filename)

	// here we create a uploads folder and store the zip inside it.....

	uploadDir := "uploads"
	os.MkdirAll(uploadDir, os.ModePerm)


	filePath := filepath.Join(uploadDir, handler.Filename)

	out, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "Cannot save file", http.StatusInternalServerError)
		return
	}
	defer out.Close()

	_, err = io.Copy(out, file)
	if err != nil {
		http.Error(w,"Failes to save file", http.StatusInternalServerError)
		return
	}

	fmt.Println("File saved at:", filePath)

	//sending the response
	response := map[string]string {
		"status": "success",
		"message": "File uploaded successfully",
		"path": filePath,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)

}

// func TestAgentHandler(w http.ResponseWriter, r *http.Request) {
	
// 	var req models.TestAgentRequest

// 	err := json.NewDecoder(r.Body).Decode(&req)
// 	if err != nil {
// 		http.Error(w, "Invalid request", http.StatusBadRequest)
// 		return
// 	}

// 	logs, err := map[string]interface{}{}

// 	if err != nil {
// 		response["status"] = "error"
// 		response["error"] = err.Error()
// 	}
// 	else{
// 		response["status"] = "success"
// 		response["logs"] = logs
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(response)
// }

//docker part

func RunAgent(w http.ResponseWriter, r *http.Request) {

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return 
	}

	var req models.TestAgentRequest

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		http.Error(w, "invalid Request", http.StatusBadRequest)
		return
	}

	logs, err := services.RunDockerContainer(req.Image)

	response := map[string]interface{}{}

	if err != nil {
		response["status"] = "error"
		response["error"] = err.Error()
	} else {
		response["status"] = "success"
		response["logs"] = logs
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)


}

