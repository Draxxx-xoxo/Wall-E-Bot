module.exports = async (discordClient, message) => {
  const ticket_message = require("../../plugins/tickets/message_collecter/message_logging") 

  try{
    ticket_message.execute(message, discordClient)
  } catch (error) {
    console.log(error);
  }
};