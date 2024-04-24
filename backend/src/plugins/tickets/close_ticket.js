const {Client} = require("pg");
const {MessageEmbed} = require("discord.js");
const Log = require("../../handlers/logging");
const {command_logging, report_pugin, report_logging, report_logging_channel} = require("../../handlers/common_functions");
const {ticketingbuttons} = require("../../handlers/common_buttons")
const {reportlog, notelog} = require("../../handlers/common_embeds");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "close_ticket",
  enable: false,
  permissions: 20,
  execute: async (message, discordclient) => {
  
    const channel = message.channel;

    await channel.delete();
  },

  data: new SlashCommandBuilder()
    .setName("close_ticket")
    .setDescription("Close a ticket")
};