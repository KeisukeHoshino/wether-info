import { Client, GatewayIntentBits, Message, TextChannel } from 'discord.js';
import * as dotenv from 'dotenv';
import * as cron from 'node-cron';
import http from 'http';
import { startHealthCheckCron } from './cron';

// Koyeb用ヘルスチェックサーバー
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is online!');
}).listen(process.env.PORT || 8080);

// .envファイルの読み込み
dotenv.config();

startHealthCheckCron();

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

  // --- 定時実行の設定 ---
  // 分 時 日 月 曜日
  cron.schedule('*/1 * * * *', async () => {
    const channelId = '754636255668600925';
    const channel = await client.channels.fetch(channelId);

    if (channel instanceof TextChannel) {
      await channel.send('おはようございます！朝9時になりました。');
    }
  }, {
    timezone: "Asia/Tokyo" // 日本時間で設定
  });
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
