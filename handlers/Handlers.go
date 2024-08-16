package groupieTracker

import (
	"html/template"
	"net/http"
	"strconv"
	"strings"
)

var artists []Artist

func Init() {
	artists, _= GetArtistsData()
}

func GetHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		ErrorHandler(w, r, http.StatusMethodNotAllowed)
		return
	}

	if r.URL.Path != "/" {
		ErrorHandler(w, r, http.StatusNotFound)
		return
	}

	t, err := template.ParseFiles("static/artists/artists.html")
	if err != nil {
		ErrorHandler(w, r, http.StatusInternalServerError)
		return
	}

	// artists, _ = GetArtistsData()
	t.Execute(w, artists)
}

func GetArtist(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/artist/") // This will return id
	id, _ := strconv.Atoi(path)
	if id > 52 || id < 1 {
		ErrorHandler(w, r, http.StatusInternalServerError)
		return
	}
	// artists, err := GetArtistsData()
	// if err != nil {
	// 	ErrorHandler(w, r, http.StatusInternalServerError)
	// 	return
	// }

	for _, artist := range artists {
		if artist.Id == id {
			t, err := template.ParseFiles("static/artist/artist.html")
			if err != nil {
				ErrorHandler(w, r, http.StatusInternalServerError)
				return
			}
			R, _ := GetRelationData(strconv.Itoa(id))
			artist.Concerts = R.DatesLocations
			t.Execute(w, artist)
			return
		}
	}

	ErrorHandler(w, r, http.StatusNotFound)
}

func AboutUsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		ErrorHandler(w, r, http.StatusMethodNotAllowed)
		return
	}

	t, err := template.ParseFiles("static/aboutUs/aboutUs.html")
	if err != nil {
		ErrorHandler(w, r, http.StatusInternalServerError)
		return
	}

	t.Execute(w, nil)
}
