package main

import (
	docs "employee-api/docs"
	"employee-api/middleware"
	"employee-api/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/penglongli/gin-metrics/ginmetrics"
	"github.com/sirupsen/logrus"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

var router = gin.New()

func init() {
	logrus.SetLevel(logrus.InfoLevel)
	logrus.SetFormatter(&logrus.JSONFormatter{}) // NEW
}

// @title Employee API
// @version 1.0
// @description The REST API documentation for employee webserver
// @termsOfService http://swagger.io/terms/

// @contact.name Opstree Solutions
// @contact.url https://opstree.com
// @contact.email opensource@opstree.com

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @BasePath /api/v1
// @schemes http
func main() {
	monitor := ginmetrics.GetMonitor()
	monitor.SetMetricPath("/metrics")
	monitor.SetSlowTime(1)
	monitor.SetDuration([]float64{0.1, 0.3, 1.2, 5, 10})
	monitor.Use(router)

	// Global middlewares
	router.Use(gin.Recovery())
	router.Use(middleware.LoggingMiddleware())

	// CORS Middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://172.16.21.128:3000",                                    // local frontend
			"http://np-dev-otms-alb-831114106.us-west-2.elb.amazonaws.com", // production frontend
			"http://cloudninja.live",
			"http://www.cloudninja.live",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},           // ✅ Added OPTIONS
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"}, // ✅ Optional: support custom headers
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// API routes
	v1 := router.Group("/api/v1")
	docs.SwaggerInfo.BasePath = "/api/v1/employee"
	routes.CreateRouterForEmployee(v1)

	// Swagger UI
	url := ginSwagger.URL("http://np-dev-otms-alb-831114106.us-west-2.elb.amazonaws.com:8082/swagger/doc.json")
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler, url))

	// Start server
	router.Run(":8082")
}
