const { MessageEmbed } = require("discord.js")
const buttons = require("../../../handlers/common_buttons");
const { Modal, TextInputComponent, MessageActionRow } = require("discord.js");
const { createClient } = require("@supabase/supabase-js")

module.exports = {
  logging: async (message, discordClient) => {

    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)  

    const query = `SELECT * FROM public.configurator_v1s WHERE guild_id = ${message.guild.id.toString()}`

    const {data, error} = await supabase
      .from("configurator_v1s")
      .select("guild_id::text, infraction_logging_channel::text, command_logging_channel::text, report_logging_channel::text, guild_events_logging_channel::text, report_user::text, report_user_logging_channel::text, mute_role::text")
      .eq("guild_id", message.guild.id.toString())

    if(data.length == 0){
      return message.reply("There is an error fetching your configurations. Please contact support if this issue persists.")
    }

    const button = await buttons.setupbutton(false, false, false, "Logging");

    const loggingChannel = data[0]

    var infractionChannel = ""
    var commandChannel = ""
    var reportChannel = ""
    var guildChannel = ""

    if(message.guild.channels.cache.get(loggingChannel.infraction_logging_channel) == undefined){
      infractionChannel = "No channel setup"
    }
    else{
      infractionChannel = message.guild.channels.cache.get(loggingChannel.infraction_logging_channel).name + " `" + loggingChannel.infraction_logging_channel + "`" 
    }

    if(message.guild.channels.cache.get(loggingChannel.command_logging_channel) == undefined){
      commandChannel = "No channel setup"
    }
    else{
      commandChannel = message.guild.channels.cache.get(loggingChannel.command_logging_channel).name + " `" + loggingChannel.command_logging_channel + "`" 
    }

    if(message.guild.channels.cache.get(loggingChannel.report_logging_channel) == undefined){
      reportChannel = "No channel setup"
    }
    else{
      reportChannel = message.guild.channels.cache.get(loggingChannel.report_logging_channel).name + " `" + loggingChannel.report_logging_channel + "`" 
    }

    if(message.guild.channels.cache.get(loggingChannel.guild_events_logging_channel) == undefined){
      guildChannel = "No channel setup"
    }
    else{
      guildChannel = message.guild.channels.cache.get(loggingChannel.guild_events_logging_channel).name + " `" + loggingChannel.guild_events_logging_channel + "`" 
    }

    const logging = new MessageEmbed()
      .setColor("ad94f2")
      .setTitle("Logging")
      .setDescription("These are the logging channels enabled for the server")
      .addFields(
        { name: "Infraction Logging", value: infractionChannel },
        { name: "Command Logging", value: commandChannel },
        { name: "Report Logging", value: reportChannel },
        { name: "Guild Logging", value: guildChannel },
      )
      
    await message.message.edit({ embeds: [logging], components: [button] });
    message.deferUpdate()
  },
  setup1: async (message, discordClient) => {

    const modal = new Modal()
      .setCustomId("loggingchannelID")
      .setTitle("Change Logging Channels");

    const infractionLoggingChannel = new TextInputComponent()
      .setCustomId("infractionChannelId")
      .setLabel("Enter Channel ID for infraction logging")
      .setPlaceholder("Do not input anything if you do not wish to enable logging.")
      .setStyle("SHORT");
    const commandLoggingChannel = new TextInputComponent()
      .setCustomId("commandChannelId")
      .setLabel("Enter Channel ID for command logging")
      .setPlaceholder("Do not input anything if you do not wish to enable logging.")
      .setStyle("SHORT");
    const reportLoggingChannel = new TextInputComponent()
      .setCustomId("reportChannelId")
      .setLabel("Enter Channel ID for report logging")
      .setPlaceholder("Do not input anything if you do not wish to enable logging.")
      .setStyle("SHORT");
    const guildEventLoggingChannel = new TextInputComponent()
      .setCustomId("guildEventChannelId")
      .setLabel("Enter Channel ID for guild event logging")
      .setPlaceholder("Do not input anything if you do not wish to enable logging.")
      .setStyle("SHORT");


    const firstactionrow = new MessageActionRow().addComponents(infractionLoggingChannel)
    const secondactionrow = new MessageActionRow().addComponents(commandLoggingChannel)
    const thirdactionrow = new MessageActionRow().addComponents(reportLoggingChannel)
    const fourthactionrow = new MessageActionRow().addComponents(guildEventLoggingChannel)



    modal.addComponents(firstactionrow, secondactionrow, thirdactionrow, fourthactionrow);
    await message.showModal(modal);

  },

  setup2: async (message, discordClient) => {
    const infractionChannelId = message.fields.getTextInputValue("infractionChannelId") || "NULL";
    const commandChannelId = message.fields.getTextInputValue("commandChannelId") || "NULL";
    const reportChannelId = message.fields.getTextInputValue("reportChannelId") || "NULL";
    const guildEventChannelId = message.fields.getTextInputValue("guildEventChannelId") || "NULL";

    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)
 

    const query = `UPDATE public.configurator_v1s SET infraction_logging_channel = '${infractionChannelId}', command_logging_channel = '${commandChannelId}', report_logging_channel = '${reportChannelId}', guild_events_logging_channel = '${guildEventChannelId}' WHERE guild_id = ${message.guild.id}`

    const {data, error} = await supabase
      .from("configurator_v1s")
      .update({infraction_logging_channel: infractionChannelId, command_logging_channel: commandChannelId, report_logging_channel: reportChannelId, guild_events_logging_channel: guildEventChannelId})
      .eq("guild_id", message.guild.id)

    message.reply({content: "Logging channel has been updated. Please click on the update button to see the changes", ephemeral: true})
  }

}