console.log("✅ Purchase.js Loaded!");

const purchaseConnector = window.TonConnectManager.getInstance();
const purchaseButton = document.getElementById("purchase-token");

purchaseButton.addEventListener("click", async () => {
    try {
        const hasPurchased = localStorage.getItem("hasPurchased");

        if (hasPurchased === "true") {
            showToast("✅ You have already made a purchase.");
            return;
        }

        const walletInfo = purchaseConnector.wallet;
        if (walletInfo?.account?.address) {
            await processPurchase(walletInfo.account.address);
            return;
        }

        window.TonConnectManager.setActiveHandler(processPurchase);
        await purchaseConnector.openModal();


    } catch (error) {
        console.error("❌ Error during purchase process:", error);
        showToast("❌ Something went wrong during the purchase.");
    }
});

async function processPurchase(address) {
    console.log("✅ Purchase: Wallet Address:", address);

    const userId = localStorage.getItem("user_id");
    if (!userId) {
        showToast("❌ User ID not found. Please log in again.");
        return;
    }

    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
            {
                address: "UQCbOJAnXrXWryp-8LaqPMEayZpyemJlCnx5oIyEWvoUnAEX",
                amount: "500000000"
            }
        ]
    };

    const result = await purchaseConnector.sendTransaction(transaction);

    if (result?.boc) {
        await fetch(`${window.SERVER_URL}/log_token_purchase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "API-SECRET": window.API_SECRET,
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify({
                user_id: userId,
                transaction_boc: result.boc,
                amount: 10000
            })
        });

        showToast("🎉 Purchase successful! You received 10,000 tokens!");

        // 🎯 اضافه کن بعد از showToast موفق
        const purchaseButton = document.getElementById("purchase-token");
        if (purchaseButton) {
            purchaseButton.disabled = true;
            purchaseButton.textContent = "🎉 You have already received 10,000 tokens!";
        }

        // ✅ ثبت علامت خرید موفق در LocalStorage
        localStorage.setItem("hasPurchased", "true");

        if (typeof fetchTokensFromAPI === "function") {
            fetchTokensFromAPI();
        }
    } else {
        showToast("❌ Transaction was cancelled or failed.");
    }
}
