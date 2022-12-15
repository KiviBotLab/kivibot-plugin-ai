# 小爱同学 for KiviBot

[![npm-version](https://img.shields.io/npm/v/kivibot-plugin-ai?color=527dec&label=kivibot-plugin-ai&style=flat-square)](https://npm.im/kivibot-plugin-ai)
[![dm](https://shields.io/npm/dm/kivibot-plugin-ai?style=flat-square)](https://npm.im/kivibot-plugin-ai)

[`KiviBot`](https://beta.kivibot.com) 的 [小爱同学](https://xiaoai.mi.com/) 插件，接入小爱同学实现智能聊天功能。数据来源于小爱同学官方接口，详情查看[源码](https://github.com/KiviBotLab/kivibot-plugin-ai/blob/main/src/fetchReply.ts#L7)。

**特征**

- 接入小爱同学官方接口，稳定不失效
- 无需配置开发者鉴权 key，安装即用
- 支持语音回复和文字回复，任你选择
- 支持艾特触发、配置关键词触发
- 支持配置忽略词、屏蔽群和屏蔽 QQ

> 语音模式需要安装 [ffmpeg](https://ffmpeg.org/)

**安装**

```shell
/plugin add ai
```

**启用**

```shell
/plugin on ai
```

**使用**

```shell
小爱在吗
@Bot 现在几点了
小爱同学今天是星期几
```

**配置**

编辑 `框架目录/data/plugins/小爱同学/config.json` 文件

> 注意：配置中不能带有注释，此处注释仅用作解释说明。

```jsonc
// `框架目录/data/plugins/小爱同学/config.json` 文件内容
{
  /** 回复模式，默认文本 text，语音改为 audio，语音需要配置 ffmpeg */
  "mode": "text",
  /** 触发词列表，仅群聊生效 */
  "words": ["小爱"],
  /** 是否开启艾特触发，默认开启，仅群聊生效 */
  "enableAt": true,
  /** 私聊是否开启，默认开启，开启后无需任何触发词即可触发 */
  "enablePrivate": true,
  /** API 请求错误时的回复 */
  "errorReply": "让小爱思考一下再给你答复吧",
  /** 是否屏蔽管理员私聊，默认屏蔽（防止消息命令误触） */
  "ignoreAdmin": true,
  /** 忽略群列表 */
  "ignoreGroups": [],
  /** 忽略好友列表，群聊私聊均会忽略，填入 QQ 列表，这里默认忽略 Q 群管家 */
  "ignoreFriends": [2854196310],
  /** 强制忽略词列表 */
  "ignoreWords": ["#", "/", "自爆", "同归于尽"]
}
```

修改后保存，使用以下命令重载插件即可生效。

```shell
/plugin reload ai
```
