const {Client} = require("pg");
const {MessageEmbed} = require("discord.js");
const Log = require("../../handlers/logging");
const {command_logging, report_pugin, report_logging, report_logging_channel} = require("../../handlers/common_functions");
const {ticketingbuttons} = require("../../handlers/common_buttons")
const {reportlog, notelog} = require("../../handlers/common_embeds");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "ticket_embed",
  enable: false,
  permissions: 20,
  execute: async (message, discordclient) => {
  
    const embed = new MessageEmbed()
      .setTitle("Create a Ticket")
      // Used for a later feature
      //.setDescription("Please select the type of ticket you would like to create")
      .setDescription("Click the button below to create a ticket")
      .setColor("ad94f2")

    const buttons = await ticketingbuttons(false);

    message.reply({
      embeds: [embed],
      components: [buttons]
    });
  },

  data: new SlashCommandBuilder()
    .setName("ticket_embed")
    .setDescription("Create a ticket embed")
};