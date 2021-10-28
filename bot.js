require("dotenv").config()
const slasho = require("discord-slasho")
const { MongoClient } = require("mongodb")
const { CommandInteraction } = require("discord.js")
var mongoClient
var bioDB

//SET TO FALSE TO ENABLE DEV MODE - Bloxxer Dumbass Countermeasure 1
const launchToPublic = false

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

//Character Creation Command
const createCharacter = {
    type: "slash",
    name: "makecharacter",
    description: "Creates a character in the bot's database with a given name.",
    options:[
        {
            name: "name",
            description: "The name to give the character",
            type: "STRING",
            required: true
        }
    ],

    async execute({interaction}) {
        //Interaction name variable
        var iname = interaction.options.getString("name")

        await connectToDB()
        
        //Finding possible existing files with the same name
        if (await mongoClient.db("rpBios").collection("savedBios").findOne({name: iname}) !== null) {
           interaction.reply("Failed: A existing character with the name **"+iname+"** already exists.")
            connectToDB(true)
            return 
        }
            
        

        //Creating a new file
        try {
            await mongoClient.db("rpBios").collection("savedBios").insertOne({
                name: interaction.options.getString("name"),
                ownerId: interaction.member.user.id
            })
        } catch(err) {
            interaction.reply("Failed to create document! Please show this error to Bloxxer:\n"+err)
        }
        interaction.reply("Success!")
        mongoClient.close()
        console.log("Connection to MongoDB closed.")
    }
}

//Character Edit Command
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
        await bioDB

        //Detecting if a file with the character name exists
        if (await bioDB.findOne({name: characterName}) == null) {
            interaction.reply("Failed! Character \""+characterName+"\" does not exist in the database.")
            return
        }

        //Update variables if no input was given
        if (newCharName == null) {
            newCharName = await bioDB.findOne({name: characterName}).name
        }
        if (newCharDesc == null) {
            newCharDesc = await bioDB.findOne({name: characterName}).description
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
            interaction.reply("Failed! Send this error message to bloxxer:\n"+err)
            connectToDB(true)
            return
        }
    }
}

const bot = new slasho.App({
    token: process.env.DISCORD_TOKEN,
    devGuild: "714337883116535868",
    intents: ["GUILDS"],
    commands: [createCharacter, editCharacter]
})

bot.launch().then(() => {
    if (launchToPublic) {
        bot.production()
    } else {
        bot.dev()
    }
})