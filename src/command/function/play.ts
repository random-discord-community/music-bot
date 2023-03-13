import fs from 'fs'

import {
  createAudioPlayer,
  createAudioResource,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
} from '@discordjs/voice'
import {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  GuildMember,
} from 'discord.js'
import ytdl from 'ytdl-core'
import ytsr, { Video } from 'ytsr'

const playCommand = async (interaction: ChatInputCommandInteraction) => {
  const sender = interaction.member as GuildMember

  if (!sender.voice.channelId) {
    interaction.reply({
      ephemeral: true,
      content: 'まずボイスチャンネルに接続してください。',
    })
    return
  }

  const query = interaction.options.getString('query') || ''
  const video = query && (await findVideo(query))

  if (!video) {
    interaction.reply('該当する動画がありませんでした。')
    return
  }

  // console.log(video.url)

  const videoEmbed = createVideoEmbed(video, interaction.client, sender)

  playMusic(interaction, video, sender, videoEmbed)
}

const findVideo = async (keyword: string) => {
  const filter = await ytsr.getFilters(keyword)
  const resultUrl = filter.get('Type')?.get('Video')?.url

  if (!resultUrl) return null

  const filteredResult = await ytsr(resultUrl, { hl: 'ja', limit: 5 })

  const totalResult = filteredResult.items as Video[]

  return totalResult.filter((video) => video.duration)[0]
}

const playMusic = async (
  interaction: ChatInputCommandInteraction,
  video: Video,
  sender: GuildMember,
  videoEmbed: EmbedBuilder
) => {
  if (!interaction.guildId || !interaction.guild?.voiceAdapterCreator) return

  const connection =
    getVoiceConnection(interaction.guildId) ||
    joinVoiceChannel({
      channelId: sender.voice.channelId || '',
      guildId: interaction.guildId,
      adapterCreator: interaction.guild?.voiceAdapterCreator,
    })

  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
    debug: true,
  })

  connection.subscribe(player)

  const readableAudio = ytdl(video.url, {
    filter: 'audioonly',
    quality: 'highestaudio',
    highWaterMark: 32 * 1024 * 1024,
  })

  ytdl(video.url, {
    filter: 'audioonly',
    quality: 'highestaudio',
    highWaterMark: 32 * 1024 * 1024,
  }).pipe(fs.createWriteStream('video.mp4'))

  const resource = createAudioResource(readableAudio, {
    inlineVolume: true,
  })

  resource.volume?.setVolume(0.08)

  connection.on(VoiceConnectionStatus.Disconnected, async () => {
    try {
      await Promise.race([
        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
      ])
    } catch (error) {
      connection.destroy()
    }
  })

  player.on('subscribe', () => {
    interaction.reply({ embeds: [videoEmbed] })
  })

  player.on('error', (error) => {
    console.error(`Play error: ${error.message}`)
  })

  connection.on('error', (error) => {
    console.error(`Connection error: ${error.message}`)
  })

  // player.on('stateChange', (state) => {
  //   console.log(`player: ${state.status}`)
  // })

  // connection.on('stateChange', (state) =>
  //   console.log(`connection: ${state.status}`)
  // )

  player.play(resource)
}

const createVideoEmbed = (
  video: Video,
  client: Client,
  sender: GuildMember
) => {
  return new EmbedBuilder()
    .setColor(0xffffff)
    .setTitle(`Now playing: ${video.title}`)
    .setURL(video.url)
    .setAuthor({
      name: client.user?.username || '',
      iconURL: client.user?.avatarURL() || '',
    })
    .setImage(video.bestThumbnail.url)
    .setFooter({
      text: `${video.duration} Queued by: ${sender.nickname}` || '',
    })
}

export default playCommand
