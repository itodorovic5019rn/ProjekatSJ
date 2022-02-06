const express = require('express');
const Joi = require("joi");
const { sequelize, Films, Users } = require('../models');
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

route.delete('/films', authToken, (req,res) => {
    Films.findOne({ where: { id: req.body.id } })
        .then( film => {
            film.destroy()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
});

route.get('/films', (req, res) => {
    Films.findAll()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

route.get('/films/:id', (req, res) => {
    Films.findOne({where: {id:req.params.id}})
        .then( row => res.json(row) )
        .catch( err => res.status(500).json(err) );
});

route.put('/films', authToken, (req, res) => { // update
    Films.findOne({ where: { id: req.body.id }})
        .then( film => {
            var check = true;
            var error;

            const obj = {
                naziv: req.body.naziv,
                prosecnaOcena: req.body.prosecnaOcena,
                reziser: req.body.reziser,
                trajanje: req.body.trajanje,
                godina: req.body.godina
            };

            const sema = Joi.object().keys({
                naziv: Joi.string().required(),
                prosecnaOcena: Joi.number().required(),
                reziser: Joi.string().required(),
                trajanje: Joi.number().required(),
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
                film.naziv = req.body.naziv; 
                film.prosecnaOcena = req.body.prosecnaOcena;
                film.reziser = req.body.reziser;
                film.trajanje = req.body.trajanje;
                film.godina = req.body.godina;

                film.save()
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
            }else{
                res.json({err: error});
            }
        })
        .catch( err => res.status(500).json(err) );

});

route.post("/films", authToken, (req, res) => { // za pravljenje filma
    var check = true;
    var error;
    
    const obj = { // polja u obj moraju da budu identicna kao atributi entiteta Films
        naziv: req.body.naziv,
        prosecnaOcena: req.body.prosecnaOcena,
        reziser: req.body.reziser,
        trajanje: req.body.trajanje,
        godina: req.body.godina,
    };

    const sema = Joi.object().keys({
        naziv: Joi.string().required(),
        prosecnaOcena: Joi.number().required(),
        reziser: Joi.string().required(),
        trajanje: Joi.number().required(),
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
        Films.create(obj)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json("Error = " + err));
    }else{
        res.json({err: error});
    }

});

module.exports = route;