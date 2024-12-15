const {MessageEmbed} = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders");
const { createClient } = require("@supabase/supabase-js")

module.exports = {
  name: "infraction_reason",
  aliases:["inf_reason"],
  enable: true,
  permissions: 50,
  execute: async (message, discordclient) => {

    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)
    const inf_id = message.options.getNumber("id");
    const reason = message.options.getString("reason");
  
    const query = `UPDATE public.infractions SET reason = '${reason}' WHERE id = ${inf_id} AND guild_id = ${message.guild.id}`

    const {data, error} = await supabase
      .from("infractions")
      .update({reason: reason})
      .eq("id", inf_id)
      .eq("guild_id", message.guild.id)
      .select()
       
    if(data.length == 0) return message.reply("This infraction does not exsist on this server")

    message.reply(`Reason for #${inf_id} has been updated to` + "```" + reason + "```")
        
  },
  data: new SlashCommandBuilder()
    .setName("infraction_reason")
    .setDescription("Change the reason of an infraction")
	  .addNumberOption(option => option.setName("id").setDescription("Search for a specific infraction").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("Reason for the infraction").setRequired(true))
};  