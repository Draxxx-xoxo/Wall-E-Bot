const { MessageEmbed } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders");
const buttons = require("../../handlers/common_buttons");
const { createClient } = require("@supabase/supabase-js")

module.exports = {
  name: "configurator",
  enable: true,
  permissions: 100,
  execute: async (message, discordClient) => {

    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)

    const { data, error } = await supabase.rpc("insert_configurator_if_not_exists", {guild_id_input: message.guild.id})
      
    const configuator = new MessageEmbed()
      .setColor("ad94f2")
      .setTitle("Configurator")
      .setDescription("**Which configuration would you like to change?**\n- Logging\n- Reporting\n- Mutes\n*Others are still in development*")

    const button = await buttons.configurationbuttons(false, false, false)

    var backId = ""

    if(!message.component){
      backId = null
    } else {
      backId = message.component.customId.toLowerCase()
    }

    if(backId == "back"){
      await message.message.edit({ embeds: [configuator], components: [button] })
      message.deferUpdate()
    }
    else{
      await message.reply({ embeds: [configuator], components: [button] })
    }
  },
  update_button: async (message, discordClient) => {

    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)

    const {data, error} = await supabase
      .from("configurator_v1s")
      .select("guild_id::text, infraction_logging_channel::text, command_logging_channel::text, report_logging_channel::text, guild_events_logging_channel::text, report_user, report_user_logging_channel::text, mute_role::text")
      .eq("guild_id", message.guild.id.toString())

    const res = await data[0]

    var embed = ""
    var config = ""
    var reportUser = ""

    if(res.report_user == true){
      reportUser = "On"
    }
    else{
      reportUser = "Off"
    }

    var reportChannel = ""

    if(message.guild.channels.cache.get(res.report_user_logging_channel) == undefined){
      reportChannel =" No channel setup"
    }
    else {
      reportChannel = message.guild.channels.cache.get(res.report_user_logging_channel).name + " `" + res.report_user_logging_channel + "`" 
    }

    var muteRole = ""

    if(message.guild.roles.cache.get(res.mute_role) == undefined){
      muteRole = "No role setup"
    }
    else {
      muteRole = message.guild.roles.cache.get(res.mute_role).name + " `" + res.mute_role + "`" 
    }

    const loggingChannel = res

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

    if(message.component.customId == "updateReport"){
      embed = new MessageEmbed()
        .setColor("ad94f2")
        .setTitle("Reporting")
        .setDescription("This are the current configurations for the reporting system. You can change them by clicking on the buttons below.")
        .addFields(
          { name: "Reporting", value: reportUser},
          { name: "Reporting Channel", value: reportChannel},
        )
      config = "Report"
    }
    else if(message.component.customId == "updateMutes"){
      embed = new MessageEmbed()
        .setColor("ad94f2")
        .setTitle("Reporting")
        .setDescription("This are the current configurations for the reporting system. You can change them by clicking on the buttons below.")
        .addFields(
          { name: "Mute Role", value: muteRole},
        )
      config = "Mutes"
    }
    else if(message.component.customId == "updateLogging"){
      embed = new MessageEmbed()
        .setColor("ad94f2")
        .setTitle("Logging")
        .setDescription("These are the logging channels enabled for the server")
        .addFields(
          { name: "Infraction Logging", value: infractionChannel },
          { name: "Command Logging", value: commandChannel },
          { name: "Report Logging", value: reportChannel },
          { name: "Guild Logging", value: guildChannel },
        )
      config = "Logging"
    }
    const button = await buttons.setupbutton(false, false, false, config);
    await message.message.edit({ embeds: [embed], components: [button] });
    message.deferUpdate()
  },
  data: new SlashCommandBuilder()
    .setName("configurator")
    .setDescription("Configure the settings of the Bot")
}
