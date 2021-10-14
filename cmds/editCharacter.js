//Character Edit Command
//Command used to modify character data.

require("dotenv").config()
const { MongoClient } = require("mongodb")
var mongoClient
var bioDB

//MongoDB Connection Function
async function connectToDB(closeConnection) {
    if (closeConnection) {
        await mongoClient.close()
        console.log("Disconnected from MongoDB.")
        return
    }

    try {
        mongoClient = new MongoClient(process.env.MONGO_URI)
        await mongoClient.connect()
        bioDB = mongoClient.db("rpBios").collection("savedBios")
        console.log("Connected to MongoDB")
    } catch(err) {
        console.warn("FAILED TO CONNECT TO MONGO:\n"+err)
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

        await connectToDB()

        //Detecting if a file with the character name exists
        if (await bioDB.findOne({name: characterName}) == null) {
            interaction.reply("Failed! Character \""+characterName+"\" does not exist in the database.")
            return
        }

        //Update variables if no input was given
        if (newCharName == null) {
            await bioDB.findOne({name: characterName}).name
        }
        if (newCharDesc == null) {
            await bioDB.findOne({name: characterName}).description
        }

        //Appending character file on MongoDB
        try {
            await bioDB.findAndModify({
                query: {name: characterName},
                update: {name: newCharName, description: newCharDesc}
            })
            interaction.reply("Success!")
            connectToDB(true)
        } catch(err) {
            interaction.reply("Failed! Send this error message to Bloxxer:\n"+err)
            connectToDB(true)
            return
        }
    }
}

exports.cmd = editCharacter