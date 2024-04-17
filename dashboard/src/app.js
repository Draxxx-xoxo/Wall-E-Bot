require('dotenv').config();
require('./strategies/discordstrategy');
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const express = require('express');
const app = express();
const PORT = process.env.PORT || 53134;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const db = require('./database/mongodb');
const path = require('path');
const mongoose = require('mongoose');

db.then(() => console.log('Connected to MongoDB.')).catch(err => console.log(err));
// Routes
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');
const guildRoute = require('./routes/guild')
const checkout = require('./routes/payments')

app.use(express.static(__dirname + '/public/scripts'));

app.use(session({
    secret: 'some random secret',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false,
    resave: false,
    name: 'discord.oauth2',
    store: new MongoStore({ mongooseConnection:  mongoose.connection })
}));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


// Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Middleware Routes
app.use('/auth', authRoute);
app.use('/dashboard', dashboardRoute);
app.use('/:GuildID', guildRoute);
app.use('/', checkout);

app.get('/', isAuthorized, (req, res) => {
    res.render('home');
});

app.get('/docs', (req, res) => {
    res.redirect('https://sailboatbot.gitbook.io/wall-e-discord-bot/');
});

app.all('*', (req, res) => { 
    res.status(404).render('404'); 
  }); 
    

function isAuthorized(req, res, next) {
    if(req.user) {
        console.log("User is logged in.");
        res.redirect('/dashboard');
    }
    else {
        console.log("User is not logged in.");
        next();
    }
}

app.listen(PORT, () => console.log(`Now listening to requests on port ${PORT}`));