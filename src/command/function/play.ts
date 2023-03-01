import {
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
} from '@discordjs/voice'
import { ChatInputCommandInteraction, GuildMember } from 'discord.js'
import ytdl from 'ytdl-core'
import ytsr, { Video } from 'ytsr'

const playCommand = async (interaction: ChatInputCommandInteraction) => {
  const sender = interaction.member as GuildMember
  if (!sender.voice) return

  const query = interaction.options.getString('query') || ''
  const video = query ? await findVideo(query) : null

  video
    ? playMusic(interaction, video, sender)
    : interaction.reply('該当する動画がありませんでした。')
}

const findVideo = async (keyword: string) => {
  const filter = await ytsr.getFilters(keyword)
  const resultUrl = filter.get('Type')?.get('Video')?.url

  if (!resultUrl) return null

  const totalResult = await ytsr(resultUrl, { hl: 'ja', limit: 1 })

  const sanitizedResult = (totalResult.items[0] as unknown) as Video
  return sanitizedResult.url
}

const playMusic = async (
  interaction: ChatInputCommandInteraction,
  videoUrl: string,
  sender: GuildMember
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
  })

  player.on('subscribe', () => {
    interaction.reply('再生します！')
  })

  player.on('error', (error) => {
    console.error(`Error: ${error.message}`)
  })

  connection.subscribe(player)

  const readableAudio = ytdl(videoUrl, {
    filter: 'audioonly',
    quality: 'highestaudio',
    highWaterMark: 32 * 1024 * 1024,
  })

  const resource = createAudioResource(readableAudio, {
    inlineVolume: true,
  })

  resource.volume?.setVolume(0.08)

  player.play(resource)
}

export default playCommand
