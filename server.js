const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors')

const PORT = process.env.PORT | 3000

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());


// API router mounted from /api.js
const apiRouter = require("./server/api");
app.use("/", apiRouter);


app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`)
});