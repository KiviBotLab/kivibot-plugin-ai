# 小爱同学

`KiviBot` 小爱同学插件。

**安装**

使用框架消息指令安装并启用小爱同学。

```shell
/plugin add ai # 等待安装完成
/plugin on ai # 安装完成后启用
```

**配置**

编辑 `data/plugins/小爱同学/config.json` 文件，修改后保存，重载插件（`/plugin reload ai`）即可生效。

> 注意：配置中不能带有注释，此处注释仅用作解释说明。

```json
// `data/plugins/小爱同学/config.json` 文件内容
{
  /** 回复模式，默认文本 text，语音改为 audio，需要配置 ffmpeg */
  "mode": "text",
  /** 忽略群 */
  "missGroups": [],
  /** 私聊是否开启，默认开启 */
  "enablePrivate": true,
  /** 强制忽略词，支持正则匹配 */
  "missWords": ["#", "自爆", "同归于尽"],
  /** 是否屏蔽管理员私聊，默认屏蔽（防止消息命令误触） */
  "ignoreAdmin": true
}
```
