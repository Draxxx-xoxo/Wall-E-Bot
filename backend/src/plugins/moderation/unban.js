const {Client} = require("pg");
const {MessageEmbed} = require("discord.js");
const Log = require("../../handlers/logging");
const {command_logging, infractionQ} = require("../../handlers/common_functions");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "unban",
  category: "botinfo",
  enable: true,
  permissions: 80,
  description: "Returns bot and API latency in milliseconds.",
  execute: async (message, discordclient) => {

    const member = message.options.getUser("user");
    //var member = message.mentions.members.first() || await message.guild.members.fetch(args[0])

    let reason_ = message.options.getString("reason");

    if (member.id == message.member.id){
      return message.reply("You cannot warn youself :person_facepalming:")
    };

    const embed = new MessageEmbed()
      .setTitle(`You have been banned in ${message.guild.name}`)
      .setDescription("Reason\n" + "```" + reason_ + "```")


    if (member.id == message.member.id){
      return message.channel.send("You cannot ban youself :person_facepalming:");
    }

   
    const moderator_id = message.member.user
    const timestamp = Date.now()

    message.guild.members.unban(member).catch(console.error);
    message.reply({content: `${member.id} has been unbanned :ok_hand:`, fetchReply: true});

    setTimeout(async function() {
      await message.deleteReply()
    }, 3000);

    if(message.guild.channels.cache.get(await infraction_logging(message.guild.id)) != undefined){
      Log.Infraction(
        discordclient,
        `${moderator_id.username}#${moderator_id.discriminator} unbanned ${member.username}#${member.discriminator} ` + "`" + `${member.id}` + "`" + ` Reason: ${reason_ || "None"}`,
        message.guild.id
      );
    }
        
    await client.end();  
  },
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Moderator command to ban a user")
    .addUserOption(option => option.setName("user").setDescription("Select a user").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("Reason for the warn"))
};
