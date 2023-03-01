import { EmbedBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction } from 'discord.js'

const helpCommand = (interaction: ChatInputCommandInteraction) => {
  interaction.reply({ embeds: [helpEmbed], ephemeral: true })
}

// TODO: 改行の書き方なんとかしたい

const helpEmbed = new EmbedBuilder()
  .setColor(0xffffff)
  .setTitle('Usage - 使い方')
  .addFields({
    name: '/music help',
    value: '\nこのBotの使い方を表示します',
  })
  .addFields({
    name: '\n',
    value: '\n',
  })
  .addFields({
    name: '/music status',
    value: '\n現在のBotの状態を表示します',
  })
  .addFields({
    name: '\n',
    value: '\n',
  })
  .addFields({
    name: '/music play `[検索キーワード] または [youtubeのURL]`',
    value:
      '\n指定したキーワードのYoutubeの検索結果、またはプレイリストの音楽を再生します。',
  })
  .addFields({
    name: '\n',
    value: '\n',
  })
  .addFields({
    name: '/music stop',
    value: '\n音楽の再生を停止します。',
  })
  .addFields({
    name: '\n',
    value: '\n',
  })
  .addFields({
    name: '/music kick',
    value: '\nボイスチャンネルから退出します。',
  })

export default helpCommand
