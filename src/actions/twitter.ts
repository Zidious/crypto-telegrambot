import { assert } from 'console'
import { Telegraf } from 'telegraf'
import Twitter from 'twitter-lite'
import { IInlineKeyboardWithPhoto, IBaseInlineKeyboard } from '../types'
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

const sendMessage = (
  bot: Telegraf,
  ctx: any,
  text: string,
  tweetURL: string
) => {
  const botMessage: IBaseInlineKeyboard = {
    bot: bot,
    chatId: ctx.chat.id,
    botMessage: text,
    keyboardMesage: '🐣 View Tweet 🐣',
    keyboardUrl: tweetURL
  }

  buildBotMessageWithKeyboard(botMessage)
}

const sendMessageWithPhoto = (
  text: string,
  display_text_range: number[],
  bot: Telegraf,
  ctx: any,
  tweetURL: string
) => {
  const image = (text as string).substring(display_text_range[1]).trim()
  const message = (text as string).substring(
    display_text_range[0],
    display_text_range[1]
  )
  const botPhoto: IInlineKeyboardWithPhoto = {
    bot: bot,
    chatId: ctx.chat.id,
    photoUrl: image,
    botMessage: message,
    keyboardMesage: '🐣 View Tweet 🐣',
    keyboardUrl: tweetURL
  }

  buildBotPhotoMessageWithKeyboard(botPhoto)
}

export const startStream = (client: Twitter, bot: Telegraf, ctx: any) => {
  const parameters = {
    follow: TWITTER_USERS_IDS
  }

  client
    .stream('statuses/filter', parameters)
    .on('start', () => console.log('Starting Twitter stream...'))
    .on('data', tweet => {
      const {
        retweeted_status,
        in_reply_to_status_id,
        quoted_status_id,
        in_reply_to_user_id,
        id_str,
        text,
        display_text_range,
        extended_tweet
      } = tweet

      // only filter users tweets, we do not want the bot to post
      // deteled twets, retweets, replies or quoteed retweets
      if (
        !(
          tweet.delete ||
          retweeted_status ||
          in_reply_to_status_id ||
          in_reply_to_user_id ||
          quoted_status_id
        )
      ) {
        // get screen name to build the tweeet URL
        const { screen_name } = tweet.user
        const tweetURL = `https://twitter.com/${screen_name}/status/${id_str}`

        // if tweet body > 140 characters
        if (extended_tweet) {
          const { full_text, entities } = extended_tweet
          const { media } = entities

          // extended tweet has an image
          if (extended_tweet.display_text_range && media) {
            sendMessageWithPhoto(
              full_text,
              extended_tweet.display_text_range,
              bot,
              ctx,
              tweetURL
            )
          } else {
            sendMessage(bot, ctx, full_text, tweetURL)
          }
          // tweet body < 140 characters
        } else {
          // tweet has an image
          if (display_text_range) {
            sendMessageWithPhoto(text, display_text_range, bot, ctx, tweetURL)
          } else {
            sendMessage(bot, ctx, text, tweetURL)
          }
        }
      }
    })
    .on('ping', () => console.log('Looking for tweets...'))
    .on('error', error => console.log('Oops, error occured...', error))
    .on('end', () => console.log('Twitter stream ending...'))
}
