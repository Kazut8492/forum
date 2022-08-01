package main

import (
	"database/sql"
	"fmt"
	"forum-spa/backend/src"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	_ "github.com/mattn/go-sqlite3"
)

// We'll need to define an Upgrader
// this will require a Read and Write buffer size
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,

	// We'll need to check the origin of our connection
	// this will allow us to make requests from our React
	// development server to here.
	// For now, we'll do no checking and just allow any connection
	CheckOrigin: func(r *http.Request) bool { return true },
}

// define a reader which will listen for
// new messages being sent to our WebSocket
// endpoint
func reader(conn *websocket.Conn) {
	for {
		// read in a message
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		// print out that message for clarity
		fmt.Println(string(p))

		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}

	}
}

// define our WebSocket endpoint
func serveWs(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Host)
	// upgrade this connection to a WebSocket
	// connection
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}
	// listen indefinitely for new messages coming
	// through on our WebSocket connection
	reader(ws)
}

func main() {

	// Create dummy data
	db, err := sql.Open("sqlite3", "./example.db")
	if err != nil {
		fmt.Println(err.Error())
		log.Fatal(1)
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
		log.Fatal(1)
	}
	src.CreateTables(db)
	testPosts := []src.Post{
		{
			Title:          "Title1",
			Content:        "Content1",
			CategoryArr:    []string{"science", "education"},
			CreatorUsrName: "DummyUser",
		},
		{Title: "Title2", Content: "Content2", CategoryArr: []string{"education", "sports"}, CreatorUsrName: "DummyUser"},
		{Title: "Title3", Content: "Content3", CategoryArr: []string{"sports", "lifehacks"}, CreatorUsrName: "DummyUser"},
	}

	// Check if the post table is empty, if not then avoid adding any more test posts
	rowCount := 0
	postRows, err := db.Query(`
		SELECT * FROM post
	`)
	if err != nil {
		panic(err.Error())
	}
	defer postRows.Close()
	for postRows.Next() {
		rowCount++
	}
	if rowCount == 0 {
		for _, post := range testPosts {
			src.InsertPost(db, post)
		}
	}

	fmt.Println("Server is starting")
	http.HandleFunc("/", src.IndexHandler)
	// mape our `/ws` endpoint to the `serveWs` function
	http.HandleFunc("/ws", serveWs)
	http.ListenAndServe(":8080", nil)
}
