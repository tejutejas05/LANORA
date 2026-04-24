package main

import (
	"fmt"
	"net/http"

	"lanora-backend/database"
	"lanora-backend/handlers"
	"lanora-backend/middleware"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {

	database.Connect()

	api := &handlers.APIHandler{DB: database.DB}

	// ---------------- HEALTH ----------------
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Lanora backend running")
	})

	// ---------------- AUTH (Frontend) ----------------
	http.HandleFunc("/api/register", handlers.Register)
	http.HandleFunc("/api/login", handlers.Login)

	// ---------------- AUTH (CLI COMPATIBILITY) ----------------
	http.HandleFunc("/register", handlers.Register)
	http.HandleFunc("/login", handlers.Login)

	// ---------------- AGENT ROUTES ----------------
	http.HandleFunc("/api/test-agent", middleware.VerifyJWT(api.TestAgent))
	http.HandleFunc("/api/test-agent-stream", middleware.VerifyJWT(handlers.TestAgentStream))
	http.HandleFunc("/deploy-agent", middleware.VerifyJWT(api.DeployAgent))

	// CLI compatibility
	http.HandleFunc("/test-agent", middleware.VerifyJWT(api.TestAgent))

	// ---------------- DASHBOARD APIs ----------------
	http.HandleFunc("/api/dashboard", middleware.VerifyJWT(api.DashboardHandler))
	http.HandleFunc("/api/sandboxes", middleware.VerifyJWT(api.SandboxesHandler))
	http.HandleFunc("/api/history", middleware.VerifyJWT(api.HistoryHandler))
	http.HandleFunc("/api/resources", middleware.VerifyJWT(api.ResourcesHandler))

	http.HandleFunc("/agent/", api.AgentProxy) // new 

	fmt.Println("Server started at :5000")

	err := http.ListenAndServe(":5000", enableCORS(http.DefaultServeMux))
	if err != nil {
		fmt.Println("Server error:", err)
	}
}