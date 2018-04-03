const Discord = require("discord.js")
const dilbert = require("random-dilbert")
const snekfetch = require('snekfetch');
const garf = require("garfield");

//Totally stolen from the MDN docs :D
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = class Comics {
	constructor(client) {
		this.commands = ["dilbert", "xkcd", "garfield"]; //Don't add the help command to this list.
		this.client = client
		snekfetch.get("http://xkcd.com/info.0.json").then((r) => {
			var result = JSON.parse(r.text)
			this.latestXKCD = result.num
		}).catch(console.error);
	}
	help(message) {
		console.log("help")
		message.setTitle("Comics Help")
		.addField(bot.prefix + "xkcd <option>", "options:\n-random: gives a random comic\n-[a number]: gives that comic\n-new: gives the newest comic")
		.addField(bot.prefix + "dilbert", "Gives you a random Dilbert comic")
		.addField(bot.prefix+"garfield", "Gives you a random Garfield comic")
		return message
	}
	xkcd(message) {
		if (message.content.split(" ").length === 1 || message.content.toLowerCase().split(" ")[1] === "new") {
			snekfetch.get("http://xkcd.com/info.0.json").then((r) => {
				var result = JSON.parse(r.text)
				var send = new Discord.RichEmbed()
					.setImage(result.img)
					.setDescription(result.alt)
					.setTitle(result.title)
				return message.channel.send(send)
			}).catch(console.error);
		}
		var type = message.content.toLowerCase().split(" ")[1]
		if (type === "random") {
			snekfetch.get("http://xkcd.com/info.0.json").then((r) => {
				var result = JSON.parse(r.text)
				var number = getRandomInt(0, result.num)
				snekfetch.get(`http://xkcd.com/${number}/info.0.json`).then((r) => {
					var result = JSON.parse(r.text)
					var send = new Discord.RichEmbed()
						.setImage(result.img)
						.setDescription(result.alt)
						.setTitle(result.title)
					return message.channel.send(send)
				})
			})
		}
		else if (!isNaN(type) && Number(type) < this.latestXKCD && Number(type) > 0) {
			snekfetch.get(`http://xkcd.com/${type}/info.0.json`).then((r) => {
				var result = JSON.parse(r.text)
				var send = new Discord.RichEmbed()
					.setImage(result.img)
					.setDescription(result.alt)
					.setTitle(result.title)
				return message.channel.send(send)
			}).catch(console.error);
		}
		else if(!isNaN(type) && Number(type) > this.latestXKCD) return message.reply("That comic doesn't exist yet!")
		else message.reply("Please use either `random` `new` or specify a number that is greater than 0.")
	}
	dilbert(message) {
		message.channel.send("Please wait while I get the comic...").then(function(msg){
			dilbert(function(err, data) {
				var comic = new Discord.RichEmbed()
				.setTitle("Random Dilbert Comic")
				.setImage(data.url)
				msg.edit(comic)
			})
		})
	}
	garfield(message) {
		var embed = new Discord.RichEmbed()
		.setTitle("Random Garfield Comic")
		.setImage(garf.random())
		message.channel.send(embed)
	}
}