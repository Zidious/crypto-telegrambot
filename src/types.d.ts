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
  Price: object
  PiCycle: object
  RUPL: object
  RHODL: object
  Puell: object
  Trolololo: object
  MVRV: object
  ReserveRisk: object
  Wobull: object
  HalvingToPeak: object
  GoogleTrends: object
  Confidence: object
}

export interface IInlineKeyboardWithUrl {
  bot: Telegraf
  chatId: number
  botMessage: string
  keyboardMesage: string
  keyboardUrl: string
}
