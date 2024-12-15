const {Client} = require("pg");
const {MessageEmbed} = require("discord.js")
const {destroyinf} = require("../../handlers/common_buttons")
const { MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { createClient } = require("@supabase/supabase-js")


module.exports = {
  name: "infraction_destroy",
  aliases:["infraction_destroy", "inf_destroy","inf_delete"],
  enable: true,
  permissions: 80,
  execute: async (message, discordclient) => {

    const inf_id = message.options.getNumber("id");
    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)
  
    const {data, error} = await supabase
      .from("infractions")
      .select()
      .eq("id", inf_id)
      .eq("guild_id", message.guild.id)
       

    if(data.length == 0) return message.reply("This infraction does not exsist on this server")

    //const timestamp = `${res.timestamp}` || ''

    //var date = new Date (timestamp).toLocaleString()

    const res = data[0]

    const embed = new MessageEmbed()
      .setTitle("Infraction #" + res.id)
      .addFields(
        {name: "User", value: res.discord_tag + "\n<@" + res.discord_id + ">", inline: true},
        {name: "Moderator", value: res.moderator_tag + "\n<@" + res.moderator_id + ">", inline: true},
        {name: "Reason", value: res.reason || "No Reason"}
      )
      .setFooter({text:"Infraction was created on " + res.created_at})


    const buttons = await destroyinf(false)


    message.reply({content: "Are you sure you want to delete this infraction? Click on `Yes` if you wish to procced", components:[buttons], embeds:[embed]})
        
  },

  button: async(button, discordclient) => {

    const buttons = await destroyinf(true)

    if(button.component.customId == "yes"){

      const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)
      const inf_id =  button.message.embeds[0].title.slice(12)
      const delete_query = `DELETE FROM public.infractions WHERE id = ${inf_id} AND guild_id = ${button.guild.id}`
      const {data, error} = await supabase
        .from("infractions")
        .delete()
        .eq("id", inf_id)
        .eq("guild_id", button.guild.id)

      button.reply("#" + inf_id + " has been deleted");
      button.message.edit({
        components:[buttons]
      })
    }
    if (button.component.customId == "no"){

      button.reply("Action cancelled")
      button.message.edit({
        components:[buttons]
      })
    }
  },
  data: new SlashCommandBuilder()
    .setName("infraction_destroy")
    .setDescription("Destroy an infraction")
	  .addNumberOption(option => option.setName("id").setDescription("Delete a specific infraction").setRequired(true))
};  