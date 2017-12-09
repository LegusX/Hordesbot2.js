const randomQuestions = [
	"Would you rather feel like you have a sense of purpose in life, money, or happiness?",
	"Why are things named as they are? Why is an apple an apple, why isn't it an orange?",
	"What is right and wrong?",
	"What's more important, money or humanity?",
	"Can you touch your own eye?",
	"What's more important, hospitality or safety?",
	"Can you lick your elbow?",
	"Is all of humanity really just a simulation?",
	"Should people always be completely honest?",
	"If our eyes turn things upside-down so our brains can make sense of it does that mean everything is upside-down?",
	"Why is sour sour, why isn't it sweet?",
	"What matters more, being neutral or defending your friends?",
	"Can you cross a bridge with no end?",
	"What's more powerful, love or lust?",
	"If thunder is the thing we hear, why is there a word called 'thunderbolt'?",
	"What matters more to you, inner beauty or outer beauty?",
	"Why do we have money? It's just paper and metal."
]
//^All submitted by the community

//Totally stolen from the MDN docs :D
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = class fun {
	constructor(client,bot) {
		this.client = client
		this.bot = bot
		this.commands = ["die", "revive", "tassels", "tree"]
	}
	die(msg) {
		if (msg.member.displayName.includes("The Ghost of")) return msg.reply("You're already a ghost, you can't die again silly")
		else {
			msg.channel.send(`*kills ${msg.author}*`)
			msg.member.setNickname("The Ghost of "+msg.member.displayName)
		}
	}
	revive(msg) {
		if (!msg.member.displayName.includes("The Ghost of")) return msg.reply("No point in reviving yourself if you're already alive")
		else {
			msg.channel.send(`*revives ${msg.author} with fancy magic powers*`)
			msg.member.setNickname(msg.member.displayName.replace("The Ghost of ", ""))
		}
	}
	tassels(message) {
		message.channel.send(randomQuestions[getRandomInt(0,randomQuestions.length)])
	}
	tree(message) {
		if(message.member.displayName.includes("🎄")) message.member.setNickname(message.member.displayName.replace("🎄", ""))
		else message.member.setNickname(message.member.displayName+"🎄")
		message.reply("TREES FOR EVERYONE!")
	}
}