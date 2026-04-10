package middleware


import(
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"

)

var SECRET_KEY = []byte("secret_key")

func VerifyJWT(next http.HandlerFunc) http.HandlerFunc {
	return func (w http.ResponseWriter, r *http.Request)  {

		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			http.Error(w, "Missing token", 401)
			return 
		}
		
		parts := strings.Split(authHeader, " ")

		if len(parts) != 2 {
			http.Error(w, "invalid tken format", 401)
			return 
		}

		tokenString := parts[1]

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return SECRET_KEY, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "invalid token", 401)
		}

		next(w,r)
	}
}