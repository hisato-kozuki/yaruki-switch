const frame = document.getElementById("frame");
const button = document.getElementById("circleButton");
const elapsedDisplay = document.getElementById("elapsed");
const resultDisplay = document.getElementById("result");

const POST_URL = "https://example.com/api/receive"; // ←送信先URLを適宜変更
let timerInterval = null;

// 🔹 枠を5×5に配置
const rects = [];
for (let i = 0; i < 25; i++) {
  const rect = document.createElement("div");
  rect.classList.add("rect");
  rect.dataset.index = i;
  frame.appendChild(rect);
  rects.push(rect);
}

// 🔹 十字型配置のインデックスを定義
const crossIndexes = [2, 7, 10, 11, 12, 13, 14, 17, 22];

// 🔹 通常配置に戻す関数
function resetGrid() {
  rects.forEach((rect) => {
    rect.classList.remove("cross");
    rect.style.transform = "translate(0, 0) scale(1)";
  });
}

// 🔹 十字型配置に変形する関数
function toCrossShape() {
  rects.forEach((rect, i) => {
    if (crossIndexes.includes(i)) {
      rect.classList.add("cross");
      rect.style.transform = "scale(1.3)";
    } else {
      rect.style.transform = "scale(0)";
    }
  });
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

    toCrossShape();
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
    resetGrid();
    button.style.background = "radial-gradient(circle at 30% 30%, #4CAF50, #2E7D32)";

    // localStorageをクリアしてクリック状態をリセット
    localStorage.removeItem("stored_date");
    elapsedDisplay.textContent = "経過時間: 0秒";
  }
});

// ページ読み込み時に復元
if (localStorage.getItem("stored_date")) {
  toCrossShape();
  button.style.background = "radial-gradient(circle at 30% 30%, #f44336, #b71c1c)";
  timerInterval = setInterval(updateElapsedTime, 1000);
}