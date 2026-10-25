import http from "http";
import { app } from "./app.js";
import { config } from "dotenv";
import connect from "./utils/mongodb.js";
import initializeGridFSBucket from "./utils/gridfs.js";


const server = http.createServer(app);

//setup mongodb connection
console.log("Connecting to MongoDB:", process.env.MONGO_URI);

connect().then(async (db) => {
  try {
    // Initialize GridFSBucket
    const bucket = await initializeGridFSBucket(db);

    // Store bucket in app.locals for later use (e.g., in file routes)
    app.locals.bucket = bucket;
    app.locals.db = db.connection.db; //storing mongodb ref so i can access these locals in routes

    // Start the server
    server.listen(8000, () => {
      console.log("Server running on port 8000");
    });
  } catch (err) {
    console.error("Error initializing GridFSBucket:", err);
    process.exit(1); // Exit the process on failure
  }
}).catch(err => {
  console.error("Database connection failed:", err);
  process.exit(1); // Exit the process on failure
});
