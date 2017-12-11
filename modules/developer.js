const admins = ["227376221351182337", "190313064367652864", "117993898537779207", "126288853576318976"]
module.exports = class admin {
	constructor(client,bot) {
		this.client = client
		this.bot = bot
		this.commands = ["stop"]
	}
	stop(message) {
		if (admins.includes(message.author.id)) {
			message.reply("👋")
			process.exit()
		}
	}
	help(message) {
		message.setDescription("These commands can only be used by LegusX, BlazingFire007, Korvnisse, and Dek")
		.addField("`"+this.bot.prefix+"stop`", "Shuts off the bot entirely, only use if you must.")
		return message
	}
}