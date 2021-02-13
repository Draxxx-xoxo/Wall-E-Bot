const fs = require('fs');
const Discord = require('discord.js');
const { mainprefix, token, pgkey } = require('../../../../config.json');
const {Client} = require('pg')

const discordclient = new Discord.Client();
discordclient.commands = new Discord.Collection();

discordclient.once('ready', () => {
	console.log('ban Ready!');

	discordclient.user.setActivity(`Watching EVEE`)
});


discordclient.on('message', async message => {

    if (message.content.startsWith(`${mainprefix}ban`)) {
         
        if(message.member.hasPermission("BAN_MEMBERS")){
            
            
            const client = new Client({
                connectionString: pgkey,
                ssl: {
                    rejectUnauthorized: false
                }
            });
                        
                        // opening connection
                client.connect();
                    
                   
            let cont = message.content.slice((mainprefix + `ban `).length).split(" ")
            var member_id = message.mentions.users.first()
            var member_id = message.mentions.users.first()|| cont.slice(0,1).toString()
            let reason_ = cont.slice(1).join(" ").toString()
            let user = message.guild.members.cache.get(member_id.id || member_id);

            const embed = new Discord.MessageEmbed()
            .setTitle(`You have been banned in ${message.guild.name}`)
            .setDescription(`Reason\n` + '```' + reason_ + '```')

            if(!message.member.hasPermission("BAN_MEMBERS")){
                return message.channel.send('You do not have permissions to ban')
            }
            else if (message.mentions.users.first() == message.member.user){
                return message.channel.send('You cannot warn youself :person_facepalming:')
            }
            else if (member_id == message.member.user.id){
                return message.channel.send('You cannot warn yourself :person_facepalming:')
            }
       
        if(user){


            const ban_member = user.user
            const moderator_id = message.member.user
            const timestamp = Date.now()
            const query = `
                    
            INSERT INTO guild."`+ message.guild.id +`"(
                discord_id, discord_tag, infractions, moderator_id, moderator_tag, reason, timestamp)
                VALUES (${ban_member.id}, '${ban_member.username}#${ban_member.discriminator}', 'ban', ${message.author.id}, '${moderator_id.username}#${moderator_id.discriminator}', '${reason_}', ${timestamp});
            
            `


            user.ban({reason: reason_})
            
            client.query(query);

            
            message.channel.send(`${member_id} has been banned :ok_hand: User has been notified`)
            .then(msg => {
                msg.delete({ timeout: 3000 })
              })
            
              discordclient.users.cache.get(user.user.id).send(embed);
        }
        else {
            message.channel.send(`Invaild User || Unable to ban member`)
        };
        client.end();         
    }
                
    }
});




discordclient.login(process.env.token);