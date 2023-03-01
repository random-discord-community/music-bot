import { REST, Routes, SlashCommandBuilder } from 'discord.js'

const commands = new SlashCommandBuilder()
  .setName('music')
  .setDescription(
    '音楽を再生できます。\nオプションなしで実行した場合、使い方が表示されます。'
  )
  .addSubcommand((option) => {
    return option
      .setName('help')
      .setDescription(
        'このBotの使い方を表示します。オプションなしで実行した場合もhelpと同じ挙動をします。'
      )
  })
  .addSubcommand((option) => {
    return option
      .setName('status')
      .setDescription('現在のBotの状態を表示します。')
  })
  .addSubcommand((option) => {
    return option
      .setName('play')
      .setDescription(
        '指定したキーワードのYoutubeの検索結果、またはプレイリストの音楽を再生します。'
      )
      .addStringOption((stringOption) => {
        return stringOption
          .setName('query')
          .setDescription(
            '指定されたキーワードもしくはURLを、Youtube上で検索し再生します。'
          )
          .setRequired(true)
      })
  })
  .addSubcommand((option) => {
    return option
      .setName('stop')
      .setDescription('音楽の再生を即座に停止します。')
  })
  .addSubcommand((option) => {
    return option
      .setName('kick')
      .setDescription('Botをボイスチャンネルから即座に退出させます。')
  })

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN || '')

const registerCommands = async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID || ''), {
      body: [commands],
    })

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}

registerCommands()
