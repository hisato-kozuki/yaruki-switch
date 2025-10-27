const frame = document.getElementById("frame");
const button = document.getElementById("circleButton");
const elapsedDisplay = document.getElementById("elapsed");
const resultDisplay = document.getElementById("result");
const urlInput = document.getElementById("postUrl");
const saveUrlBtn = document.getElementById("saveUrlBtn");

let timerInterval = null;

// 🔹 送信URLの保存と復元
if (localStorage.getItem("post_url")) {
  urlInput.value = localStorage.getItem("post_url");
}

saveUrlBtn.addEventListener("click", () => {
  const url = urlInput.value.trim();
  if (url) {
    localStorage.setItem("post_url", url);
    resultDisplay.textContent = "送信先URLを保存しました。";
  } else {
    resultDisplay.textContent = "URLを入力してください。";
  }
});

// 🔹 枠を5×5に配置
const rects = [];
for (let i = 0; i < 25; i++) {
  const rect = document.createElement("div");
  rect.classList.add("rect");
  rect.dataset.index = i;
  frame.appendChild(rect);
  rects.push(rect);
}

// 十字型になるインデックス
const crossIndexes = [2, 7, 10, 11, 12, 13, 14, 17, 22];

function resetGrid() {
  rects.forEach((r) => {
    r.classList.remove("cross");
    r.style.transform = "translate(0,0) scale(1)";
  });
}

function toCrossShape() {
  rects.forEach((r, i) => {
    if (crossIndexes.includes(i)) {
      r.classList.add("cross");
      r.style.transform = "scale(1.3)";
    } else {
      r.style.transform = "scale(0)";
    }
  });
}

// 🔹 経過時間更新
function updateElapsedTime() {
  const start = localStorage.getItem("stored_date");
  if (!start) {
    elapsedDisplay.textContent = "経過時間: 0秒";
    return;
  }
  const elapsed = Math.floor((Date.now() - new Date(start)) / 1000);
  elapsedDisplay.textContent = `経過時間: ${elapsed} 秒`;
}

// 🔹 ボタンクリックイベント
button.addEventListener("click", async () => {
  const storedDate = localStorage.getItem("stored_date");

  // 送信先URLの取得
  const POST_URL = localStorage.getItem("post_url");
  if (!POST_URL) {
    resultDisplay.textContent = "送信先URLを設定してください。";
    return;
  }

  // 1回目クリック
  if (!storedDate) {
    const now = new Date().toISOString();
    localStorage.setItem("stored_date", now);
    toCrossShape();
    button.style.background = "radial-gradient(circle at 30% 30%, #f44336, #b71c1c)";
    resultDisplay.textContent = "計測開始しました。";

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateElapsedTime, 1000);
  }
  // 2回目クリック
  else {
    const startDate = localStorage.getItem("stored_date");
    const endDate = new Date().toISOString();
    const payload = {
      title: "hhhhh",
      date_start: startDate,
      date_end: endDate
    };

    if (timerInterval) clearInterval(timerInterval);

    try {
      const res = await fetch(POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const txt = res.ok ? "送信成功！" : `送信失敗 (${res.status})`;
      resultDisplay.textContent = `送信結果: ${txt}`;
    } catch (err) {
      resultDisplay.textContent = `オフラインまたは送信エラー: ${err.message}`;
    }

    // 初期化
    resetGrid();
    button.style.background = "radial-gradient(circle at 30% 30%, #4CAF50, #2E7D32)";
    localStorage.removeItem("stored_date");
    elapsedDisplay.textContent = "経過時間: 0秒";
  }
});

// ページロード時の状態復元
if (localStorage.getItem("stored_date")) {
  toCrossShape();
  button.style.background = "radial-gradient(circle at 30% 30%, #f44336, #b71c1c)";
  timerInterval = setInterval(updateElapsedTime, 1000);
}

// PWA の service worker 登録
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker 登録完了"))
    .catch((err) => console.error("SW登録エラー:", err));
}