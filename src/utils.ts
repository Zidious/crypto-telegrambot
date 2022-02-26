import {
  ICBBIResponse,
  ICoinMarketResponse,
  IBaseInlineKeyboard,
  IInlineKeyboardWithPhoto
} from './types'
import axios from 'axios'
import CoinGeckoAPI from '@crypto-coffee/coingecko-api'

export const filterUserCommand = (command: string, { update }: any): string => {
  const { message } = update
  return message.text.split(command).pop()
}

export const fetchCoinMarkets = async (
  gecko: CoinGeckoAPI,
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

export const fetchCompanies = async (ctx: any, gecko: CoinGeckoAPI) => {
  let resultsBtc
  try {
    resultsBtc = await gecko.companies('bitcoin')

    ctx.replyWithMarkdown(`
    ***Top Companies Holdings (Bitcoin)*** \n
    ***Bitcoin***
    ${getCompanyBase(resultsBtc)}
    ***Companies***
    ${getCompanyData(resultsBtc.companies[0], 1)}
    ${getCompanyData(resultsBtc.companies[1], 2)}
    ${getCompanyData(resultsBtc.companies[2], 3)}
    `)
  } catch (error) {
    ctx.replyWithMarkdown(
      `${error} If needed, please submit issue to: https://github.com/Zidious/crypto-telegrambot`
    )
  }
}

const getCompanyBase = (result: Record<string, string | number>): string => {
  return `
  Total Holdings: ${result.total_holdings} 
  Total Value (USD): ${formatCurrency.format(result.total_value_usd as number)} 
  Market Cap Dominance (%): ${(result.market_cap_dominance as number).toFixed(
    2
  )}% 
  `
}
const getCompanyData = (
  companies: Record<string, string | number>,
  index: number
): string => {
  return `
  ***#${index}*** - ${companies.name}

  Symbol: ${companies.symbol} 
  Country: ${companies.country}
  Total Holdings (BTC): ${companies.total_holdings} 
  Total Entry Value (USD): ${formatCurrency.format(
    companies.total_entry_value_usd as number
  )} 
  Total Current Value (USD): ${formatCurrency.format(
    companies.total_current_value_usd as number
  )} 
  `
}

const formatCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

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
}: IBaseInlineKeyboard) => {
  bot.telegram.sendMessage(chatId, botMessage, {
    reply_markup: {
      inline_keyboard: [[{ text: keyboardMesage, url: keyboardUrl }]]
    }
  })
}

export const buildBotPhotoMessageWithKeyboard = ({
  bot,
  chatId,
  photoUrl,
  botMessage,
  keyboardMesage,
  keyboardUrl
}: IInlineKeyboardWithPhoto) => {
  bot.telegram.sendPhoto(chatId, photoUrl, {
    caption: botMessage,
    reply_markup: {
      inline_keyboard: [[{ text: keyboardMesage, url: keyboardUrl }]]
    }
  })
}

export const markdownWrapper = (message: string): string => {
  return ` \`\`\` ${message} \`\`\` `
}

const CBBI = (data: Record<string, number>) => {
  const key = Object.keys(data)[Object.keys(data).length - 1]
  const value = Object.values(data)[Object.values(data).length - 1]

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

export const splitUserArgs = (args: string) => {
  return args.split(',')
}
