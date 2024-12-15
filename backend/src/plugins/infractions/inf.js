const {MessageEmbed} = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders");
const { createClient } = require("@supabase/supabase-js")

module.exports = {
  name: "infraction",
  aliases:["infraction","inf_search","case"],
  enable: true,
  permissions: 40,
  execute: async (message, discordclient) => {

    const inf_id = message.options.getNumber("id");

    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)

    const { data, error } = await supabase
      .from("infractions")
      .select()
      .eq("id", inf_id)

  
    if(data.length == 0) return message.reply("This infraction does not exsist on this server")

    const res = data[0]
    const timestamp = `${res.timestamp}`

    const embed = new MessageEmbed()
      .setTitle("Infraction #" + res.id)
      .addFields(
        {name: "User", value: res.discord_tag + "\n<@" + res.discord_id + ">", inline: true},
        {name: "Moderator", value: res.moderator_tag + "\n<@" + res.moderator_id + ">", inline: true},
        {name: "Reason", value: res.reason || "No Reason"}
      )
      .setFooter({text: "Infraction was created on " + res.created_at})
    await message.reply({embeds: [embed]})
  
        
  },
  data: new SlashCommandBuilder()
    .setName("infraction")
    .setDescription("Lookup for an infraction")
	  .addNumberOption(option => option.setName("id").setDescription("Search for a specific infraction").setRequired(true))
};  