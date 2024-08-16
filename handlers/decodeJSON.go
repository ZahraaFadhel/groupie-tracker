package groupieTracker

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type Artist struct {
	Id           int      `json:"id"`
	Image        string   `json:"image"`
	Name         string   `json:"name"`
	Members      []string `json:"members"`
	CreationDate int      `json:"creationDate"`
	FirstAlbum   string   `json:"firstAlbum"`
	Locations    string   `json:"locations"`
	ConcertDates string   `json:"concertDates"`
	Relations    string   `json:"relations"`
	Concerts      map[string][]string
}

type Location struct {
	Id        int      `json:"id"`
	Locations []string `json:"locations"`
	Dates     string   `json:"dates"`
}

type Date struct {
	Id    int      `json:"id"`
	Dates []string `json:"dates"`
}

type Relation struct {
	Id             int                 `json:"id"`
	DatesLocations map[string][]string `json:"dateslocations"`
}

func getJsonData(URL string) ([]byte, error) {
	response, err := http.Get(URL)
	if err != nil {
		log.Fatal(err)
	}

	defer response.Body.Close() // schedule Close method to be called when main function completes

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request returned status code: %d", response.StatusCode)
	}

	dataBytes, err := io.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}
	return dataBytes, nil
}

func GetArtistsData() ([]Artist, error) {
	// fmt.Println("Fetching Artists data...")
	data, err := getJsonData("https://groupietrackers.herokuapp.com/api/artists")
	if err != nil {
		log.Fatal(err)
	}

	// var Artisis []Artist
	err = json.Unmarshal(data, &artists)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return artists, nil
}

func GetRelationData(id string) (Relation, error) {
	// fmt.Println("Fetching Relations data...")

	URL := "https://groupietrackers.herokuapp.com/api/relation" + "/" + id
	data, err := getJsonData(URL)
	if err != nil {
		log.Fatal(err)
	}

	var relation Relation
	err = json.Unmarshal(data, &relation)
	if err != nil {
		fmt.Println(err)
		return Relation{}, err
	}

	return relation, nil
}
