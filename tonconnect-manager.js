console.log("✅ TonConnect Manager Loaded!");

// Singleton Manager
class TonConnectManager {
    constructor() {
        this.manifestUrl = "https://greentreebot.onrender.com/tonconnect-manifest.json";
        this.instance = null;
        this.activeHandler = null; // 🎯 اضافه شد
    }

    getInstance() {
        if (!this.instance) {
            this.instance = new window.TON_CONNECT_UI.TonConnectUI({
                manifestUrl: this.manifestUrl

             });

            console.log("✅ TonConnect UI instance created!");

            // 🎯 Listener مرکزی فقط یک بار ساخته می‌شود!
            this.instance.onStatusChange((walletInfo) => {
                if (walletInfo?.account?.address && this.activeHandler) {
                    this.activeHandler(walletInfo.account.address);
                    this.activeHandler = null; // بعد از اجرا پاک می‌کنیم تا دوباره اجرا نشود.
                }
            });
        } else {
            console.log("🔄 Using existing TonConnect UI instance!");
        }
        return this.instance;
    }

    // 🎯 اضافه کردن متد برای ست کردن handler فعال
    setActiveHandler(handler) {
        this.activeHandler = handler;
    }
}

// Export to window
window.TonConnectManager = new TonConnectManager();
