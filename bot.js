require("dotenv").config()
const slasho = require("discord-slasho")
const { MongoClient } = require("mongodb")
const { CommandInteraction } = require("discord.js")
var mongoClient

//SET TO FALSE TO ENABLE DEV MODE - Bloxxer Dumbass Countermeasure 1
const launchToPublic = false

async function connectToDB() {
    try {
        mongoClient = new MongoClient("mongodb+srv://bot:bloxxer102@cluster0.22mjy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
        await mongoClient.connect()
        console.log("Connected to MongoDB")
    } catch(err) {
        console.warn("FAILED TO CONNECT TO MONGO:\n"+err)
    }
}

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
        try {
            await mongoClient.db("rpBios").collection("savedBios").findOne({name: iname})
            interaction.reply("Failed: A existing character with the name **"+iname+"** already exists.")
            mongoClient.close()
            console.log("Connection to MongoDB closed.")
            return
        } catch {}

        //Creating a new file
        try {
            await mongoClient.db("rpBios").collection("savedBios").insertOne({
                name: interaction.options.getString("name")
            })
        } catch(err) {
            interaction.reply("Failed to create document! Please show this error to Bloxxer:\n"+err)
        }
        interaction.reply("Success!")
        mongoClient.close()
        console.log("Connection to MongoDB closed.")
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