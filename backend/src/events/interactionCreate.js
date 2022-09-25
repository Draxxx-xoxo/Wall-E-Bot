const functions = require('../handlers/common_functions')

module.exports = async (discordClient, interaction) => {
    if (interaction.isButton()){
		if(interaction.component.customId == 'yes' || 'no'){
			const destroy_infs = require('../plugins/infractions/destroy_inf')

			try{
				destroy_infs.button(interaction, discordClient)
			} catch (error) {
				console.log(error);
			}
		}

		if(interaction.component.customId.toLowerCase() == 'warn' || 'mute' || 'ban' || 'kick' || 'deny'){
			const report_buttons = require('../plugins/report/report_buttons') 

			try{
				report_buttons.execute(interaction, discordClient)
			} catch (error) {
				console.log(error);
			}
		}
	}

	if(interaction.isSelectMenu()){
		const message_menu = require('../plugins/infractions/message_menu') 

		try{
			message_menu.execute(interaction, discordClient)
		} catch (error) {
			console.log(error);
		}
	}
	if(interaction.isCommand()){

		const { commandName } = interaction;
		if (commandName === 'ping') {
			const ping = require('../plugins/admin/ping')
			try{
				ping.execute(interaction, discordClient)
			} catch (error) {
				console.log(error);
			}
		}
		if ( commandName === 'what_happened_to_eve'){
			const what_happened_to_eve = require('../plugins/utilities/announcement')
			try{
				what_happened_to_eve.execute(interaction, discordClient)
			} catch (error) {
				console.log(error);
			}
		}
}
};