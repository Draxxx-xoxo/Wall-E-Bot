const router = require('express').Router();
const passport = require('passport');
const express = require('express');

router.use(express.json());
router.get('/', passport.authenticate('discord'));
router.get('/redirect', passport.authenticate('discord', { 
    failureRedirect: '/forbidden',
    successRedirect: '/dashboard'
}));
router.get('/logout', (req, res) => {
    if(req.user) {
        req.logout();
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

function isAuthorized(req, res, next) {
    if(req.user) {
        console.log("User is logged in.");
        next();
    }
    else {
        console.log("User is not logged in.");
        res.redirect('/');
    }
}


module.exports = router;