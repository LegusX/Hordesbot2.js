module.exports = class Moderation {
	constructor(client) {
		this.client = client
		this.commands = ["cooldown"]
	}
	cooldown(msg) {
		if (msg.member.roles.exists("name", "Community Manager") || msg.member.roles.exists("name", "Developer")) {
			if (Number(msg.content.toLowerCase().substr(10)) === "NaN" || Number(msg.content.toLowerCase().substr(10)) === NaN) return msg.reply("Please specify a number of seconds.")
			cooldownTime = Number(msg.content.toLowerCase().substr(10))
			msg.reply("Command cooldown time set to `" + cooldownTime + "` seconds")
		}
	}
	help(message) {
		message.addField("`" + bot.prefix + "cooldown <seconds>`", "Changes the command cooldown length")
		return message;
	}
	blacklist(message) {
		if(message.mentions.length < 1) return message.reply("Please @mention the user you would like to blacklist")
		if(bot.blacklist.includes(message.mentions.first().id)) return message.reply("That user has already been blacklisted. To un-blacklist them, please use the `whitelist` command")
		bot.blacklist.push(message.mentions.first().id)
		message.channel.send(`User: ${message.mentions.first()} has been succesfully blacklisted.`)
	}
}