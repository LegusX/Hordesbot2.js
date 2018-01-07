//Template for new modules
const Discord = require("discord.js")

//Totally stolen from the MDN docs :D
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = class Template {
	constructor(client) {
		this.commands = [""]; //Don't add the help command to this list.
		this.client = client
	}
	help(message) {
		message.setTitle("Template Help")
		.setDescription("This is the help menu for the template")
		.addField("THERE ARE NO COMMANDS", "Well, except for this one.")
		return message;
	}
}