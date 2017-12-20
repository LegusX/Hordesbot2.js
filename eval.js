const socket = require("socket.io-client")("http://localhost:3456");
const chalk = require("chalk");
const readLineSync = require("readline-sync");

var auth = false;
var input = "You may now evaluate JavaScript.";
socket.on("connect", () => {
    console.clear();
    console.log(chalk.yellow("Authorization Needed:"));
    const pass = readLineSync.question("Token: ", {hideEchoBack: true}).trim();
    socket.emit("auth", pass);

    socket.on("auth", data => {
        if (data === true) {
            console.log(chalk.green("Success!"));
            auth = true;
            socket.emit("eval", "'Eval is functioning properly'");
        } else {
            console.log(chalk.red("Authorization Failed."));
            auth = false;
        }
    });

    socket.on("eval", data => {
        console.log(data);
		socket.emit("eval", readLineSync.prompt());
    });

    socket.on("deny", data => {
        if (data === true) auth = false;
		console.log(chalk.red("Authentication Revoked."));
    });
});