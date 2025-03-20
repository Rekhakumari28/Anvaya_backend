// import express

const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credential: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const { initializeDatabase } = require("./db/db.connection.js");

app.use(express.json());

initializeDatabase()

app.get("/", (req, res) => {
  res.send("Welcome to Avanya! This is Avanya CRM Backend.");
});


//import router
const salesAgentRouter = require("./routes/salesAgentRoute.js");
const leadRouter = require("./routes/leadRoute.js");
const tagRouter = require('./routes/tagsRoute.js')
const reportRouter = require("./routes/reportRoute.js")

//routes
app.use("/api/agents", salesAgentRouter);
app.use("/api/leads", leadRouter);
app.use("/api/tags", tagRouter)
app.use("/api/reports", reportRouter)

//port
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

module.exports = app;
