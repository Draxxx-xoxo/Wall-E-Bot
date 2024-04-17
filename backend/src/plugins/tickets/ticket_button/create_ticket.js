const { MessageEmbed } = require("discord.js")
const {Client} = require("pg");
const buttons = require("../../../handlers/common_buttons");
const { Modal, TextInputComponent, MessageActionRow, Permissions } = require("discord.js");

module.exports = {
  createticket: async (message, discordClient) => {
    const category = message.guild.channels.cache.find(c => c.type === "GUILD_CATEGORY" && c.id == 1230130766730625054);
    if (!category) {
      return message.reply("Category not found.");
    }
    const newChannel = await message.guild.channels.create("ticket-001", {
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

    await newChannel.send("Welcome to the new channel!");

    message.reply(`Channel <#${newChannel.id}> created in category ${category.name}`);
  },
}