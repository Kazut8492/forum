package src

// type Session struct {
// 	userId     int
// 	username   string
// 	sessionId  int
// 	expiration time.Time
// }

type User struct {
	ID        int
	Username  string
	Email     string
	Password  string
	Age       string
	Gender    string
	FirstName string
	LastName  string
}

type Comment struct {
	ID             int
	PostId         int
	Title          string
	Content        string
	CreatorUsrName string
	Likes          []Like
	Dislikes       []Dislike
}

type Post struct {
	ID             int
	Title          string
	Content        string
	Comments       []Comment
	CategoryStr    string
	CategoryArr    []string
	CreatorUsrName string
	Likes          []Like
	Dislikes       []Dislike
}

type Like struct {
	ID             int
	PostId         int
	CommentId      int
	CreatorUsrName string
}

type Dislike struct {
	ID             int
	PostId         int
	CommentId      int
	CreatorUsrName string
}

type ChatHistory struct {
	ID             int
	CreatorUsrName string
	Content        string
}
