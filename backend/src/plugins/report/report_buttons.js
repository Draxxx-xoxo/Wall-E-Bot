const {Client} = require("pg");
const {MessageEmbed} = require("discord.js");
const Discord = require("discord.js");
const {command_logging} = require("../../handlers/common_functions")
const {reportbuttons} = require("../../handlers/common_buttons")
const {reportlog} = require("../../handlers/common_embeds")
const moderation = require("./report_buttons/moderation");
const { createClient } = require("@supabase/supabase-js")


module.exports = {
  execute: async (button, discordclient) => {

    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)
    const report_id = button.message.embeds[0].title.slice(8)

    const {data, error} = await supabase
      .from("reports")
      .select("reported_user_id::text, reason")
      .eq("guild_id", button.guild.id)
      .eq("id", report_id)

    const res = data[0]

    const member = await button.guild.members.fetch(res.reported_user_id)

    if(!member){
      button.reply.send({ content: "Member is not in the guild", ephemeral: true})
      return
    }

    const reason_ = res.reason

    const report_buttons = await reportbuttons(true)

    if(button.component.customId == "warn"){
      await moderation.warn(button, report_id, member, report_buttons, reason_, discordclient);
    };
    if (button.component.customId == "deny"){
      await moderation.deny(button, report_id, member, report_buttons);
    };
    if (button.component.customId == "kick"){
      await moderation.kick(button, report_id, member, report_buttons, reason_, discordclient)
    };
    if (button.component.customId == "ban"){
      await moderation.ban(button, report_id, member, report_buttons, reason_, discordclient)
    }
    if (button.component.customId == "mute"){
      await moderation.mute(button, report_id, member, report_buttons, reason_, discordclient)
    }
        
  }
};  
