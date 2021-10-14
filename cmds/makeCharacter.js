//Make Character Command
//Command used to create characters in the DB.

require("dotenv").config()
const { MongoClient } = require("mongodb")
var mongoClient
var bioDB

//MongoDB Connection Function
const connectToDB = async (closeConnection) => {
    if (closeConnection == true) {
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
        bioDB = mongoClient.db("rpBios").collection("savedBios")
        
        //Finding possible existing files with the same name
        if (await bioDB.findOne({name: iname}) !== null) {
           interaction.reply("Failed: A existing character with the name **"+iname+"** already exists.")
            connectToDB(true)
            return 
        }
            
        

        //Creating a new file
        try {
            await bioDB.insertOne({
                name: interaction.options.getString("name"),
                ownerId: interaction.member.user.id
            })
        } catch(err) {
            interaction.reply("Failed to create document! Please show this error to Bloxxer:\n"+err)
            connectToDB(false)
            return
        }
        interaction.reply("Success!")
        connectToDB(false)
        console.log("Connection to MongoDB closed.")
    }
}

exports.cmd = createCharacter