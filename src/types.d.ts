import { Telegraf } from 'telegraf'

export interface ICoinMarketResponse {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: any
  last_updated: string
}

export interface ICBBIResponse {
  Price: Record<string, number>
  PiCycle: Record<string, number>
  RUPL: Record<string, number>
  RHODL: Record<string, number>
  Puell: Record<string, number>
  Trolololo: Record<string, number>
  MVRV: Record<string, number>
  ReserveRisk: Record<string, number>
  Wobull: Record<string, number>
  HalvingToPeak: Record<string, number>
  GoogleTrends: Record<string, number>
  Confidence: Record<string, number>
}

export interface IBaseInlineKeyboard {
  bot: Telegraf
  chatId: number
  botMessage: string
  keyboardMesage: string
  keyboardUrl: string
}

export interface IInlineKeyboardWithPhoto extends IBaseInlineKeyboard {
  photoUrl: string
}

export interface IMessageParams {
  text: string
  display_text_range?: number[]
  bot: Telegraf
  ctx: any
  tweetURL: string
}
