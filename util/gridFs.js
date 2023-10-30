// config/gridfs.js
const mongoose = require("mongoose");
const gridfs = require("gridfs-stream");

// Create a GridFS storage using the MongoDB connection
const conn = mongoose.connection;
let gfs = null;

conn.once("open", () => {
  gfs = gridfs(conn.db, mongoose.mongo);
});

if (gfs !== null) module.exports = { gfs };
