const express = require("express");
const authRoute = require("./routes/authRoute");
const ticketRoute = require("./routes/ticketRoute");
const dealRoute = require("./routes/dealRoute");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/api", ticketRoute);
app.use("/api", dealRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
