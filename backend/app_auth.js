const express = require("express");
const Joi = require("joi");
const { sequelize, Users, Films } = require("./models");
const cors = require("cors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();

var corsOptions = {
    origin: "http://localhost:8080",
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));

app.post("/register", (req, res) => {
    var check = true;
    var error;

    const obj = { // polja u obj moraju da budu identicna kao atributi entiteta Users
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    };

    const sema = Joi.object().keys({
        username: Joi.string().min(3).max(20).required(),
        firstname: Joi.string().min(1).required(),
        lastname: Joi.string().min(1).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.optional()
    });

    Joi.validate(obj, sema, (err, result) => {
        if(err){
            error = err.message;
            console.log("ERROR :" + err);
            check = false;
        }
    });

    obj.password = bcrypt.hashSync(req.body.password, 10); // ovde hash-ujem password zbog validacije iznad

    if(check){ // ako udje u if(err) u validate-u
        if(obj.role == false){
            obj.role = "user";
        }else{
            obj.role = "moderator";
        }

        Users.create(obj).then(rows => { // kreiram user-a

            const usr = { // ovo stavljam u token
                userId: rows.id,
                username: rows.username,
                role: rows.role // da bih proveravao da li ima odredjenu privilegiju 
            };

            const myToken = jwt.sign(usr, process.env.ACCESS_TOKEN_SECRET); 

            console.log("User created with token = " + myToken);

            res.json({token:myToken, userId:usr.userId}); // saljem token u register.js

        }).catch(err => res.status(500).json("Error = " + err));
    }else{
        res.json({err: error});
    }

});

app.post("/login", (req, res) => {
    
    Users.findOne({where: {username: req.body.username}}) // nalazimo user-a u bazi podataka preko username-a
        .then( usr => {

            if(usr == null){
                res.json({msg: "Invalid credentials!"});
                return;
            }
        
            if(bcrypt.compareSync(req.body.password, usr.password)){

                const obj = { // ovo stavljam u token
                    userId: usr.id,
                    username: usr.username,
                    role: usr.role // stvaljam role da bih proveravao privilegije
                };

                const token = jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET);

                res.json({token: token, userId: obj.userId});
            }else{
                res.status(400).json({msg: "Invalid credentials!"});
            }

        }).catch(err => res.status(500).json(err));

});

app.listen({ port: 9000 }, async() => {
    await sequelize.authenticate();
    console.log("Auth started");
});