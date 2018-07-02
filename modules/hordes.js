//Template for new modules
const Discord = require("discord.js");
const fetch = require("node-fetch");

//Totally stolen from the MDN docs :D
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = class Hordes {
	constructor(client) {
		this.commands = ["itempedia", "itemsearch", "player"]; //Don't add the help command to this list.
		this.client = client;
		this.allNamesL = [];
		this.allNames = [];
		this.namesNum = {};
		let names = Object.getOwnPropertyNames(equipment);
		for (var i in Object.getOwnPropertyNames(equipment)) {
			let lowercaseArray = [];
			for (var j in equipment[names[i]].name) {
				lowercaseArray.push(equipment[names[i]].name[j].toLowerCase());
			}
			this.allNamesL = this.allNamesL.concat(lowercaseArray);
			this.allNames = this.allNames.concat(equipment[names[i]].name);
			this.namesNum[equipment[names[i]]] = lowercaseArray.length;
		}
	}
	help(message) {
		message.setTitle("Hordes Help")
		.setDescription("This is the help menu for the Hordes.io based commands, not for actually playing Hordes.io")
		.addField(bot.prefix+"itemsearch", "Can't remember the name for an item? Use this command to look it up.")
		.addField(bot.prefix+"itempedia", "Look up possible stats for different items (needs full item name)")
		.addField(bot.prefix+"player <name>", "Looks up information about the given player")
		return message;
	}
	itemsearch(message) {
		var raw = message.content.replace(bot.prefix+"itemsearch ", "");
		var args = message.content.replace(bot.prefix+"itemsearch ", "").split(" ");
		if (this.allNamesL.includes(raw.toLowerCase())) {
			let index = this.allNamesL.indexOf(raw.toLowerCase());
			return message.reply("One match found: `"+this.allNames[index]+"`");
		}
		else {
			var list = [];
			for (let i in this.allNamesL) {
				if (this.allNamesL[i].includes(raw.toLowerCase())) list.push(this.allNames[i])
			}
			if (list.length > 0) {
				var re = "**List of possible matches for __"+raw+"__:**\n";
				for (let i in list) {
					re += "\n`"+list[i]+"`";
				}
				message.reply(re);
			}
			else message.reply("No items found!");
		}
		// let msg = this.allNames.join("").substr(0,2000)
		// message.channel.send(msg)
	}
	itempedia(message) {
		var raw = message.content.replace(bot.prefix+"itempedia ", "");
		var args = message.content.replace(bot.prefix+"itempedia ", "").split(" ");
		if (!this.allNamesL.includes(raw.toLowerCase())) return message.reply("That item does not exist! (Perhaps use the `$itemsearch` command to look it up instead?)");
		let names = Object.getOwnPropertyNames(equipment)
		let object;
		for (let i in Object.getOwnPropertyNames(equipment)) {
			if(equipment[names[i]].name.includes(this.allNames[this.allNamesL.indexOf(raw.toLowerCase())])) object = equipment[names[i]]
		}
		let index = object.name.indexOf(this.allNames[this.allNamesL.indexOf(raw.toLowerCase())])
		let classInfo = (typeof object.class === "undefined")?"Any class":object.class.join(" or ")
		let statNames = Object.getOwnPropertyNames(object.stats)
		var embed = new Discord.RichEmbed()
		.setTitle(this.allNames[this.allNamesL.indexOf(raw.toLowerCase())])
		.setThumbnail("https://hordes.io/data/items/"+((typeof object.url === "undefined")?object.description.toLowerCase():object.url)+index+".png")
		.addField("Minimum Level", object.lvl[index], true)
		.addField("Requires", classInfo, true)
		.setColor("#6C00FF")
		for (let i in statNames) {
			let equip = object
			let level = object.lvl[index]
			let stats = equip.stats[statNames[i]];
			let low = (stats.float)?(Math.round((level*(stats.multi*stats.low)+stats.base) * 10) / 10).toFixed(1):Math.ceil((level*(stats.multi*stats.low)+stats.base))
			let high = (stats.float)?(Math.round((level*(stats.multi*stats.high)+stats.base) * 10) / 10).toFixed(1):Math.ceil((level*(stats.multi*stats.high)+stats.base))
			embed.addField(statNames[i], low+"-"+high, true);
		}
		message.channel.send(embed);
	}
	player(message) {
		let p = message.content.replace(bot.prefix+"player ", "");
		fetch(`https://www.flareco.net/api/hordes.io.api.php?username=${p}&all`)
		.then((r)=>r.json())
		.then((j)=>{
			let embed = new Discord.RichEmbed()
			.setTitle(j.name)
			.addField("Level", j.level, true)
			.addField("Class", j.class.replace(j.class[0], j.class[0].toUpperCase()), true)
			.addField("Fame", j.fame, true)
			.addField("Clan", j.clan, true)
			.addField("Faction", j.faction, true)
			.addField("EXP", j.exp+"/"+j.needexp+" ("+((Math.round(((j.exp/j.needexp)*100)*100))/100)+"%)", true)
			.setFooter("Stats requested by: "+message.author.username)
			.setThumbnail("https://hordes.io/data/class/class_"+j.class+".png")
			.setColor((j.faction === "Bloodlust")?"F1454D": "58CEFF");
			message.channel.send(embed);
		})
		.catch(e=>{
			message.reply("**Something went wrong! Either one of these two things may have occurred:**\n+The specified user does not exist or does not have a unique name\n+Something has gone wrong with the sketchy API that Legus is using.\n\nIf you are having troubles and you know for a fact that the player you're trying to look up is real, please go bug Legus.");
		});
	}
};

