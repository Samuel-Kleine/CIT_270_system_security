const express = require ("express");

const app = express();

const port = 3000;

app.get("/", (reg, res) => {
    res.send("hello sam");
});

app.listen(port, () => {
    console.log("listening");
});