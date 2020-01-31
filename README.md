# now-telegram-bot
> Basic Telegram bot running on now.sh

## Before start
Create new Telegram bot using BotFather and get a token (not covered here)

## Local development
1. run `npm install`
2. copy `.env.exmaple` as `.env` and update with your config
3. run `now dev`
4. use `ngrok` or `Localtunnel` to expose your local server to Telegram API
5. register bot

## Production
1. setup your production config by running:
```
now secrets add telegram_bot_token <replace_with_your_token>
now secrets add telegram_bot_url <replace_with_your_url>
```
2. deploy to now: `now --target production`

## Register bot
Open `https://<replace_with_your_url>/register<replace_with_your_token>`
