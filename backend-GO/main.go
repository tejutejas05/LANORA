package main

import (
	"net/http"
	"fmt"

	"lanora-backend/database"
	
)

func main(){
	database.Connect()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Server is running")
	})

	fmt.Println("Server started at :8080")
	http.ListenAndServe(":8080", nil)

}

