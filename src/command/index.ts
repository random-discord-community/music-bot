// コマンドのリスナー

import { Client } from 'discord.js'
import { help, play, stop } from './function'

const listenCommands = (client: Client) => {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    switch (interaction.options.getSubcommand()) {
      case 'help':
        help(interaction)
        break

      case 'play':
        play(interaction)
        break

      case 'stop':
        stop(interaction)
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
