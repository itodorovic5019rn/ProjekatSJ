const express = require('express');
const Joi = require("joi");
const { sequelize, Users } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(401).json({ msg: "Error: No token" });
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.status(403).json({ msg: err });

        if(user.role != "admin"){ // proveravam da li je ulogovani user admin
            return res.json();
        }

        req.user = user;
    
        next();
    });
}

route.delete('/users', authToken, (req,res) => {

    Users.findOne({ where: { id: req.body.id } })
        .then( usr => {
            usr.destroy()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json({msg: "User with given id doesn't exist!"}) );
});

route.get('/users', authToken, (req, res) => {
    Users.findAll()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

route.put('/users', authToken, (req, res) => {
    Users.findOne({ where: { id: req.body.id }})
        .then( usr => {
            var check = true;
            var error;

            const obj = {
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email
            };

            const sema = Joi.object().keys({
                username: Joi.string().min(3).max(20).required(),
                firstname: Joi.string().min(1).required(),
                lastname: Joi.string().min(1).required(),
                email: Joi.string().trim().email().required()
            });

            Joi.validate(obj, sema, (err, result) => {
                if(err){
                    error = err.message;
                    console.log(err);
                    check = false;
                }
            });

            if(check){
                usr.username = req.body.username;
                usr.firstname = req.body.firstname;
                usr.lastname = req.body.lastname;
                usr.email = req.body.email;
                usr.role = req.body.role;

                usr.save()
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
            }else{
                res.json({err: error});
            }
        })
        .catch( err => res.status(500).json(err) );

});

module.exports = route;