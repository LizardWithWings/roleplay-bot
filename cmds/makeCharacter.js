//Make Character Command
//Command used to create characters in the DB.

require("dotenv").config()
const { MongoClient } = require("mongodb")
const reply = require("./replyHandler.js")
var mongoClient
var bioDB

//MongoDB Connection Function
async function connectToDB(closeConnection, interaction)  {
    if (closeConnection == true) {
        await mongoClient.close()
        reply.mongoDisconnect(interaction.user.tag, interaction.user.id, interaction.guild.name, interaction.guild.id)
        return
    }

    try {
        mongoClient = new MongoClient(process.env.MONGO_URI)
        await mongoClient.connect()
        bioDB = mongoClient.db("rpBios").collection("savedBios")
        reply.mongoConnect(interaction.user.tag, interaction.user.id, interaction.guild.name, interaction.guild.id)\n------------------------------")
    } catch(err) {
      interaction.reply("A mongo error has occured. Please send this to Bloxxer:\n```js\n`"+err+"\n```")
        reply.mongoError(interaction.user.tag, interaction.user.id, interaction.guild.name, interaction.guild.id, err)
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
        },
        {
            name: "description",
            description: "The description of the character.",
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
        if (await bioDB.findOne({name: iname, ownerId: interaction.user.id}) !== null) {
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