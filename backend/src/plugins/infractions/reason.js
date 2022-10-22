const {Client} = require("pg");
const {pgkey} = require("../../../config.json");
const {MessageEmbed} = require("discord.js")

module.exports = {
  name: "reason",
  category: "botinfo",
  aliases:["inf_reason"],
  enable: false,
  permissions:["MANAGE_GUILD","ADMINISTRATOR"],
  description: "Returns bot and API latency in milliseconds.",
  execute: async (message, discordclient) => {

    const inf_id = args[0];

    const reason = args.slice(1).join(" ");
  
    const client = new Client({
      user: process.env.user,
      host: process.env.host,
      database: process.env.db,
      password: process.env.passwd,
      port: process.env.port,
    });
              
    // opening connection
    await client.connect();

    const query = `UPDATE public.infractions SET reason = '${reason}' WHERE id = ${inf_id} AND guild_id = ${message.guild.id}`
       
    const res = (await client.query(query).catch(console.error)).rows[0]


    const checkquery = `SELECT * FROM public.infractions WHERE id = ${inf_id} AND guild_id = ${message.guild.id} ORDER BY id DESC`

    const checkres = (await client.query(checkquery).catch(console.error)).rows[0]

    if(!checkres){
      return message.channel.send("Please enter a valid infraction")
    }

    message.channel.send(`Reason for #${inf_id} has been updated to` + "```" + reason + "```")
        
    client.end();
        
  }
};  