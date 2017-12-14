const Discord = require("discord.js");
const fs = require("fs")
const client = new Discord.Client();
const commandLineArgs = require('command-line-args')

const optionDefinitions = [{
	name: 'token',
	alias: 't',
	type: String
}]
const options = commandLineArgs(optionDefinitions)
// console.log(options)
if (typeof options.token === "undefined") return console.log("Please pass a token through the -token or -t argument")

global.bot = {
	modules: {},
	prefix: "$",
	blacklist: []
}
global.moduleList = []
global.helpList = []
var cooldown = []
global.cooldownTime = 15
global.mods = ["227376221351182337", "190313064367652864", "117993898537779207", "126288853576318976", "184784933330354177", "126288853576318976", "298984060049686528"]

var numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
var numbertext = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

fs.readdir("./modules/", (err, files) => {
	if (err) console.error(err);

	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if (jsfiles.length <= 0) {
		console.log("No modules to load!");
	}

	console.log(`Loading ${jsfiles.length} modules!`);

	jsfiles.forEach((f, i) => {
		let module = require(`./modules/${f}`);
		console.log(`${i + 1}: ${f} loaded!`);
		bot.modules[f] = new module(client, bot)
		moduleList.push(f)
		if (typeof bot.modules[f].help !== "undefined") helpList.push(f)
	});
});

bot.blacklist = JSON.parse(fs.readFileSync("./data/blacklist.json"))

//Pulled from: https://stackoverflow.com/questions/1484506/random-color-generator
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function cooloff(id) {
	if (mods.includes(id)) return;
	cooldown.push(id)
	setTimeout(function (id) {
		cooldown.splice(cooldown.indexOf(id), 1)
	}, 1000 * cooldownTime, id)
}

client.on("ready", () => {
	console.log("ready");
	// [messagelist, userdata] = rs(null, [], [], jsonfile);
	bot.hordes = client.guilds.get("221772925282287627");
	bot.redtick = bot.hordes.emojis.find("name", "redtick");
	bot.greentick = bot.hordes.emojis.find("name", "greentick");
	bot.penaltytick = bot.hordes.emojis.find("name", "penaltytick");
	bot.reactionsWatch = [bot.redtick.id, bot.greentick.id, bot.penaltytick.id];
	client.user.setGame(`Use ${bot.prefix}help!`)
	// client.guilds.find("id", "221772925282287627").channels.find("id", "240595502167490562").send("I am now online :D")
});

client.on("message", async msg => {
	const message = msg;
	if (msg.channel.type === "dm" || msg.channel.type === "group" || msg.author.id === "243120137010413568") return;
	if (msg.channel.id !== "390239096519393282" && msg.content[0] === bot.prefix && msg.channel.id !== "287042530825076736") {
		msg.author.send("Please don't use bot commands outside of #bot-commands")
		return msg.delete()
	}
	if (cooldown.includes(msg.author.id) && msg.content[0] === bot.prefix) {
		msg.author.send("Please wait " + cooldownTime + " seconds between sending commands!")
		return msg.delete();
	}
	//Do not change the order of the above if statements, or it'll break the bot.

	if (msg.content.startsWith(bot.prefix + "ping")) {
		cooloff(msg.author.id)
		const message = await msg.channel.send("x ms");
		return message.edit(message.createdTimestamp - msg.createdTimestamp + " ms");
	}

	if (msg.content.startsWith(bot.prefix + "help")) {
		if (msg.content.replace(bot.prefix + "help") === "" || !helpList.includes(msg.content.replace(bot.prefix + "help ", "").toLowerCase() + ".js")) {
			var sectionBlock = "▫" + helpList[0].split("")[0].toUpperCase() + helpList[0].substr(1).replace(".js", "")
			for (var i = 1; i < helpList.length; i++) {
				sectionBlock += "\n▫" + helpList[i].split("")[0].toUpperCase() + helpList[i].substr(1).replace(".js", "")
			}
			var helpMessage = new Discord.RichEmbed()
				.setTitle("**HordesBot Help**")
				.setDescription("Use `$help <section>` for more info about each section")
				.addField("Sections", sectionBlock)
				.setColor(getRandomColor())
			msg.channel.send(helpMessage)
			cooloff(msg.author.id)
			return;
		} else {
			var name = msg.content.replace(bot.prefix + "help ", "").split("")[0].toUpperCase() + msg.content.replace(bot.prefix + "help ").substr(1)
			var helpMessage = new Discord.RichEmbed()
				.setTitle("HordesBot " + name + " Help")
				.setColor(getRandomColor())

			cooloff(msg.author.id)
			msg.channel.send(bot.modules[msg.content.replace(bot.prefix + "help ", "").toLowerCase() + ".js"].help(helpMessage))
		}
	}

	if (msg.content[0] === bot.prefix && msg.channel.type !== "dm" && msg.channel.type !== "group" && (msg.channel.id === "390239096519393282" || msg.channel.id === "287042530825076736")) {
		var command = msg.content.split(" ")[0].replace(bot.prefix, "").toLowerCase()
		for (var i in command.split("")) {
			if(numbers.includes(command.split("")[i])) {
				command.replace(command.split("")[i], numbertext[numbers.indexOf(command.split("")[i])])
			}
		}
		for (var i = 0; i < moduleList.length; i++) {
			if (typeof bot.modules[moduleList[i]].commands === "undefined") return;
			if (bot.modules[moduleList[i]].commands.includes(command)) {
				cooloff(msg.author.id)
				bot.modules[moduleList[i]][command](msg)
			}
		}
	}
})

client.login(options.token);
