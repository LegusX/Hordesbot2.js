const Discord = require("discord.js")
const git = require("simple-git")("../")
const fs = require("fs")

const admins = ["227376221351182337", "190313064367652864", "117993898537779207", "126288853576318976"]

module.exports = class Developer {
	constructor(client/*,bot*/) {
		this.client = client
		// this.bot = bot
		this.commands = ["stop", "reload", "eval"]
	}
	stop(message) {
		if (admins.includes(message.author.id)) {
			message.reply("👋")
			process.exit()
		}
	}
	reload(message) {
		if (admins.includes(message.author.id)) {
			try {
				console.log("Attempting to reload module: "+message.content.toLowerCase().replace(bot.prefix+"reload ", ""))
				delete require.cache[require.resolve(`./${message.content.toLowerCase().replace(bot.prefix+"reload ", "")}.js`)];
				delete bot.modules[`./${message.content.toLowerCase().replace(bot.prefix+"reload ", "")}.js`]
				var module = require(`./${message.content.toLowerCase().replace(bot.prefix+"reload ", "")}.js`)
				bot.modules[message.content.toLowerCase().replace(bot.prefix+"reload ", "")+".js"] = new module(this.client, bot)
				console.log("Module: "+message.content.toLowerCase().replace(bot.prefix+"reload ", "")+" has been successfully reloaded.")
				message.reply("Module: `"+message.content.toLowerCase().replace(bot.prefix+"reload ", "")+"` has been successfully reloaded.")
			}
			catch(e){
				console.log("Error: "+e)
				message.reply("Module: `"+message.content.toLowerCase().replace(bot.prefix+"reload ", "")+"` could not be found.")
			}
		}
	}
	help(message) {
		message.setDescription("These commands can only be used by LegusX, BlazingFire007, Korvnisse, and Dek")
		.addField("`"+bot.prefix+"stop`", "Shuts off the bot entirely, only use if you must.")
		.addField("`"+bot.prefix+"reload <module>`", "Reloads the given module")
		.addField("`"+bot.prefix+"eval <code to run>`", "Evals the given code")
		return message
	}
	eval(message) {
		if (admins.includes(message.author.id)) {
			var args = message.content.replace(bot.prefix+"eval ", "").split(" ")
			var client = this.client
			let result;
			try {
	    		let out = eval(args.join(' '));
	    		var evalMBD = new Discord.RichEmbed()
	    		  .setTitle('Input')
	    		  .setColor("#00ff00")
	    		  .setDescription("```js\n" + message.content.substring(6) + "\n```")
	    		  .setFooter("Eval Completed.")
	    		  .setTimestamp()
	    		  .addField('Output', "```js\n" + out.toString().replace(client.token, "") + "\n```");
	    		message.channel.send('Eval Complete', {embed: evalMBD});
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
			message.channel.send("```js\n" + result + "\n```");
		}
	else return message.reply("You have to be a developer to use this command.")
	}
	update(message) {
		git.fetch(function(){
			console.log("Updating bot")
			for(var i=0;i<Object.getOwnPropertyNames(bot.modules).length;i++) {
				fs.readdir("./modules/", (err, files) => {
				    if(err) console.error(err);
				
				    let jsfiles = files.filter(f => f.split(".").pop() === "js");
				    if(jsfiles.length <= 0) {
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
			}
		})
	}
}