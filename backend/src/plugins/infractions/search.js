const {MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js")
const functions = require("../../handlers/common_functions")
const { SlashCommandBuilder } = require("@discordjs/builders");
const { createClient } = require("@supabase/supabase-js")


module.exports = {
  name: "infraction_search",
  aliases:["infraction search","infraction_search", "inf search"],
  enable: true,
  permissions: 40,
  execute: async (message, discordclient) => {

    const member = message.options.getUser("user");
    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)

    var {data, error} = await supabase
      .from("infractions")
      .select()
      .eq("discord_id", member.id)
      .eq("guild_id", message.guild.id)
      .order("id", {ascending: false})

    var {count, error} = await supabase
      .from("infractions")
      .select("*", { count: "exact", head: true })
      .eq("discord_id", member.id)
      .eq("guild_id", message.guild.id)

    var rowcount = count
    var res = data

    console.log(rowcount, res)

    var report_id_arrary = [];
    var infractions_arrary = [];
    var reason_arrary = [];

    for (let i = 0; i < rowcount; i++) {
      var report_id = report_id_arrary.push(res[i].id)
      var infractions = infractions_arrary.push(res[i].infractions)
      var reason = reason_arrary.push(res[i].reason)
    }

    if(data.length == 0) return message.reply("This user does not have any infractions for this server");

    var report_arrary = [];
    for(let i = 0; i < rowcount; i++){
      var report = report_arrary.push(`#${report_id_arrary[i]} (${infractions_arrary[i]}): ${reason_arrary[i] || "No Reason"}`)
    }
    var options = [];
    if(rowcount >= 25) var rowcount = 25
    for(let i = 0; i < rowcount; i++){
      switch (infractions_arrary[i]) {
      case "warn":
        emoji = "⚠️";
        break;
      case "ban":
        emoji = "🚫";
        break;
      case "tempmute":
        emoji = "🔕"
        break;
      case "mute":
        emoji = "🔕";
        break;
      case "kick":
        emoji = "🦵🏼";
        break;
      default:
        emoji = "⚠️";
        break;
      };
      let option = options.push({
        label: "#" + report_id_arrary[i],
        emoji: emoji,
        description: infractions_arrary[i],
        value: "infraction" + report_id_arrary[i],
      },
      )}
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId("search")
          .setPlaceholder("Nothing selected")
          .addOptions(options),
      );
    //var prefix = await functions.getPreix(message.guild.id)
    var inf_search = new MessageEmbed()
      .setAuthor({name: `Infractions Overview for ${member.username.toString()}`, iconURL: member.displayAvatarURL()})
      .setDescription("Use the Select Menu to see for infraction details")
      .setThumbnail(member.displayAvatarURL())
      .addFields(
        { name: "Infractions", value: report_arrary.join("\n"), inline: false},
        { name: "Total Infractions", value: rowcount.toString(), inline: true },
        { name: `Joined ${message.member.guild.name.toString()}`, value: new Date (member.joinedTimestamp).toLocaleString(), inline: true },
      )
    message.reply({embeds: [inf_search], components: [row]}) 
  },
  data: new SlashCommandBuilder()
    .setName("infraction_search")
    .setDescription("Lookup for member infractions")
    .addUserOption(option => option.setName("user").setDescription("Select a user").setRequired(true))
};  
