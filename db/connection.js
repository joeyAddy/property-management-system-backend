const mongoose = require("mongoose");

const localDB = process.env.DATABASE_LOCAL;

// cloud connection-Str
const cloudDB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

(async () => {
  try {
    await mongoose.connect(cloudDB, {
      // await mongoose.connect(localDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Data Base connection is successful!!!");
  } catch (err) {
    console.error("Error connecting to the database:", err.message, localDB);
    process.exit(1);
  }
})();
