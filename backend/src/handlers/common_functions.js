const yaml = require("js-yaml");
const fs = require("fs");
const functions = require("./pg");
const moment = require("moment");
async function Newpg_table(guildid){
  const pg = await functions.pg(`SELECT * FROM public.configurator_v1s WHERE guild_id = ${guildid}`)
  const doc = pg.rows[0]
  return doc 
}
module.exports = {
  async muteRole(message) {
    const doc = await Newpg_table(message.guild.id);
    return doc.mute_role
  },
  async censorWords(message) {
    const doc = await pg_table(message.guild.id);
    return doc.plugins.censor.censor_words
  },
  async censorIgnoreUser(message) {
    const doc = await pg_table(message.guild.id);
    return doc.plugins.censor.ignore_users
  },
  async censorIgnoreChannel(message) {
    const doc = await pg_table(message.guild.id);
    return doc.plugins.censor.ignore_channels
  },
  async welcomechannel(guildid) {
    const doc = await pg_table(guildid);
    return doc.plugins.welcome_channel.channel
  },
  async join_message(guildid) {
    const doc = await pg_table(guildid);
    return doc.plugins.welcome_channel.join_message
  },
  async leave_message(guildid) {
    const doc = await pg_table(guildid);
    return doc.plugins.welcome_channel.leave_message
  },
  async command_logging(guildid) {
    const doc = await Newpg_table(guildid);
    return doc.command_logging_channel
  },
  async guild_logging(guildid) {
    const doc = await Newpg_table(guildid);
    return doc.guild_events_logging_channel
  },
  async infraction_logging(guildid) {
    const doc = await Newpg_table(guildid);
    return doc.infraction_logging_channel
  },
  async report_pugin(guildid) {
    const doc = await Newpg_table(guildid);
    return doc.report_user
  },
  async report_logging(guildid) {
    const doc = await Newpg_table(guildid);
    return doc.report_user
  },
  async report_logging_channel(guildid) {
    const doc = await Newpg_table(guildid);
    return doc.report_user_logging_channel
  },
  async infractionQ(member, moderator_id, reason_, message, timestamp, infraction) {
    const query = `
        INSERT INTO public.infractions(
            discord_id, discord_tag, infractions, moderator_id, moderator_tag, reason, guild_id, created_at)
            VALUES (${member.id}, '${member.username}#${member.discriminator}', '${infraction}', ${moderator_id.id}, '${moderator_id.username}#${moderator_id.discriminator}', '${reason_}', ${message.guild.id}, '${moment().format()}'); 
        `

    return query
  },
  async reportupdate(report_id, button, status){
    const query = `
        UPDATE public.reports
        SET status = '${status}'
        WHERE "id" = ${report_id} AND "guild_id" = ${button.guild.id}
        RETURNING *
        `
    return query
  },
  async addguild(guildName, guildId, guildIcon, guildOwner){
    const query = `
        INSERT INTO public.allowed_guilds(
            guild_name, guild_id, icon)
            VALUES ('${guildName}', '${guildId}', '${guildIcon}'); 

        INSERT INTO public.allowed_users(
            guild_id, user_id, permission_id)
            VALUES ('${guildId}', '${guildOwner}', 0);    
        `
    return query
  },
  async rolelevel(guildid) {
    const doc = await pg_table(guildid);
    return doc.plugins.level
  },
  async censor_check(guildid){
    const doc = await pg_table(guildid);
    const checker = doc.plugins.censor
    if(checker == undefined){
      return false
    }
    else {
      return true
    }
  },

  async super_admins(){
    const pg = await functions.pg("SELECT * FROM public.global_admins");
    const doc = pg.rows.map(user => user.user_id)
    return doc
  }
}