(function() {
    // 監聽整個文件的鍵盤按下事件
    document.addEventListener('keydown', function(event) {
        // 檢查是否同時按下了 Cmd/Ctrl + Shift + C
        const isCmdOrCtrl = event.metaKey || event.ctrlKey;
        const isShift = event.shiftKey;
        const isC = event.key === 'c' || event.key === 'C';

        if (isCmdOrCtrl && isShift && isC) {
            // 阻止瀏覽器的預設行為
            event.preventDefault();
            const currentUrl = window.location.href;
            
            // 執行複製
            copyToClipboard(currentUrl);
        }
    });

    // 核心複製邏輯（雙重保險）
    function copyToClipboard(text) {
        // 1. 先嘗試使用現代 Clipboard API (必須在 HTTPS 環境下才有效)
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showSnackbar('🔗 網址已成功複製！');
            }).catch(err => {
                console.warn('現代 API 複製失敗，切換至傳統方法...', err);
                fallbackCopy(text);
            });
        } else {
            // 2. 如果不是 HTTPS 或不支援，直接使用傳統方法
            fallbackCopy(text);
        }
    }

    // 傳統複製方法（最穩定的後備方案）
    function fallbackCopy(text) {
        // 建立一個隱藏的 textarea
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // 將其移出畫面外，避免網頁閃爍或排版跑掉
        textArea.style.position = "fixed";
        textArea.style.top = "-9999px";
        textArea.style.left = "-9999px";
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            // 執行複製指令
            const successful = document.execCommand('copy');
            if (successful) {
                showSnackbar('🔗 網址已成功複製！');
            } else {
                showSnackbar('❌ 複製失敗，請檢查瀏覽器權限。');
            }
        } catch (err) {
            console.error('傳統方法複製發生錯誤', err);
            showSnackbar('❌ 複製發生錯誤。');
        }
        
        // 複製完畢後移除 textarea
        document.body.removeChild(textArea);
    }

    // 建立並顯示 Snackbar
    function showSnackbar(message) {
        const snackbarId = 'scripty-custom-snackbar';
        
        const existingSnackbar = document.getElementById(snackbarId);
        if (existingSnackbar) {
            existingSnackbar.remove();
        }

        const snackbar = document.createElement('div');
        snackbar.id = snackbarId;
        snackbar.textContent = message;

        Object.assign(snackbar.style, {
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#323232',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '2147483647',
            opacity: '0',
            transition: 'opacity 0.3s ease-in-out',
            pointerEvents: 'none'
        });

        document.body.appendChild(snackbar);

        requestAnimationFrame(() => {
            snackbar.style.opacity = '1';
        });

        setTimeout(() => {
            snackbar.style.opacity = '0';
            setTimeout(() => {
                if (snackbar.parentNode) {
                    snackbar.remove();
                }
            }, 300); 
        }, 3000);
    }
})();
