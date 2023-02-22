const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const PORT = process.env.PORT | 3000

app.use(express.static('public'));
app.use(bodyParser.json());


// API router mounted from /api.js
const apiRouter = require("./api");
app.use("/", apiRouter);


app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`)
});