// مقداردهی TonConnect (اگر مقداردهی نشده بود)
if (!window.TonConnect) {
    try {
        window.TonConnect = new window.TON_CONNECT_UI.TonConnect({
            manifestUrl: "https://greentreebot.onrender.com/tonconnect-manifest.json"
        });
        console.log("✅ TonConnect Initialized Successfully!");
    } catch (error) {
        console.error("❌ Failed to initialize TonConnect:", error);
    }
}

function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "30px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "linear-gradient(to right, #4CAF50, #81C784)";
    toast.style.color = "#fff";
    toast.style.padding = "15px 30px";
    toast.style.borderRadius = "30px";
    toast.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
    toast.style.fontSize = "16px";
    toast.style.opacity = "0";
    toast.style.zIndex = "9999";
    toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";

    // Show
    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
    }, 100);

    // Hide after 3s
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(20px)";
    }, 3000);
}

// بررسی مقدار manifestUrl
console.log("✅ Checking manifestUrl in TonConnect...");
console.log("TonConnect manifestUrl:", window.TonConnect?.dappSettings?.manifestUrl);

window.navigateTo = function(page) {
    let userId = localStorage.getItem("user_id");
    if (!userId || userId === "Unknown" || userId === null) {
        showToast("❌ No valid user_id found! Please log in again.");
        return;
    }
    window.location.href = `${page}?user_id=${encodeURIComponent(userId)}`;
};

// ⬇ بقیه کدهای script.js داخل eventListener باقی می‌مانند
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script Loaded Successfully.");

const urlParams = new URLSearchParams(window.location.search);
const userIdFromUrl = urlParams.get("user_id");

if (userIdFromUrl && userIdFromUrl !== "null" && userIdFromUrl !== "undefined") {
    window.userId = userIdFromUrl;
    localStorage.setItem("user_id", userIdFromUrl);
} else {
    const userIdFromStorage = localStorage.getItem("user_id");
    if (userIdFromStorage && userIdFromStorage !== "null" && userIdFromStorage !== "undefined") {
        window.userId = userIdFromStorage;
    } else {
        window.userId = "7462185373"; // مقدار پیش‌فرض اجباری
        localStorage.setItem("user_id", window.userId);
    }
}
    console.log("✅ Final User ID:", window.userId);
});

        window.SERVER_URL = "https://greentreebot.onrender.com";
        console.log("✅ SERVER_URL Set To:", window.SERVER_URL);


    if (typeof API_SECRET === "undefined") {
        window.API_SECRET = "452428fb1c3e4f0a61a53ea2c74a941094325afdf3ed67bb1d807abeacbc1de7";
    }

    // تابع دریافت مقدار total_tokens
async function fetchTokensFromAPI() {
    if (!window.userId) {
        console.error("❌ No user ID found. Cannot fetch tokens.");
        return;
    }

    try {
        const response = await fetch(`${window.SERVER_URL}/get_user_info?user_id=${window.userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "API-SECRET": window.API_SECRET,
                "ngrok-skip-browser-warning": "true"
            }
        });

    const data = await response.json();
    console.log("📡 Server Response (Parsed JSON):", data);

    if (!response.ok) {
        console.error("❌ HTTP Error:", response.status, response.statusText);
        return;
    }

    if (!data.total_tokens) {
        console.warn("⚠️ Warning: No tokens received from API.");
        return;
    }

    document.getElementById("token-count").textContent = data.total_tokens || "0";
    localStorage.setItem("tokens", data.total_tokens || "0");
    console.log("✅ Tokens Updated:", data.total_tokens);
    } catch (error) {
        console.error("❌ Server connection failed:", error);
    } // این } بسته شدن try-catch است
} // این } بسته شدن تابع fetchTokensFromAPI است

localStorage.setItem("user_id", window.userId);
console.log("✅ User ID:", window.userId);

// اینجا fetchTokensFromAPI رو اجرا کن که بعد از مقداردهی userId انجام بشه
if (!window.userId || window.userId === "undefined" || window.userId === null) {
    console.warn("⚠️ No valid user ID found! Setting default...");
    window.userId = localStorage.getItem("user_id") || "7462185373"; // مقدار پیش‌فرض
    localStorage.setItem("user_id", window.userId);
}
console.log("✅ Final User ID:", window.userId);

// حالا fetchTokensFromAPI رو اجرا کن
setTimeout(() => {
    console.log("🚀 Running fetchTokensFromAPI after userId is set...");
    fetchTokensFromAPI();
}, 500);

setTimeout(() => {
    populateWalletAddress();
}, 600);

setTimeout(() => {
    console.log("🚀 Running fetchInviteCountFromAPI...");
    fetchInviteCountFromAPI();
}, 600);

async function fetchInviteCountFromAPI() {
    if (!window.userId) {
        console.error("❌ No user ID found. Cannot fetch invite count.");
        return;
    }

    try {
        const response = await fetch(`${window.SERVER_URL}/get_invite_count?user_id=${window.userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "API-SECRET": window.API_SECRET,
                "ngrok-skip-browser-warning": "true"
            }
        });

        const data = await response.json();
        console.log("📡 Invite count response:", data);

        if (!response.ok) {
            console.error("❌ HTTP Error:", response.status, response.statusText);
            return;
        }

        const inviteCountElement = document.getElementById("invite-count");
        if (inviteCountElement) {
            inviteCountElement.textContent = data.invite_count || "0";
            console.log("✅ Invite Count Updated:", data.invite_count);
        }

    } catch (error) {
        console.error("❌ Error fetching invite count:", error);
    }
}

