//replyHandler.js
//The script that handles replying to slash commands.
//Also handles some console output.

const { MessageEmbed } = require("discord.js")
const errorColor = "#ff0000"
const successColor = "#00ff00"

//HELP EMBED
const help = (user) => {
  return new MessageEmbed()
    .setTitle("Help Menu/Command List")
    .setDescription("Welcome to the help menu! This menu shows every command that you can run for this bot.")
    .addField("/createcharacter", "Creates a character with a name and a description.")
    .addField("/editcharacter", "Allows you to edit a characters name, description and/or image.")
    .addField("/deletecharacter", "Deletes a character that has the given name.")
    .addField("/viewcharacter", "Views a character owned by the user given")
    .addField("/listcharacters", "Lists all your character's by names only.")
    .setColor("ffff00")
    .setFooter(footerText(user.tag), user.avatarURL({dynamic: true}))
} 

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
    .setDescription("The character named **"+charName+"** already exists!")
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
    .setDescription("There was an error while trying to delete your character named **"+charName+"**. Please send this error to Bloxxer#8729:\n```js\n"+err+"\n```")
    .setColor(errorColor)
    .setFooter(footerText(user.tag), user.avatarURL({dynamic: true}))
}

//View Character output
const viewCharacter = (charName, charDesc, charImg, color, user) => {
  if (charImg) {
    return new MessageEmbed()
      .setTitle(charName)
      .addField("Description:", charDesc, false)
      .setImage(charImg)
      .setColor(color)
      .setFooter(footerText(user.tag), user.avatarURL({dynamic: true}))
  } else {
    return new MessageEmbed()
      .setTitle(charName)
      .addField("Description:", charDesc, false)
      .setColor(color)
      .setFooter(footerText(user.tag), user.avatarURL({dynamic: true}))
  }
}

//View Character Error
const viewCharacterError = (charName, user, err) => {
  return new MessageEmbed()
    .setTitle("Error in Viewing Character!")
    .setDescription("There was an error while trying to view the character named **"+charName+"**. Please send this error to Bloxxer#8729:\n```js\n"+err+"\n```")
    .setColor(errorColor)
    .setFooter(footerText(user.tag), user.avatarURL({dynamic: true}))
}


//Exporting functions
exports.help = help
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
exports.viewCharacter = viewCharacter
exports.viewCharacterError = viewCharacterError