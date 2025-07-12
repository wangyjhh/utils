import { getSign, getTimestamp, retry } from '.'

export const fetchPost = async (url: string, body: object) => {
    try {
        const response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        if (!response.ok) {
            throw new Error('请求失败')
        }
        return await response.json()
    }
    catch (error) {
        console.error(error)
    }
}

export interface BotConfig {
    webhook: string
    secret: string
    template_id: string
    template_variable?: { [key: string]: string }
}

export const sendFeishuBotMessage = async (bot_config: BotConfig) => {
    const timestamp = getTimestamp()
    const sign = getSign(timestamp, bot_config.secret)
    const body = {
        timestamp,
        sign,
        msg_type: 'interactive',
        card: {
            type: 'template',
            data: {
                template_id: bot_config.template_id,
                template_variable: bot_config.template_variable,
            },
        },
    }

    const res = await retry(() => fetchPost(bot_config.webhook, body), {
        taskName: '获取客流',
        maxRetries: 5,
        retryDelay: 500,
        validateResult: (res: any) => res.code === 0,
    })
    return res
}
