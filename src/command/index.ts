// コマンドのリスナー

import { Client } from 'discord.js'
import { help, play, status } from './function'

const listenCommands = (client: Client) => {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    switch (interaction.options.getSubcommand()) {
      case 'status':
        status(interaction)
        break

      case 'help':
        help(interaction)
        break

      case 'play':
        play(interaction)
        break

      default:
        interaction.reply({
          ephemeral: true,
          content: 'このコマンドは存在しないか、開発中です。',
        })
    }
  })
}

export default listenCommands
