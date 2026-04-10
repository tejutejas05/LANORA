package handlers

import(
	"fmt"
	"io"
	"net/http"
	"os"
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