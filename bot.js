require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

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

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// ---------- EMOJI SET (Dark / Rizz) ----------
const EM = {
  brand: "🖤",
  uno: "⚫",
  dos: "🔘",
  tri: "☠️",
  hard: "💀",
  combo: "☣️",
  random: "🕳️",
  loading: "⚙️",
  success: "🔥",
  fail: "💩"
};

// ---------- KEYBOARDS (big buttons) ----------
const mainMenu = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [
      [{ text: "🖤 " + "COMBOWOMBO — ЖЕСТЬ" }],
      [{ text: "☠️ " + "Поле Чудес — трюки" }],
      [{ text: "🕳️ " + "Рандомный трюк" }],
      [{ text: "📜 " + "Справка" }]
    ],
    one_time_keyboard: false
  }
};

const combMenuKb = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [
      [{ text: "☣️ Через темп" }],
      [{ text: "⚡ В темп" }],
      [{ text: "💀 Hardcore" }],
      [{ text: "⬅️ Назад" }]
    ]
  }
};

const tricksMenuKb = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [
      [{ text: "⚫ UNO" }],
      [{ text: "🔘 DOS" }],
      [{ text: "☠️ TRI" }],
      [{ text: "💀 ЖЕСТЬ" }],
      [{ text: "⬅️ Назад" }]
    ]
  }
};

const rateMenu = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [
      [{ text: "🔥 Норм" }, { text: "💩 Не зашло" }],
      [{ text: "⬅️ Назад" }]
    ]
  }
};

// ---------- HELPERS ----------
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function pulseTyping(chatId, times = 3, delay = 600) {
  try {
    for (let i = 0; i < times; i++) {
      await bot.sendChatAction(chatId, "typing");
      await sleep(delay);
    }
  } catch (e) {
    // ignore chatAction errors
  }
}

async function animateAndEdit(chatId, baseText, generatorFn, loadingText, keyboard) {
  // Send a single "loading" message, animate it, then edit to result
  const sent = await bot.sendMessage(chatId, loadingText);
  // simulate dark loading steps
  await pulseTyping(chatId, 2, 400);
  // small step edits to feel alive
  try {
    await bot.editMessageText(loadingText + " " + EM.loading, {
      chat_id: chatId,
      message_id: sent.message_id
    });
    await sleep(350);
    await bot.editMessageText(loadingText + " " + EM.loading + " " + EM.loading, {
      chat_id: chatId,
      message_id: sent.message_id
    });
    await sleep(350);
  } catch (e) {
    // editing may fail if message removed; ignore and continue
  }

  // generate content
  const content = await (async () => {
    try {
      return generatorFn();
    } catch (e) {
      return "Ошибка генерации.";
    }
  })();

  // build final card (HTML)
  const card =
    "<pre>" + EM.brand + " — TRICK MACHINE — RIZZ MODE</pre>\n\n" +
    "<b>" + baseText + "</b>\n\n" +
    "<code>" + escapeHtml(content) + "</code>\n\n" +
    EM.success + " <i>Нажми оценку или назад</i>";

  // edit to final
  try {
    await bot.editMessageText(card, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "HTML",
      reply_markup: keyboard ? keyboard.reply_markup : rateMenu.reply_markup
    });
  } catch (e) {
    // fallback: send fresh message if edit fails
    await bot.sendMessage(chatId, card, {
      parse_mode: "HTML",
      reply_markup: keyboard ? keyboard.reply_markup : rateMenu.reply_markup
    });
  }
}

function escapeHtml(text) {
  if (!text && text !== 0) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ---------- START ----------
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  const banner =
    EM.brand + " <b>TRICK MACHINE — RIZZ EDITION</b>\n\n" +
    "Добро. Тёмно. Опасно.\n" +
    "Выбирай режим — и я выдам трюк, который можно либо сделать, либо поломать.";
  await bot.sendMessage(chatId, banner, {
    parse_mode: "HTML",
    reply_markup: mainMenu.reply_markup
  });
});

