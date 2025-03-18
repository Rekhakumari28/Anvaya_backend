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

const { initializeDatabase } = require("./db/db.connection");

app.use(express.json());

initializeDatabase()

app.get("/", (req, res) => {
  res.send("Welcome to Avanya! This is Avanya CRM Backend.");
});


//import router
const salesAgentRouter = require("./routes/salesAgentRoute");
const leadRouter = require("./routes/leadRoute");
const commentRouter = require('./routes/commentRoute')
const tagRouter = require('./routes/tagsRoute')

//routes
app.use("/agents", salesAgentRouter);
app.use("/leads", leadRouter);
app.use("/leads", commentRouter)
app.use("/tags", tagRouter)


//port
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

module.exports = app;
