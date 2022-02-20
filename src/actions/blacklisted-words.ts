import Filter from 'bad-words'
import { Telegraf } from 'telegraf'
import { splitUserArgs } from '../utils'
require('dotenv').config()

const { BLACKLISTED_WORDS } = process.env
const filter = new Filter()

const createWordList = (list: string) => {
  let wordList: string[] = []
  try {
    wordList = splitUserArgs(list)
  } catch (error) {
    throw new Error(
      'Unable to split BLACKLISTED_WORDS ENV. Please make sure it follows the following format: \n BLACKLISTED_WORDS=arg1,arg2,arg3'
    )
  }

  return wordList
}

export const blacklistedWordChecks = (bot: Telegraf) => {
  if (BLACKLISTED_WORDS) {
    const wordList: string[] = createWordList(BLACKLISTED_WORDS)
    filter.addWords(...wordList)

    bot.on('text', async ctx => {
      const { message_id, text } = ctx.message
      if (filter.isProfane(text)) {
        ctx.deleteMessage(message_id)
      }
    })
    bot.on('photo', async ctx => {
      const { message_id, caption } = ctx.message
      if (caption && filter.isProfane(caption)) {
        ctx.deleteMessage(message_id)
      }
    })
    bot.on('video', async ctx => {
      const { message_id, caption } = ctx.message
      if (caption && filter.isProfane(caption)) {
        ctx.deleteMessage(message_id)
      }
    })
  }
}
