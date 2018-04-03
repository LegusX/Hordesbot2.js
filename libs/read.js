const fs = require("fs")

module.exports = {
	readJSON: function(path) {
		return JSON.parse(fs.readFileSync(path));
	},
	writeJSON: function(path, data) {
		fs.writeFileSync(path, JSON.stringify(data));
		return;
	},
	readUser: function(id) {
		return this.readJSON("./data/idledata.json")[id];
	},
	writeUser: function(id, data) {
		var datawrite = this.readJSON("./data/idledata.json");
		datawrite[id] = data;
		this.writeJSON("./data/idledata.json", datawrite);
	},
	userExists: function(id) {
		if (Object.getOwnPropertyNames(this.readJSON("./data/idledata.json")).includes(id)) return true;
		else return false;
	},
}