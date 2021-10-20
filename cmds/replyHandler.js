//replyHandler.js
//The script that handles replying to slash commands.
//Also handles some console output.

const { MessageEmbed } = require("discord.js")
const errorColor = "#ff0000"
const successColor = "#00ff00"

//Function to make footer text cuz im lazy
function footerText(user) {
  return "Command ran by "+user+" | Bot made by Bloxxer#8729"
}

//Mongo disconnect log
const mongoDisconnect = (user, userid, guild, guildid) => {
  console.log("------------------------------\nDisconnected from Mongo:\n>>user.tag: "+user+" ("+userid+")\n>>Guild: "+guild+" ("+guildid+")\n------------------------------")
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
const mongoErrorReply = (user, err) => {
  return new MessageEmbed()
    .setTitle("A MongoDB Error Occured!")
    .setDescription("Please send this to Bloxxer#8729:\n```js\n"+err+"\n```")
    .setColor(errorColor)
    .setFooter(footerText(user.tag), user.avatarURL({dynamic: true}))
} 

//Character Already Exists
const characterExists = (charName, user) => {
  return new MessageEmbed()
    .setTitle("Character Already Exists!")
    .setDescription("The character named **"+charName+"** already exists! Try ``editcharacter`` instead.")
    .setColor(errorColor)
    .setFooter(footerText(user.tag), user.avatarURL({dynamic: true}))
}

//Character Doesnt Exist
const characterDoesntExist = (charName, user) => {
  return new MessageEmbed()
    .setTitle("Character Doesn't Exist!")
    .setDescription("Could not find the character named **"+charName+"** in the bot's database. Please make a character with this name first. If you believe this is a glitch/error, please contact Bloxxer#8729.")
    .setColor(errorColor)
    .setFooter(footerText(user.tag), user.avatarURL({dynamic: true}))
}


//Successfully Created Character
const characterCreated = (charName, user) => {
return new MessageEmbed()
    .setTitle("Character Successfully Created!")
    .setDescription("Your character **"+charName+"** has been successfully saved in the database.")
    .setColor(successColor)
    .setFooter(footerText(user.tag), user.avatarURL({dynamic: true}))
}

//Error in Creating Character
const characterCreateError = (charName, user, err) => {
  return new MessageEmbed()
    .setTitle("Character Creation Error!")
    .setDescription("An error has occured trying to create the character named **"+charName+"**. Please send this error to Bloxxer#8729:\n```js\n"+err+"\n```")
    .setColor(errorColor)
    .setFooter(footerText(user.tag), user.avatarURL({dynamic: true}))
}

//Successfully Modified Character
const characterModified = (charName, user) => {
  return new MessageEmbed()
    .setTitle("Character Successfully Modified!")
    .setDescription("Your character **"+charName+"** has been successfuly updated!")
    .setColor(successColor)
    .setFooter(footerText(user.tag), user.avatarURL({dynamic: true}))
}

//Error in Modifying Character
const characterModifyError = (charName, user, err) => {
  return new MessageEmbed()
    .setTitle("Character Modification Error!")
    .setDescription("An error has occured trying to modify the character named **"+charName+"**. Please send this error to Bloxxer#8729:\n```js\n"+err+"\n```")
    .setColor(errorColor)
    .setFooter(footerText(user.tag), user.avatarURL({dynamic: true}))
}

//Successfully Deleted Character
const characterDeleted = (charName, user) => {
  return new MessageEmbed()
    .setTitle("Character Successfuly Deleted!")
    .setDescription("Your character **"+charName+"** was successfully removed from the database.")
    .setColor(successColor)
    .setFooter(footerText(user.tag), user.avatarURL({dynamic: true}))
}

//Error in Deleting Character
const characterDeleteError = (charName, user, err) => {
  return new MessageEmbed()
    .setTitle("Character Deletion Error!")
    .setDescription("There was an errror whole trying to delete your character named **"+charName+"**. Please send this error to Bloxxer#8729:\n```js\n"+err+"\n```")
    .setColor(errorColor)
    .setFooter(footerText(user.tag), user.avatarURL({dynamic: true}))
}

//Exporting functions
exports.mongoDisconnect = mongoDisconnect
exports.mongoConnect = mongoConnect
exports.mongoError = mongoError
exports.mongoErrorReply = mongoErrorReply
exports.characterExists = characterExists
exports.characterDoesntExist = characterDoesntExist
exports.characterCreated = characterCreated
exports.characterCreateError = characterCreateError
exports.characterModified = characterModified
exports.characterModifyError = characterModifyError
exports.characterDeleted = characterDeleted
exports.characterDeleteError = characterDeleteError