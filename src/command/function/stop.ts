import { getVoiceConnection } from '@discordjs/voice'
import { ChatInputCommandInteraction } from 'discord.js'

const stopCommand = (interaction: ChatInputCommandInteraction) => {
  const connection = getVoiceConnection(interaction.guildId || '')

  if (!connection) {
    interaction.reply({
      ephemeral: true,
      content: '音声が再生されていません。',
    })

    return
  }

  connection.destroy()
  interaction.reply('音声を停止しました。')
}

export default stopCommand
