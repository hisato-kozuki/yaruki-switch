const frame = document.getElementById("frame");
const button = document.getElementById("circleButton");
const elapsedDisplay = document.getElementById("elapsed");
const resultDisplay = document.getElementById("result");

const POST_URL = "https://example.com/api/receive"; // 送信先URLを必要に応じて変更
let timerInterval = null;

// 🔹 枠（小さな長方形）を生成
for (let i = 0; i < 25; i++) {
  const rect = document.createElement("div");
  rect.classList.add("rect");
  frame.appendChild(rect);
}

// 🔹 経過時間更新関数
function updateElapsedTime() {
  const start = localStorage.getItem("stored_date");
  if (!start) {
    elapsedDisplay.textContent = "経過時間: 0秒";
    return;
  }
  const elapsed = Math.floor((Date.now() - new Date(start)) / 1000);
  elapsedDisplay.textContent = `経過時間: ${elapsed} 秒`;
}

// 🔹 クリックイベント
button.addEventListener("click", async () => {
  const storedDate = localStorage.getItem("stored_date");

  // 🔸 1回目クリック時
  if (!storedDate) {
    const now = new Date().toISOString();
    localStorage.setItem("stored_date", now);

    // 枠を十字型に変化
    frame.classList.add("cross");
    button.style.background = "radial-gradient(circle at 30% 30%, #f44336, #b71c1c)";
    resultDisplay.textContent = "ボタンが押されました。計測開始。";

    // 経過時間をリアルタイムで表示
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateElapsedTime, 1000);
  }

  // 🔸 2回目クリック時
  else {
    const startDate = localStorage.getItem("stored_date");
    const endDate = new Date().toISOString();

    const payload = {
      title: "hhhhh",
      date_start: startDate,
      date_end: endDate
    };

    // 経過時間停止
    if (timerInterval) clearInterval(timerInterval);

    // データ送信
    try {
      const response = await fetch(POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resultText = response.ok ? "送信成功！" : `送信失敗 (${response.status})`;
      resultDisplay.textContent = `送信結果: ${resultText}`;
    } catch (error) {
      resultDisplay.textContent = `送信エラー: ${error.message}`;
    }

    // 枠・ボタンを初期化
    frame.classList.remove("cross");
    button.style.background = "radial-gradient(circle at 30% 30%, #4CAF50, #2E7D32)";

    // localStorageをクリアしてクリック状態をリセット
    localStorage.removeItem("stored_date");
    elapsedDisplay.textContent = "経過時間: 0秒";
  }
});

// ページ読み込み時に経過時間表示を更新
if (localStorage.getItem("stored_date")) {
  frame.classList.add("cross");
  button.style.background = "radial-gradient(circle at 30% 30%, #f44336, #b71c1c)";
  timerInterval = setInterval(updateElapsedTime, 1000);
}