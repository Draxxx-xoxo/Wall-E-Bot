const { MessageEmbed } = require("discord.js")
const { createClient } = require("@supabase/supabase-js")
const buttons = require("../../../handlers/common_buttons");
const { Modal, TextInputComponent, MessageActionRow } = require("discord.js");

module.exports = {
  mute: async (message, discordClient) => {

    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)

    const query = `SELECT * FROM public.configurator_v1s WHERE guild_id = ${message.guild.id.toString()}`

    const {data, error} = await supabase
      .from("configurator_v1s")
      .select("mute_role::text")
      .eq("guild_id", message.guild.id.toString())

    if(data.length == 0){
      return message.reply("There is an error fetching your configurations. Please contact support if this issue persists.")
    }

    const res = data[0]

    var muteRole = ""

    if(message.guild.roles.cache.get(res.mute_role) == undefined){
      muteRole = "No role setup"
    }
    else {
      muteRole = message.guild.roles.cache.get(res.mute_role).name + " `" + res.mute_role + "`" 
    }

    const button = await buttons.setupbutton(false, false, false, "Mutes");

    const reporting = new MessageEmbed()
      .setColor("ad94f2")
      .setTitle("Reporting")
      .setDescription("This are the current configurations for the reporting system. You can change them by clicking on the buttons below.")
      .addFields(
        { name: "Mute Role", value: muteRole},
      )
      
    await message.message.edit({ embeds: [reporting], components: [button] });
    message.deferUpdate()
  },
  setup1: async (message, discordClient) => {

    const modal = new Modal()
      .setCustomId("roleID")
      .setTitle("Change Mute Role");

    const changeLoggingChannel = new TextInputComponent()
      .setCustomId("roleID")
      .setLabel("Whats the Role ID of the Mute Role?")
      .setStyle("SHORT");

    const firstactionrow = new MessageActionRow().addComponents(changeLoggingChannel)
    modal.addComponents(firstactionrow)
    await message.showModal(modal);

  }, 
  setup2: async (message, discordClient) => {
    const roleId = message.fields.getTextInputValue("roleID") || null;

    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)

    const query = `UPDATE public.configurator_v1s SET mute_role = '${roleId}' WHERE guild_id = ${message.guild.id}`

    const {data, error} = await supabase
      .from("configurator_v1s")
      .update({mute_role: roleId})
      .eq("guild_id", message.guild.id)

    message.reply({content: "Mute Role has been updated. Please click on the update button to see the changes", ephemeral: true})

  },
}