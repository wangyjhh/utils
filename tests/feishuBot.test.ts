import { log } from 'node:console'
import { describe, expect, it } from 'vitest'
import { sendFeishuBotMessage } from '../src'

const bot_config = {
    webhook: 'https://open.feishu.cn/open-apis/bot/v2/hook/035b47c2-0ab1-4898-b77e-5a6aab2641a7',
    secret: 'I6J7QqZCTHnjJ1yMSXqAad',
    template_id: 'AAqj6SzMJa16h',
    template_variable: {},
}

const getData = async () => {
    return {
        weather: '晴',
        temperature: 30,
        time: new Date().toLocaleString(),
        zhuti_info: `1.融创乐园出票2000张，4000人次；融创乐园:入园5000人，出园2000人，在园1000人`,
        shui_info: `2.水世界出票1000张，1000人次；水世界:入园1000人，出园200人，在园800人`,
    }
}

describe('sendFeishuBotMessage', () => {
    it('should send message to feishu bot', async () => {
        bot_config.template_variable = await getData()
        log(await sendFeishuBotMessage(bot_config))
    })
})
