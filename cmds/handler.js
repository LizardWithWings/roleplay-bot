//handler.js
//Main handler for exporting commands for use in the main bot script.

exports.makechar = require("./makeCharacter.js").cmd
exports.editchar = require("./editCharacter.js").cmd
exports.deletechar = require("./deleteCharacter.js").cmd

exports.test = require("./test.js").cmd