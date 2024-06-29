package groupieTracker

import (
	"html/template"
	"net/http"
)

type ErrorData struct {
	Title   string
	Message string
}

func ErrorHandler(w http.ResponseWriter, r *http.Request, status int) {
	w.WriteHeader(status)

	var data ErrorData

	switch status {
	case http.StatusNotFound:
		data = ErrorData{
			Title:   "404 Not Found",
			Message: "The page you are looking for does not exist.",
		}
	case http.StatusBadRequest:
		data = ErrorData{
			Title:   "400 Bad Request",
			Message: "The request could not be understood by the server.",
		}
	case http.StatusInternalServerError:
		data = ErrorData{
			Title:   "500 Internal Server Error",
			Message: "The server encountered an internal error.",
		}
	case http.StatusMethodNotAllowed:
		data = ErrorData{
			Title:   "405 Method Not Allowed",
			Message: "The method is not allowed for the requested URL.",
		}
	default:
		data = ErrorData{
			Title:   "Error",
			Message: "An unexpected error occurred.",
		}
	}

	parsedTemplate, err := template.ParseFiles("error/error.html")
	if err != nil {
		http.Error(w, "Error rendering template", http.StatusInternalServerError)
		return
	}

	parsedTemplate.Execute(w, data)
}
