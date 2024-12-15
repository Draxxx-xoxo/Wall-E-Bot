const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "automod",
  enable: false,
  category: "automod",
  permissions: 40,
  execute: async (message, discordclient) => {

    const word = message.options.getString("word");

    const rule = await message.guild.autoModerationRules.create({
      name: "flag word rule",
      eventType: 1,
      triggerType: 1,
      enabled: true,
      triggerMetadata: 
      {
        keywordFilter: [`${word}`]
      },
      actions: [
        {
          type: 1,
          metadata: {
            channel: message.channel,
            durationSeconds: 10,
            customMessage: "You said a bad word"
          }
        }
      ]
    })

    await message.reply({content: `Created a rule for ${word}`, ephemeral: true})
        
  },
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("create an automod??")
    .addStringOption(option => option.setName("word").setDescription("word").setRequired(true))
}; 