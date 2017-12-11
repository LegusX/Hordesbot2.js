const Discord = require("discord.js")
module.exports = class General {
	constructor(client) {
		this.client = client
		this.commands = ["ping", "info"]
	}
	ping(msg) {
        msg.channel.send(new Date().getTime() - msg.createdTimestamp + " ms");
	}
	info(message) {
		var embed = new Discord.RichEmbed()
		.setTitle("HordesBot Info")
		.addField("Developers", "HordesBot is developed by LegusX and BlazingFire007")
		.addField("When was this made?", "I've completely lost track, honestly.")
		.addField("Why was this made?", "That is confidential information.")
		.setThumbnail(this.client.user.avatarURL)
		message.channel.send(embed)
	}
	help(message) {
		message.addField("`"+bot.prefix+"ping`", "Gets a rough estimate of the ping for HordesBot")
		.addField("`"+bot.prefix+"info`", "Just some info about HordesBot")
		return message
	}
}