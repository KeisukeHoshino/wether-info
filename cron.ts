import cron from "node-cron";
import * as dotenv from "dotenv";

// .envファイルの読み込み
dotenv.config();

// 10分ごとにヘルスチェックを実行
export function startHealthCheckCron() {
  cron.schedule("*/1 * * * *", async () => {
    try {
      // 実行時に動的にURLを取得
      const healthCheckUrl =
        process.env.HEALTH_CHECK_URL ||
        `http://localhost:${process.env.PORT || 8080}`;
      const now = new Date().toLocaleString("ja-JP");
      console.log(`🔍 [${now}] ヘルスチェック実行中... (${healthCheckUrl})`);
      const response = await fetch(healthCheckUrl);

      if (response.ok) {
        console.log(`✅ [${now}] ヘルスチェック成功: ${response.status}`);
      } else {
        console.warn(`⚠️ [${now}] ヘルスチェック失敗: ${response.status}`);
      }
    } catch (error) {
      const now = new Date().toLocaleString("ja-JP");
      console.error(`❌ [${now}] ヘルスチェックエラー:`, error);
    }
  });

  console.log("🕐 ヘルスチェックの定期実行を開始しました (10分間隔)");
}
