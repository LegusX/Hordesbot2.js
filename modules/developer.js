const Discord = require("discord.js")
const git = require("simple-git")("./")
const fs = require("fs")
const chalk = require("chalk");
const app = require("http").createServer(()=>{});
const io = require("socket.io")(app);

const admins = ["227376221351182337", "190313064367652864", "117993898537779207", "126288853576318976"]

module.exports = class Developer {
	constructor(client /*,bot*/ ) {
		this.client = client
		// this.bot = bot
		this.commands = ["stop", "reload", "update"]
		this.server = io;
		app.listen(3456);
		this.auth = false;
		this.server.users = [];
		this.server.on("connection", socket => {
			this.server.users.push({id:socket.id, auth: false});
			console.log(chalk.yellow("New Connection to Eval Server."));
			if (this.server.users.length > 1) {
				console.log(chalk.red("Error: Socket has 2 connected users... Closing server."))
				socket.broadcast.emit("deny", true);
				this.server.close();
			}
			socket.on("auth", data => {
				if (data && data === client.token) {
					console.log(chalk.green("Connection Authorized."));
					this.auth = true;
					this.server.users[0].auth = true;
					socket.emit("auth", true);
				} else {
					console.log(chalk.red("Connection Failed to Authorize."));
					this.auth = false;
					socket.emit("auth", false);
				}
			});
			socket.on("eval", data => {
				if (!this.auth || !this.server.users[0].id === socket.id || !this.server.users[0].auth) { socket.emit("deny", true); return; }
				socket.emit("eval", this.mval(data));
			});
			socket.on("disconnect", () => {
				this.server.users.shift();
			});
		});
	}
	stop(message) {
		if (admins.includes(message.author.id)) {
			message.reply("👋")
			process.exit()
		}
	}
	mval(input) {
		console.log(chalk.yellow(input));
		let out;
		try {
			out = eval(input);
		} catch (e) {
			out = e.toString();
		}
		return out;
	}
	reload(message) {
		if (admins.includes(message.author.id)) {
			try {
				console.log("Attempting to reload module: " + message.content.toLowerCase().replace(bot.prefix + "reload ", ""))
				if (message.content.toLowerCase().replace(bot.prefix+"reload ", "") === "developer") this.server.close();
				delete require.cache[require.resolve(`./${message.content.toLowerCase().replace(bot.prefix+"reload ", "")}.js`)];
				delete bot.modules[`./${message.content.toLowerCase().replace(bot.prefix+"reload ", "")}.js`]
				var module = require(`./${message.content.toLowerCase().replace(bot.prefix+"reload ", "")}.js`)
				bot.modules[message.content.toLowerCase().replace(bot.prefix + "reload ", "") + ".js"] = new module(this.client, bot)
				moduleList.splice(moduleList.indexOf(message.content.toLowerCase().replace(bot.prefix + "reload ", "") + ".js"), 1)
				console.log("Module: " + message.content.toLowerCase().replace(bot.prefix + "reload ", "") + " has been successfully reloaded.")
				message.reply("Module: `" + message.content.toLowerCase().replace(bot.prefix + "reload ", "") + "` has been successfully reloaded.")
			} catch (e) {
				console.log("Error: " + e)
				message.reply("Module: `" + message.content.toLowerCase().replace(bot.prefix + "reload ", "") + "` could not be found.")
			}
		}
	}
	help(message) {
		message.setDescription("These commands can only be used by LegusX, BlazingFire007, Korvnisse, and Dek")
			.addField("`" + bot.prefix + "stop`", "Shuts off the bot entirely, only use if you must.")
			.addField("`" + bot.prefix + "reload <module>`", "Reloads the given module")
			.addField("`" + bot.prefix + "eval <code to run>`", "Evals the given code")
			.addField("`" + bot.prefix + "update`", "Updates HordesBot from the repo and restarts all modules")
		return message
	}
	eval(message) {
		if (admins.includes(message.author.id)) {
			var args = message.content.replace(bot.prefix + "eval ", "").split(" ")
			var client = this.client
			let result;
			try {
				console.log(chalk.yellow("Eval: " + (args.join(' ') || "")));
				let out = eval(args.join(' ')) || "";
				var evalMBD = new Discord.RichEmbed()
					.setTitle('Input')
					.setColor("#00ff00")
					.setDescription("```js\n" + message.content.substring(6) + "\n```")
					.setFooter("Eval Completed.")
					.setTimestamp()
					.addField('Output', "```js\n" + out.toString().replace(client.token, "") + "\n```");
				message.channel.send('Eval Complete', {
					embed: evalMBD
				});
				message.delete();
			} catch (e) {
				var evalErr = new Discord.RichEmbed()
					.setAuthor('Error!')
					.setTitle('Input')
					.setColor("#ff0000")
					.setDescription("```js\n" + message.content.substring(6) + "\n```")
					.setFooter("Eval Error.")
					.setTimestamp();
				message.delete();
				return message.channel.send("```js\n" + e.toString() + "\n```", evalErr);
			}
		} else return message.reply("You have to be a developer to use this command.")
	}
	update(message) {
		if (!admins.includes(message.author.id)) return;
		var client = this.client;
		this.server.close();
		git.pull(function (err, update) {
			if (err) console.log(err.toString());
			if (!update) return console.log("no update");
			console.log(chalk.yellow("Updating bot"));
			// FIND WAY TO RESTART PROCESS HERE
			moduleList.length = 0;
			fs.readdir("./modules/", (err, files) => {
				if (err) console.error(err);

				let jsfiles = files.filter(f => f.split(".").pop() === "js");
				if (jsfiles.length <= 0) {
					console.log("No modules to load!");
				}

				moduleList.length = []
				console.log(`Loading ${jsfiles.length} modules!`);

				jsfiles.forEach((f, i) => {
					delete require.cache[require.resolve(`./${f}`)];
					try {
						let module = require(`./${f}`);
						console.log(`${i + 1}: ${f} loaded!`);
						bot.modules[f] = new module(client, bot)
						moduleList.push(f)
						if (typeof bot.modules[f].help !== "undefined") helpList.push(f)
					}
					catch(e){
						message.reply(`Module \`${f}\` failed to load`)
					}
				});
			});
		})
	}
}
