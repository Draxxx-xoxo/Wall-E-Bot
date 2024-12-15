const functions = require("../../handlers/common_functions")
const Log = require("../../handlers/logging")
const {permission} = require("../../handlers/permissions") 
const {premium} = require("../../handlers/premium")

module.exports = async (discordClient, interaction) => {

  if (interaction.isButton()){
    if(interaction.component.customId == "yes" || interaction.component.customId.toLowerCase() == "no"){
      var destroy_infs = require("../../plugins/infractions/destroy_inf")
      try{
        destroy_infs.button(interaction, discordClient)
      } catch (error) {
        console.log(error);
      }
    }
    if(interaction.component.customId.toLowerCase() == "warn" || interaction.component.customId.toLowerCase() == "mute" || interaction.component.customId.toLowerCase()== "ban" || interaction.component.customId.toLowerCase() == "kick" || interaction.component.customId.toLowerCase() =="deny"){
      var report_buttons = require("../../plugins/report/report_buttons") 

      try{
        report_buttons.execute(interaction, discordClient)
      } catch (error) {
        console.log(error);
      }
    }
    if(interaction.component.customId.toLowerCase() == "logging" || interaction.component.customId.toLowerCase() == "reporting" || interaction.component.customId.toLowerCase() == "mutes"){
      var main_buttons = require("../../plugins/configuration/buttons.config")

      try{
        main_buttons.main_button(interaction, discordClient)
      } catch (error) {
        console.log(error);
      }
    }
    if(interaction.component.customId.toLowerCase() == "setupmutes"){
      var mute_config_buttons = require("../../plugins/configuration/config_buttons/mute_config_buttons")

      try{
        mute_config_buttons.setup1(interaction, discordClient)
      } catch (error) {
        console.log(error);
      }
    }
    if(interaction.component.customId.toLowerCase() == "updatemutes" || interaction.component.customId.toLowerCase() == "updatereport" || interaction.component.customId.toLowerCase() == "updatelogging"){
      var updateButton = require("../../plugins/configuration/config")

      try{
        updateButton.update_button(interaction, discordClient)
      } catch (error) {
        console.log(error);
      }
    }
    if(interaction.component.customId.toLowerCase() == "back"){
      const backbutton = require("../../plugins/configuration/config")

      try{
        backbutton.execute(interaction, discordClient)
      } catch (error) {
        console.log(error);
      }
    }
    if(interaction.component.customId.toLowerCase() == "setupreport"){
      const config_buttons = require("../../plugins/configuration/config_buttons/report_config_buttons")

      try{
        config_buttons.setup1(interaction, discordClient)
      } catch (error) {
        console.log(error);
      }
    }
    if(interaction.component.customId.toLowerCase() == "enable" || interaction.component.customId.toLowerCase() == "disable"){
      const config_buttons = require("../../plugins/configuration/config_buttons/report_config_buttons")

      try{
        config_buttons.setup2(interaction, discordClient)
      } catch (error) {
        console.log(error);
      }
    }
    if(interaction.component.customId.toLowerCase() == "enable" || interaction.component.customId.toLowerCase() == "disable"){
      const config_buttons = require("../../plugins/configuration/config_buttons/report_config_buttons")

      try{
        config_buttons.setup2(interaction, discordClient)
      } catch (error) {
        console.log(error);
      }
    }
    if(interaction.customId.toLowerCase() == "setuplogging"){
      var config_buttons = require("../../plugins/configuration/config_buttons/logging_button_config")
      try{
        config_buttons.setup1(interaction, discordClient)
      } catch (error) {
        console.log(error);
      }
    }
  }

  if(interaction.isModalSubmit()){
    var config_buttons = require("../../plugins/configuration/config_buttons/report_config_buttons")
    if(interaction.customId == "reportChannelID"){
      try{
        config_buttons.setup3(interaction, discordClient)
      } catch (error) {
        console.log(error);
      }
    }
    var loggingModal = require("../../plugins/configuration/config_buttons/logging_button_config")
    if(interaction.customId == "loggingchannelID"){
      try{
        loggingModal.setup2(interaction, discordClient)
      } catch (error) {
        console.log(error);
      }
    }
  }

  if(interaction.isSelectMenu()){
    const message_menu = require("../../plugins/infractions/message_menu") 

    try{
      message_menu.execute(interaction, discordClient)
    } catch (error) {
      console.log(error);
    }
  }
  if(interaction.isCommand()){

    const { commandName } = interaction;
    const command = discordClient.commands.get(commandName)
    const commandEnabled = command.enable || false
    const super_admins = await functions.super_admins()

    if(commandEnabled == false){
      if(super_admins[0] !== interaction.user.id){
        await interaction.reply({ content:"This commands are not ready to use yet! We will be releasing them soon.", ephemeral: true })
        return;
      }
    }
    var channeltype = ""

    if(interaction.channel == null){
      channeltype = "null"
    }
    else{
      channeltype = interaction.channel.type
    }

    if(channeltype == "null"){
      return interaction.reply({ content: "I can't execute that command inside DMs!", ephemeral: true });
    }

    const premium_check = await premium(interaction.guild.id, command.category)

    if(premium_check == false){
      return interaction.reply({ content: "This command is only available to premium users!", ephemeral: true });
    }

    const permission_check = await permission(discordClient, command.permissions, interaction.guild.id, interaction.member)
    if(permission_check == false){
      return interaction.reply({ content: "I can't execute that command you do not have the right permissions!", ephemeral: true });
      
    }


    try{
      await command.execute(interaction, discordClient)
      if(interaction.guild.channels.cache.get(await functions.command_logging(interaction.guild.id)) != undefined){
        Log.Command(
          discordClient,
          `${interaction.user.tag} used the command ` + "`" + command.name + "`" + ` in <#${interaction.channel.id}>`,
          interaction.guild.id
        )
      }	
    } catch (error) {
      console.log(error);
    }
  
  }
};