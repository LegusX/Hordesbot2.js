module.exports = class General {
	constructor(client) {
		this.client = client
		this.commands = ["ping"]
	}
	ping(msg) {
        msg.channel.send(new Date().getTime() - msg.createdTimestamp + " ms");
	}
	info(message) {
		
	}
	help(message) {
		message.addField("`"+bot.prefix+"ping`", "Gets a rough estimate of the ping for HordesBot")
	}
}