//replyHandler.js
//The script that handles replying to slash commands.
//Also handles some console output.

const { MessageEmbed } = require("discord.js")
const errorColor = "#ff0000"
const successColor = "#00ff00"

//Mongo disconnect log
const mongoDisconnect = (user, userid, guild, guildid) => {
  console.log("------------------------------\nDisconnected from Mongo:\n>>User: "+user+" ("+userid+")\n>>Guild: "+guild+" ("+guildid+")\n------------------------------")
}

//Mongo connect log
const mongoConnect = (user, userid, guild, guildid) => {
  console.log("------------------------------\nConnected to Mongo:\n>>User: "+user+" ("+userid+")\n>>Guild: "+guild+" ("+guildid+")\n------------------------------")
}

//Mongo error log
const mongoError = (user, userid, guild, guildid, err) => {
  console.warn("------------------------------\nMongo Error:\n>>User: "+user+" ("+userid+")\n>>Guild: "+guild+" ("+guildid+")\n>>Error: "+err+"\n------------------------------")
}

//Mongo Error Reply
const mongoErrorReply = (err) => {
  return new MessageEmbed()
    .setTitle("A MongoDB Error Occured!")
    .setDescription("Please send this to Bloxxer#8729:\n```\n"+err+"\n```")
    .setColor(errorColor)
} 

//Character Already Exists
const characterExists = (charName, user) => {
  return new MessageEmbed()
    .addTitle("Character Already Exists!")
    .addDescription("The character named **"+charName+"** already exists! Try ``editcharacter`` instead.")
    .setColor(errorColor)
}

//Character Doesnt Exist



//Successfully Created Character

//Error in Creating Character


//Successfully Modified Character

//Error in Modifying Character


//Successfully Deleted Character

//Error in Deleting Character


exports.mongoDisconnect = mongoDisconnect
exports.mongoConnect = mongoConnect
exports.mongoError = mongoError
exports.mongoErrorReply = mongoErrorReply