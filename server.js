const express = require ("express");

const app = express();

const port = 3000;

const bodyParser = require ('body-parser');

const Redis = require ('redis');

const redisClient = Redis.createClient({url:"redis://127.0.0.1:6379"});

const {v4: uuidv4} = require('uuid');//universely unique identifier

const cookieParser = require("cookie-parser");

app.use(bodyParser.json()); //This looks for oncoming data

app.use(express.static('public'));

app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello Sam");
});

app.get("/validate", async(req, res) =>{
    const loginToken = req.cookies.stedicookie;
    console.log("loginToken", loginToken);
    const loginUser = await redisClient.hGet('TokenMap', loginToken);
    res.send(loginUser);

});

app.post('/login', async(req, res) =>{
    const loginUser = req.body.userName;
    const loginPassword = req.body.password;//Access the password data in the body
    console.log('Login username: '+loginUser);
    const correctPassword = await redisClient.hGet('UserMap', loginUser);
    if (loginPassword==correctPassword){
        const loginToken = uuidv4();
        await redisClient.hSet('TokenMap',loginToken,loginUser);//add token to Map
        res.cookie('stedicookie', loginToken);
        res.send(loginToken);
    } 
    else {
        res.status(401);//unauthorized
        res.send('Incorrect password for '+loginUser);
    }
    
});

app.listen(port, () => {
    redisClient.connect();
    console.log("listening");
});