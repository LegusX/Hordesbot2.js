const Discord = require("discord.js")
const fs = require("fs")

function readJSON(location) {
	return JSON.parse(fs.readFileSync(location))
}

module.exports = class General {
	constructor(client) {
		this.client = client
		this.commands = ["info", "suggestcommand", "kingofping", "uptime"]
		this.start = Date.now();
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
			.addField("`" + bot.prefix + "kingofping`", "Gives the highest ping of HordesBot, and the person who obtained it!")
		return message
	}
	suggestcommand(message){
		this.client.channels.get("398936399954313229").sendMessage(`**${message.member.displayName} (${message.author.username}/${message.author.id})** suggested the following command:\n${message.content.replace(bot.prefix+"suggestcommand ", "")}`)
	}
	kingofping(message) {
		var data = readJSON("./data/kingofping.json")
		message.reply(`The current King of Ping is **${data.username}** with a ping of **${data.ping}**`)
	}
	uptime(message) {
		message.reply("HordesBot has been online for "+msToTime(Date.now()-this.start))
	}
}

//from https://stackoverflow.com/a/9763769/7552088
function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return "`"+hrs + ':' + mins + ':' + secs + '.' + ms+"`";
}
