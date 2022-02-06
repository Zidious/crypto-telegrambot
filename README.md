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
## Twitter API Integration

To get started, we need to set a few environment variables for the Twitter API. Within your `.env` file (or wherever you set your ENV variables) set the following:

```console
CONSUMER_KEY=foo
CONSUMER_SECRET=bar
ACCESS_TOKEN_KEY=baz
ACCESS_TOKEN_SECRET=qux
```

You can locate the above within the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard) under 'keys and tokens'.

Next, we need to setup a list of users to follow. This will allow the Twitter stream to check the user(s) statuses and post their tweets in your group chat in real-time. As we need the user IDs, I would recommend going over to [TwitterID](https://tweeterid.com/) paste in the user name you wish to follow e.g. '@foobar' and it will fetch the user ID. Paste the user ID within the ENV variable shown below:

```console
// Single user ID
TWITTER_USERS_IDS=1111

// Multiple user IDs (Note: NO space between the commas)
TWITTER_USERS_IDS=1111,2222,3333
```

Once you have done all of the above, you can start the Twiter stream. Go into your Telegram group chat and use the command below to start the stream:

```console
/twitter
```

## BOT commands

### Price Command

`/p <coin id>` - The `<coin id>` represents the coin ID e.g. bitcoin and the bot will reply with all of the pricing information. This includes rank, price, 24h high, 24h low, change 24h, volume, market cap, and, ATH.

`/cbbi` - Displays the CBBI confidence percentage, an indicator to calculate how confident bitcoin has reached its top. More information on the CBBI indicator can be found here: [CBBI website](https://colintalkscrypto.com/cbbi/)

### Upcoming

More commands including: charts, exchange information indexes, any commands you'd like to see please raise an issue.
