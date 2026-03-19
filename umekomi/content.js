(function() {
  browser.storage.local.get("savedCode").then((res) => {
    if (!res.savedCode) return;

    // 既存のViewerがあれば削除
    const exist = document.getElementById('my-universal-viewer');
    if (exist) exist.remove();

    // 台座の作成
    const container = document.createElement('div');
    container.id = 'my-universal-viewer';
    
    // スタイル設定（重要：最前面に来るように z-index を最大に）
    container.style.cssText = `
      position: fixed !important;
      bottom: 15px !important;
      right: 15px !important;
      z-index: 2147483647 !important;
      background: #ffffff !important;
      border: 1px solid #ddd !important;
      box-shadow: 0 8px 30px rgba(0,0,0,0.2) !important;
      padding: 8px !important;
      border-radius: 12px !important;
      max-width: 90vw !important;
      line-height: 0 !important;
    `;

    // ユーザーコードを挿入
    container.innerHTML = res.savedCode;
    document.body.appendChild(container);

    // JavaScriptを強制実行させる処理
    const scripts = container.querySelectorAll("script");
    scripts.forEach(oldScript => {
      const newScript = document.createElement("script");
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      // bodyに直接貼ることで実行させる
      document.body.appendChild(newScript);
      oldScript.remove();
    });
  });
})();
