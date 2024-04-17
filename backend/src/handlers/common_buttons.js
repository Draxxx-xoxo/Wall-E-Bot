const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {

  async reportbuttons(disabled) {

    const buttons = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("warn")
          .setLabel("Warn")
          .setDisabled(disabled)
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("mute")
          .setLabel("Mute")
          .setDisabled(disabled)
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("kick")
          .setLabel("Kick")
          .setDisabled(disabled)
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("ban")
          .setLabel("Ban")
          .setDisabled(disabled)
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("deny")
          .setLabel("Deny")
          .setDisabled(disabled)
          .setStyle("PRIMARY"),
      );

    return (buttons)
  },

  async destroyinf(disabled) {
    const buttons = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("yes")
          .setLabel("Yes")
          .setDisabled(disabled)
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("no")
          .setLabel("No")
          .setDisabled(disabled)
          .setStyle("PRIMARY"),
      );

    return(buttons)
  },

  async configurationbuttons(disabled1, disabled2, disabled3) {
    const buttons = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("logging")
          .setLabel("Logging")
          .setDisabled(disabled1)
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("reporting")
          .setLabel("Reporting")
          .setDisabled(disabled2)
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("mutes")
          .setLabel("Mutes")
          .setDisabled(disabled3)
          .setStyle("PRIMARY"),
      );

    return(buttons)
  },
  async setupbutton(disabled1, disabled2, disabled3, config) {
    const buttons = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("setup"+config)
          .setLabel("Edit")
          .setDisabled(disabled1)
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("Back")
          .setLabel("Back")
          .setDisabled(disabled2)
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("update"+config)
          .setLabel("Update")
          .setDisabled(disabled3)
          .setStyle("PRIMARY"),
      );

    return(buttons)
  },
  async setupbutton1(disabled) {
    const buttons = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("enable")
          .setLabel("Enable")
          .setDisabled(disabled)
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("disable")
          .setLabel("Disable")
          .setDisabled(disabled)
          .setStyle("PRIMARY"),
      );
    return(buttons)
  }, 

  async ticketingbuttons(disabled) {
    const buttons = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("createticket")
          .setLabel("Ticket")
          .setDisabled(disabled)
          .setStyle("PRIMARY"),
      );
    return(buttons)
  }, 
}
