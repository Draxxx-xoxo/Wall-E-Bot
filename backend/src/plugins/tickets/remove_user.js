const { MessageEmbed } = require("discord.js")
const {Client} = require("pg");
const { Modal, TextInputComponent, MessageActionRow, Permissions } = require("discord.js");
const moment = require("moment");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  name: "remove_user",
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
  
    if(searchres.rowCount != 1){
      return message.reply("This is not a ticket channel or has not been created by the bot");
    }
      
    if(searchres.rows[0].active == false){
      return message.reply("This ticket is already closed");
    }

    await client.end()

    const member = message.options.getUser("user");

    const channel = message.channel; 

    channel.permissionOverwrites.delete(member)
      .then(() => {
        // Send confirmation message
        message.reply(`${member} has been removed from the channel!`);
      })
      .catch(error => {
        console.error("Failed to remove user from channel:", error);
        message.reply("Failed to remove user from channel.");
      });
  },

  data: new SlashCommandBuilder()
    .setName("remove_user")
    .setDescription("Removes User to a ticket")
    .addUserOption(option => option.setName("user").setDescription("Select a user").setRequired(true))
}