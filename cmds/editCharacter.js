//Character Edit Command
//Command used to modify character data.

require("dotenv").config()
const { MongoClient } = require("mongodb")
var mongoClient
var bioDB

//MongoDB Connection Function
async function connectToDB(closeConnection, interaction)  {
    if (closeConnection == true) {
        await mongoClient.close()
        console.log("------------------------------\nDisconnected from Mongo:\n>>User: "+interaction.user.tag+" ("+interaction.user.id+")\n>>Guild: "+interaction.guild.name+" ("+interaction.guild.id+")\n------------------------------")
        return
    }

    try {
        mongoClient = new MongoClient(process.env.MONGO_URI)
        await mongoClient.connect()
        bioDB = mongoClient.db("rpBios").collection("savedBios")
        console.log("------------------------------\nConnected to Mongo:\n>>User: "+interaction.user.tag+" ("+interaction.user.id+")\n>>Guild: "+interaction.guild.name+" ("+interaction.guild.id+")\n------------------------------")
    } catch(err) {
      interaction.reply("A mongo error has occured. Please send this to Bloxxer:\n```js\n`"+err+"\n```")
        console.warn("------------------------------\nMongo Error:\n>>User: "+interaction.user.tag+" ("+interaction.user.id+")\n>>Guild: "+interaction.guild.name+" ("+interaction.guild.id+")\n>>Error: "+err+"\n------------------------------")
    }
}

const editCharacter = {
    type: "slash", 
    name: "editcharacter",
    description: "Edit one of your characters!",
    options: [
        {
            name: "char_name",
            description: "Enter the name of the character you want to update",
            type: "STRING",
            required: true
        },
        {
            name: "new_char_name",
            description: "Enter the new name for the character here. Leave blank to keep existing one.",
            type: "STRING",
            required: false
        },
        {
            name: "new_char_desc",
            description: "Change the characters description. Leave blank to keep existing one.",
            type: "STRING",
            required: false
        }
    ],

    async execute({interaction}) {
        const characterName = interaction.options.getString("char_name")
        var newCharName = interaction.options.getString("new_char_name")
        var newCharDesc = interaction.options.getString("new_char_desc")

        await connectToDB(false, interaction)

        //Detecting if a file with the character name exists
        if (await bioDB.findOne({name: characterName, ownerId: interaction.user.id}) == null) {
            interaction.reply("Failed! Character \""+characterName+"\" does not exist in the database.")
            connectToDB(true, interaction)
            return
        }

        //Update variables if no input was given
        if (newCharName == null) {
            await bioDB.findOne({name: characterName, ownerId: interaction.user.id}).name
        }
        if (newCharDesc == null) {
            await bioDB.findOne({name: characterName, ownerId: interaction.user.id}).description
        }

        //Appending character file on MongoDB
        try {
            await bioDB.findOneAndUpdate(
              {name: characterName, ownerId: interaction.user.id,},
              {name: newCharName, description: newCharDesc}
            )
            interaction.reply("Success!")
            connectToDB(true, interaction)
        } catch(err) {
            interaction.reply("Failed! Send this error message to Bloxxer:\n```js\n"+err+"\n```")
            connectToDB(true, interaction)
            return
        }
    }
}

exports.cmd = editCharacter