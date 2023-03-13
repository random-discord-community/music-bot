import { EmbedBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction } from 'discord.js'

const helpCommand = (interaction: ChatInputCommandInteraction) => {
  interaction.reply({ embeds: [helpEmbed], ephemeral: true })
}

const helpEmbed = new EmbedBuilder()
  .setColor(0xffffff)
  .setTitle('Conductor - 音響ボット')
  .setImage(
    'https://media.discordapp.net/attachments/748794967232610315/1084768018820771871/Conductor.png?width=1920&height=560'
  )
  .addFields(
    {
      name: '/music help',
      value: 'このBotの使い方を表示します',
    },
    { name: '\u200B', value: '\n' },
    {
      name: '/music play `[検索キーワード] または [youtubeのURL]`',
      value:
        '指定したキーワードのYoutubeの検索結果、またはプレイリストの音楽を再生します。',
    },
    { name: '\u200B', value: '\n' },
    {
      name: '/music stop',
      value: '音楽の再生を停止します。',
    }
  )

export default helpCommand
