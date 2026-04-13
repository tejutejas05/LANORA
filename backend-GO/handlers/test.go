package handlers

import(
	"fmt"
	"io"
	"net/http"
	"os"
	"encoding/json"

	"lanora-backend/models"
	"lanora-backend/services"

)

func TestAgent(w http.ResponseWriter, r *http.Request) {

	fmt.Println("/test-agent hit")

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "File not recevied", 400)
		return
	}
	defer file.Close()

	fmt.Println("file recevied:", handler.Filename)

	// save file locally for temp
	out, err := os.Create(handler.Filename)
	if err != nil{
		http.Error(w, "Cannot save file", 500)
		return 
	}
	defer out.Close()

	io.Copy(out, file)

	fmt.Println("File saved successfully!!")
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

