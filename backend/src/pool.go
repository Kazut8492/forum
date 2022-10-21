package src

import (
	"fmt"
)

func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
	}
}

func (pool *Pool) Start() {
	for {
		select {
		case client1 := <-pool.Register:
			joiningUser := client1.ID
			onlineUsers := []string{}
			fmt.Println("This user is joining", joiningUser)
			pool.Clients[client1] = true
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client, _ := range pool.Clients {
				client.Conn.WriteJSON(Message{Type: 1, Body: "New User Joined..."})
				if client.ID != "" {
					onlineUsers = append(onlineUsers, client.ID)
				}
			}
			for client, _ := range pool.Clients {
				client.Conn.WriteJSON(Message{ReceiverUsrName: client.ID, Body: "", OnlineUsers: onlineUsers})
			}
			// client1.Conn.WriteJSON(Message{ReceiverUsrName: client1.ID, Body: "", OnlineUsers: onlineUsers})
			break
		case client1 := <-pool.Unregister:
			leavingUser := client1.ID
			onlineUsers := []string{}
			fmt.Println("This user is leaving", leavingUser)
			delete(pool.Clients, client1)
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client, _ := range pool.Clients {
				client.Conn.WriteJSON(Message{Type: 1, Body: "User Disconnected..."})
				if client.ID != "" {
					onlineUsers = append(onlineUsers, client.ID)
				}
			}
			for client, _ := range pool.Clients {
				client.Conn.WriteJSON(Message{ReceiverUsrName: client.ID, Body: "", OnlineUsers: onlineUsers})
			}
			break
		case message := <-pool.Broadcast:
			// onlineUsers := []string{}
			fmt.Println("Sending message to all clients in Pool")
			for client, _ := range pool.Clients {
				// if client.ID != "" {
				// 	onlineUsers = append(onlineUsers, client.ID)
				// }
				// pool.Broadcast <- Message{ReceiverUsrName: client.ID, Body: "", OnlineUsers: onlineUsers}
				// client.Conn.WriteJSON(Message{ReceiverUsrName: client.ID, Body: "", OnlineUsers: onlineUsers})

				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
			}
		}
	}
}
