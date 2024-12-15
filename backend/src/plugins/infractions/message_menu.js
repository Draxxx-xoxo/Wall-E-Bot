const {MessageEmbed} = require("discord.js")
const { createClient } = require("@supabase/supabase-js")

module.exports = {
  execute: async (menu, discordclient) => {
    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)

    const inf_id = menu.values[0].replace(menu.values[0],menu.values[0].slice(10))

    const {data, error} = await supabase
      .from("infractions")
      .select()
      .eq("id", inf_id)
      .eq("guild_id", menu.guild.id)
      .order("id", {ascending: false})
       
    const res = data[0]

    if(menu.values[0]== "infraction"+res.id) {
      const embed = new MessageEmbed()
        .setTitle("Infraction #" + res.id)
        .addFields(
          {name: "User", value: res.discord_tag + "\n<@" + res.discord_id + ">", inline: true},
          {name: "Moderator", value: res.moderator_tag + "\n<@" + res.moderator_id + ">", inline: true},
          {name: "Reason", value: res.reason || "No Reason"}
        )
        .setFooter({text: "Infraction was created on " + res.created_at})
      await menu.reply({embeds: [embed]})
    }   
  }
};  