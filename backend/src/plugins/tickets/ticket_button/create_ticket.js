const { MessageEmbed } = require("discord.js")
const {Client} = require("pg");
const buttons = require("../../../handlers/common_buttons");
const { Modal, TextInputComponent, MessageActionRow, Permissions } = require("discord.js");
const moment = require("moment");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  createticket: async (message, discordClient) => {

    const uid = uuidv4();

    // Define the API endpoint and bearer token
    const apiUrl = "http://localhost:1337/api/tickets";
    const bearerToken = "822ca389f5560fec7410bd387bdac30cf87379d1608de0b400b903549af53bff5942217c08fdf0fc1ecf3f06b681e0684c1c15a7a6dd1c74533524abe31f93bcf0484c0f63861763afa589ba6750879d6c224fa4ad2f3b7787c32fe518ab6115b98bd6b44e1d0fad3f1cd68a5dafa251c0268e815b7e1c057b7573f91198ed61"; // This wouldn't work for anyone lol cuz its localhost

    const category = message.guild.channels.cache.find(c => c.type === "GUILD_CATEGORY" && c.id == 1230130766730625054);
    if (!category) {
      return message.reply("Category not found.");
    }
    const newChannel = await message.guild.channels.create("ticket-", {
      type: "GUILD_TEXT", // Change to 'GUILD_VOICE' for voice channels
      parent: category.id,
      permissionOverwrites: [
        {
          id: message.user.id, 
          allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY] 
        },
        {
          id: message.guild.roles.everyone, // @everyone role ID
          deny: [Permissions.FLAGS.VIEW_CHANNEL] 
        },
        {
          id: "740175943829815307", 
          allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY] 
        },
        {
          id: "774118155387011074", 
          allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY], 
          deny: [Permissions.FLAGS.SEND_MESSAGES,]
        },

      ],
    });

    const embed = new MessageEmbed()
      .setTitle(`Welcome to your ticket ${message.user.username}!`)
      // Used for a later feature
      //.setDescription("Please select the type of ticket you would like to create")
      .setDescription("Please state the purpose of this ticket")
      .setColor("ad94f2")
      .setTimestamp(moment().format())

    await newChannel.send({
      embeds: [embed],
    });

    // Define the data to be sent in the request body
    const requestData = {
      "data": {
        "ticketID": uid,
        "active": "true",
        "userID": message.user.id,
        "username": message.user.username,
        "guildID": message.guild.id,
        "guildName": message.guild.name,
        "channelID": newChannel.id,
      }
    }
    
    // Set up the request configuration
    const config = {
      method: "post", // Use PUT method
      url: apiUrl,
      headers: { 
        "Authorization": `bearer ${bearerToken}`, // Add bearer token to headers
        "Content-Type": "application/json" // Specify the content type
      },
      data: requestData // Set the data to be sent in the request body
    };
    
    // Make the PUT request
    axios(config)
      .then(response => {
        console.log("Response:", response.data);
      })
      .catch(error => {
        console.error("Error:", error);
      });

    message.reply(`Channel <#${newChannel.id}> created in category ${category.name}`);
  },
}