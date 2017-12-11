var fs = require("fs");

function readJSON(location) {
	return JSON.parse(fs.readFileSync(location))
}

function writeJSON(location, data){
	fs.writeFileSync(location, JSON.stringify(data))
}

function userScore(id, pn) {
	if(pn ==="+") {
		return typeof readJSON("./data/reportdata.json")[id] === "undefined"?addUser(id,pn):readJSON("./data/reportdata.json")[id].positive
	} else if(pn==="-") {
		return typeof readJSON("./data/reportdata.json")[id] === "undefined"?addUser(id,pn):readJSON("./data/reportdata.json")[id].negative
	}
	else console.log("Must be + or -")
}

function updateReports(member, good, message) {
	if (typeof readJSON("./data/reportdata.json")[member.user.id] === "undefined") addUser(member.user.id,good?"+":"-")
	else {
		var data = readJSON("./data/reportdata.json")
		if (good) data[member.user.id].positive++
		else if (!good) data[member.user.id].negative++
		if (data[member.user.id].negative >= 3) message.channel.overwritePermissions(member.user, {"SEND_MESSAGES": false})
		if (data[member.user.id].positive >= 3) {
			if (!member.roles.array().includes("348316016742498305")) member.addRole("348316016742498305")
		}
		writeJSON("./data/reportdata.json", data)
	}
	return;
}
module.exports = class reports {
	constructor(client,bot) {
		this.client = client
		this.bot = bot;
		this.commands = []
		client.on("messageReactionAdd", (reaction,user)=>{
			var message = reaction.message
			if(reaction.message.channel.id!=="388460142284505102") return;
			if (user.id === "240613206442246144") return;
			if(!message.guild.members.find("id", user.id).roles.exists("id", "227720287083298816")/*CM role*/ && user.id !== "117993898537779207"/*Dek*/ && user.id !=="349377841416110081"/*dhwty*/) return;
			if (!bot.reactionsWatch.includes(reaction.emoji.id)) return;
			if (message.reactions.exists(r=>r.emoji.name==="GM")) return;
			if (message.reactions.exists(r=>r.emoji.name==="🔒")) return;
			switch (reaction.emoji.id) {
				case bot.reactionsWatch[0]: {
					bot.hordes.channels.find("id", "388458554907951105").send("```Report Denied\nUsername: "+message.author.username+"\n\n"+message.content+"\n\nUser Score: +"+userScore(message.author.id,"+")+" -"+userScore(message.author.id,"-")+"```")
					message.react("🔒")
					break;
				}
				case bot.reactionsWatch[1]: {
					updateReports(message.member, true, message)
					bot.hordes.channels.find("id", "388458477732888606").send("```Report Accepted\nUsername: "+message.author.username+"\n\n"+message.content+"\n\nUser Score: +"+userScore(message.author.id,"+")+" -"+userScore(message.author.id,"-")+"```")
					message.react("🔒")
					break;
				}
				case bot.reactionsWatch[2]: {
					updateReports(message.member, false, message)
					message.reply("idk what to do here. don't ask me.")
					message.react("🔒")
				}
			}
		})
	}
	
}