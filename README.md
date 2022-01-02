# Crypto Price Telegram BOT

A Crypto price BOT built with TypeScript, Node, Telegraf and, CoinGecko API.

## Usage

Build the project

```console
npm run build
```

Set the ENV variable of your Telegram BOT (this is found via Bot Father on Telegram) and use the start command to run the bot.

```console
CRYPTO_COFFEE_BOT_TOKEN="hazaar" npm start
```

Thats it! Good to go!

## BOT commands

`<coin id>` pass the coin ID e.g. bitcoin and the bot will reply with all of the pricing information. This includes rank, price, 24h high, 24h low, change 24h, volume, market cap, and, ATH.

```console
/p <coin id>
```

More commands to come!

## Local Development

To compile TSC without rebuilding use:

```console
npm run watch
```

### Upcoming

More commands including: charts, exchange information indexes, any commands you'd like to see please raise an issue.
