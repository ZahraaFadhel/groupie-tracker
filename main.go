package main

import (
	"fmt"
	groupieTracker "groupieTracker/handlers"
	"net/http"
	
)

func main() {

	http.HandleFunc("/aboutUs/", groupieTracker.AboutUsHandler)
	http.HandleFunc("/artist/", groupieTracker.GetArtist)
	http.HandleFunc("/", groupieTracker.GetHandler)

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

	port := "localhost:8080"
	fmt.Printf("Server is working on http://" + port + "\n")
	
	err := http.ListenAndServe(":8080", nil)
	if err == nil {
		groupieTracker.OpenBrowser("http://localhost:8080")
	}
}


