require("dotenv").config()
const slasho = require("discord-slasho")
const { CommandInteraction } = require("discord.js")

//Command Handler Script
const cmds = require("./cmds/handler.js")

//SET TO FALSE TO ENABLE DEV MODE - Bloxxer Dumbass Countermeasure 1
const launchToPublic = false

const bot = new slasho.App({
    token: process.env.DISCORD_TOKEN,
    devGuild: "714337883116535868",
    intents: ["GUILDS"],
    commands: [cmds.makechar, cmds.editchar]
})

bot.launch().then(() => {
    if (launchToPublic) {
        bot.production()
    } else {
        bot.dev()
    }
})