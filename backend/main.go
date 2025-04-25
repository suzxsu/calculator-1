package main

import (
	"calculator/gen/proto/calculator/calculatorconnect"
	"calculator/service"
	"log"
	"net/http"

	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

// CORSMiddleware 包装处理程序以添加CORS头
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 设置CORS头
		origin := r.Header.Get("Origin")
		if origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Connect-Protocol-Version")
			w.Header().Set("Access-Control-Max-Age", "86400")
		}

		// 处理预检请求
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// 继续处理请求
		next.ServeHTTP(w, r)
	})
}

func main() {
	calculatorServer := service.NewCalculatorServer()
	
	// 使用 Connect 协议注册服务处理程序
	mux := http.NewServeMux()
	path, handler := calculatorconnect.NewCalculatorServiceHandler(calculatorServer)
	mux.Handle(path, handler)

	// 添加默认处理程序
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
	})

	// 创建带有CORS中间件的服务器
	corsHandler := CORSMiddleware(mux)

	// 启动HTTP服务器并支持HTTP/2
	log.Println("Starting server on :8080...")
	http.ListenAndServe(
		":8080",
		// 使用h2c允许通过明文TCP提供HTTP/2
		h2c.NewHandler(corsHandler, &http2.Server{}),
	)
} 