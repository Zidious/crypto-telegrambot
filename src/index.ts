require('dotenv').config()
import CoinGeckoApi from '@crypto-coffee/coingecko-api'
import { Telegraf } from 'telegraf'
import { ICoinMarketResponse, IBaseInlineKeyboard } from './types'
import {
  buildBotMessageWithKeyboard,
  buildBotPriceMessage,
  fetchCBBIIndicator,
  fetchCoinMarkets,
  filterUserCommand,
  markdownWrapper
} from './utils'
import { createTwitterClient, startStream } from './actions/twitter'
import { blacklistedWordChecks } from './actions/blacklisted-words'

const { CRYPTO_COFFEE_BOT_TOKEN } = process.env
const bot = new Telegraf(CRYPTO_COFFEE_BOT_TOKEN as string)
const coinGeckoApi = new CoinGeckoApi()
const commands = {
  price: '/p',
  cbbi: '/cbbi'
}
let hasTwitterStreamStarted = false

bot.command('commands', ctx => {
  ctx.reply(`
    My commands: 
    /p - <coin> Fetch coin price info.
    /cbbi - CBBI indicator (BTCs top).
    /twitter - Start a twitter stream of user(s)
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
  const cbbiObject: IBaseInlineKeyboard = {
    bot: bot,
    chatId: ctx.chat.id,
    botMessage: confidence,
    keyboardMesage: 'CBBI Website',
    keyboardUrl: 'https://colintalkscrypto.com/cbbi/'
  }

  buildBotMessageWithKeyboard(cbbiObject)
})

// start Twitter stream
bot.command('/twitter', async ctx => {
  const { message_id } = ctx.update.message
  if (!hasTwitterStreamStarted) {
    ctx.reply('Starting Twitter stream...')
    ctx.deleteMessage(message_id)
    const client = createTwitterClient()
    hasTwitterStreamStarted = true
    startStream(client, bot, ctx)
  } else {
    ctx.deleteMessage(message_id)
    ctx.reply('Twitter stream has already started...')
  }
})

blacklistedWordChecks(bot)

bot.launch()
