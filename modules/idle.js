const read = require("../libs/read.js")
const Discord = require("discord.js")

global.areas = [
	{
		name: "Midguard",
		min: 1,
		max: 10
	},
	{
		name: "Ashfall",
		min: 9,
		max: 20
	},
	{
		name: "Ravenhall",
		min: 21,
		max: 30
	},
	{
		name: "Stonehelm",
		min:31,
		max:39
	}
]

//Totally stolen from the MDN docs :D
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = class Idle {
	constructor(client) {
		this.commands = ["create", "mychars", "resetdata", "select", "sendto", "readdata"]; //Don't add the help command to this list.
		this.client = client
		for (var i in areas) {
			areas[i].index = i
		}
	}
	help(message) {
		message.setTitle("Idle Help")
		.setDescription("All the commands for the bot-based idle game for Hordes.io")
		.addField(bot.prefix+"create account/character", "Creates either a new character, or an IdleHordes account (depending on the option you choose)")
		.addField(bot.prefix+"mychars", "Lists off all of your characters")
		.addField(bot.prefix+"resetdata", "Resets all idledata.json data.")
		.addField(bot.prefix+"select <charactername>", "Selects a character to perform other commands on.")
		.addField(bot.prefix+"sendto", "Allows you to send the selected character somewhere on the map")
		.addField("THERE ARE NO OTHER COMMANDS", "NOT YET AT LEAST")
		.addField("NOTE/WARNING/CAUTION", "THIS SECTION OF THE BOT IS NOWHERE NEAR COMPLETE. PLEASE HAVE PATIENCE AS I FINISH IT.")
		return message;
	}
	create(message) {
		if (message.content.toLowerCase().replace(bot.prefix+"create ", "") === "account") {
			if (read.userExists(message.author.id)) return message.reply("You already have an account!")
			else {
				message.channel.send("Creating account for **"+message.member.displayName+"**...").then((msg)=>{
					let newData = {
						id:message.author.id,
						characters:[],
						money:100,
						skills:[],
						characterLimit:2,
						selected:null,
						names:[]
					}
					read.writeUser(message.author.id, newData)
					msg.edit("An account for **"+message.member.displayName+"** has been created!")
				});
			}
		}
		else if (message.content.toLowerCase().replace(bot.prefix+"create ", "") === "character" && read.userExists(message.author.id)) {
			let userData = read.readUser(message.author.id)
			if (userData.characters.length === userData.characterLimit) return message.reply("You can't make any more characters at this time!")
			message.reply("In order to successfully create your new character, please answer the following questions within 60 seconds")
			message.channel.send("What will the character's class be?\n▫Archer\n▫Shaman\n▫Warrior\n▫Mage")
			var newCharacter = {
				level: 1,
				xp: 0,
				inventory: [],
				area: null,
				equip: {}
			}
			var filter = msg => msg.author.id === message.author.id
			var filteroptions = {max:1,time:60000, errors:["time"]}
			message.channel.awaitMessages(filter, filteroptions).then((c)=>{
				let accepted = ["archer", "shaman", "warrior", "mage"]
				let newM = c.first()
				newCharacter.class = newM.content.toLowerCase()
				if (!accepted.includes(newM.content.toLowerCase())) return message.reply("That is not a character type!")
				message.channel.send(message.member.displayName+", what will the character's name be? (Character names must be 20 characters or less)")
				message.channel.awaitMessages(filter, filteroptions).then((c)=>{
					let newM = c.first()
					newCharacter.name = newM.content
					let userData = read.readUser(message.author.id)
					if (userData.names.includes(newCharacter.name)) return message.reply("You already have a character with that name!")
					if (newM.content.length >= 20) return message.reply("Character names must be 20 characters or less! Please reuse the `$create character` command and start again!")
					var embed = new Discord.RichEmbed()
					.setTitle("Stats for "+newCharacter.name)
					.setThumbnail("https://hordes.io/data/class/class_"+newCharacter.class+".png")
					.addField("Level", newCharacter.level, true)
					.addField("XP", newCharacter.xp, true)
					.addField("Current Area", (newCharacter.area === null)?"None": newCharacter.area)
					.setDescription("A new character has been created! <a:apartyblob:419501479305412608>")
					.setAuthor(message.author.username, message.author.avatarURL);
					userData.characters.push(newCharacter)
					userData.names.push(newM.content)
					read.writeUser(message.author.id, userData)
					message.channel.send(embed).then(msg=>msg.react(msg.guild.emojis.get("419501479305412608")));
				})
			}).catch((e)=>{return message.reply("Character creation canceled due to taking longer than 60 seconds.");})
		}
		else if (!read.userExists(message.author.id)) return message.reply("You need to create an account first!\n*Hint:* `$create account`")
		else message.reply("Please specify either `"+bot.prefix+"create account` or `"+bot.prefix+"create character`!")
	}
	mychars(message) {
		if (!read.userExists(message.author.id)) return message.reply("You need to create an account first!\n*Hint:* `$create account`")
		let user = read.readUser(message.author.id)
		if (user.characters.length === 0) return message.reply("You don't have any characters\n*Hint: use `$create character` to make a new character`")
		let embed = new Discord.RichEmbed()
		.setTitle(message.member.displayName+"'s character list")
		.setThumbnail(message.author.avatarURL);
		for (let i in user.characters) {
			embed.addField(user.characters[i].name, "Level: "+user.characters[i].level+"\nClass: "+user.characters[i].class, true);
		}
		message.channel.send(embed);
	}
	resetdata(message){
		if(message.author.id !== "227376221351182337") return message.reply("Only LegusX gets to use this command, you pleb.")
		message.reply("Are you sure you want to do this?")
		let filter = (msg)=>msg.author.id === "227376221351182337"
		message.channel.awaitMessages(filter, {max:1, time:10000}).then((c)=>{
			let msg = c.first()
			if (msg.content.toLowerCase() === "yes") {
				message.channel.send("All data has been deleted.")
				return read.writeJSON("./data/idledata.json", {});
			}
			else message.channel.send("Reset aborted")
		})
	}
	select(message){
		if (!read.userExists(message.author.id)) return message.reply("You need to create an account first!\n*Hint:* `$create account`")
		let user = read.readUser(message.author.id)
		if (!user.names.includes(message.content.replace(bot.prefix+"select ", ""))) return message.reply("You don't have a character with that name! (This command is case sensitive)")
		else {
			user.selected = user.names.indexOf(message.content.replace(bot.prefix+"select ", ""));
			var name = message.content.replace(bot.prefix+"select ", "");
			read.writeUser(message.author.id, user)
			message.reply("Successfully selected character **"+name+"**!")
		}
	}
	sendto(message) {
		message.channel.send("⚠This command is currently under construction! Watch out for falling `if` statements!⚠");
		if (!read.userExists(message.author.id)) return message.reply("You need to create an account first!\n*Hint:* `$create account`")
		let user = read.readUser(message.author.id)
		if (user.selected === null) return message.reply("You need to select a character first!\n*Hint:* `$select <character name>`")
		// if (message.content.toLowerCase().replace)
		if (message.content.split(" ").length < 2) {
			let embed = new Discord.RichEmbed()
			.setTitle("Sending "+user.names[user.selected]+" somewhere")
			.setDescription("Say the name of the area you wish to send your character to")
			for (let i in areas) {
				let area = areas[i]
				embed.addField(area.name, "Levels "+area.min+"-"+area.max, true)
			}
			message.channel.send(embed)
			var filter = msg => msg.author.id === message.author.id
			message.channel.awaitMessages(filter, {max:1,time:60000,errors:["time"]})
			.then((c)=>{
				let check = []
				for (let i in areas) {
					if (areas[i].name.toLowerCase() === c.first().content.toLowerCase()) {
						check.push(true)
						let user = read.readUser(message.author.id)
						user.characters[user.selected].area = areas[i].name
						message.reply("**"+user.characters[user.selected].name+"** has been sent to **"+areas[i].name+"**!")
						i = areas.length
						return;
					}
					else check.push(false)
				}
				if (!check.includes(true)) return message.reply("That is not a real area!")
			})
		}
		else {
			
		}
	}
	readdata(message) {
		if (message.author.id !== "227376221351182337") return;
		if (message.mentions.users.keyArray().length < 1) return message.channel.send("```"+JSON.stringify(read.readUser(message.author.id))+"```")
		else message.channel.send("```"+JSON.stringify(read.readUser(message.mentions.users.keyArray()[0]))+"```")
	}
}