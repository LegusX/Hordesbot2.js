const admins = ["227376221351182337", "190313064367652864", "117993898537779207", "126288853576318976"]
module.exports = class Developer {
	constructor(client/*,bot*/) {
		this.client = client
		// this.bot = bot
		this.commands = ["stop", "reload"]
	}
	stop(message) {
		if (admins.includes(message.author.id)) {
			message.reply("👋")
			process.exit()
		}
	}
	reload(message) {
		if (admins.includes(message.author.id)) {
			try {
				console.log("Attempting to reload module: "+message.content.toLowerCase().replace(bot.prefix+"reload ", ""))
				delete require.cache[require.resolve(`./${message.content.toLowerCase().replace(bot.prefix+"reload ", "")}.js`)];
				delete bot.modules[`./${message.content.toLowerCase().replace(bot.prefix+"reload ", "")}.js`]
				var module = require(`./${message.content.toLowerCase().replace(bot.prefix+"reload ", "")}.js`)
				bot.modules[message.content.toLowerCase().replace(bot.prefix+"reload ", "")+".js"] = new module(this.client, bot)
				console.log("Module: "+message.content.toLowerCase().replace(bot.prefix+"reload ", "")+" has been successfully reloaded.")
				message.reply("Module: `"+message.content.toLowerCase().replace(bot.prefix+"reload ", "")+"` has been successfully reloaded.")
			}
			catch(e){
				console.log("Error: "+e)
				message.reply("Module: `"+message.content.toLowerCase().replace(bot.prefix+"reload ", "")+"` could not be found.")
			}
		}
	}
	help(message) {
		message.setDescription("These commands can only be used by LegusX, BlazingFire007, Korvnisse, and Dek")
		.addField("`"+bot.prefix+"stop`", "Shuts off the bot entirely, only use if you must.")
		.addField("`"+bot.prefix+"reload <module>`", "Name of the module to reload")
		return message
	}
}