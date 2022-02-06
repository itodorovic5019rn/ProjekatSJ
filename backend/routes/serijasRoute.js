const express = require('express');
const Joi = require("joi");
const { sequelize, Serijas, Users } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(401).json({ msg: "Error" });
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.status(403).json({ msg: err });

        req.user = user;
    
        next();
    });
}

route.delete('/tvShows', authToken, (req,res) => { // brisanje serije
    Serijas.findOne({ where: { id: req.body.id } })
        .then( serija => {
            serija.destroy()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
});

route.get('/tvShows', (req, res) => { // uzimanje svih serija iz baze
    Serijas.findAll()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

route.put('/tvShows', authToken, (req, res) => { // apdejtovanje serije
    Serijas.findOne({ where: { id: req.body.id }})
        .then( serija => {
            var check = true;
            var error;

            const obj = {
                naziv: req.body.naziv,
                prosecnaOcena: req.body.prosecnaOcena,
                reziser: req.body.reziser,
                sezone: req.body.sezone,
                godina: req.body.godina
            };

            const sema = Joi.object().keys({
                naziv: Joi.string().required(),
                prosecnaOcena: Joi.number().required(),
                reziser: Joi.string().required(),
                sezone: Joi.number().required(),
                godina: Joi.number().required()
            });

            Joi.validate(obj, sema, (err, result) => {
                if(err){
                    error = err.message;
                    console.log(err);
                    check = false;
                }
            });

            if(check){
                serija.naziv = req.body.naziv; 
                serija.prosecnaOcena = req.body.prosecnaOcena;
                serija.reziser = req.body.reziser;
                serija.sezone = req.body.sezone;
                serija.godina = req.body.godina;

                serija.save()
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
            }else{
                res.json({err: error});
            }
        })
        .catch( err => res.status(500).json(err) );

});

route.post("/tvShows", authToken, (req, res) => { // za pravljenje serije
    var check = true;
    var error;

    const obj = { // polja u obj moraju da budu identicna kao atributi entiteta Serijas
        naziv: req.body.naziv,
        prosecnaOcena: req.body.prosecnaOcena,
        reziser: req.body.reziser,
        sezone: req.body.sezone,
        godina: req.body.godina
    };

    const sema = Joi.object().keys({
        naziv: Joi.string().required(),
        prosecnaOcena: Joi.number().required(),
        reziser: Joi.string().required(),
        sezone: Joi.number().required(),
        godina: Joi.number().required()
    });

    Joi.validate(obj, sema, (err, result) => {
        if(err){
            error = err.message;
            console.log(err);
            check = false;
        }
    });

    if(check){
        Serijas.create(obj)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json("Error = " + err));
    }else{
        res.json({err: error});
    }

});

module.exports = route;