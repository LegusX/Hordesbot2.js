const Discord = require("discord.js")
const dilbert = require("random-dilbert")
const snekfetch = require('snekfetch');

module.exports = class Comics {
	constructor(client) {
		this.commands = ["dilbert", "xkcd"]; //Don't add the help command to this list.
		this.client = client
	}
	help(message) {
		console.log("help")
		var help = new Discord.RichEmbed()
		.setTitle("Comics Help")
		.addField(this.bot.prefix + "xkcd", "Gives you the most recent XKCD comic")
		.addField(this.bot.prefix + "dilbert", "Gives you a random Dilbert comic")
		message.channel.send(help)
	}
	xkcd(message) {
		snekfetch.get("http://xkcd.com/info.0.json").then((r) => {
			var result = JSON.parse(r.text)
			var send = new Discord.RichEmbed()
				.setImage(result.img)
				.setDescription(result.alt)
				.setTitle(result.title)
			message.channel.send(send)
		}).catch(console.error);
	}
	dilbert(message) {
		message.channel.send("Please wait while I get the comic...").then(function(msg){
			dilbert(function(err, data) {
				msg.delete()
				var comic = new Discord.RichEmbed()
				.setTitle("Random Dilbert")
				.setImage(data.url)
				message.channel.send(comic)
			})
		})
	}
}