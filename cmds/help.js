//Help Command
//Lists all of the bot's commands.
const reply = require("./replyHandler.js")

const help = {
    type: "slash",
    name: "help",
    description: "Shows all of the commands for this bot.",

    async execute({interaction}) {
      interaction.reply(
        {
          embeds:
          [
            reply.help(interaction.user)
          ]
        }
      )
    }
}

exports.cmd = help