//2023-06-20: https://www.youtube.com/watch?v=6cm6G78ZDmM
//How to Deploy a Node.js Puppeteer App to Render.com for Free - Avi Mamenko, uploaded Feb 26, 2023

const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();

const PORT = process.env.PORT || 3000;
console.log(`Listening on port ${PORT}!`);

app.get("/scrape", (req, res) => {
    scrapeLogic(res);
})

app.get("/", (req, res) => {
    res.send("Render Puppeteer server is up and running :)");
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})