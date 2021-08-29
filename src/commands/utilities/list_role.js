const {MessageEmbed} = require('discord.js');

module.exports = {
	name: "list_role",
	category: "botinfo",
	description: "Returns bot and API latency in milliseconds.",
	execute: async (message, args, client) => {

        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])

        if(!role) return message.channel.send('Please mention or input a valid role.');

        const list_role = message.guild.roles.cache.get(`${role.id}`).members.map(m=>m.user.tag + ' `' + m.user.id + '`').join('\n')

		const embed = new MessageEmbed()
		.setTitle('Members who have ' + role.name)
		.setDescription(list_role)
		.setFooter(message.guild.roles.cache.get(`${role.id}`).members.map(m=>m).length + ' Members with the role')
		
        
        message.channel.send(embed)
	},
};
