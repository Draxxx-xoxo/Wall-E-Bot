const {Client} = require("pg");
const {MessageEmbed} = require("discord.js");
const Log = require("../../handlers/logging");
const {command_logging, report_pugin, report_logging, report_logging_channel} = require("../../handlers/common_functions");
const {ticketingbuttons} = require("../../handlers/common_buttons")
const {reportlog, notelog} = require("../../handlers/common_embeds");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { search } = require("../../../../dashboard/src/routes/payments");

module.exports = {
  name: "close_ticket",
  enable: false,
  permissions: 50,
  execute: async (message, discordclient) => {

    const client = new Client({
      user: process.env.user,
      host: process.env.host,
      database: process.env.db,
      password: process.env.passwd,
      port: process.env.port,
    });
  
    await client.connect();
      
    const searchquery = `
      SELECT * FROM tickets WHERE channel_id = ${message.channel.id};
    `

    const searchres = await client.query(searchquery);

    console.log(searchres.rows);
    if(searchres.rowCount != 1){
      return message.reply("This is not a ticket channel or has not been created by the bot");
    }
    
    if(searchres.rows[0].active == false){
      return message.reply("This ticket is already closed");
    }
  
    const channel = message.channel;

    await channel.delete();
  },

  data: new SlashCommandBuilder()
    .setName("close_ticket")
    .setDescription("Close a ticket")
};