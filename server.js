const dotEnv = require("dotenv");
dotEnv.config({ path: "./env/config.env" });
require("./db/connection");

const app = require("./app");

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on ${port} port!`);
});
