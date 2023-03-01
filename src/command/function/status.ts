import { ChatInputCommandInteraction } from 'discord.js'

const statusCommand = (interaction: ChatInputCommandInteraction) => {
  interaction.reply(
    'このコマンドは現在開発中です！\nThis command is under development!'
  )
}

export default statusCommand
