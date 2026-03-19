document.getElementById('exec-btn').addEventListener('click', async () => {
  const code = document.getElementById('code-input').value;
  if (!code) return;

  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

  browser.scripting.executeScript({
    target: { tabId: tab.id },
    func: (injectedCode) => {
      // 既存のViewerがあれば削除
      const old = document.getElementById('my-one-time-viewer');
      if (old) old.remove();

      const container = document.createElement('div');
      container.id = 'my-one-time-viewer';
      container.style.cssText = `
        position: fixed !important; bottom: 20px !important; right: 20px !important;
        z-index: 2147483647 !important; background: white !important;
        padding: 10px !important; border: 2px solid #333 !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important; border-radius: 8px !important;
      `;

      // 【修正ポイント】innerHTMLの代わりにDOMParserを使用
      const parser = new DOMParser();
      const doc = parser.parseFromString(injectedCode, 'text/html');
      
      // 解析した要素を一つずつ追加（これなら安全とみなされます）
      const fragment = document.createDocumentFragment();
      Array.from(doc.body.childNodes).forEach(node => {
        fragment.appendChild(node.cloneNode(true));
      });
      container.appendChild(fragment);
      document.body.appendChild(container);

      // scriptタグの実行（既存のロジックを維持）
      const scripts = container.querySelectorAll("script");
      scripts.forEach(oldScript => {
        const newScript = document.createElement("script");
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        document.body.appendChild(newScript);
        // 元の場所からは削除
        oldScript.remove();
      });
    },
    args: [code]
  });
});
