const express = require('express');
const Joi = require("joi");
const { sequelize, FilmPosts, Users } = require('../models');
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

route.delete('/moviesPosts', authToken, (req,res) => {
    FilmPosts.findOne({ where: { id: req.body.id } })
        .then( filmPost => {
            filmPost.destroy()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
});

route.get('/moviesPosts', (req, res) => {
    FilmPosts.findAll({include: ["user", "film"]})
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

route.get('/moviesPosts/:id', (req, res) => {
    FilmPosts.findOne({where: {id:req.params.id}, include: ['user', 'film']})
        .then( row => res.json(row) )
        .catch( err => res.status(500).json(err) );
});

route.put('/moviesPosts', authToken, (req, res) => {
    FilmPosts.findOne({ where: { id: req.body.id }})
        .then( filmPost => {
            var check = true;
            var error;

            const objCheck = {
                ocena: req.body.ocena,
                komentar: req.body.komentar,
                lajk: req.body.lajk
            }

            const sema = Joi.object().keys({
                ocena: Joi.number().required(),
                komentar: Joi.string().required(),
                lajk: Joi.number().required()
            });

            Joi.validate(objCheck, sema, (err, result) => {
                if(err){
                    error = err.message;
                    check = false;
                    console.log(err);
                }
            });

            if(check){
                filmPost.ocena = req.body.ocena; 
                filmPost.komentar = req.body.komentar;
                filmPost.preporuka = req.body.preporuka;
                filmPost.lajk = req.body.lajk;

                filmPost.save()
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
            }else{
                res.json({err: error});
            }
        })
        .catch( err => res.status(500).json(err) );

});

route.post("/moviesPosts", authToken, (req, res) => { // za pravljenje film posta
    var check = true;
    var error;

    const objCheck = {
        ocena: req.body.ocena,
        komentar: req.body.komentar,
        lajk: req.body.lajk
    }

    const sema = Joi.object().keys({
        ocena: Joi.number().required(),
        komentar: Joi.string().required(),
        lajk: Joi.number().required()
    });

    Joi.validate(objCheck, sema, (err, result) => {
        if(err){
            error = err.message;
            check = false;
            console.log(err);
        }
    });
   
    const obj = { // polja u obj moraju da budu identicna kao atributi entiteta FilmPosts
        userId: req.user.userId,
        ocena: req.body.ocena,
        komentar: req.body.komentar,
        preporuka: req.body.preporuka,
        lajk: req.body.lajk,
        filmId: req.body.filmId
    };

    if(check){
        FilmPosts.create(obj)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json("Error = " + err));
    }else{
        res.json({err: error});
    }
});

module.exports = route;