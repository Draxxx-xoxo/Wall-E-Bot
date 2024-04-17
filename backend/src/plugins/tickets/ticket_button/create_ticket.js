const { MessageEmbed } = require("discord.js")
const {Client} = require("pg");
const buttons = require("../../../handlers/common_buttons");
const { Modal, TextInputComponent, MessageActionRow } = require("discord.js");

module.exports = {
  createticket: async (message, discordClient) => {
    const category = message.guild.channels.cache.find(c => c.type === "GUILD_CATEGORY" && c.id == 1230130766730625054);

    if (!category) {
      return message.reply("Category not found.");
    }
    const newChannel = await message.guild.channels.create("ticket-001", {
      type: "GUILD_TEXT", // Change to 'GUILD_VOICE' for voice channels
      parent: category.id
    });

    message.reply(`Channel ${newChannel.name} created in ${category.name}`);
  },
}