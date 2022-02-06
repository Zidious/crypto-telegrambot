import { assert } from 'console'
import { Telegraf } from 'telegraf'
import Twitter from 'twitter-lite'
import {
  IInlineKeyboardWithUrlWithPhoto,
  IInlineKeyboardWithUrl
} from '../types'
import {
  buildBotMessageWithKeyboard,
  buildBotPhotoMessageWithKeyboard
} from '../utils'

const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_SECRET,
  TWITTER_USERS_IDS
} = process.env

export const createTwitterClient = (): Twitter => {
  assert(CONSUMER_KEY, 'Twitter CONSUMER_KEY env required.')
  assert(CONSUMER_SECRET, 'Twitter CONSUMER_SECRET required.')
  assert(ACCESS_TOKEN_KEY, 'Twitter ACCESS_TOKEN_KEY required.')
  assert(ACCESS_TOKEN_SECRET, 'Twitter ACCESS_TOKEN_SECRET required.')
  assert(TWITTER_USERS_IDS, 'TWITTER_USERS_IDS required for Twitter stream.')

  return new Twitter({
    consumer_key: CONSUMER_KEY as string,
    consumer_secret: CONSUMER_SECRET as string,
    access_token_key: ACCESS_TOKEN_KEY as string,
    access_token_secret: ACCESS_TOKEN_SECRET as string
  })
}

export const startStream = (client: Twitter, bot: Telegraf, ctx: any) => {
  const parameters = {
    follow: TWITTER_USERS_IDS
  }

  client
    .stream('statuses/filter', parameters)
    .on('start', () => console.log('Starting Twitter stream...'))
    .on('data', tweet => {
      // we only care about tweets not deleted tweets
      if (!tweet.delete) {
        const { id_str, text, display_text_range } = tweet
        const { screen_name } = tweet.user

        // builds URL to tweet
        const tweetURL = `https://twitter.com/${screen_name}/status/${id_str}`

        // tweets with image
        if (display_text_range) {
          const image = (text as string).substring(display_text_range[1]).trim()
          const message = (text as string).substring(
            display_text_range[0],
            display_text_range[1]
          )
          const botPhoto: IInlineKeyboardWithUrlWithPhoto = {
            bot: bot,
            chatId: ctx.chat.id,
            photoUrl: image,
            botMessage: message,
            keyboardMesage: '🐣 View Tweet 🐣',
            keyboardUrl: tweetURL
          }

          buildBotPhotoMessageWithKeyboard(botPhoto)
        } else {
          // tweets without image
          const botMessage: IInlineKeyboardWithUrl = {
            bot: bot,
            chatId: ctx.chat.id,
            botMessage: text,
            keyboardMesage: '🐣 View Tweet 🐣',
            keyboardUrl: tweetURL
          }

          buildBotMessageWithKeyboard(botMessage)
        }
      }
    })
    .on('ping', () => console.log('Looking for tweets...'))
    .on('error', error => console.log('Oops, error occured...', error))
    .on('end', () => console.log('Twitter stream ending...'))
}
