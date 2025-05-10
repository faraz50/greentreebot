console.log("✅ Wallet.js Loaded!");

window.SERVER_URL = "https://greentreebot.onrender.com";

const walletConnector = window.TonConnectManager.getInstance();
const connectWalletButton = document.getElementById("connect-wallet");

connectWalletButton.addEventListener("click", async () => {
    try {
        const walletInfo = walletConnector.wallet;
        if (walletInfo?.account?.address) {
            processWallet(walletInfo.account.address);
            return;
        }

        window.TonConnectManager.setActiveHandler(processWallet);
        await walletConnector.openModal();

    } catch (error) {
        console.error("❌ Error during wallet connection in wallet.js:", error);
    }
});

async function processWallet(address) {
    document.getElementById("wallet-address").value = address;
    localStorage.setItem("wallet_address", address);

    console.log("✅ Wallet Connected via Wallet.js:", address);

    const userId = localStorage.getItem("user_id");
    if (!userId) {
        console.error("❌ No user ID found for saving wallet address!");
        return;
    }

    const response = await fetch(`${window.SERVER_URL}/save_wallet_address`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "API-SECRET": window.API_SECRET
        }
        body: JSON.stringify({ user_id: userId, wallet_address: address })
    });

    const data = await response.json();
    console.log("✅ Wallet address saved on server:", data);
}
