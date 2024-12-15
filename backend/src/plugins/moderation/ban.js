const {MessageEmbed} = require("discord.js");
const Log = require("../../handlers/logging");
const {command_logging, infractionQ, infraction_logging} = require("../../handlers/common_functions");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "ban",
  category: "botinfo",
  permissions: 50,
  enable: true,
  description: "Returns bot and API latency in milliseconds.",
  execute: async (message, discordclient) => {

    const member = message.options.getUser("user");
  
    let reason_ = message.options.getString("reason");

    if (member.id == message.member.id){
      return message.reply("You cannot warn youself :person_facepalming:")
    };

    const embed = new MessageEmbed()
      .setTitle(`You have been banned in ${message.guild.name}`)
      .setDescription("Reason\n" + "```" + reason_ + "```")


    if (member.id == message.member.id){
      return message.reply("You cannot ban youself :person_facepalming:");
    }
   
    const moderator_id = message.member.user
    const timestamp = Date.now()
    await infractionQ(member, moderator_id, reason_, message, timestamp, "ban")


    //member.send('embed').catch(() => console.log("Can't send DM to your user!"));
    message.guild.members.ban(member, {reason: reason_})
    //member.ban({reason: reason_})


        
    message.reply({content: `${member.id} has been banned :ok_hand: User has been notified`, fetchReply: true})

    setTimeout(async function() {
      await message.deleteReply()
    }, 3000)

    if(message.guild.channels.cache.get(await infraction_logging(message.guild.id)) != undefined){
      Log.Infraction(
        discordclient,
        `${moderator_id.username}#${moderator_id.discriminator} banned ${member.username}#${member.discriminator} ` + "`" + `${member.id}` + "`" + ` Reason: ${reason_ || "None"}`,
        message.guild.id
      );
    }
  
  },
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Moderator command to ban a user")
    .addUserOption(option => option.setName("user").setDescription("Select a user").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("Reason for the warn"))

};