// ---------- MESSAGE HANDLERS (reply-keyboard) ----------
bot.on("message", async (msg) => {
  const text = msg.text && msg.text.trim();
  const chatId = msg.chat.id;

  // MAIN MENU
  if (text === "🖤 COMBOWOMBO — ЖЕСТЬ" || text === "🎩 UNO / DOS / TRI / ЖЕСТЬ") {
    // Keep compatibility: respond with combowombo menu
    return bot.sendMessage(chatId, EM.combo + " COMBOWOMBO — выбор типа:", {
      reply_markup: combMenuKb.reply_markup
    });
  }

  if (text === "🌀 Комбо блок" || text === "🌀 COMBO BLOCK") {
    return bot.sendMessage(chatId, EM.combo + " Комбо — выбери:", {
      reply_markup: combMenuKb.reply_markup
    });
  }

  if (text === "☠️ Поле Чудес — трюки" || text === "☠️ Поле Чудес — трюки") {
    return bot.sendMessage(chatId, EM.tri + " Поле Чудес — выбери сложность:", {
      reply_markup: tricksMenuKb.reply_markup
    });
  }

  if (text === "🕳️ Рандомный трюк" || text === "🎲 Поле чудес (рандом)" || text === "🕳️ Рандомный трюк") {
    return animateAndEdit(chatId, "RANDOM TRICK", () => getAny(), EM.loading + " Крутим вселенную...", rateMenu);
  }

  if (text === "📜 Справка" || text === "📚 Справка") {
    const help =
      "<b>RIZZ HELP</b>\n\n" +
      EM.uno + " UNO — простые элементы\n" +
      EM.dos + " DOS — средняя сложность\n" +
      EM.tri + " TRI — жёсткие элементы\n" +
      EM.hard + " ЖЕСТЬ — сложнейшие приёмы\n\n" +
      EM.combo + " Комбо через темп — паузы и ритм\n" +
      "⚡ Комбо в темп — без пауз\n" +
      "💀 Комбо вомбо — экстремум\n\n" +
      "<i>Используй клавиатуру. Оценки сохраняются локально.</i>";
    return bot.sendMessage(chatId, help, {
      parse_mode: "HTML",
      reply_markup: mainMenu.reply_markup
    });
  }

  // TRICKS MENU
  if (text === "⚫ UNO" || text === "UNO — одинарные") {
    return animateAndEdit(chatId, EM.uno + " UNO", () => getUno(), EM.loading + " Генерация UNO...", rateMenu);
  }

  if (text === "🔘 DOS" || text === "DOS — двойные") {
    return animateAndEdit(chatId, EM.dos + " DOS", () => getDos(), EM.loading + " Генерация DOS...", rateMenu);
  }

  if (text === "☠️ TRI" || text === "TRI — тройные") {
    return animateAndEdit(chatId, EM.tri + " TRI", () => getTri(), EM.loading + " Генерация TRI...", rateMenu);
  }

  if (text === "💀 ЖЕСТЬ" || text === "ЖЕСТЬ — очень сложные") {
    return animateAndEdit(chatId, EM.hard + " ЖЕСТЬ", () => getHard(), EM.loading + " Собираю ЖЕСТЬ...", rateMenu);
  }

  // COMBO MENU
  if (text === "Комбо через темп") {
    return animateAndEdit(chatId, EM.combo + " Комбо через темп", () => getComboCherez(), EM.loading + " Составляю связку...", rateMenu);
  }

  if (text === "Комбо в темп") {
    return animateAndEdit(chatId, EM.combo + " Комбо в темп", () => getComboVTemp(), EM.loading + " Составляю связку...", rateMenu);
  }

  if (text === "Комбо вомбо (hardcore)" || text === "💀 Hardcore") {
    return animateAndEdit(chatId, EM.hard + " COMBO HARDCORE", () => getComboHard(), EM.loading + " Заряжаю вомбо...", rateMenu);
  }

  // RATE buttons (simple responses)
  if (text === "🔥 Норм") {
    await bot.sendMessage(chatId, EM.success + " Записал рейтинг. Спасибо.", mainMenu);
    return;
  }

  if (text === "💩 Не зашло" || text === "💩 Так себе") {
    await bot.sendMessage(chatId, EM.fail + " Принял. Буду учиться.", mainMenu);
    return;
  }

  // BACK
  if (text === "⬅️ Назад") {
    return bot.sendMessage(chatId, "🏠 Главное меню:", mainMenu);
  }

  // Unknown input — gentle nudge
  return bot.sendMessage(chatId, "Не понял. Жми кнопку из меню.", mainMenu);
});

// ---------- graceful logging of errors ----------
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT:", err && err.stack ? err.stack : err);
});
process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});