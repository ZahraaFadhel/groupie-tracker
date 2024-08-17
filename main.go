package main

import (
	"encoding/json"
	"fmt"
	groupieTracker "groupieTracker/handlers"
	"io"
	"net/http"
)

func main() {

	groupieTracker.Init()
	
	http.HandleFunc("/", groupieTracker.GetHandler)
	http.HandleFunc("/artist/", groupieTracker.GetArtist)
	http.HandleFunc("/aboutUs/", groupieTracker.AboutUsHandler)

	http.HandleFunc("/styleArtists.css", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/artists/styleArtists.css")
	})
	http.HandleFunc("/styleArtist.css", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/artist/styleArtist.css")
	})
	http.HandleFunc("/error/error.css", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "error/error.css")
	})
	http.HandleFunc("/aboutUs.css", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/aboutUs/aboutUs.css")
	})
	http.HandleFunc("/search.js", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/artists/search.js")
	})
	http.HandleFunc("/filters.js", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/artists/filters.js")
	})
	http.HandleFunc("/index.js", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/artists/index.js")
	})

	

	// to solve CORS issue
	http.HandleFunc("/api/artists", fetchArtists)
	http.HandleFunc("/api/locations/", fetchLocations)

	port := "localhost:8080"
	fmt.Printf("Server is working on http://%s\n", port)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Printf("Failed to start server: %v\n", err)
	} else {
		groupieTracker.OpenBrowser("http://localhost:8080")
	}
}

func fetchArtists(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get("https://groupietrackers.herokuapp.com/api/artists")
	if err != nil {
		http.Error(w, "Failed to reach external API", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read response from external API", http.StatusInternalServerError)
		return
	}

	var data interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Failed to parse JSON response from external API", http.StatusInternalServerError)
		return
	}

	responseData, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "Failed to serialize JSON response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)
}

func fetchLocations(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/api/locations/"):]
	url := fmt.Sprintf("https://groupietrackers.herokuapp.com/api/locations/%s", id)

	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Failed to reach external API", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read response from external API", http.StatusInternalServerError)
		return
	}

	var data interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Failed to parse JSON response from external API", http.StatusInternalServerError)
		return
	}

	responseData, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "Failed to serialize JSON response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseData)
}
