const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const {
  getUno,
  getDos,
  getTri,
  getHard,
  getComboCherez,
  getComboVTemp,
  getComboHard,
  getAny
} = require("./tricks");

const { edit } = require("./utils");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// ================== БОЛЬШИЕ КНОПКИ ==================

const mainMenu = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [
      [{ text: "🎩 UNO / DOS / TRI / ЖЕСТЬ" }],
      [{ text: "🌀 Комбо блок" }],
      [{ text: "🎲 Поле чудес (рандом)" }],
      [{ text: "📚 Справка" }]
    ]
  }
};

const unoMenu = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [
      [{ text: "UNO — одинарные" }],
      [{ text: "DOS — двойные" }],
      [{ text: "TRI — тройные" }],
      [{ text: "ЖЕСТЬ — очень сложные" }],
      [{ text: "⬅️ Назад" }]
    ]
  }
};

const comboMenu = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [
      [{ text: "Комбо через темп" }],
      [{ text: "Комбо в темп" }],
      [{ text: "Комбо вомбо (hardcore)" }],
      [{ text: "⬅️ Назад" }]
    ]
  }
};

const rateMenu = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [
      [
        { text: "🔥 Норм" },
        { text: "💩 Так себе" }
      ],
      [{ text: "⬅️ Назад" }]
    ]
  }
};

// ================== START ==================

bot.onText(/\/start/, async msg => {
  const chatId = msg.chat.id;

  const intro =
    "👋 <b>Здарова, артист.</b>\n\n" +
    "Ты попал в генератор трюков.\n" +
    "Жми кнопки и лови идеи для тренировок.\n\n" +
    "<b>Что доступно:</b>\n" +
    "• UNO / DOS / TRI / ЖЕСТЬ\n" +
    "• Комбо: через темп, в темп, вомбо\n" +
    "• Поле чудес — рандомный трюк\n";

  await bot.sendMessage(chatId, intro, {
    parse_mode: "HTML",
    reply_markup: mainMenu.reply_markup
  });
});

// ================== ЛОГИКА МЕНЮ ==================

bot.on("message", async msg => {
  const text = msg.text;
  const chatId = msg.chat.id;

  // Главное меню
  if (text === "🎩 UNO / DOS / TRI / ЖЕСТЬ") {
    return bot.sendMessage(chatId, "🎩 Выбери уровень:", unoMenu);
  }

  if (text === "🌀 Комбо блок") {
    return bot.sendMessage(chatId, "🌀 Выбери тип комбо:", comboMenu);
  }

  if (text === "🎲 Поле чудес (рандом)") {
    return bot.sendMessage(chatId, "🎲 Случайный трюк:\n" + getAny(), rateMenu);
  }

  if (text === "📚 Справка") {
    const info =
      "📚 <b>Краткая справка:</b>\n\n" +
      "UNO — одинарные трюки\n" +
      "DOS — двойные\n" +
      "TRI — тройные\n" +
      "ЖЕСТЬ — самые сложные\n" +
      "Комбо через темп — элемент, пауза, следующий\n" +
      "Комбо в темп — без пауз\n" +
      "Комбо вомбо — самые жёсткие\n" +
      "Поле чудес — рандом";
    return bot.sendMessage(chatId, info, {
      parse_mode: "HTML",
      reply_markup: mainMenu.reply_markup
    });
  }

  // ================= UNO меню =================
  if (text === "UNO — одинарные") {
    return bot.sendMessage(chatId, "UNO — одинарный трюк:\n" + getUno(), rateMenu);
  }

  if (text === "DOS — двойные") {
    return bot.sendMessage(chatId, "DOS — двойной трюк:\n" + getDos(), rateMenu);
  }

  if (text === "TRI — тройные") {
    return bot.sendMessage(chatId, "TRI — тройной трюк:\n" + getTri(), rateMenu);
  }

  if (text === "ЖЕСТЬ — очень сложные") {
    return bot.sendMessage(chatId, "ЖЕСТЬ — сложный трюк:\n" + getHard(), rateMenu);
  }

  // ================= Комбо меню =================
  if (text === "Комбо через темп") {
    return bot.sendMessage(
      chatId,
      "Комбо через темп:\n\n" + getComboCherez(),
      rateMenu
    );
  }

  if (text === "Комбо в темп") {
    return bot.sendMessage(
      chatId,
      "Комбо в темп:\n\n" + getComboVTemp(),
      rateMenu
    );
  }

  if (text === "Комбо вомбо (hardcore)") {
    return bot.sendMessage(
      chatId,
      "Комбо вомбо (hardcore):\n\n" + getComboHard(),
      rateMenu
    );
  }

  // ================= Рейтинг =================
  if (text === "🔥 Норм") {
    return bot.sendMessage(chatId, "Записал как 🔥", mainMenu);
  }

  if (text === "💩 Так себе") {
    return bot.sendMessage(chatId, "Понял, не зашло 💩", mainMenu);
  }

  // ================= BACK =================
  if (text === "⬅️ Назад") {
    return bot.sendMessage(chatId, "🏠 Главное меню:", mainMenu);
  }
});