package src

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"time"

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
		body := string(p)
		// convert variable body into map format
		jsonMap := make(map[string]string)
		err = json.Unmarshal([]byte(body), &jsonMap)
		if err != nil {
			log.Println(err)
			return
		}
		// fmt.Println(jsonMap)

		// CreationTimeについては、SQL側で自動で付与する。
		// message := Message{Type: messageType, Body: jsonMap["message"], CreatorUsrName: "TEST", ReceiverUsrName: jsonMap["receiver"], CreationTime: time.Now().In(time.Local)}
		message := Message{Type: messageType, Body: jsonMap["message"], CreatorUsrName: c.Username, ReceiverUsrName: jsonMap["receiver"], CreationTime: time.Now().In(time.Local)}
		// CreationTimeからミリセカンドを取り除く
		message.CreationTime = message.CreationTime.Truncate(time.Second)
		c.Pool.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)

		// Save chat in database
		fmt.Println(message)
		InsertChat(db, message)
	}
}
