// Handle uncaught exceptions
process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION!💥💥💥🙄💥💥💥 Shutting down... ");
  console.log(err.name, err.message);
  process.exit(1); // Exit the process to avoid inconsistent state
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const dbConnect = require("./config/dbConnect");
const AppError = require("./utils/appError");
const sendResponse = require("./utils/sendResponse");
const errorGlobalMiddleware = require("./middlewares/errorMiddleware");
const userRoutes = require("./routes/userRoutes");

const PORT = process.env.PORT || 7020;

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow credentials
};

// Set up CORS middleware to allow requests from different domains
app.use(cors(corsOptions));

// Parse incoming JSON request bodies with a size limit
app.use(express.json({ limit: "10kb" }));

// Parse cookies from request headers
app.use(cookieParser());

// Connect to the MongoDB database
dbConnect(process.env.DATABASE_URI);

// Health check endpoint
app.get("/", (req, res) => {
  sendResponse(null, 200, res, "Server is up and running...");
});

// Set up routes for various API endpoints
app.use("/api/v1/user", userRoutes);

// Handle 404 errors for all other routes
app.all("*", (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
);

// Global error handling middleware
app.use(errorGlobalMiddleware);

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));

// Handle unhandled promise rejections
process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION!💥💥💥🙄💥💥💥 Shutting down... ");
  console.log(err.name, err.message);
  process.exit(1); // Exit the process to avoid inconsistent state
});
