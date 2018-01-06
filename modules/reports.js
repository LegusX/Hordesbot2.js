var fs = require("fs");

function readJSON(location) {
	return JSON.parse(fs.readFileSync(location))
}

function writeJSON(location, data) {
	fs.writeFileSync(location, JSON.stringify(data))
}

function userScore(id) {
	let user = readJSON("./data/reportdata.json")[id];
	return [user["accepted"], user["denied"]];
}

function updateReports(member, good, message) {
	if (typeof readJSON("./data/reportdata.json")[member.user.id] === "undefined") addUser(member.user.id, good)
	else {
		var data = readJSON("./data/reportdata.json")
		data[member.user.id][good]++
		if (data[member.user.id].penalty >= 3) message.channel.overwritePermissions(member.user, {
			"SEND_MESSAGES": false
		})
		if (data[member.user.id].accepted >= 3 && !member.roles.array().includes("348316016742498305")) member.addRole("348316016742498305")
		writeJSON("./data/reportdata.json", data)
	}
}

function addUser(id, adp) {
	//adp = accepted,denied,penalty
	var data = readJSON("./data/reportdata.json")
	data[id] = {
		accepted: 0,
		denied: 0,
		penalty: 0
	}
	data[id][adp]++
		writeJSON("./data/reportdata.json", data)
}
module.exports = class Reports {
	constructor(client, bot) {
		this.client = client
		this.bot = bot;
		this.commands = []
		client.on("messageReactionAdd", (reaction, user) => {
			var message = reaction.message;
			if (reaction.message.channel.id !== "382612925275308032") return;
			if (user.id === "240613206442246144") return;
			if (!message.guild.member(user).roles.exists("id", "227720287083298816") /*CM role*/ && user.id !== "117993898537779207" /*Dek*/ && user.id !== "349377841416110081" /*dhwty*/ ) return;
			if (!bot.reactionsWatch.includes(reaction.emoji.id)) return;
			if (message.reactions.exists(r => r.emoji.name === "GM")) return;
			if (message.reactions.exists(r => r.emoji.name === "🔒")) return;
			switch (reaction.emoji.id) {
				case bot.reactionsWatch[0]:
					updateReports(message.member, "denied", message);
					var channel = client.channels.get("388458554907951105");
					var pos, neg;
					[pos, neg] = userScore(message.author.id);
					var text = `Report Denied by ${user.username}\nUsername: ${message.author.username}\nUser score: +${pos} -${neg}`;
					channel.send(text, {code: true, disableEveryone: true});
					var report = `**Report:**\n${message.author}: ${message.content}`;
					if (message.attachments.size > 0) {
						report += "\nAttachments:\n";
						message.attachments.forEach(attachment => {
							report += attachment.url + "\n";
						});
					}
					channel.send(report + "\n- - -");
					message.react("🔒");
					break;
				case bot.reactionsWatch[1]:
					updateReports(message.member, "accepted", message);
					var channel = client.channels.get("388458477732888606");
					var pos, neg;
					[pos, neg] = userScore(message.author.id);
					var text = `Report Accepted by ${user.username}\nUsername: ${message.author.username}\nUser score: +${pos} -${neg}`;
					channel.send(text, {code: true, disableEveryone: true});
					var report = `**Report:**\n${message.author}: ${message.content}`;
					if (message.attachments.size > 0) {
						report += "\nAttachments:\n";
						message.attachments.forEach(attachment => {
							report += attachment.url + "\n";
						});
					}
					channel.send(report + "\n- - -");
					message.react("🔒");
					break;
				case bot.reactionsWatch[2]:
					updateReports(message.member, "penalty", message);
					message.delete();
				}
		});
	}

}