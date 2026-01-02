import { Client, GatewayIntentBits, Message } from 'discord.js';
import * as dotenv from 'dotenv';
import http from 'http';

// Koyeb用ヘルスチェックサーバー
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is online!');
}).listen(process.env.PORT || 8000);

// .envファイルの読み込み
dotenv.config();

// Clientのインスタンス作成（必要な権限=Intentsを指定）
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // メッセージ内容を読み取る場合に必要
  ],
});

// Botが起動した時の処理
client.once('clientReady', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

// メッセージを受け取った時の処理
client.on('messageCreate', async (message: Message) => {
  // Bot自身のメッセージには反応しない
  if (message.author.bot) return;

  if (message.content === '!ping') {
    await message.reply('Pong!');
  }
});

// ログイン
client.login(process.env.DISCORD_TOKEN);
