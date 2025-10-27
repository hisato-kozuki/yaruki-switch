const button = document.getElementById("mainButton");
const frame = document.getElementById("buttonFrame");

// データ送信先URL（必要に応じて変更）
const POST_URL = "https://example.com/api/receive";

// 状態管理用フラグ
let isActive = false;

// ボタンをクリックした時の動作
button.addEventListener("click", async () => {
  // 初回クリック（ボタン押し込みアニメーション＋枠変形＋色変化）
  if (!isActive) {
    isActive = true;
    frame.classList.add("active");
    localStorage.setItem("stored_date", new Date().toISOString());
    console.log("開始時刻を保存しました:", localStorage["stored_date"]);
  }
  // 2回目クリック（元に戻る＋データ送信）
  else {
    isActive = false;
    frame.classList.remove("active");

    const startDate = localStorage["stored_date"];
    const endDate = new Date().toISOString();

    const payload = {
      title: "hhhhh",
      date_start: startDate,
      date_end: endDate
    };

    console.log("送信データ:", payload);

    // 経過時間計測
    const elapsed = (new Date(endDate) - new Date(startDate)) / 1000;
    console.log(`経過時間: ${elapsed} 秒`);

    try {
      const response = await fetch(POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`送信エラー: ${response.status}`);
      }
      console.log("データ送信完了");
    } catch (error) {
      console.error("送信失敗:", error);
    }
  }
});