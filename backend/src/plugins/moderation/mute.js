const {MessageEmbed} = require("discord.js")
const functions = require("../.././handlers/common_functions")
const Log = require("../../handlers/logging")
const {command_logging, infractionQ} = require("../../handlers/common_functions");

module.exports = {
  name: "mute",
  category: "botinfo",
  permissions: 40,
  enable: false,
  description: "Returns bot and API latency in milliseconds.",
  execute: async (message, discordclient) => {

                        
    if(message.mentions.roles.first()){
      return message.channel.send("Why are you mentioning a role? <:blob_ping:807930234410237963>")
    }

    var member = ""
    if(message.mentions.members.first()){
      member = message.mentions.members.first()
    }  else if(args[0]){
      member = await message.guild.members.fetch(args[0])
    }
    //var member = message.mentions.users.first() || await message.guild.members.fetch(args[0])

    //Dumb not working
    if(!member){
      return message.channel.send("Please mention a user or input a user ID")
    };

    let reason_ = args.slice(1).join(" ").toString();
        
    if (member.id == message.member.id){
      return message.channel.send("You cannot mute youself :person_facepalming:")
    }
        
    const moderator_id = message.member.user
    const timestamp = Date.now()
    await infractionQ(member, moderator_id, reason_, message, timestamp, "mute")
        
    var role_id = await functions.muteRole(message);
                
    if(!role_id){
      return message.channel.send("Please add a mute role")
    }
                
                
    if(member.roles.cache.has(role_id)){
      return message.channel.send("That person has already been muted")
    }
                
    const embed = new MessageEmbed()
      .setTitle(`You have been muted in ${message.guild.name}`)
      .setDescription("**Reason**\n" + reason_ )
                
    member.roles.add(role_id)
                
    message.channel.send(`${member.id} has been muted :ok_hand: User has been notified`)
      .then(msg => {
        msg.delete({ timeout: 3000 })
      })    
    discordclient.users.cache.get(member.user.id).send(embed).catch(() => message.reply("Can't send DM to your user!"));;

    if(message.guild.channels.cache.get(await infraction_logging(message.guild.id)) != undefined){
      Log.Infraction(
        discordclient,
        `${moderator_id.username}#${moderator_id.discriminator} muted ${member.user.username}#${member.discriminator} ` + "`" + `${member.id}` + "`" + ` Reason: ${reason_ || "None"}`,
        message.guild.id    
      );
    }       
  } 
};
    