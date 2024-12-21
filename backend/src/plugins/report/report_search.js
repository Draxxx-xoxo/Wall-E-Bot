const {Client} = require("pg");
const {MessageEmbed} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { createClient } = require("@supabase/supabase-js")

module.exports = {
  name: "report_search",
  enable: true,
  permissions: 50,
  execute: async (message, discordclient) => {

    var member = await message.guild.members.fetch(message.options.getUser("user").id)
    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)

    var {data, error} = await supabase
      .from("reports")
      .select("*")
      .eq("reported_user_id", member.user.id)
      .eq("guild_id", message.guild.id)
      .order("id", {ascending: false})

    var {count, error} = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("reported_user_id", member.user.id)
      .eq("guild_id", message.guild.id)


    const res = data

    var report_id_arrary = [];
    var reason_arrary = [];
    var status_arrary = [];
    var message_id_arrary = []

    for (let i = 0; i < count; i++) {
      var report_id = report_id_arrary.push(res[i].id);
      var reason = reason_arrary.push(res[i].reason);
      var reason = status_arrary.push(res[i].status);
      var message_id = message_id_arrary.push(res[i].message_id)

    }

    if(count === 0){
      message.reply("This user does not have any infractions for this server")
      return
    }

    var report_arrary = [];

    for(let i = 0; i < res.rowCount; i++){
      //var report = report_arrary.push(`[#${report_id_arrary[i]}](${redirect_link}${message_id_arrary[i]}): ${reason_arrary[i] || 'No Reason'}` + ' `Status: ' + status_arrary[i] + '`')
      var report = report_arrary.push(`[#${report_id_arrary[i]}]: ${reason_arrary[i] || "No Reason"}` + " `Status: " + status_arrary[i] + "`")
    }

    const report_search = new MessageEmbed()
      .setAuthor({name: `Infractions Overview for ${member.user.username}`, iconURL: member.user.displayAvatarURL()})
      .setDescription("Click on the message link to jump to that report")
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: "Infractions", value: report_arrary.join("\n"), inline: false},
        { name: `Joined ${message.guild.name}`, value: new Date (member.joinedTimestamp).toLocaleString(), inline: false},
      )
    message.reply({embeds: [report_search]});
  },
  data: new SlashCommandBuilder()
    .setName("report_search")
    .setDescription("Search for a user report.")
    .addUserOption(option => option.setName("user").setDescription("Select a user").setRequired(true))
};