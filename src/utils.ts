import {
  ICBBIResponse,
  ICoinMarketResponse,
  IInlineKeyboardWithUrl
} from './types'
import axios from 'axios'

export const filterUserCommand = (command: string, { update }: any): string => {
  const { message } = update
  return message.text.split(command).pop()
}

export const fetchCoinMarkets = async (
  gecko: any,
  ticker: string,
  ctx: any
): Promise<string[]> => {
  let results
  try {
    results = await gecko.coinMarkets({
      vs_currency: 'usd',
      ids: ticker.toLocaleLowerCase()
    })
    if (results.length === 0) {
      throw 'Unknown coin ID'
    }
  } catch (error) {
    ctx.replyWithMarkdown(
      `${error} Please refer to [CoinGeckos Coin List](https://www.coingecko.com/en). Select a coin and use the "API ID" located on the right`
    )
  }

  return results
}

export const buildBotPriceMessage = ({
  symbol,
  market_cap_rank,
  current_price,
  high_24h,
  low_24h,
  price_change_percentage_24h,
  total_volume,
  market_cap,
  ath
}: ICoinMarketResponse): string => {
  const formatCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })
  const botMessage = `
  Symbol: ${symbol?.toLocaleUpperCase()}
  Rank: #${market_cap_rank ? market_cap_rank : 'NA'}
  Price: ${formatCurrency.format(current_price)} 
  High 24h: ${formatCurrency.format(high_24h)} 
  Low 24h: ${formatCurrency.format(low_24h)} 
  Change 24h: ${price_change_percentage_24h.toFixed(2)}% 
  Volume: ${formatCurrency.format(total_volume)}
  Market Cap: ${formatCurrency.format(market_cap)} 
  ATH: ${formatCurrency.format(ath)}`

  return botMessage
}

export const buildBotMessageWithKeyboard = ({
  bot,
  chatId,
  botMessage,
  keyboardMesage,
  keyboardUrl
}: IInlineKeyboardWithUrl) => {
  bot.telegram.sendMessage(chatId, botMessage, {
    reply_markup: {
      inline_keyboard: [[{ text: keyboardMesage, url: keyboardUrl }]]
    }
  })
}
export const markdownWrapper = (message: string): string => {
  return ` \`\`\` ${message} \`\`\` `
}

const CBBI = (data: object) => {
  const key = Object.keys(data)[Object.keys(data).length - 1]
  const value = Object.values(data)[Object.values(data).length - 1] as number

  return { key: key, value: value }
}

export const fetchCBBIIndicator = async () => {
  const response = await axios.get(
    'https://colintalkscrypto.com/cbbi/data/latest.json'
  )

  const { Confidence }: ICBBIResponse = response.data
  const timestamp = CBBI(Confidence).key as unknown as number
  const confidencePercent = CBBI(Confidence).value.toFixed(
    2
  ) as unknown as number
  const date = new Date(timestamp * 1000)

  const botMessage = `CBBI Indicator - ${date.toDateString()} 
   Confidence: ${confidencePercent * 100}% 
  `
  return botMessage
}
