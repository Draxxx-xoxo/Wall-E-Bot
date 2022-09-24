const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "serverinfo",
  category: "botinfo",
  description: "Returns bot and API latency in milliseconds.",
  execute: async (message, args, client) => {

    const guildid = args[0]

    const guild = await client.guilds.fetch(guildid) || message.guild

    const serverinfo_embed = new MessageEmbed()
      .setAuthor({ name: guild.name.toString(), iconURL: guild.iconURL() })
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: "Owner", value: "<@!" + guild.ownerId + ">", inline: true },
        { name: "Owner ID", value: guild.ownerId, inline: true },
        { name: "Server ID", value: guild.id, inline: true },
        //{ name: 'Region', value: guild.region, inline: true },
        { name: "Text Channels", value: guild.channels.cache.size.toString(), inline: true },
        //{ name: `Voice Channels`, value: message.guild.channels.filter(c => c.type === 'voice').cache.size,inline: true },
        { name: "Members", value: guild.memberCount.toString(), inline: true },
        { name: "Roles", value: `${guild.roles.cache.size - 1}`, inline: true },
        { name: "Server Creation", value: new Date(guild.createdTimestamp).toLocaleString() },
      )

    message.channel.send({ embeds: [serverinfo_embed] })
  },
};
