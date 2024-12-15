const {MessageEmbed} = require("discord.js")
const Log = require("../../handlers/logging");
const {command_logging, infractionQ, infraction_logging} = require("../../handlers/common_functions");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { createClient } = require("@supabase/supabase-js")

module.exports = {
  name: "warn",
  category: "botinfo",
  permissions: 40,
  enable: true,
  execute: async (message, discordclient) => {

    const member = message.options.getUser("user");
    //var member = message.mentions.members.first() || await message.guild.members.fetch(args[0])

    //Dumb not working

    let reason_ = message.options.getString("reason");

    if (member.id == message.member.id){
      return message.reply("You cannot warn youself :person_facepalming:")
    };


    const moderator_id = message.user
    const timestamp = Date.now();

    await infractionQ1(member, moderator_id, reason_, message, timestamp, "warn")

    const DmMsg = `You have been warned in ${message.guild.name}\n Reason\n` + "```" + reason_ + "```"


    const msg = await message.reply({content: `${member.id} has been warned :ok_hand: User has been notified`, fetchReply: true})

    setTimeout(async function() {
      await message.deleteReply()
    }, 3000)


    //member.send(DmMsg).catch(() => message.reply("Can't send DM to your user!"));

    if(message.guild.channels.cache.get(await infraction_logging(message.guild.id)) != undefined){
      Log.Infraction(
			    discordclient,
			    `${moderator_id.username}#${moderator_id.discriminator} warned ${member.username}#${member.discriminator} ` + "`" + `${member.id}` + "`" + ` Reason: ${reason_ || "None"}`,
        message.guild.id
		    );
    }
  },
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Moderator command to warn a user")
    .addUserOption(option => option.setName("user").setDescription("Select a user").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("Reason for the warn"))

};
