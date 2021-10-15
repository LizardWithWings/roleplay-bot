//Make Character Command
//Command used to create characters in the DB.

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

        await connectToDB(false, interaction)
        bioDB = mongoClient.db("rpBios").collection("savedBios")
        
        //Finding possible existing files with the same name
        if (await bioDB.findOne({name: iname}) !== null) {
           interaction.reply("Failed: A existing character with the name **"+iname+"** already exists.")
            connectToDB(true, interaction)
            return 
        }
            
        

        //Creating a new file
        try {
            await bioDB.insertOne({
                name: interaction.options.getString("name"),
                ownerId: interaction.member.user.id
            })
        } catch(err) {
            interaction.reply("Failed to create document! Please show this error to Bloxxer:\n```js\n`"+err+"```")
            connectToDB(true, interaction)
            return
        }
        interaction.reply("Success!")
        connectToDB(true, interaction)
    }
}

exports.cmd = createCharacter