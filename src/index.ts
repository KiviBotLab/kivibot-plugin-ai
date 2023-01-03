import { KiviPlugin, segment, randomInt, wait } from '@kivibot/core'

import { fetchReply } from './fetchReply'

const { version } = require('../package.json')
const plugin = new KiviPlugin('小爱同学', version)

/** 默认配置，实际执行时会被插件数据目录的配置覆盖 */
const config = {
  /** 回复模式，默认文本 text，语音改为 audio，语音需要配置 ffmpeg */
  mode: 'text',
  /** 触发词列表，仅群聊生效 */
  words: ['小爱'] as string[],
  /** 是否开启艾特触发，默认开启，仅群聊生效 */
  enableAt: true,
  /** 私聊是否开启，默认开启，开启后无需任何触发词即可触发 */
  enablePrivate: true,
  /** 随机发送延迟的区间，单位毫秒，无延迟都设置为 0 */
  deplay: [300, 3000] as const,
  /** API 请求错误时的回复 */
  errorReply: '让小爱思考一下再给你答复吧',
  /** 是否屏蔽管理员私聊，默认屏蔽（防止消息命令误触） */
  ignoreAdmin: true,
  /** 忽略群列表 */
  ignoreGroups: [] as number[],
  /** 忽略好友列表，群聊私聊均会忽略，填入 QQ 列表，这里默认忽略 Q 群管家 */
  ignoreFriends: [2854196310] as number[],
  /** 强制忽略词列表 */
  ignoreWords: ['#', '/', '自爆', '同归于尽']
}

plugin.onMounted(() => {
  // 使用插件数据配置文件合并配置，优先使用：框架目录/data/plugins/小爱同学/config.json
  Object.assign(config, plugin.loadConfig())

  // 保存合并的配置
  plugin.saveConfig(config)

  plugin.onMessage(async (event, bot) => {
    const { message_type, raw_message: msg, sender } = event

    // 检测到强制忽略词则忽略
    if (config.ignoreWords.some(word => msg.includes(word))) {
      return
    }

    // 过滤屏蔽好友
    if (config.ignoreFriends.includes(sender.user_id)) {
      return
    }

    let isIgnore = false
    let hitAt = false

    if (message_type === 'private') {
      // 未开启私聊时不处理
      if (!config.enablePrivate) {
        return
      }
    } else if (message_type === 'discuss') {
      isIgnore = config.ignoreGroups.includes(event.discuss_id)
      hitAt = config.enableAt && event.message.some(e => e.type === 'at' && e.qq === bot.uin)
    } else if (message_type === 'group') {
      isIgnore = config.ignoreGroups.includes(event.group_id)
      hitAt = config.enableAt && event.message.some(e => e.type === 'at' && e.qq === bot.uin)
    }

    const hitWords = config.words.some(e => msg.includes(e))

    const isHit = hitAt || hitWords

    // 当群被屏蔽，或者未触发小爱时（通过艾特或者触发词触发时），不处理
    if (isIgnore || !isHit) {
      return
    }

    const rawText = msg.replace(/\[.*\]/g, '').trim()
    const isAudio = config.mode === 'audio'

    try {
      // 请求小爱同学官方接口数据
      const { url, displayText } = await fetchReply(rawText)

      // 随机延迟
      if (config.deplay && config.deplay[0] > 0) {
        await wait(randomInt(...config.deplay))
      }

      // 分模式发送
      if (isAudio) {
        event.reply(url ? segment.record(url) : config.errorReply, true)
      } else {
        event.reply(displayText || config.errorReply, true)
      }
    } catch (e) {
      plugin.logger.error(e)
      event.reply(config.errorReply, true)
    }
  })
})

export { plugin }
