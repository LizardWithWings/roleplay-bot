require("dotenv").config()
const slasho = require("discord-slasho")
const { CommandInteraction } = require("discord.js")
var token

//Command Handler Script
const cmds = require("./cmds/handler.js")

//SET TO FALSE TO ENABLE DEV MODE - Bloxxer Dumbass Countermeasure 1
const launchToPublic = true

//Setting which token to launch from.
if (launchToPublic) {
  console.warn("LAUNCHING IN PUBLIC MODE")
  token = process.env.DISCORD_TOKEN
} else {
  console.warn("LAUNCHING IN DEV MODE")
  token = process.env.DISCORD_TOKEN_DEV
}


const bot = new slasho.App({
    token: token,
    devGuild: "714337883116535868",
    intents: ["GUILDS"],
    commands: [
      cmds.makechar, 
      cmds.editchar, 
      cmds.deletechar,
      cmds.viewchar,
      cmds.listchars,
      cmds.info,
      //cmds.test
      ]
})

bot.launch().then(() => {
    if (launchToPublic) {
        bot.production()
    } else {
        bot.dev()
    }
})