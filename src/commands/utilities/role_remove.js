module.exports = {
	name: "role_remove",
	category: "botinfo",
	description: "Returns bot and API latency in milliseconds.",
	execute: async (message, args, client) => {
        const role = message.guild.roles.cache.get(args[0]);
        const user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]));

        if(!role) return message.channel.send('Please input a vaild role.')
        if(!user) return message.channel.send('Please mention a user.')

		for (let i = 0; i < user.roles.cache.map(r => r.id).length; i++) { 
        
        if(user.roles.cache.map(r => r.id)[i] != role){
            console.log('User does not have the role')
        }
        else {
            user.roles.remove(role.id);
            message.channel.send(`Removed ${role.name} to <@${user.id}>`)
        }
    }

	},
};