async function populateWalletAddress() {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
        console.warn("⚠️ No user ID found for fetching wallet address.");
        return;
    }

    try {
        const response = await fetch(`${window.SERVER_URL}/get_user_info?user_id=${userId}`, {
            headers: {
                "API-SECRET": window.API_SECRET,
                "ngrok-skip-browser-warning": "true"
            }
        });

        const data = await response.json();
        console.log("📡 Wallet address fetch response:", data);

        if (data.wallet_address && data.wallet_address !== "null") {
            const walletInput = document.getElementById("wallet-address");
            if (walletInput) {
                walletInput.value = data.wallet_address;
                localStorage.setItem("wallet_address", data.wallet_address); // هم در localStorage برای استفاده‌های دیگر
            }
        }

    } catch (error) {
        console.error("❌ Error fetching wallet address:", error);
    }
}

async function checkPurchaseStatus() {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
        console.warn("⚠️ No user_id found for purchase status check.");
        return;
    }

    try {
        const response = await fetch(`${window.SERVER_URL}/check_purchase_status?user_id=${userId}`, {
            headers: {
                "API-SECRET": window.API_SECRET,
                "ngrok-skip-browser-warning": "true"
            }
        });

        const data = await response.json();
        console.log("📡 Purchase status check:", data);

        if (data.hasPurchased) {
            const purchaseButton = document.getElementById("purchase-token");
            if (purchaseButton) {
                purchaseButton.disabled = true;
                purchaseButton.textContent = "🎉 You have already received 10,000 tokens!";
            }
        }

    } catch (error) {
        console.error("❌ Error checking purchase status:", error);
    }
}

setTimeout(() => {
    if (window.TonConnectUI) {
        console.log("⚠️ TonConnectUI already exists, skipping reinitialization.");
    } else if (typeof window.TON_CONNECT_UI !== "undefined" && window.TON_CONNECT_UI.TonConnectUI) {
        window.TonConnectUI = window.TON_CONNECT_UI.TonConnectUI;
        console.log("✅ TonConnectUI set from TON_CONNECT_UI!", window.TonConnectUI);
    } else {
        console.error("❌ TonConnectUI is still undefined!");
    }
}, 2000);

setTimeout(() => {
    console.log("🔍 Checking navigateTo function before attaching events:", typeof window.navigateTo);
    if (typeof window.navigateTo !== "function") {
        console.error("❌ navigateTo function is still undefined! Trying to redefine...");
        window.navigateTo = function(page) {
            let userId = localStorage.getItem("user_id");
            if (!userId || userId === "Unknown" || userId === null) {
                showToast("❌ No valid user_id found! Please log in again.");
                return;
            }
            console.log(`🔄 Navigating to: ${page} with user_id: ${userId}`);
            window.location.href = `${page}?user_id=${encodeURIComponent(userId)}`;
        };
        console.log("✅ navigateTo function redefined.");
    }
}, 2000);

document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("social-btn")) {
        const btn = event.target;
        const platform = btn.getAttribute("data-platform");
        const url = btn.getAttribute("data-url");

        // باز کردن لینک
        window.open(url, "_blank");

        // ارسال به سرور
        try {
            const response = await fetch(`${window.SERVER_URL}/log_social_action`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "API-SECRET": window.API_SECRET
                },
                body: JSON.stringify({
                    user_id: window.userId,
                    platform: platform
                })
            });

            const data = await response.json();
            if (data.success) {
                showToast(`🎉 You earned 500 tokens for joining ${platform}!`);
                fetchTokensFromAPI(); // بروزرسانی نمایش
            } else if (data.message === "Already rewarded for this platform") {
                showToast(`⚠️ You have already earned tokens for ${platform}.`);
            } else {
                showToast("❌ Something went wrong.");
            }
        } catch (err) {
            console.error("❌ Error sending social log:", err);
            showToast("❌ Network error. Try again later.");
        }
    }
});
