const Discord = require("discord.js");
const fs = require("fs")
const client = new Discord.Client();
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'token', alias: 't', type: String }
]
const options = commandLineArgs(optionDefinitions)
// console.log(options)
if (typeof options.token === "undefined") return console.log("Please pass a token through the -token or -t argument")

var bot = {
	modules:{},
	prefix:"$"
}
var moduleList = []

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
    });
});

client.on("ready", ()=>{
    console.log("ready");
    // [messagelist, userdata] = rs(null, [], [], jsonfile);
    bot.hordes = client.guilds.get("221772925282287627");
    bot.redtick = bot.hordes.emojis.find("name", "redtick");
    bot.greentick = bot.hordes.emojis.find("name", "greentick");
    bot.penaltytick = bot.hordes.emojis.find("name", "penaltytick");
    bot.reactionsWatch = [bot.redtick.id, bot.greentick.id, bot.penaltytick.id];
})

client.on("message", (msg)=>{
	if (msg.content[0] === bot.prefix && msg.channel.type !== "dm" && msg.channel.type !== "group" && msg.channel.id === "240595502167490562") {
		var command = msg.content.split(" ")[0].replace(bot.prefix, "").toLowerCase()
		for(var i=0;i<moduleList.length;i++) {
			if(bot.modules[moduleList[i]].commands.includes(command)) {
				bot.modules[moduleList[i]][command](msg)
			}
		}
	}
	else if(msg.channel.id !== "240595502167490562" && msg.content[0] === bot.prefix) {
		msg.author.send("Please don't use bot commands outside of #off-topic")
		return msg.delete()
	}
})

client.login(options.token);