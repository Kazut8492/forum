package main

import (
	"database/sql"
	"fmt"
	"forum-spa/backend/pkg/websocket"
	"forum-spa/backend/src"
	"log"
	"net/http"

	// "github.com/gorilla/websocket"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocket Endpoint Hit")
	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
}

func setupRoutes() {
	pool := websocket.NewPool()
	go pool.Start()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		serveWs(pool, w, r)
	})
}

func main() {

	// Create database
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

	// Insert dummy data if the database is empty, otherwise not.
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
	if rowCount == 0 {
		for _, post := range testPosts {
			src.InsertPost(db, post)
		}
	}

	fmt.Println("Server is starting")

	router := gin.Default()

	getPosts := func(context *gin.Context) {
		posts := src.ReadPosts(db)
		if err != nil {
			return
		}
		context.IndentedJSON(http.StatusOK, posts)
	}

	addPost := func(context *gin.Context) {
		var post src.Post
		if err := context.BindJSON(&post); err != nil {
			return
		}
		src.InsertPost(db, post)
		posts := src.ReadPosts(db)
		context.IndentedJSON(http.StatusOK, posts)
	}

	addComment := func(context *gin.Context) {
		var comment src.Comment
		if err := context.BindJSON(&comment); err != nil {
			return
		}
		src.InsertComment(db, comment)
		// comments are included in posts, so just need to return posts and extract in frontend
		posts := src.ReadPosts(db)
		context.IndentedJSON(http.StatusOK, posts)
	}

	PasswordEncrypt := func(password string) (string, error) {
		hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		return string(hash), err
	}

	addUser := func(context *gin.Context) {
		var user src.User
		if err := context.BindJSON(&user); err != nil {
			return
		}
		encryptedPass, err := PasswordEncrypt(user.Password)
		user.Password = encryptedPass
		if err != nil {
			return
		}
		src.InsertUser(db, user)
		// use user data returned from database, since user above missing user_id
		db_user := src.ReadUser(db, user)
		src.InitiateSession(context, db, db_user)
		// // This time, we store the session in sql instead??
		// store := cookie.NewStore([]byte("secret"))
		// store.Options(sessions.Options{MaxAge: 60 * 60 * 24})
		// router.Use(sessions.Sessions("mysession", store))
		context.IndentedJSON(http.StatusOK, nil)
	}

	getCookie := func(context *gin.Context) {
		user, user_cookie_err := context.Cookie("cookie")
		if user_cookie_err != nil {
			user = "Guest"
		}
		context.JSON(200, gin.H{"message": "Hello " + user})
	}

	router.Use(CORSMiddleware())
	router.GET("/posts", getPosts)
	router.POST("/new-post", addPost)
	router.POST("/new-comment", addComment)
	router.POST("/new-user", addUser)
	router.GET("/get-cookie", getCookie)
	router.Run("localhost:8080")
	setupRoutes()
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
