import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
import requests  
from datetime import datetime

API_TOKEN = "7781261232:AAFW2lbifvSazzoGt5JF7Rzdby-aD3wgAfc"
WEBAPP_URL = "https://greentreebot.onrender.com/"
SERVER_URL = "https://greentreebot.onrender.com"
API_SECRET = "452428fb1c3e4f0a61a53ea2c74a941094325afdf3ed67bb1d807abeacbc1de7"

bot = telebot.TeleBot(API_TOKEN)

def get_user_info(user_id):
    """ دریافت اطلاعات کاربر از سرور """
    try:
        headers = {"API-SECRET": API_SECRET}
        response = requests.get(f"{SERVER_URL}/get_user_info", params={"user_id": user_id}, headers=headers)
        return response.json() if response.status_code == 200 else None
    except Exception as e:
        print(f"❌ Error fetching user info: {str(e)}")
        return None

def register_user_on_server(user_id, first_name, birth_year, referrer_id=None):
    try:
        headers = {
            "Content-Type": "application/json",
            "API-SECRET": API_SECRET
        }

        payload = {
            "user_id": user_id,
            "first_name": first_name,
            "birth_year": birth_year
        }

        if referrer_id:
            payload["referrer_id"] = referrer_id

        print(f"🔍 Payload being sent: {payload}")

        response = requests.post(f"{SERVER_URL}/register_user", json=payload, headers=headers)

        print(f"🔍 Server Response: {response.status_code} - {response.text}")

        if response.status_code == 201:
            return True
        else:
            print(f"❌ Registration failed: {response.text}")
            return False

    except Exception as e:
        print(f"❌ Error registering user: {str(e)}")
        return False

@bot.message_handler(commands=['start'])
def send_welcome(message):
    user_id = message.chat.id
    first_name = message.chat.first_name

    # ✅ گرفتن referrer_id از پیام
    referrer_id = None
    if len(message.text.split()) > 1:
        referrer_id = message.text.split()[1]
    bot.user_referrer = bot.user_referrer if hasattr(bot, "user_referrer") else {}
    bot.user_referrer[user_id] = referrer_id

    user_info = get_user_info(user_id)

    if user_info:
        total_tokens = user_info["total_tokens"]
        send_webapp_link(user_id, total_tokens)
    else:
        bot.send_message(user_id, "🌱 Welcome to the **GreenTree Airdrop**!\n"
                                  "🌍 Just like every tree starts with a seed, your journey begins with your birth year!\n"
                                  "🎉 Earn free tokens based on your birth year and celebrate the gift of life and nature.\n"
                                  "📅 Let's plant the first seed – enter your birth year (e.g., `1995`).")
        bot.register_next_step_handler(message, process_birth_year)

def process_birth_year(message):
    user_id = message.chat.id
    first_name = message.chat.first_name
    birth_year = message.text.strip()

    if not birth_year.isdigit() or int(birth_year) < 1900 or int(birth_year) > datetime.now().year:
        bot.send_message(user_id, "❌ Invalid birth year. Please enter a valid year (e.g., `1995`).")
        bot.register_next_step_handler(message, process_birth_year)
        return

    birth_year = int(birth_year)
    tokens = (datetime.now().year - birth_year) * 100  

    referrer_id = bot.user_referrer.get(user_id)
    if register_user_on_server(user_id, first_name, birth_year, referrer_id):
        bot.send_message(user_id, f"🎉 **You're in!**\n"
                                  f"💵 You've received `{tokens}` tokens as a welcome gift!\n"
                                  "🌳 Imagine planting one tree for every year of your life — a gift back to our planet for all it has given us!\n"
                                  "🔥 Earn even more: Invite friends, complete tasks, and grow our green community!\n"
                                  "🏆 Click below to check your rewards and participate in the airdrop!")
        send_webapp_link(user_id, tokens)
    else:
        bot.send_message(user_id, "❌ Registration failed. Please try again later.")

def send_webapp_link(user_id, tokens):
    keyboard = InlineKeyboardMarkup()
    webapp_button = InlineKeyboardButton(
        "🌍 Open GreenTree MiniApp",
        web_app=WebAppInfo(url=f"{WEBAPP_URL}index.html")
    )
    keyboard.add(webapp_button)

    bot.send_message(user_id, f"🌟 Your total tokens: `{tokens}`\nClick below to open your MiniApp!", reply_markup=keyboard)

print("✅ Telegram bot is running...")
bot.polling(none_stop=True, timeout=60, interval=0)
