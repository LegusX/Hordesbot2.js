var fs = require("fs");
var Discord = require("discord.js")

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

function updateReports(user, good, client) {
	let member = client.guilds.get("221772925282287627").members.get(user.id)
	if (typeof readJSON("./data/reportdata.json")[user.id] === "undefined") addUser(user.id, good)
	else {
		var data = readJSON("./data/reportdata.json")
		data[user.id][good]++
		if (data[user.id].penalty >= 3) client.channels.get("382612925275308032").overwritePermissions(user, {
			"SEND_MESSAGES": false
		})
		if (data[user.id].accepted >= 10 && !member.roles.array().includes("348316016742498305")) member.addRole("348316016742498305")
		if (data[user.id].accepted >= 200 && !member.roles.has("408098180773969920")) member.addRole("408098180773969920");
		writeJSON("./data/reportdata.json", data)
	}
	return;
}

function addUser(id, adp) {
	//adp = accepted,denied,penalty
	var data = readJSON("./data/reportdata.json")
	data[id] = {
		accepted: 0,
		denied: 0,
		penalty: 0
	}
	data[id][adp]++;
	writeJSON("./data/reportdata.json", data);
}

module.exports = class Reports {
	constructor(client, bot) {
		// reportcount++
		// if (reportcount > 1) process.exit()
		this.client = client;
		this.bot = bot;
		this.commands = ["clearguardian", "reportscore", "reportlb"];
		client.on("messageReactionAdd", (reaction, user) => {
			var message = reaction.message;
			if (bot.blacklist.includes(message.author.id)) return;
			if (reaction.message.channel.id === "382612925275308032") {
				if (user.id === "240613206442246144") return;
				if (!message.guild.member(user).roles.exists("id", "227720287083298816") /*CM role*/ && user.id !== "117993898537779207" /*Dek*/ && user.id !== "349377841416110081" /*dhwty*/ ) return;
				if (!bot.reactionsWatch.includes(reaction.emoji.id)) return;
				if (message.reactions.exists(r => r.emoji.name === "GM")) return;
				if (message.reactions.exists(r => r.emoji.name === "🔒")) return;
				var ruser;
				if (message.author.id !== "243120137010413568") {
					switch (reaction.emoji.id) {
						case bot.reactionsWatch[0]:
							updateReports(message.member.user, "denied", this.client);
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
							updateReports(message.member.user, "accepted", this.client);
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
							updateReports(message.member.user, "penalty", this.client);
							message.delete();
					}
				}
				else {
					switch (reaction.emoji.id) {
						case bot.reactionsWatch[0]:
							ruser = message.mentions.users.first()
							updateReports(ruser, "denied", this.client)
							var channel = client.channels.get("388458554907951105");
							var pos, neg;
							[pos, neg] = userScore(ruser.id);
							var text = `Report Denied by ${user.username}\nUsername: ${ruser.username}\nUser score: +${pos} -${neg}`;
							channel.send(text, {code: true, disableEveryone: true});
							var report = `${message.content}`;
							channel.send(report + "\n- - -");
							message.react("🔒");
							break;
							
						case bot.reactionsWatch[1]:
							ruser = message.mentions.users.first()
							updateReports(ruser, "accepted", this.client)
							var channel = client.channels.get("388458477732888606");
							var pos, neg;
							[pos, neg] = userScore(ruser.id);
							var text = `Report Accepted by ${user.username}\nUsername: ${ruser.username}\nUser score: +${pos} -${neg}`;
							channel.send(text, {code: true, disableEveryone: true});
							var report = `${message.content}`;
							channel.send(report + "\n- - -");
							message.react("🔒");
							break;
						
						case bot.reactionsWatch[2]:
							updateReports(message.mentions.users.first(), "penalty", this.client);
							message.delete();
					}
				}
			}
			else if (reaction.message.channel.id === "467532445038805004" && message.guild.member(user).roles.exists("id", "348316016742498305")) {
				if (typeof bot.modules["ingame.js"] === "undefined") return;
				if (bot.reactionsWatch[2] !== reaction.emoji.id) return;
				let list = bot.modules["ingame.js"].messages
				if (!list.includes(reaction.message.content)) return;
				let pre = `**Message reported by ${user}**\n*Note: Message in red is the reported message, all others are there for context*`
				let post = "\n```diff"
				let index = list.indexOf(reaction.message.content);
				console.log(index)
				for (let i = index-5; i < index+6; i++) {
					if (list[i] === undefined) continue;
					let mid = "\n";
					if (i === index) mid+="-";
					mid+=list[i];
					mid = mid.replace("<:Vanguard:238319079130136577>", "").replace("<:Bloodlust:238319126991339520>", "").replace("**", "").replace("**", "");
					post+=mid;
				}
				post+="\n```\n=======================================";
				let final = pre+post;
				this.client.channels.get("382612925275308032").send(final);
			}
		});
	}
	clearguardian(message) {
		if (message.author.id !== "227376221351182337") return;
		let data = readJSON("./data/reportdata.json")
		let ids = Object.getOwnPropertyNames(data)
		for (var i=0;i<ids.length;i++) {
			let user = data[ids[i]]
			if (user.accepted < 10) {
				if (message.guild.members.get(ids[i]).roles.has("348316016742498305"))message.guild.members.get(ids[i]).removeRole("348316016742498305")
			}
		}
		message.reply("Success")
	}
	help(message) {
		message.addField("$reportscore", "Shows you how many reports you have made that have been accpeted or denied.")
		.addField("$clearguardian", "Special command for legus only")
		return message;
	}
	reportscore(message) {
		try  {
		if (message.mentions.users.array().length < 1) {
			let score = userScore(message.author.id)
			let embed = new Discord.RichEmbed()
			.setTitle("Report Score for "+message.author.username)
			.setThumbnail(message.author.avatarURL)
			.setColor(getRandomColor())
			.addField("Accepted", score[0]+" reports", true)
			.addField("Denied", score[1]+" reports", true)
			message.channel.send(embed)
		}
		else{
			let user = message.mentions.users.first();
			let score = userScore(user.id);
			let embed = new Discord.RichEmbed()
			.setTitle("Report Score for "+user.username)
			.setThumbnail(user.avatarURL)
			.setColor(getRandomColor())
			.addField("Accepted", score[0]+" reports", true)
			.addField("Denied", score[1]+ " reports", true)
			.setFooter(`Report score requested by ${message.author.username}`);
			message.channel.send(embed);
		}
		}
		catch(e){message.reply("```"+e+"```")}
	}
	reportlb(message) {
		let sorted = Object.values
	}
}