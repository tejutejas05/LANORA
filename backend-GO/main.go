package main

import (
	"fmt"
	"net/http"
	"lanora-backend/database"
	"lanora-backend/handlers"
	"lanora-backend/middleware"

)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request)  {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			return
		}
		
		next.ServeHTTP(w,r)
	})
}

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
	http.HandleFunc("/register", handlers.Register)
	http.HandleFunc("/login", handlers.Login)

	fmt.Println("Server started at :5000")
	http.ListenAndServe(":5000", nil)
}