import { log } from 'node:console'
import { describe, expect, it } from 'vitest'
import { sendFeishuBotMessage } from '../src'

const bot_config = {
    webhook: '',
    secret: '',
    template_id: '',
    template_variable: {},
}

const getData = async () => {
    return {
        weather: '晴',
        temperature: 30,
        time: new Date().toLocaleString(),
    }
}

describe('sendFeishuBotMessage', () => {
    it('should send message to feishu bot', async () => {
        bot_config.template_variable = await getData()
        log(await sendFeishuBotMessage(bot_config))
    })
})
