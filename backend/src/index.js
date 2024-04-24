require("dotenv").config(); 
const fs = require("fs");
const {Intents} = require("discord.js");
const Discord = require("discord.js");
const functions = require("./handlers/common_functions")
const { resolve } = require("path");
const yaml = require("js-yaml");
const Log = require("./handlers/logging");
const discordClient = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_MESSAGES]});
discordClient.commands = new Discord.Collection();
require("./slash_commands")

const commandFolders = fs.readdirSync("./src/plugins")

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./src/plugins/${folder}`).filter(file => file.endsWith(".js"))
  for (const file of commandFiles) {
    const command = require(`./plugins/${folder}/${file}`)
    discordClient.commands.set(command.name, command)
  }
}

const eventFolders = fs.readdirSync("./src/events")

for (const folder of eventFolders) {
  fs.readdir(resolve(`./src/events/${folder}`), (err, files) => {
    if (err) return console.error;
    files.forEach((file) => {
      if (!file.endsWith(".js")) return;
      if(file == "logging_events.js") return;
      const evt = require(`./events/${folder}/${file}`);
      let evtName = file.split(".")[0];
      console.log(`Loaded event '${evtName}'`);
      discordClient.on(evtName, evt.bind(null, discordClient));
    });
    
  });
}

//AUTOMOD
/*discordClient.on('messageCreate', async message => {
	const censor = require('./auto_mod/censor')

	if(message.author.bot) return;

	try{
		censor.execute(message, discordClient)
	} catch (error) {
		console.log(error);
	}
	
});*/



discordClient.login(process.env.sailboat_token);
