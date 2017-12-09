var fs = require("fs");

function readJSON(location) {
	return JSON.parse(fs.readFileSync(location))
}

function writeJSON(location, data){
	fs.writeFileSync(location, JSON.stringify(data))
}

function userScore(id, pn) {
	if(pn ==="+") {
		return readJSON("./data/reportdata.json")[id].positive
	} else if(pn==="-") {
		return readJSON("./data/reportdata.json")[id].negative
	}
	else console.log("Must be + or -")
}

function updateReports(member, good) {
	return;
}
module.exports = class reports {
	constructor(client,bot) {
		this.client = client
		this.bot = bot;
		this.commands = ["test"]
		client.on("messageReactionAdd", (reaction,user)=>{
			console.log(client.emojis)
			if(reaction.message.channel.id!=="388460142284505102") return;
			if (user.id === "240613206442246144") return;
			if (!bot.reactionsWatch.includes(reaction.emoji.id)) return;
			const message = reaction.message;
			if (message.reactions.exists(r=>r.emoji.name==="GM")) return;
			if (message.reactions.exists(r=>r.emoji.name==="🔒")) return;
			switch (reaction.emoji.id) {
				case bot.reactionsWatch[0]: {
					bot.hordes.channels.find("id", "388458554907951105").send("```Report Denied\nUsername: "+message.author.username+"\n\n"+message.content+"\n\nUser Score: +"+userScore(message.author.id,"+")+" -"+userScore(message.author.id,"+")+"```")
					message.react("🔒")
					break;
				}
				case bot.reactionsWatch[1]: {
					bot.hordes.channels.find("id", "388458477732888606").send("```Report Accepted\nUsername: "+message.author.username+"\n\n"+message.content+"\n\nUser Score: +"+userScore(message.author.id,"+")+" -"+userScore(message.author.id,"+")+"```")
					updateReports(message.member, true)
					message.react("🔒")
					break;
				}
				case bot.reactionsWatch[2]: {
					message.reply("idk what to do here. don't ask me.")
					updateReports(message.member, false)
					message.react("🔒")
				}
			}
		})
	}
	test(msg) {
		msg.reply("YEET")
	}
	
}