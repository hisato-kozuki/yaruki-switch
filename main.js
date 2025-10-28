const button = document.getElementById("mainButton");
const frame = document.getElementById("frame");
const elapsedText = document.getElementById("elapsed");
const resultText = document.getElementById("result");
const urlForm = document.getElementById("url-form");
const apiUrlInput = document.getElementById("apiUrl");

apiUrlInput.value = localStorage.getItem("apiUrl") || "";

urlForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = apiUrlInput.value.trim();
  if (url) {
    localStorage.setItem("apiUrl", url);
    alert("URLを保存しました。");
  }
});

let timerInterval = null;

// 経過時間の更新
function startTimer() {
  const startDate = new Date(localStorage.getItem("stored_date"));
  timerInterval = setInterval(() => {
    const now = new Date();
    const elapsedSec = Math.floor((now - startDate) / 1000);
    elapsedText.textContent = elapsedSec;
  }, 1000);
}
function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
}

// ボタン動作
button.addEventListener("click", async () => {
  const storedDate = localStorage.getItem("stored_date");
  const apiUrl = localStorage.getItem("apiUrl");

  // === 1回目クリック ===
  if (!storedDate) {
    localStorage.setItem("stored_date", new Date().toISOString());
    startTimer();

    // アニメーション変化：**十字型に変形**
    button.classList.add("pressed");
    frame.classList.add("cross");   // ← ここを add に変更（十字）
    resultText.textContent = "開始しました。";

  // === 2回目クリック ===
  } else {
    stopTimer();
    const startDate = new Date(localStorage.getItem("stored_date"));
    const now = new Date();
    const elapsed = Math.floor((now - startDate) / 1000);

    // ボタン戻す & 枠を◇（元）に戻す
    button.classList.remove("pressed");
    frame.classList.remove("cross"); // ← remove で元（45°傾いた二重正方形）に戻す

    const payload = {
      type: "post",
      datas: [
        {
          title: "sssss" + elapsed.toString().padStart(5, "0"),
          date_start: now,
          date_end: now,
          color: 3
        }
      ]
    };

    if (!apiUrl) {
      resultText.textContent = "⚠️ 送信先URLが設定されていません。";
      localStorage.removeItem("stored_date");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      resultText.textContent = `送信成功: ${text}`;
    } catch (err) {
      resultText.textContent = `送信失敗: ${err}`;
    }

    localStorage.removeItem("stored_date");
    elapsedText.textContent = "0";
  }
});

// === PWA Service Worker 登録 ===
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(() => console.log("Service Worker 登録成功"))
      .catch((err) => console.log("SW登録失敗:", err));
  });
}