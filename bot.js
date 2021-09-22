require("dotenv").config()
const slasho = require("discord-slasho")
const { MongoClient } = require("mongodb")
const { CommandInteraction } = require("discord.js")
var mongoClient
const bioDB = mongoClient.db("rpBios").collection("savedBios")

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
        mongoClient = new MongoClient("mongodb+srv://bot:bloxxer102@cluster0.22mjy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
        await mongoClient.connect()
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
            name: "Character Name",
            description: "Enter the name of the character you want to update",
            type: "STRING",
            required: true
        },
        {
            name: "New Character Name",
            description: "Enter the new name for the character here. Leave blank to keep existing one.",
            type: "STRING",
            required: true
        },
        {
            name: "New Character Description",
            description: "Change the characters description. Leave blank to keep existing one.",
            type: "STRING",
            required: true
        }
    ],

    async execute({interaction}) {
        const characterName = interaction.options.getString("Character Name")
        var newCharName = interaction.options.getString("New Character Name")
        var newCharDesc = interaction.options.getString("New Character Description")

        await connectToDB()

        //Detecting if a file with the character name exists
        if (bioDB.findOne({name: characterName}) == null) {
            interaction.reply("Failed! Character \""+characterName+"\" does not exist in the database.")
            return
        }

        //Update variables if no input was given
        if (newCharName == null) {
            newCharName = false
        }
        if (newCharDesc == null) {
            bioDB.findOne({name: characterName}).name
        }

        //Appending character file on MongoDB
        bioDB.findAndModify({
            query: {name: characterName},
            update: {name:}

        })
    }
}

const bot = new slasho.App({
    token: "NzYzNTQ5NDc2MDM5NTU3MTIx.X35U3Q.YoN56TMebCGv23ppCEvpqGkdiyk",
    devGuild: "714337883116535868",
    intents: ["GUILDS"],
    commands: [createCharacter]
})

bot.launch().then(() => {
    if (launchToPublic) {
        bot.production()
    } else {
        bot.dev()
    }
})