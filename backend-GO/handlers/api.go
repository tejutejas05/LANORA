package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type APIHandler struct{
	DB *sql.DB
}


type DashboardResponse struct {
	ActiveSandboxes int `json:"active_sandboxes"`
	TotalRuntime    int `json:"total_runtime"`
	ActiveAgents    int `json:"active_agents"`
}

type Sandbox struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Status   string `json:"status"`
	Runtime  int    `json:"runtime"`
	Storage  int    `json:"storage"`
}

type RunHistory struct {
	ID        int    `json:"id"`
	AgentName string `json:"agent_name"`
	Status    string `json:"status"`
	StartedAt string `json:"started_at"`
}

type ResourceUsage struct {
	MemoryMB int `json:"memory_mb"`
	Runtime  int `json:"runtime"`
	Tokens   int `json:"tokens"`
	GPU      int `json:"gpu"`
}

// function for the dashboard 

func (h *APIHandler) DashboardHandler(w http.ResponseWriter, r *http.Request) {
	var resp DashboardResponse

	err := h.DB.QueryRow(`
		SELECT
			COUNT(*) FILTER (WHERE status='running'),
			COALESCE(SUM(runtime_seconds),0),
			COUNT(*) FILTER (WHERE status='active')
		FROM sandboxes
	`).Scan(&resp.ActiveSandboxes, &resp.TotalRuntime, &resp.ActiveAgents)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}


// function for the sandbox handling

func (h *APIHandler) SandboxesHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(`
		SELECT id, name, status, runtime_seconds, storage_mb
		FROM sandboxes
	`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var sandboxes []Sandbox

	for rows.Next() {
		var s Sandbox
		rows.Scan(&s.ID, &s.Name, &s.Status, &s.Runtime, &s.Storage)
		sandboxes = append(sandboxes, s)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(sandboxes)
}

// function for the history handler

func (h *APIHandler) HistoryHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(`
		SELECT id, 'agent', run_status, started_at
		FROM agent_runs
		ORDER BY started_at DESC
	`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var history []RunHistory

	for rows.Next() {
		var item RunHistory
		rows.Scan(&item.ID, &item.AgentName, &item.Status, &item.StartedAt)
		history = append(history, item)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(history)
}

// function for resource usage handler

func (h *APIHandler) ResourcesHandler(w http.ResponseWriter, r *http.Request) {
	var usage ResourceUsage

	err := h.DB.QueryRow(`
		SELECT
			COALESCE(SUM(memory_mb),0),
			COALESCE(SUM(token_count),0),
			COALESCE(AVG(gpu_percent),0)
		FROM resource_usage
	`).Scan(&usage.MemoryMB, &usage.Tokens, &usage.GPU)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(usage)
}









