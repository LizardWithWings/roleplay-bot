//Character Edit Command
//Command used to modify character data.

require("dotenv").config()
const { MongoClient } = require("mongodb")
const reply = require("./replyHandler.js")
var mongoClient
var bioDB

//MongoDB Connection Function
async function connectToDB(closeConnection, interaction)  {
    if (closeConnection == true) {
        await mongoClient.close()

        reply.mongoDisconnect(
          interaction.user.tag, 
          interaction.user.id, 
          interaction.guild.name, 
          interaction.guild.id
        )
        
        return
    }

    try {
        mongoClient = new MongoClient(process.env.MONGO_URI)
        await mongoClient.connect()

        bioDB = mongoClient.db("rpBios").collection("savedBios")

        reply.mongoConnect(
          interaction.user.tag, 
          interaction.user.id, 
          interaction.guild.name, 
          interaction.guild.id
        )
    } catch(err) {
      interaction.reply(
            {
              embeds: 
              [
                reply.mongoErrorReply(interaction.user, err)
              ]
            }
          )

      reply.mongoError(
        interaction.user.tag, 
        interaction.user.id, 
        interaction.guild.name, 
        interaction.guild.id, 
        err
      )
    }
}   

const listCharacters = {
    type: "slash", 
    name: "listcharacters",
    description: "Lists your characters!",

    async execute({interaction}) {
      connectToDB(false, interaction)
      var chars = await bioDB.find(ownerId: interaction.user.id)
      
      if (chars == null) {
        interaction.reply(
          {
            embeds:
            [
              reply.noCharacters(interaction.user)
            ]
          }
        )
        return 
      }

      try {
        interaction.reply(
          {
            embeds: 
            [
              reply.listCharacters(chars, interaction.user)
            ]
          }
        )
      } catch (err) {
        interaction.reply(
          {
            embeds:
            [
              reply.listCharacterError(interaction.user, err)
            ]
          }
        )
      }
}

exports.cmd = listCharacters