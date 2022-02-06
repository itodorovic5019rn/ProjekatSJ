const express = require("express");
const path = require("path");
const BP = require("body-parser");
const { sequelize } = require("./models");
const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(BP.urlencoded({extended:false})); 
app.use(BP.json());

app.use(express.static(path.join(__dirname, 'static')));

function getCookies(req){ // sluzi za parsiranje svih cookie-ja
    if(req.headers.cookie == null){
        console.log("Cookie is null");
        return {};
    }

    const cookies = req.headers.cookie.split("; "); // splitujemo sve cookie-je
    const parsedCookies = {}; // ovde cemo da smestamo cookie-je

    cookies.forEach(element => {
        const parsedCookie = element.split("=");
        parsedCookies[parsedCookie[0]] = parsedCookie[1]; // npr. parsedCookie[0] ce mi biti naziv cookie-ja(token) a parsedCookie[1] sve posle "=" tj. ceo token
    });

    return parsedCookies;
}

function authToken(req, res, next){ 
    const cookies = getCookies(req);
    const token = cookies["token"]; // uzimamo token iz cookie-ja

    if (token == null){ // ukoliko niko nije ulogovan
        return res.redirect(307, '/admin/login');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => { // kad probamo da verifikujemo user-a ili dobijemo error ili user-a. Objekat user sadrzi ono sto smo definisali u app_auth.js kad smo regitrovali user-a i stavljali atribute u token.
        if (err){
             return res.redirect(307, '/admin/login');
        }
        
        if(user.role == "user"){
            return res.redirect(307, "/admin/login");
        }

        req.user = user;
    
        next();
    });
}

function adminAuth(req, res, next){ // proveravam da li admin pokusava da udje u users stranicu
    const cookies = getCookies(req);
    const token = cookies["token"]; // uzimamo token iz cookie-ja

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => { // kad probamo da verifikujemo user-a ili dobijemo error ili user-a. Objekat user sadrzi ono sto smo definisali u app_auth.js kad smo regitrovali user-a i stavljali atribute u token.
        if(user.role != "admin"){ // proveravam da li je ulogovani user admin
            return res.redirect(307, '/admin/index');
        }

        req.user = user;
    
        next();
    });
}

app.get("/admin/login", (req, res) => {
    res.sendFile("login.html", { root: "./static/admin" });
});

app.get("/admin/register", (req, res) => {
    res.sendFile("register.html", { root: "./static/admin"});
});

app.get("/admin/index", authToken, (req, res) => {
    res.sendFile("index.html", { root: "./static/admin"});
});

app.get("/admin/users", [authToken, adminAuth], (req, res) => {
    res.sendFile("users.html", { root: "./static/admin"});
});

app.get("/admin/films", authToken, (req, res) => {
    res.sendFile("movies.html", { root: "./static/admin"});
});

app.get("/admin/tvShows", authToken, (req, res) => {
    res.sendFile("tvShows.html", { root: "./static/admin"});
});

app.get("/admin/moviesPosts", authToken, (req, res) => {
    res.sendFile("moviesPosts.html", { root: "./static/admin"});
});

app.get("/admin/tvShowsPosts", authToken, (req, res) => {
    res.sendFile("tvShowsPosts.html", { root: "./static/admin"});
});


app.listen({ port: 8000 }, async () => {
    await sequelize.authenticate();
    console.log("App started");
}); 