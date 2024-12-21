const {MessageEmbed} = require("discord.js");
const Log = require("../../handlers/logging");
const {command_logging, report_pugin, report_logging, report_logging_channel} = require("../../handlers/common_functions");
const {reportbuttons} = require("../../handlers/common_buttons")
const deny = require("./report_buttons/moderation")
const {reportlog, notelog} = require("../../handlers/common_embeds");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { createClient } = require("@supabase/supabase-js")


module.exports = {
  name: "note",
  permissions: 50,
  enable: true,
  execute: async (message, discordclient) => {

    const id = message.options.getNumber("id")
    const note = message.options.getString("note")

    const supabase = createClient(process.env.supabasUrl, process.env.supabaseKey)

    const searchquery = `
      SELECT * FROM public.reports WHERE id = ${id} AND guild_id = ${message.guild.id};
    `
    const{data, error} = await supabase
      .from("reports")
      .select("message_id::text, reported_user_tag::text")
      .eq("id", id)
      .eq("guild_id", message.guild.id)

    const searchres = data[0]

    if(data.length == 0) return message.reply({content: "No report found with that ID", ephemeral: true})

    const {data1, error1} = await supabase
      .from("notes")
      .insert({guild_id: message.guild.id, user_id: message.user.id, username: message.user.tag, report_id: id, note: note, report_message_id: searchres.message_id})
      .select()
        
    if(data1.length == 1){
      message.reply({content: "Your note was created successfully", ephemeral: true})
    }



    // LOG THE NOTE
    const {data2, error2} = await supabase
      .from("configurator_v1s")
      .select()
      .eq("guild_id", message.guild.id)
    const channelres = data2[0]
    const note_channel = message.guild.channels.cache.get(channelres.command_logging_channel)
    const note_message = await note_channel.messages.fetch(`${searchres.message_id}`)
    const reportembed = await reportlog(searchres,"🟡")
    const report_buttons = await reportbuttons(false)
    const search_notes = `SELECT * FROM public.notes WHERE report_id = ${id} AND guild_id = ${message.guild.id}`
    const notes = (await client.query(search_notes).catch(console.error))
    var notes_embed_fields = []

    for(var i = 0; i < notes.rowCount; i++){
      notes_embed_fields.push({name: "Note from " + notes.rows[i].username, value: notes.rows[i].note})
    }

    const note_embed = (await notelog(searchres.id)).addFields(notes_embed_fields)


    note_message.edit({
      components: [report_buttons],
      embeds: [reportembed, note_embed]
    })

    await client.end();  

    
  },
  data: new SlashCommandBuilder()
    .setName("note")
    .setDescription("Add a note to the report")
    .addNumberOption(option => option.setName("id").setDescription("Report ID to add the note").setRequired(true))
    .addStringOption(option => option.setName("note").setDescription("Note that you want to add to the report").setRequired(true))
};