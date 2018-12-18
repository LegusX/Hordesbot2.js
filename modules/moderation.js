const fs = require("fs")
module.exports = class Moderation {
	constructor(client) {
		this.client = client
		this.commands = ["cooldown", "blacklist", "whitelist", "lock", "clear"]
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
		.addField("`" + bot.prefix + "blacklist <mention>`", "Prevents the choosen person from using bot commands")
		.addField("`" + bot.prefix + "whitelist <mention>`", "Allows the mentioned person to use bot commands again")
		return message;
	}
	blacklist(message) {
		if(!message.member.roles.exists("name", "Community Manager") && !message.member.roles.exists("name", "Developer")) return;
		if(message.mentions.users.keyArray().length < 1) return message.reply("Please @mention the user you would like to blacklist")
		if(bot.blacklist.includes(message.mentions.users.first().id)) return message.reply("That user has already been blacklisted. To un-blacklist them, please use the `whitelist` command")
		bot.blacklist.push(message.mentions.users.first().id)
		fs.writeFileSync("./data/blacklist.json", JSON.stringify(bot.blacklist))
		message.channel.send(`User: ${message.mentions.users.first()} has been succesfully blacklisted.`)
	}
	whitelist(message) {
		if(!message.member.roles.exists("name", "Community Manager") && !message.member.roles.exists("name", "Developer")) return;
		if(message.mentions.users.keyArray().length < 1) return message.reply("Please @mention the user you would like to whitelist")
		if(!bot.blacklist.includes(message.mentions.users.first().id)) return message.reply("That user is not blacklisted. To blacklist them, please use the `blacklist` command")
		bot.blacklist.splice(bot.blacklist.indexOf(message.mentions.users.first().id), 1)
		fs.writeFileSync("./data/blacklist.json", JSON.stringify(bot.blacklist))
		message.channel.send(`User: ${message.mentions.users.first()} has been succesfully whitelisted.`)
	}
	lock(message) {
		if(!message.member.roles.exists("name", "Community Manager") && !message.member.roles.exists("name", "Developer") && !msg.member.roles.has("513058713490292737")) return;
		let time = isNaN(message.content.split(" ")[1])?undefined:Number(message.content.split(" ")[1])
		if(!time) return message.reply("Please specify a number of minutes to lock this channel for!")
		message.channel.overwritePermissions(message.guild.id, {
			SEND_MESSAGES:false
		}, "Channel locked by "+message.author.id)
		message.channel.overwritePermissions(message.member.highestRole, {
			SEND_MESSAGES:true
		})
		message.reply("Channel locked for "+time+" minutes!")
		setTimeout(function(){
			message.channel.overwritePermissions(message.guild.id, {
				SEND_MESSAGES:true
			})
		}, time*60000)
	}
	clear(message) {
		if(!message.member.roles.exists("name", "Community Manager") && !message.member.roles.exists("name", "Developer")  && !msg.member.roles.has("513058713490292737")) return;
		let num = isNaN(message.content.split(" ")[1])?undefined:Number(message.content.split(" ")[1])
		if(!num) return message.reply("Please specify a number of messages to delete!")
		message.channel.bulkDelete(num)
		.then(function(messages){
			message.channel.send("Deleted "+messages.size+" messages!")
			.then((msg)=>{setTimeout(function(msg){msg.delete()}, 4000, msg)});
		})
		.catch((e)=>{this.client.guilds.get("243099652315021312").channels.get("428315330134409216").send(e)})
		message.delete()
	}
}