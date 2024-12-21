const {MessageEmbed} = require("discord.js");
const functions = require("../.././handlers/common_functions");
const Log = require("../../handlers/logging");
const {command_logging} = require("../../handlers/common_functions");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "unmute",
  category: "botinfo",
  enable: false,
  permissions: 50,
  description: "Returns bot and API latency in milliseconds.",
  execute: async (message, discordclient) => {
                        
    var member = message.options.getUser("user");
        

    if (member.id == message.member.user.id){
      return message.channel.send("You cannot mute yourself :person_facepalming:")
    };


    const role_id = await functions.muteRole(message);
    const moderator_id = message.member.user
        

    if(!role_id){
      return message.channel.send("Please add a mute role")
    }

    var member_ = await discordclient.guilds.cache.get(message.guild.id).members.cache.get(member.id)

    if(member_.roles.cache.has(role_id) == false){
      return message.reply("That person is not muted")
    }

    const embed = new MessageEmbed()
      .setTitle(`You have been unmuted in ${message.guild.name}`)

    member_.roles.remove(role_id)
        
    message.reply({ content: `${member.id} has been unmuted :ok_hand: User has been notified`, fetchReply: true})

    setTimeout(async function() {
      await message.deleteReply()
    }, 3000)

    discordclient.users.cache.get(member.id).send(embed).catch(() => message.reply("Can't send DM to your user!"));

    if(message.guild.channels.cache.get(await infraction_logging(message.guild.id)) != undefined){
      Log.Infraction(
			    discordclient,
			    `${moderator_id.username}#${moderator_id.discriminator} unmuted ${member.username}#${member.discriminator} ` + "`" + `${member.id}` + "`",
        message.guild.id
		    );
    }
                
    await client.end()        
  }, 
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Moderator command to unmute a user")
    .addUserOption(option => option.setName("user").setDescription("Select a user").setRequired(true))
};
    