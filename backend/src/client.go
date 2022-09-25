package src

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	db, err := sql.Open("sqlite3", "./example.db")
	if err != nil {
		fmt.Println(err.Error())
		log.Fatal(1)
	}
	defer db.Close()

	for {
		// Broadcast to other clients
		messageType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		message := Message{Type: messageType, Body: string(p), CreatorUsrName: c.Username}
		c.Pool.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)

		// Save chat in database
		fmt.Println(message)
		InsertChat(db, message)
	}
}
