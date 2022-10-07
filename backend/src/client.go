package src

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"strconv"
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
		_, p, err := c.Conn.ReadMessage()
		// messageType, p, err := c.Conn.ReadMessage()
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
		fmt.Println(jsonMap)

		intVar, _ := strconv.Atoi(jsonMap["type"])
		// CreationTimeについては、SQL側で自動で付与する。
		// message := Message{Type: messageType, Body: jsonMap["message"], CreatorUsrName: "TEST", ReceiverUsrName: jsonMap["receiver"], CreationTime: time.Now().In(time.Local)}
		message := Message{Type: intVar, Body: jsonMap["message"], CreatorUsrName: jsonMap["creator"], ReceiverUsrName: jsonMap["receiver"], CreationTime: time.Now().In(time.Local)}
		fmt.Printf("message type: %d\n", intVar)
		// CreationTimeからミリセカンドを取り除く
		message.CreationTime = message.CreationTime.Truncate(time.Second)
		fmt.Printf("Message Received: %+v\n", message)
		c.Pool.Broadcast <- message

		if message.Type == 1 {
			// Save chat in database
			fmt.Println(message)
			InsertChat(db, message)
		} else if message.Type == 0 {
			// system message about login & logout
			fmt.Println(message)
			if message.Body == "login" || message.Body == "signup" {
				statement, err := db.Prepare(`
					INSERT INTO online_users (
						username
					) VALUES (?)
				`)
				if err != nil {
					log.Fatal(err.Error())
				}
				defer statement.Close()
				// number of variables have to be matched with INSERTed variables
				statement.Exec(message.ReceiverUsrName)
			} else if message.Body == "logout" {
				statement, err := db.Prepare(`
					DELETE FROM online_users WHERE username = ?
				`)
				if err != nil {
					log.Fatal(err.Error())
				}
				defer statement.Close()
				// number of variables have to be matched with INSERTed variables
				statement.Exec(message.ReceiverUsrName)
			}
		}

	}
}
