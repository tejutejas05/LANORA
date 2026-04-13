package main

import (
	"fmt"
	"net/http"

	"lanora-backend/database"
	"lanora-backend/handlers"
	"lanora-backend/middleware"

)

func main() {

	database.Connect()

	// test route
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Server is running ")
	})

	http.HandleFunc("/test-agent", middleware.VerifyJWT(handlers.TestAgent))
	// function for the test
	http.HandleFunc("/run-agent", middleware.VerifyJWT(handlers.RunAgent))

	//  IMPORTANT ROUTE
	http.HandleFunc("/auth/register", handlers.Register)
	http.HandleFunc("/auth/login", handlers.Login)

	fmt.Println("Server started at :5000")
	http.ListenAndServe(":5000", nil)
}