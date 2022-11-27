# 小爱同学

`KiviBot` 小爱同学插件。

安装:

```shell
kivi install kivibot-plugin-ai
```

配置项：

```js
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
```
