// Botの起動周り

import { Client, GatewayIntentBits } from 'discord.js'
import listenCommands from './command'
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
})

client.login(process.env.BOT_TOKEN)

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)

  listenCommands(client)
})

// import { generateDependencyReport } from '@discordjs/voice'

// console.log(generateDependencyReport())
