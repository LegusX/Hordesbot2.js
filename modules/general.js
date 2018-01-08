const Discord = require("discord.js")
module.exports = class General {
	constructor(client) {
		this.client = client
		this.commands = ["ping", "info", "suggestcommand"]
	}
	ping(msg) {
		return message.edit(message.createdTimestamp - msg.createdTimestamp + " ms");
	}
	info(message) {
		var embed = new Discord.RichEmbed()
			.setTitle("HordesBot Info")
			.addField("Developers", "HordesBot is developed by LegusX and BlazingFire007")
			.addField("When was this made?", "A long time ago in a galaxy far, far away")
			.addField("Why was this made?", "That is confidential information.")
			.setThumbnail(this.client.user.avatarURL)
		message.channel.send(embed)
	}
	help(message) {
		message.addField("`" + bot.prefix + "ping`", "Gets a rough estimate of the ping for HordesBot")
			.addField("`" + bot.prefix + "info`", "Just some info about HordesBot")
			.addField("`" + bot.prefix + "suggestcommand`", "Allows you to suggest a command for HordesBot!")
		return message
	}
	suggestcommand(message){
		this.client.channels.get("398936399954313229").sendMessage(`**${message.member.displayName} (${message.author.username}/${message.author.id})** suggested the following command:\n${message.content.replace(bot.prefix+"suggestcommand ", "")}`)
	}
}
