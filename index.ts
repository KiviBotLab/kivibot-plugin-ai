import { KiviPlugin, segment } from '@kivibot/core'
import { customAlphabet } from 'nanoid'
import axios from 'axios'

const plugin = new KiviPlugin('小爱同学', '2.1.0')

const config = {
  /** 回复模式，默认文本 text，语音改为 audio，需要配置 ffmpeg */
  mode: 'text',
  /** 忽略群 */
  missGroups: [] as number[],
  /** 私聊是否开启，默认开启 */
  enablePrivate: true,
  /** 强制忽略词，支持正则匹配 */
  missWords: [/^\s*#/, '自爆', '同归于尽'],
  /** 是否屏蔽管理员私聊，默认屏蔽（防止消息命令误触） */
  ignoreAdmin: true
}

const nanoid = customAlphabet('0123456789abcdef', 4)

export async function fetchReply(text: string) {
  const api = 'https://ai-voice.api.xiaomi.net/aivs/v2.2/text'

  const params: Record<string, string> = {
    requestId: '',
    token: '',
    userId: `${nanoid(8)}-${nanoid()}-${nanoid()}-${nanoid()}-${nanoid(8)}`
  }

  const { data } = await axios.post(api, { requestText: text }, { params })

  return data?.directive ?? {}
}

plugin.onMounted(() => {
  plugin.onMessage(async event => {
    const { message_type, sender } = event

    if (config.missWords.some(word => event.toString().search(word) !== -1)) {
      return
    }

    switch (message_type) {
      case 'private': {
        if (!config.enablePrivate) {
          return
        }

        if (config.ignoreAdmin && plugin.admins.includes(sender.user_id)) {
          return
        }

        break
      }

      case 'discuss': {
        const isDiscussMiss = config.missGroups.includes(event.discuss_id)

        if (isDiscussMiss || !event.atme) {
          return
        }

        break
      }

      case 'group': {
        const isDiscussMiss = config.missGroups.includes(event.group_id)

        if (isDiscussMiss || !event.atme) {
          return
        }

        break
      }

      default:
        break
    }

    const rawText = event
      .toString()
      .replace(/\{.*\}/g, '')
      .trim()

    const isAudio = config.mode === 'audio'

    try {
      const { url, displayText } = await fetchReply(rawText)

      if (isAudio) {
        event.reply(url ? segment.record(url) : '让小爱思考一下')
      } else {
        event.reply(displayText || '让小爱思考一下')
      }
    } catch (e) {
      console.error(e)
    }
  })
})

export default plugin
