module.exports = class Moderation {
	constructor(client) {
		this.client = client
		this.commands = ["cooldown"]
	}
	cooldown(msg) {
		if (msg.member.roles.exists("name", "Community Manager") || msg.member.roles.exists("name", "Developer")) {
			if(Number(msg.content.toLowerCase().substr(10)) === "NaN" || Number(msg.content.toLowerCase().substr(10)) === NaN) return msg.reply("Please specify a number of seconds.")
			cooldownTime = Number(msg.content.toLowerCase().substr(10))
			msg.reply("Command cooldown time set to `"+cooldownTime+"` seconds")
		}
	}
	help(message) {
		message.addField("`"+bot.prefix+"cooldown <seconds>`", "Changes the command cooldown length")
		return message;
	}
}