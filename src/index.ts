const CoinGeckoApi = require('@crypto-coffee/coingecko-api').default
import { Telegraf } from 'telegraf'
import { ICoinMarketResponse, IInlineKeyboardWithUrl } from './types'
import {
  buildBotMessageWithKeyboard,
  buildBotPriceMessage,
  fetchCBBIIndicator,
  fetchCoinMarkets,
  filterUserCommand,
  markdownWrapper
} from './utils'

const { CRYPTO_COFFEE_BOT_TOKEN } = process.env

const bot = new Telegraf(CRYPTO_COFFEE_BOT_TOKEN as string)
const coinGeckoApi = new CoinGeckoApi()

const commands = {
  price: '/p',
  cbbi: '/cbbi'
}

bot.command('commands', ctx => {
  ctx.reply(`
    My commands: 
    /p - <coin> Fetch coin price info.
    `)
})

bot.command(commands.price, async ctx => {
  const userText = filterUserCommand(commands.price, ctx)
  const results = await fetchCoinMarkets(coinGeckoApi, userText, ctx)

  if (results.length !== 0) {
    const message = buildBotPriceMessage(
      results[0] as unknown as ICoinMarketResponse
    )

    ctx.replyWithMarkdownV2(markdownWrapper(message))
  }
})

bot.command(commands.cbbi, async ctx => {
  const confidence = await fetchCBBIIndicator()
  const cbbiObject: IInlineKeyboardWithUrl = {
    bot: bot,
    chatId: ctx.chat.id,
    botMessage: confidence,
    keyboardMesage: 'CBBI Website',
    keyboardUrl: 'https://colintalkscrypto.com/cbbi/'
  }

  buildBotMessageWithKeyboard(cbbiObject)
})

bot.launch()
