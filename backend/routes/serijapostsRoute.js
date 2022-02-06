const express = require('express');
const Joi = require("joi");
const { sequelize, SerijaPosts, Users } = require('../models');
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

route.delete('/tvShowsPosts', authToken, (req,res) => {
    SerijaPosts.findOne({ where: { id: req.body.id } })
        .then( serijaPost => {
            serijaPost.destroy()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
});

route.get('/tvShowsPosts', (req, res) => {
    SerijaPosts.findAll({include: ["user", "serija"]})
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

route.get('/tvShowsPosts/:id', (req, res) => {
    SerijaPosts.findOne({where: {id:req.params.id}, include: ['user', 'serija']})
        .then( row => res.json(row) )
        .catch( err => res.status(500).json(err) );
});

route.put('/tvShowsPosts', authToken, (req, res) => {
    SerijaPosts.findOne({ where: { id: req.body.id }})
        .then( serijaPost => {
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
                serijaPost.ocena = req.body.ocena; 
                serijaPost.komentar = req.body.komentar;
                serijaPost.preporuka = req.body.preporuka;
                serijaPost.lajk = req.body.lajk;

                serijaPost.save()
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
            }else{
                res.json({err: error});
            }
        })
        .catch( err => res.status(500).json(err) );

});

route.post("/tvShowsPosts", authToken, (req, res) => { // za pravljenje serija posta

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

    const obj = { // polja u obj moraju da budu identicna kao atributi entiteta SerijaPosts
        userId: req.user.userId,
        ocena: req.body.ocena,
        komentar: req.body.komentar,
        preporuka: req.body.preporuka,
        lajk: req.body.lajk,
        serijaId: req.body.serijaId
    };

    if(check){
        SerijaPosts.create(obj)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json("Error = " + err));
    }else{
        res.json({err: error});
    }
});

module.exports = route;