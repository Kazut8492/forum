package main

import (
	"database/sql"
	"fmt"

	"forum-spa/backend/src"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

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
			context.JSON(500, gin.H{"message": "Failed to read posts"})
			return
		}
		context.JSON(http.StatusOK, posts)
	}

	addPost := func(context *gin.Context) {
		username, cookie_err := context.Cookie("cookie")
		fmt.Println(username)
		if cookie_err != nil {
			context.JSON(500, gin.H{"message": "Issue on reading cookie"})
			return
		} else {
			var post src.Post
			if err := context.BindJSON(&post); err != nil {
				context.JSON(500, gin.H{"message": "Failed to perse post info"})
				return
			}
			post.CreatorUsrName = username
			src.InsertPost(db, post)
			posts := src.ReadPosts(db)
			context.JSON(http.StatusOK, posts)
		}
	}

	addComment := func(context *gin.Context) {
		username, cookie_err := context.Cookie("cookie")
		if cookie_err != nil {
			context.JSON(500, gin.H{"message": "Issue on reading cookie"})
			return
		} else {
			var comment src.Comment
			if err := context.BindJSON(&comment); err != nil {
				context.JSON(500, gin.H{"message": "Failed to perse comment info"})
				return
			}
			comment.CreatorUsrName = username
			src.InsertComment(db, comment)
			posts := src.ReadPosts(db)
			context.JSON(http.StatusOK, posts)
		}
	}

	addUser := func(context *gin.Context) {
		PasswordEncrypt := func(password string) (string, error) {
			hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
			return string(hash), err
		}

		var user src.User
		if err := context.BindJSON(&user); err != nil {
			context.JSON(500, gin.H{"message": "Failed to perse user info"})
			return
		}

		var matchedEmail string
		var matchedUsername string
		db.QueryRow("SELECT user_email FROM user WHERE user_email = ?", user.Email).Scan(&matchedEmail)
		db.QueryRow("SELECT username FROM user WHERE username = ?", user.Username).Scan(&matchedUsername)
		if user.Email == matchedEmail || user.Username == matchedUsername {
			if user.Username == matchedUsername {
				context.JSON(500, gin.H{"message": "Nickname already taken"})
				return
			}
			if user.Email == matchedEmail {
				context.JSON(500, gin.H{"message": "Email already taken"})
				return
			}
		} else {
			encryptedPass, err := PasswordEncrypt(user.Password)
			user.Password = encryptedPass
			if err != nil {
				context.JSON(500, gin.H{"message": "Failed to encrypt password"})
				return
			}
			src.InsertUser(db, user)
			db_user := src.ReadUser(db, user)
			src.InitiateSession(context, db, db_user)
			context.JSON(http.StatusOK, gin.H{"message": "Registration succeeded"})
		}
	}

	loginUser := func(context *gin.Context) {
		var userInfo src.User
		if err := context.BindJSON(&userInfo); err != nil {
			context.JSON(500, gin.H{"message": "Failed to perse login user info"})
			return
		}

		var matchedUsername string
		db.QueryRow("SELECT username FROM user WHERE username = ?", userInfo.Username).Scan(&matchedUsername)
		var matchedEmail string
		db.QueryRow("SELECT user_email FROM user WHERE user_email = ?", userInfo.Email).Scan(&matchedEmail)

		CompareHashAndPassword := func(hash, password string) error {
			return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
		}

		if !(matchedUsername == "") {
			matchedUser := src.ReadUser(db, userInfo)
			if err := CompareHashAndPassword(matchedUser.Password, userInfo.Password); err != nil {
				context.JSON(500, gin.H{"message": "Wrong password"})
				return
			} else {
				src.InitiateSession(context, db, matchedUser)
				context.JSON(200, gin.H{"message": "Login succeeded"})
				return
			}
		} else if !(matchedEmail == "") {
			db.QueryRow("SELECT username FROM user WHERE user_email = ?", matchedEmail).Scan(&matchedUsername)
			userInfo.Username = matchedUsername
			matchedUser := src.ReadUser(db, userInfo)
			if err := CompareHashAndPassword(matchedUser.Password, userInfo.Password); err != nil {
				context.JSON(500, gin.H{"message": "Wrong password"})
				return
			} else {
				src.InitiateSession(context, db, matchedUser)
				context.JSON(200, gin.H{"message": "Login succeeded"})
				return
			}
		} else {
			context.JSON(500, gin.H{"message": "Wrong username / email"})
			return
		}
	}

	logoutUser := func(context *gin.Context) {
		username, cookie_err := context.Cookie("cookie")
		if cookie_err != nil {
			context.JSON(500, gin.H{"message": "Issue on reading cookie"})
			return
		} else {
			db.Exec("DELETE FROM session WHERE username = ?", username)
			context.SetCookie("cookie", "", -1, "/", "localhost", false, true)
			context.JSON(200, gin.H{"message": "Logout succeeded"})
			return
		}
	}

	addLike := func(context *gin.Context) {

		var likeInfo src.Like
		if err := context.BindJSON(&likeInfo); err != nil {
			context.JSON(500, gin.H{"message": "likeInfo cannot be read"})
			return
		}

		username, cookie_err := context.Cookie("cookie")
		if cookie_err != nil {
			context.JSON(500, gin.H{"message": "Issue on reading cookie"})
			return
		} else {

			// If the user already liked it, then erase it.
			var matchedUsernameLiked string
			db.QueryRow("SELECT creator_username FROM like WHERE creator_username = ? AND post_id = ? AND comment_id = ?", username, likeInfo.PostId, likeInfo.CommentId).Scan(&matchedUsernameLiked)
			if matchedUsernameLiked == username {
				_, err = db.Exec("DELETE FROM like WHERE creator_username = ? AND post_id = ? AND comment_id = ?", username, likeInfo.PostId, likeInfo.CommentId)
				if err != nil {
					context.JSON(500, gin.H{"message": "database issue"})
					return
				}
			} else {
				// Insert like
				statement, err := db.Prepare(`
					INSERT INTO like (
						post_id,
						creator_username,
						comment_id
					) VALUES (?, ?, ?)
				`)
				if err != nil {
					context.JSON(500, gin.H{"message": "database issue"})
					return
				}
				defer statement.Close()
				// number of variables have to be matched with INSERTed variables
				statement.Exec(likeInfo.PostId, username, likeInfo.CommentId)
			}

			// If the user already disliked it then erase it
			var matchedUsernameDisliked string
			db.QueryRow("SELECT creator_username FROM dislike WHERE creator_username = ? AND post_id = ? AND comment_id = ?", username, likeInfo.PostId, likeInfo.CommentId).Scan(&matchedUsernameDisliked)
			if matchedUsernameDisliked == username {
				_, err = db.Exec("DELETE FROM dislike WHERE creator_username = ? AND post_id = ? AND comment_id = ?", username, likeInfo.PostId, likeInfo.CommentId)
				if err != nil {
					context.JSON(500, gin.H{"message": "database issue"})
					return
				}
			}

			// return psots which includes likes and dislikes
			posts := src.ReadPosts(db)
			context.JSON(http.StatusOK, posts)
		}
	}

	addDislike := func(context *gin.Context) {
		var dislikeInfo src.Dislike
		if err := context.BindJSON(&dislikeInfo); err != nil {
			context.JSON(500, gin.H{"message": "dislikeInfo cannot be read"})
			return
		}

		username, cookie_err := context.Cookie("cookie")
		if cookie_err != nil {
			context.JSON(500, gin.H{"message": "Issue on reading cookie"})
			return
		} else {

			// If the user already disliked it, then erase it.
			var matchedUsernameDisliked string
			db.QueryRow("SELECT creator_username FROM dislike WHERE creator_username = ? AND post_id = ? AND comment_id = ?", username, dislikeInfo.PostId, dislikeInfo.CommentId).Scan(&matchedUsernameDisliked)
			if matchedUsernameDisliked == username {
				_, err = db.Exec("DELETE FROM dislike WHERE creator_username = ? AND post_id = ? AND comment_id = ?", username, dislikeInfo.PostId, dislikeInfo.CommentId)
				if err != nil {
					context.JSON(500, gin.H{"message": "database issue"})
					return
				}
			} else {
				// Insert dislike
				statement, err := db.Prepare(`
					INSERT INTO dislike (
						post_id,
						creator_username,
						comment_id
					) VALUES (?, ?, ?)
				`)
				if err != nil {
					context.JSON(500, gin.H{"message": "database issue"})
					return
				}
				defer statement.Close()
				// number of variables have to be matched with INSERTed variables
				statement.Exec(dislikeInfo.PostId, username, dislikeInfo.CommentId)
			}

			// If the user already liked it then erase it
			var matchedUsernameLiked string
			db.QueryRow("SELECT creator_username FROM like WHERE creator_username = ? AND post_id = ? AND comment_id = ?", username, dislikeInfo.PostId, dislikeInfo.CommentId).Scan(&matchedUsernameLiked)
			if matchedUsernameLiked == username {
				_, err = db.Exec("DELETE FROM like WHERE creator_username = ? AND post_id = ? AND comment_id = ?", username, dislikeInfo.PostId, dislikeInfo.CommentId)
				if err != nil {
					context.JSON(500, gin.H{"message": "database issue"})
					return
				}
			}

			// return psots which includes likes and dislikes
			posts := src.ReadPosts(db)
			context.JSON(http.StatusOK, posts)
		}
	}

	getChatHistory := func(context *gin.Context) {
		// username, cookie_err := context.Cookie("cookie")
		_, cookie_err := context.Cookie("cookie")
		if cookie_err != nil {
			context.JSON(500, gin.H{"message": "Issue on reading cookie"})
			return
		} else {
			chatHistory := src.ReadChatHistory(db)
			context.JSON(http.StatusOK, chatHistory)
		}
	}

	router.Use(CORSMiddleware())
	pool := src.NewPool()
	go pool.Start()
	router.GET("/ws", func(context *gin.Context) {
		username, cookie_err := context.Cookie("cookie")
		if cookie_err != nil {
			context.JSON(500, gin.H{"message": "Issue on reading cookie"})
			return
		} else {
			serveWs(pool, context.Writer, context.Request, username)
		}
	})
	router.GET("/posts", getPosts)
	router.POST("/new-post", addPost)
	router.POST("/new-comment", addComment)
	router.POST("/new-user", addUser)
	router.POST("/login", loginUser)
	router.GET("/logout", logoutUser)
	router.POST("/like", addLike)
	router.POST("/dislike", addDislike)
	router.GET("/chatHistory", getChatHistory)
	router.Run("localhost:8080")
}

func serveWs(pool *src.Pool, w http.ResponseWriter, r *http.Request, username string) {
	fmt.Println("src Endpoint Hit")
	conn, err := src.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	client := &src.Client{
		Conn:     conn,
		Pool:     pool,
		Username: username,
	}

	pool.Register <- client
	client.Read()
}

// func setupRoutes() {
// 	pool := websocket.NewPool()
// 	go pool.Start()

// 	http.Handle("/", http.FileServer(http.Dir("./frontend/public")))
// 	http.Handle("/src/", http.StripPrefix("/src/", http.FileServer(http.Dir("src"))))
// 	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
// 		serveWs(pool, w, r)
// 	})
// }

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
