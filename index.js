const { KiviPlugin, segment } = require('@kivibot/core')
const { default: axios } = require('axios')
const { nanoid } = require('nanoid')

const plugin = new KiviPlugin('小爱同学', '2.0.0')

const config = {
  // 回复模式，默认文本 text，语音改为 audio，需要配置 ffmpeg
  mode: 'text',
  // 忽略群
  missGroups: [],
  // 私聊是否开启，默认开启
  enablePrivate: true,
  // 强制忽略词
  missWords: ['#', '自爆', '同归于尽'],
  // 是否屏蔽管理员私聊，默认屏蔽（防止消息命令误触）
  ignoreAdmin: true
}

const api = 'https://ai-voice.api.xiaomi.net/aivs/v2.2/text'
const params = { requestId: '', token: '' }

async function fetchReply(text) {
  params.userId = `${nanoid(8)}-${nanoid(4)}-${nanoid(4)}-${nanoid(4)}-${nanoid(8)}`
  const { data } = await axios.post(api, { requestText: text }, { params })
  return data?.directive ?? {}
}

plugin.onMounted(() => {
  plugin.onMessage(async event => {
    const { reply, message_type, sender } = event

    if (config.missWords.some(word => event.toString().search(word) !== -1)) {
      return
    }

    if (message_type === 'private') {
      if (!config.enablePrivate) {
        return
      }

      if (config.ignoreAdmin && plugin.admins.includes(sender.user_id)) {
        return
      }
    } else {
      const isDiscussMiss = config.missGroups.includes(event?.discuss_id)
      const isGroupMiss = config.missGroups.includes(event?.group_id)

      if (isDiscussMiss || isGroupMiss) {
        return
      }
    }

    const rawText = event.toString().replace(/\{.*\}/g, '')
    const { url, displayText } = await fetchReply(rawText)

    const isAudio = config.mode === 'audio'

    if (isAudio) {
      reply(url ? segment.record(url) : '让小爱思考一下')
    } else {
      reply(displayText || '让小爱思考一下')
    }
  })
})

module.exports = plugin
