const Log = require("../../handlers/logging");
const {command_logging, report_pugin, report_logging, report_logging_channel} = require("../../handlers/common_functions");
const {reportbuttons} = require("../../handlers/common_buttons")
const deny = require("./report_buttons/moderation")
const {reportlog, notelog} = require("../../handlers/common_embeds");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { createClient } = require("@supabase/supabase-js")

module.exports = {
  name: "report",
  enable: true,
  permissions: 20,
  execute: async (message, discordclient) => {

    if(await report_pugin(message.guild.id) == false){
      message.reply("This server is not setup to accept reports. Please contact your administrator if you believe this is an error")
      return
    }

    var member = await message.guild.members.fetch(message.options.getUser("user").id)


    let reason_ = message.options.getString("reason")

    if (member.id == message.member.id){
      message.reply({content: "You cannot report youself :person_facepalming:", fetchReply: true})

      setTimeout(async function() {
        await message.deleteReply()
      }, 3000)

      return
    }

    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)

    const {data, error} = await supabase
      .from("reports")
      .insert({reporter_id: message.user.id, reporter_tag: message.user.tag, reported_user_tag: member.user.tag, reported_user_id: member.user.id, reason: reason_ || "No Reason", guild_id: message.guild.id, status: "pending"})
      .select()

    const res = data[0]

    message.reply({content: "User has been reported, please check your DM's for updates", fetchReply: true})

    setTimeout(async function() {
      await message.deleteReply()
    }, 3000)
        
    //message.author.send('Overview about report').catch(() => message.reply("Can't send DM to your user!"));;

    /*if(await report_logging(message.guild.id) ==  true){
      Log.Send(
        discordclient,
        `${message.user.tag} reported ${member.user.tag}` + "`" + `${member.user.id}` + "`" + ` Reason: ${reason_ || "None"}`,
        message.guild.id
      );
    }*/
    const reportchannel = await report_logging_channel(message.guild.id);

    const report_buttons = await reportbuttons(false)

    const reportembed = await reportlog(res,"🟡")
    const noteembed = (await notelog(res.id)).addFields({name: "\u200b", value: "\u200b"},)
     
    const messagereply = message.guild.channels.cache.get(reportchannel).send({
      components: [report_buttons],
      embeds: [reportembed, noteembed]
    });  


    await supabase
      .from("reports")
      .update({message_id: (await messagereply).id})
      .eq("id", res.id)

  },
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Report a user for moderators to review")
    .addUserOption(option => option.setName("user").setDescription("Select a user").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("Reason for the report").setRequired(true))
};