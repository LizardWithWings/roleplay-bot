//Test Command
//Version v1.0.0

const test = {
    type: "slash",
    name: "testcmd",
    description: "Test Command! :D",

    async execute({interaction}) {
        interaction.reply("Hello WOrld")
    }
}

exports.test = test