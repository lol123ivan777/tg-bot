const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const combos = require("./combos.js");

// ---------- /start ----------
bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id;

  const greeting =
    "Ну что, Артист, привет. Это акробатическое казино 🎰\n" +
    "Не знаешь что прыгнуть? 🤸 Сейчас подберем.\n\n" +
    "Выбирай режим:";

  bot.sendMessage(chatId, greeting, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "ComboWombo ☠", callback_data: "combomenu" }],
        [{ text: "Поле Чудес 🎲", callback_data: "polemenu" }]
      ]
    }
  });
});

// ---------- Обработка кнопок ----------
bot.on("callback_query", query => {
  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const data = query.data;

  // ========== Главное меню ==========
  if (data === "back_main") {
    return bot.editMessageText("Выбери режим:", {
      chat_id: chatId,
      message_id: msgId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "ComboWombo ☠", callback_data: "combomenu" }],
          [{ text: "Поле Чудес 🎲", callback_data: "polemenu" }]
        ]
      }
    });
  }

  // ========== Меню ComboWombo ==========
  if (data === "combomenu") {
    return bot.editMessageText("Комбо ☠", {
      chat_id: chatId,
      message_id: msgId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "Через темп", callback_data: "combo_cherez" }],
          [{ text: "В темп", callback_data: "combo_vtemp" }],
          [{ text: "Хардкор ☠", callback_data: "combo_hardcore" }],
          [{ text: "← Назад", callback_data: "back_main" }]
        ]
      }
    });
  }

  // ----- Отдельные комбо -----
  if (data === "combo_cherez") {
    return sendEdit(chatId, msgId, "Комбо (через темп):\n" + combos.getComboCherez(), "combomenu");
  }

  if (data === "combo_vtemp") {
    return sendEdit(chatId, msgId, "Комбо (в темп):\n" + combos.getComboVTemp(), "combomenu");
  }

  if (data === "combo_hardcore") {
    return sendEdit(chatId, msgId, "Комбо (☠):\n" + combos.getComboHard(), "combomenu");
  }

  // ========== Поле Чудес ==========
  if (data === "polemenu") {
    return bot.editMessageText("Выбери уровень:", {
      chat_id: chatId,
      message_id: msgId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "Uno", callback_data: "uno" }],
          [{ text: "Dos", callback_data: "dos" }],
          [{ text: "Tri", callback_data: "tri" }],
          [{ text: "🎲 Хз", callback_data: "random_all" }],
          [{ text: "← Назад", callback_data: "back_main" }]
        ]
      }
    });
  }

  // ----- Трюки -----
  if (data === "uno") {
    return sendEdit(chatId, msgId, "Трюк (Uno):\n" + combos.getUno(), "polemenu");
  }

  if (data === "dos") {
    return sendEdit(chatId, msgId, "Трюк (Dos):\n" + combos.getDos(), "polemenu");
  }

  if (data === "tri") {
    return sendEdit(chatId, msgId, "Трюк (Tri):\n" + combos.getTri(), "polemenu");
  }

  // ----- Random -----
  if (data === "random_all") {
    const randomTrick = combos.getAny();
    return sendEdit(chatId, msgId, "Трюк (🎲):\n" + randomTrick, "polemenu");
  }
});

// -------- Helper: компактная функция обновления сообщений --------
function sendEdit(chat_id, message_id, text, back) {
  return bot.editMessageText(text, {
    chat_id,
    message_id,
    reply_markup: {
      inline_keyboard: [
        [{ text: "← Назад", callback_data: back }]
      ]
    }
  });
}