const router = require('express').Router();
const { getPermissions } = require('../utils/utils');
const {Client} = require('pg');


async function isAuthorized (req, res, next){

    var userID = ''

    if(req.user == undefined){
        userID = null
    }
    else {
        userID = req.user.discordId
    }
    const client = new Client({
        user: process.env.user,
        host: process.env.host,
        database: process.env.db,
        password: process.env.passwd,
        port: process.env.port,
    }); 
    client.connect();

    const guildid = req.baseUrl.slice(1)
    const queryGuild = `SELECT * FROM allowed_guilds JOIN  allowed_users d USING (guild_id) WHERE d.guild_id = ${guildid} AND d.user_id = ${userID}`;
    const res_guild = await client.query(queryGuild);
    const queryAdmin = `SELECT * FROM global_admins WHERE user_id = ${userID};`
    const res_admin = await client.query(queryAdmin);
    client.end();
    
    if(res_admin.rowCount == 1){
        console.log("User is logged in & a Super Admin");
        next();
    }
    else{
        if(req.user && res_guild.rowCount > 0) {
            console.log("User is logged in & guild is allowed.");
            //console.log(req.user)
            //console.log(res_guild.rowCount)
            next();
        }
        else {
            if(req.user == undefined){
                console.log("User is not logged in.");
                res.redirect('/');
            }
            else{
                console.log("User is not in guild.");
                res.render('forbidden');
            }
        }
    }
}

router.get('/infractions', isAuthorized, async (req, res) => {

    const client = new Client({
        user: process.env.user,
        host: process.env.host,
        database: process.env.db,
        password: process.env.passwd,
        port: process.env.port,
    }); 
    client.connect();
    
    const guildid = req.baseUrl.slice(1)
    const queryGuild = `SELECT * FROM allowed_guilds JOIN  allowed_users d USING (guild_id) WHERE d.guild_id = ${guildid} AND d.user_id = ${req.user.discordId};`;
    const res_guild = await client.query(queryGuild);
    const queryAdmin = `SELECT * FROM global_admins WHERE user_id = ${req.user.discordId};`
    const res_admin = await client.query(queryAdmin);
    permission = 0

    if(res_guild.rowCount == 0){
        if(res_admin.rowCount == 1){
            permission = 0
        }
        else{
            permission = 1
        }
    }
    else if(res_guild.rowCount == 1){
        permission = res_guild.rows[0].permission_id
    }

    client.end()
    //console.log(queryGuild);
    //console.log(res_guild.rows)


    res.render('infractions', {
        username: req.user.username,
        discordId: req.user.discordId,
        guilds: req.user.guilds,
        permissions: res_guild.rows[0].permission_id
    });
});

router.get('/add_user', isAuthorized, async (req, res) => {

    const client = new Client({
        user: process.env.user,
        host: process.env.host,
        database: process.env.db,
        password: process.env.passwd,
        port: process.env.port,
    }); 
    client.connect();
    
    const guildid = req.baseUrl.slice(1)
    const queryGuild = `SELECT * FROM allowed_guilds JOIN  allowed_users d USING (guild_id) WHERE d.guild_id = ${guildid} AND d.user_id = ${req.user.discordId};`;
    const res_guild = await client.query(queryGuild);
    const queryAdmin = `SELECT * FROM global_admins WHERE user_id = ${req.user.discordId};`
    const res_admin = await client.query(queryAdmin);
    permission = 0

    //console.log(queryGuild);
    //console.log(res_guild.rows)

    if(res_guild.rowCount == 0){
        if(res_admin.rowCount == 1){
            permission = 0
        }
        else{
            permission = 1
        }
    }
    else if(res_guild.rowCount == 1){
        permission = res_guild.rows[0].permission_id
    }

    client.end()

    res.render('add_user', {
        username: req.user.username,
        discordId: req.user.discordId,
        guilds: req.user.guilds,
        permissions: res_guild.rows[0].permission_id
    });
});

router.get('/editor', isAuthorized, (req, res) => {

    res.render('editor', {
        username: req.user.username,
        discordId: req.user.discordId,
        guilds: req.user.guilds,
    });
});

router.get('/permissions', isAuthorized, async(req, res) => {

    const client = new Client({
        user: process.env.user,
        host: process.env.host,
        database: process.env.db,
        password: process.env.passwd,
        port: process.env.port,
    }); 
    client.connect();
    
    const guildid = req.baseUrl.slice(1)
    const queryGuild = `SELECT * FROM allowed_guilds JOIN  allowed_users d USING (guild_id) WHERE d.guild_id = ${guildid} AND d.user_id = ${req.user.discordId};`;
    const res_guild = await client.query(queryGuild);
    const queryAdmin = `SELECT * FROM global_admins WHERE user_id = ${req.user.discordId};`
    const res_admin = await client.query(queryAdmin);
    permission = 0

    if(res_guild.rowCount == 0){
        if(res_admin.rowCount == 1){
            permission = 0
        }
        else{
            permission = 1
        }
    }
    else if(res_guild.rowCount == 1){
        permission = res_guild.rows[0].permission_id
    }
    client.end()

    res.render('bot_permissions.ejs', {
        username: req.user.username,
        discordId: req.user.discordId,
        guilds: req.user.guilds,
        permissions: permission
    });
});


router.get('/ticketing', isAuthorized, (req, res) => {

    res.render('ticketing.ejs', {
        username: req.user.username,
        discordId: req.user.discordId,
        guilds: req.user.guilds,
    });
});

module.exports = router;