//Template for new modules
const Discord = require("discord.js")

module.exports = class Template {
	constructor(client) {
		this.commands = [""]; //Don't add the help command to this list.
		this.client = client
	}
	help(message) {
		var help = new Discord.RichEmbed()
		.setTitle("Template Help")
		.setDescription("This is the help menu for the template")
		.addField("THERE ARE NO COMMANDS", "Well, except for this one.")
		message.channel.send(help)
	}
}