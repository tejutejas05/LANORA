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
			w.WriteHeader(http.StatusOK)
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

	http.HandleFunc("/test-agent", middleware.VerifyJWT(handlers.TestAgent)) // for the cli
	http.HandleFunc("/test-agent-stream", middleware.VerifyJWT(handlers.TestAgentStream)) // for the frontend
	
	// // api call 
	// http.HandleFunc("/api/dashboard", middleware.VerifyJWT(handlers.DashboardHandler))
	// http.HandleFunc("/api/sandboxes", middleware.VerifyJWT(handlers.SandboxersHandler))
	// http.HandleFunc("/api/history", middleware.VerifyJWT(handlers.historyHandler))
	// http.HandleFunc("/api/resources", middleware.VerifyJWT(handlers.resourcesHandler))

	api := &handlers.APIHandler{DB: database.DB}

	http.HandleFunc("/api/dashboard", api.DashboardHandler)
	http.HandleFunc("/api/sandboxes", api.SandboxesHandler)
	http.HandleFunc("/api/history", api.HistoryHandler)
	http.HandleFunc("/api/resources", api.ResourcesHandler)



	//  IMPORTANT ROUTE
	http.HandleFunc("/register", handlers.Register)
	http.HandleFunc("/login", handlers.Login)

	fmt.Println("Server started at :5000")
	


	//wraping default ServerMux with Cors
	err := http.ListenAndServe(":5000", 
		enableCORS(http.DefaultServeMux),
	)
	
	if err != nil {
		panic(err)
	}
}