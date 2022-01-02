import { ICoinMarketResponse } from './types'

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
      ids: ticker
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

export const markdownWrapper = (message: string): string => {
  return ` \`\`\` ${message} \`\`\` `
}
