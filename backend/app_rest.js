const express = require('express');
const { sequelize, Users } = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
// const http = require('http');
// const { Server } = require("socket.io");
require('dotenv').config();

const usersRoute = require("./routes/usersRoute");
const filmsRoute = require("./routes/filmsRoute");
const serijasRoute = require("./routes/serijasRoute");
const moviesPostsRoute = require("./routes/filmpostsRoute");
const serijasPostsRoute = require("./routes/serijapostsRoute");

const app = express();

// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:8080',
//         methods: ['GET', 'POST'],
//         credentials: true
//     },
//     allowEIO3: true
// });

var corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api", usersRoute);
app.use("/api", filmsRoute);
app.use("/api", serijasRoute);
app.use("/api", moviesPostsRoute);
app.use("/api", serijasPostsRoute);

// function authSocket(msg, next) {
//     if (msg[1].token == null) {
//         next(new Error("Not authenticated"));
//     } else {
//         jwt.verify(msg[1].token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//             if (err) {
//                 next(new Error(err));
//             } else {
//                 msg[1].user = user;
//                 next();
//             }
//         });
//     }
// }

// io.on('connection', socket => {
//     socket.use(authSocket);
 
//     socket.on('comment', msg => {
//         Messages.create({ body: msg.body, artId: msg.artId, userId: msg.user.userId })
//             .then( rows => {
//                 Messages.findOne({ where: { id: rows.id }, include: ['user'] })
//                     .then( msg => io.emit('comment', JSON.stringify(msg)) ) 
//             }).catch( err => res.status(500).json(err) );
//     });

//     socket.on('error', err => socket.emit('error', err.message) );
// });

app.listen({ port: 10000 }, async () => {
    await sequelize.authenticate();
    console.log("started app_rest");
});