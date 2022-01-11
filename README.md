# Crypto Price Telegram BOT

A Crypto price BOT built with TypeScript, Node, Telegraf and, CoinGecko API.

## Usage

Build the project

```console
npm run build
```

Set the ENV variable of your Telegram BOT (this is located via Bot Father on TG, you want the BOT_TOKEN) and use the start command to run the bot.

```console
CRYPTO_COFFEE_BOT_TOKEN="hazaar" npm start
```

## BOT commands

## Price Command

`/p <coin id>` - The `<coin id>` represents the coin ID e.g. bitcoin and the bot will reply with all of the pricing information. This includes rank, price, 24h high, 24h low, change 24h, volume, market cap, and, ATH.

`/cbbi` - Displays the CBBI confidence percentage, an indicator to calculate how confident bitcoin has reached its top. More information on the CBBI indicator can be found here: [CBBI website](https://colintalkscrypto.com/cbbi/)

## Local Development

To compile TSC without rebuilding use:

```console
npm run watch
```

### Upcoming

More commands including: charts, exchange information indexes, any commands you'd like to see please raise an issue.
