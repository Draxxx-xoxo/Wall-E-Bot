const {reportlog} = require("../../../handlers/common_embeds");
const functions = require("../../../handlers/common_functions");
const Log = require("../../../handlers/logging");
const {MessageEmbed} = require("discord.js");


module.exports = {
  deny: async (button, report_id, member, buttons) => {
    const res = await functions.reportupdate(report_id, button, "denied");

    const report_log = await reportlog(res, "🔴")

    button.reply(`${member.user.id} has not been punished :ok_hand:`);

    button.message.edit({
      embeds: [report_log],
      components: [buttons]
    })
  },

  warn: async (button, report_id, member, buttons, reason_, discordclient) => {
    const moderator_id = button.message.author
    const timestamp = Date.now();
    const query = await functions.infractionQ(member, moderator_id, reason_, button, timestamp, "warn")

    const updateres = await functions.reportupdate(report_id, button, "approved");

    const report_log = await (await reportlog(updateres, "🟢")).addField("Infraction", "Warn", false)

    const embed = new MessageEmbed()
      .setTitle(`You have been warned in ${button.guild.name}`)
      .setDescription("Reason\n" + "```" + reason_ + "```");

    button.message.edit({
      embeds: [report_log],
      components: [buttons]
    })

    button.reply(`${member.id} has been warned :ok_hand: User has been notified`);


    discordclient.users.cache.get(member.id).send(embed).catch(() => button.message.reply("Can't send DM to your user!"));

    if(await functions.command_logging(button.guild.id) ==  true){
      Log.Send(
        discordclient,
        `${moderator_id.username}#${moderator_id.discriminator} warned ${member.user.username}#${member.user.discriminator} ` + "`" + `${member.user.id}` + "`" + ` Reason: ${reason_ || "None"}`,
        message.guild.id
      );
    }
  },

  kick: async (button, report_id, member, buttons, reason_, discordclient) => {
    const moderator_id = button.message.author
    const timestamp = Date.now();
    const query = await functions.infractionQ(member, moderator_id, reason_, button, timestamp, "kick")

    const updateres = await functions.reportupdate(report_id, button, "approved");

    const report_log = await (await reportlog(updateres, "🟢")).addField("Infraction", "Kick", true)

    member.kick()

    const embed = new MessageEmbed()
      .setTitle(`You have been kicked in ${button.guild.name}`)
      .setDescription("Reason\n" + "```" + reason_ + "```");

    button.message.edit({
      embeds: [report_log],
      components: [buttons]
    })

    button.reply(`${member.id} has been kicked :ok_hand: User has been notified`);


    discordclient.users.cache.get(member.id).send(embed).catch(() => button.message.reply("Can't send DM to your user!"));

    if(await functions.command_logging(button.guild.id) ==  true){
      Log.Send(
        discordclient,
        `${moderator_id.username}#${moderator_id.discriminator} kicked ${member.user.username}#${member.user.discriminator} ` + "`" + `${member.user.id}` + "`" + ` Reason: ${reason_ || "None"}`,
        message.guild.id
      );
    } 
  },

  ban: async (button, report_id, member, buttons, reason_, discordclient) => {
    const moderator_id = button.message.author
    const timestamp = Date.now();
    const query = await functions.infractionQ(member, moderator_id, reason_, button, timestamp, "ban")

    const updateres = await functions.reportupdate(report_id, button, "approved");

    const report_log = await (await reportlog(updateres, "🟢")).addField("Infraction", "Ban", true)

    member.ban({reason: reason_})

    const embed = new MessageEmbed()
      .setTitle(`You have been banned in ${button.guild.name}`)
      .setDescription("Reason\n" + "```" + reason_ + "```");

    button.message.edit({
      embeds: [report_log],
      components: [buttons]
    })

    button.reply(`${member.id} has been banned :ok_hand: User has been notified`);


    discordclient.users.cache.get(member.id).send(embed).catch(() => button.message.reply("Can't send DM to your user!"));

    if(await functions.command_logging(button.guild.id) ==  true){
      Log.Send(
        discordclient,
        `${moderator_id.username}#${moderator_id.discriminator} kicked ${member.user.username}#${member.user.discriminator} ` + "`" + `${member.user.id}` + "`" + ` Reason: ${reason_ || "None"}`,
        message.guild.id
      );
    }
  },

  mute: async (button, report_id, member, buttons, reason_, discordclient) => {
    const moderator_id = button.message.author
    const timestamp = Date.now();
    const query = await functions.infractionQ(member, moderator_id, reason_, button, timestamp, "muted")

    var role_id = await functions.muteRole(button);

    if(!role_id){
      return button.reply({content: "Please add a mute role", ephemeral: true})
    }

    const updateres = await functions.reportupdate(report_id, button, "approved");

    const report_log = await (await reportlog(updateres, "🟢")).addField("Infraction", "Mute", true)

    member.roles.add(role_id)

    const embed = new MessageEmbed()
      .setTitle(`You have been Muted in ${button.guild.name}`)
      .setDescription("Reason\n" + "```" + reason_ + "```");

    button.message.edit({
      embeds: [report_log],
      components: [buttons]
    })

    button.reply(`${member.id} has been Muted :ok_hand: User has been notified`);


    discordclient.users.cache.get(member.id).send(embed).catch(() => button.message.reply("Can't send DM to your user!"));

    if(await functions.command_logging(button.guild.id) ==  true){
      Log.Send(
        discordclient,
        `${moderator_id.username}#${moderator_id.discriminator} kicked ${member.user.username}#${member.user.discriminator} ` + "`" + `${member.user.id}` + "`" + ` Reason: ${reason_ || "None"}`,
        message.guild.id
      );
    }
  }
}

