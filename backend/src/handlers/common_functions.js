const yaml = require("js-yaml");
const fs = require("fs");
const functions = require("./pg");
const moment = require("moment");
const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)

async function Newpg_table(guildid){
  const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)

  const {data, error} = await supabase
    .from("configurator_v1s")
    .select("guild_id::text, infraction_logging_channel::text, command_logging_channel::text, report_logging_channel::text, guild_events_logging_channel::text, report_user, report_user_logging_channel::text, mute_role::text")
    .eq("guild_id", guildid.toString())

  return data[0] 
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
    const { error } = await supabase
      .from("infractions")
      .insert({"discord_id": member.id, "discord_tag": `${member.username}#${member.discriminator}`, "infractions": infraction, "moderator_id": moderator_id.id, "moderator_tag": `${moderator_id.username}#${moderator_id.discriminator}`, "reason": reason_, "guild_id": message.guild.id, "created_at": moment().format()})
  },
  async reportupdate(report_id, button, status){
    const {data, error} = await supabase
      .from("reports")
      .update({status: status})
      .eq("id", report_id)
      .eq("guild_id", button.guild.id)

    return data[0]
    
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