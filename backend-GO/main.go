package main

import (
	"fmt"
	"net/http"

	"lanora-backend/database"
	"lanora-backend/handlers"
)

func main() {

	database.Connect()

	// test route
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Server is running ")
	})

	//  IMPORTANT ROUTE
	http.HandleFunc("/auth/register", handlers.Register)

	fmt.Println("Server started at :5000")
	http.ListenAndServe(":5000", nil)
}