global.equipment = {
    sword: {
        description: "Sword",
        name: ["Wooden Sword", "Rusty Ironsword", "Troll Blade", "Broadsword", "Longsword", "Carved Bonesword", "Greatsword", "Ghastly Scimitar", "Nullfire Sword", "Knight's Greatsword", "King's Glaive", "Void Blade", "Zerstörer", "Hearteater", "Demonedge", "Excalibur", "Harbinger"],
        lvl: [1, 3, 9, 15, 21, 28, 34, 40, 46, 52, 58, 64, 70, 76, 82, 88, 94],
        class: ["warrior"],
        stats: {
            mindmg: {
                base: 3,
                multi: .7,
                low: .6,
                high: .9
            },
            maxdmg: {
                base: 5,
                multi: .8,
                low: 1.1,
                high: 1.2
            },
            crit: {
                base: 2,
                multi: .12,
                low: .8,
                high: 1,
                float: !0
            }
        }
    },
    staff: {
        description: "Staff",
        name: ["Broken Twig", "Cracked Stick", "Gnarled Broomstick", "Oak Stave", "Mystic Wand", "Bone Stave", "Encrusted Rod", "Imbued Staff", "Emerald Staff", "Sapphire Staff", "Frozen Greatstaff", "Infernal Staff", "Hellfire Greatstaff", "Staff of Angelness", "Crystal Core", "Witch's Heart", "Deathweaver"],
        class: ["mage"],
        lvl: [1, 4, 10, 16, 22, 29, 35, 41, 47, 53, 59, 65, 71, 77, 83, 89, 95],
        stats: {
            mindmg: {
                base: 2,
                multi: .9,
                low: .6,
                high: .9
            },
            maxdmg: {
                base: 3,
                multi: 1.1,
                low: 1.1,
                high: 1.2
            },
            crit: {
                base: 2,
                multi: .1,
                low: .8,
                high: 1,
                float: !0
            },
            mp: {
                base: 5,
                multi: .8,
                low: .8,
                high: 1
            },
            mpreg: {
                base: .5,
                multi: .05,
                low: .8,
                high: 1,
                float: !0
            }
        }
    },
    hammer: {
        description: "Hammer",
        name: ["Splintered Club", "Wooden Mallet", "Rusty Flail", "Orcish Bludgeon", "Heavy Mace", "Iron Basher", "Darkmetal Maul", "Divine Gavel", "Hallowed Hammer", "Dwarfen Maul", "Coldforged Gavel", "Amboss", "Skullshatterer", "Benevolence", "Hammer of Gaia", "Worldender", "Nightmare"],
        class: ["shaman"],
        lvl: [1, 5, 11, 17, 23, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96], //19
        stats: {
            mindmg: {
                base: 1,
                multi: .6,
                low: .6,
                high: 1
            },
            maxdmg: {
                base: 4,
                multi: .8,
                low: .7,
                high: 1
            },
            mpreg: {
                base: 1,
                multi: .05,
                low: .8,
                high: 1,
                float: !0
            }
        }
    },
    bow: {
        description: "Bow",
        name: ["Driftwood Shortbow", "Novice Shortbow", "Curved Shortbow", "Adventurer's Shortbow", "Long Bow", "Bone Bow", "Elven Bow", "Ancient Bow", "Iron Piercer", "Silver Recurve", "Assassin's Bow", "Skyfire Warbow", "Hellfire Warbow", "Widowmaker", "Stormsong", "Scarebow", "Fury"],
        class: ["archer"],
        lvl: [1, 6, 12, 18, 24, 31, 37, 43, 49, 55, 61, 67, 73, 79, 85, 91, 97],
        stats: {
            mindmg: {
                base: 1,
                multi: .7,
                low: .7,
                high: 1
            },
            maxdmg: {
                base: 3,
                multi: .9,
                low: 1,
                high: 1.1
            },
            crit: {
                base: 3,
                multi: .15,
                low: .6,
                high: 1,
                float: !0
            }
        }
    },
    "chest armor": {
        description: "Chest armor",
        name: ["Potato Sack", "Faded Garment", "Adventurer's Tunic", "Quilted Leather", "Scaled Chestguard", "Sky Cloak", "Shadow Cloak", "Obsidian Cloak", "Hellfire Cloak", "Soulkeeper", "Deathless"],
        lvl: [1, 9, 18, 27, 36, 45, 56, 65, 74, 83],
        url:"armor",
        stats: {
            def: {
                base: 5,
                multi: .9,
                low: .6,
                high: 1
            },
            hp: {
                base: 10,
                multi: 1.2,
                low: .6,
                high: 1
            },
            hpreg: {
                base: .5,
                multi: .05,
                low: .3,
                high: 1,
                float: !0
            }
        }
    },
    gloves: {
        description: "Gloves",
        name: ["Hand Wraps", "Cloth Mitts", "Leather Gloves", "Bone Grips", "Iron Gauntlets", "Imbued Gloves", "Wartorn Mitts", "Fiery Handguards", "Gloves of Empowerment", "Coldforged Fists", "Eternal Gauntlets", "Gloves of Midas", "Titan's Mitts"],
        lvl: [1, 8, 17, 26, 35, 44, 55, 64, 73, 82],
        url:"glove",
        stats: {
            crit: {
                base: .2,
                multi: .05,
                low: .2,
                high: 1,
                float: !0
            },
            def: {
                base: 2,
                multi: .3,
                low: .5,
                high: 1
            },
            hp: {
                base: 3,
                multi: .4,
                low: .5,
                high: 1
            }
        }
    },
    armlet: {
        description: "Armlet",
        name: ["Simple Bracelet", "Makeshift Brace", "Leather Armlet", "Ivory Bracelet", "Iron Vambrace", "Imbued Bracers", "Ember Cuffs", "Mirrored Armlet", "Golem Fragment", "Coldforged Bracer", "Blackstar Gem", "Eternal Vambraces", "Lost Guardian"],
        lvl: [1, 7, 16, 25, 34, 43, 54, 63, 72, 81],
        stats: {
            def: {
                base: 2,
                multi: .4,
                low: .5,
                high: 1
            },
            hp: {
                base: 3,
                multi: .3,
                low: .5,
                high: 1
            },
            mp: {
                base: 5,
                multi: 1,
                low: .5,
                high: 1
            },
            mpreg: {
                base: .2,
                multi: .05,
                low: .5,
                high: 1,
                float: !0
            }
        }
    },
    boots: {
        description: "Boots",
        name: ["Sandals", "Cloth Footpads", "Leather Boots", "Bone Greaves", "Scaled Treads", "Patterned Greaves", "Wartorn Boots", "Imbued Treads", "Skyswift Boots", "Coldforged Greaves", "Cloudrunner Treads", "Boots of Hermes", "Starshard Greaves"],
        lvl: [1, 6, 15, 24, 33, 42, 53, 62, 71, 80],
        url:"boot",
        stats: {
            def: {
                base: 2,
                multi: .3,
                low: .5,
                high: 1
            },
            hp: {
                base: 3,
                multi: .3,
                low: .5,
                high: 1
            },
            move: {
                base: .1,
                multi: .02,
                low: .5,
                high: 1,
                float: !0
            }
        }
    },
    ring: {
        description: "Ring",
        name: ["Woven Band", "Ironbark Circlet", "Brass Ringlet", "Hollowed Bone", "Elven Band", "Imbued Circlet", "Arcane Ring", "Emerald Band", "Infernal Ring", "Ancient Talisman"],
        lvl: [1, 5, 14, 23, 32, 41, 52, 61, 70, 79],
        stats: {
            hpreg: {
                base: .1,
                multi: .05,
                low: .2,
                high: 1,
                float: !0
            },
            mpreg: {
                base: .1,
                multi: .05,
                low: .2,
                high: 1,
                float: !0
            }
        }
    },
    bag: {
        description: "Bag",
        name: ["Linen Pouch", "Adventurer's Rucksack", "Purpur Duffel", "Elven Saddlebag", "Moss Enigma"],
        lvl: [15, 31, 46, 61, 82],
        stats: {
            slots: {
                multi: .5,
                low: .8,
                high: 1
            }
        }
    },
    quiver: {
        description: "Quiver",
        name: ["Linen Quiver", "Reinforced Quiver", "Last Reserves", "Lotharien", "Snake Quiver"],
        class: ["archer"],
        lvl: [5, 25, 45, 65, 85],
        stats: {
            crit: {
                base: .5,
                multi: .08,
                low: .5,
                high: 1,
                float: !0
            },
            move: {
                base: .1,
                multi: .03,
                low: .5,
                high: 1,
                float: !0
            }
        }
    },
    shield: {
        description: "Shield",
        name: ["Wooden Shield", "Buckler", "Old Bulwark", "Metal Guard", "Protecteron"],
        class: ["shaman", "warrior"],
        lvl: [2, 13, 33, 63, 88],
        stats: {
            def: {
                base: 15,
                multi: 1.2,
                low: .5,
                high: 1
            },
            hp: {
                base: 8,
                multi: .4,
                low: .5,
                high: 1
            },
            hpreg: {
                base: .1,
                multi: .05,
                low: .5,
                high: 1,
                float: !0
            }
        }
    },
    talisman: {
        description: "Talisman",
        name: ["Smelly Talisman", "Guided Talisman", "Ocean Talisman", "Qui'ton", "Dimension Talisman"],
        class: ["mage"],
        lvl: [7, 27, 47, 67, 87],
        stats: {
            mp: {
                base: 3,
                multi: 1.2,
                low: .5,
                high: 1
            },
            mpreg: {
                base: .1,
                multi: .1,
                low: .5,
                high: 1,
                float: !0
            }
        }
    }
}
