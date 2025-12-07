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

// EMOJI SET
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

// MAIN MENU
const mainMenu = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [
      [{ text: "🖤   COMBOWOMBO — ЖЕСТЬ" }],
      [{ text: "☠️   Поле Чудес — трюки" }],
      [{ text: "🕳️   Рандомный трюк" }],
      [{ text: "📜   Справка" }]
    ]
  }
};

// COMBO MENU
const combMenuKb = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [
      [{ text: "☣️   Через темп" }],
      [{ text: "⚡   В темп" }],
      [{ text: "💀   Hardcore" }],
      [{ text: "⬅️   Назад" }]
    ]
  }
};

// TRICKS MENU
const tricksMenuKb = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [
      [{ text: "⚫   UNO" }],
      [{ text: "🔘   DOS" }],
      [{ text: "☠️   TRI" }],
      [{ text: "💀   ЖЕСТЬ" }],
      [{ text: "⬅️   Назад" }]
    ]
  }
};

// RATE MENU
const rateMenu = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [
      [{ text: "🔥   Норм" }, { text: "💩   Не зашло" }],
      [{ text: "⬅️   Назад" }]
    ]
  }
};

// HELPERS
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function pulseTyping(chatId, times = 2, delay = 350) {
  for (let i = 0; i < times; i++) {
    await bot.sendChatAction(chatId, "typing");
    await sleep(delay);
  }
}

function escapeHtml(text) {
  if (!text && text !== 0) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function animateAndEdit(chatId, title, generatorFn, loading, keyboard) {
  const sent = await bot.sendMessage(chatId, loading);

  await pulseTyping(chatId);

  try {
    await bot.editMessageText(loading + " " + EM.loading, {
      chat_id: chatId,
      message_id: sent.message_id
    });
    await sleep(300);
    await bot.editMessageText(loading + " " + EM.loading + " " + EM.loading, {
      chat_id: chatId,
      message_id: sent.message_id
    });
    await sleep(300);
  } catch (_) {}

  let content = "Ошибка.";
  try {
    content = generatorFn();
  } catch (_) {}

  const msg =
    "<pre>" + EM.brand + " — TRICK MACHINE — IVAN MODE</pre>\n\n" +
    "<b>" + escapeHtml(title) + "</b>\n\n" +
    "<code>" + escapeHtml(content) + "</code>\n\n" +
    EM.success + " <i>Нажми оценку или назад</i>";

  try {
    await bot.editMessageText(msg, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "HTML",
      reply_markup: (keyboard || rateMenu).reply_markup
    });
  } catch (_) {
    await bot.sendMessage(chatId, msg, {
      parse_mode: "HTML",
      reply_markup: (keyboard || rateMenu).reply_markup
    });
  }
}

// START
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  const banner =
    EM.brand + " <b>TRICK MACHINE — IVAN EDITION</b>\n\n" +
    "Давай посмотрим куда тебя заведет фортуна.\n" +
    "Выбирай режим — и получай трюк. И помни, не имеешь права отказаться😄🗿";

  await bot.sendMessage(chatId, banner, {
    parse_mode: "HTML",
    reply_markup: mainMenu.reply_markup
  });
});

// MESSAGE HANDLER
bot.on("message", async (msg) => {
  const text = msg.text && msg.text.trim();
  const chatId = msg.chat.id;
  if (!text) return;

  if (text === "🖤   COMBOWOMBO — ЖЕСТЬ") {
    return bot.sendMessage(chatId, EM.combo + " Выбери тип:", combMenuKb);
  }

  if (text === "☠️   Поле Чудес — трюки") {
    return bot.sendMessage(chatId, EM.tri + " Выбери сложность:", tricksMenuKb);
  }

  if (text === "🕳️   Рандомный трюк") {
    return animateAndEdit(
      chatId,
      "RANDOM TRICK",
      () => getAny(),
      EM.loading + " Кручу вселенную...",
      rateMenu
    );
  }

  if (text === "📜   Справка") {
    const help =
      "<b>RIZZ HELP</b>\n\n" +
      EM.uno + " UNO — простые элементы\n" +
      EM.dos + " DOS — средняя сложность\n" +
      EM.tri + " TRI — жёсткие элементы\n" +
      EM.hard + " ЖЕСТЬ — максимальная сложность\n\n" +
      EM.combo + " Комбо через темп — паузы\n" +
      "⚡ В темп — без остановок\n" +
      "💀 Hardcore — экстремальная связка\n\n" +
      "<i>Бот принимает только кнопки.</i>";

    return bot.sendMessage(chatId, help, {
      parse_mode: "HTML",
      reply_markup: mainMenu.reply_markup
    });
  }

  // TRICKS
  if (text === "⚫   UNO") {
    return animateAndEdit(chatId, "UNO", () => getUno(), EM.loading + " Генерация UNO...");
  }

  if (text === "🔘   DOS") {
    return animateAndEdit(chatId, "DOS", () => getDos(), EM.loading + " Генерация DOS...");
  }

  if (text === "☠️   TRI") {
    return animateAndEdit(chatId, "TRI", () => getTri(), EM.loading + " Генерация TRI...");
  }

  if (text === "💀   ЖЕСТЬ") {
    return animateAndEdit(chatId, "ЖЕСТЬ", () => getHard(), EM.loading + " Генерация жести...");
  }

  // COMBO
  if (text === "☣️   Через темп") {
    return animateAndEdit(chatId, "Комбо через темп", () => getComboCherez(), EM.loading + " Собираю связку...");
  }

  if (text === "⚡   В темп") {
    return animateAndEdit(chatId, "Комбо в темп", () => getComboVTemp(), EM.loading + " Составляю...");
  }

  if (text === "💀   Hardcore") {
    return animateAndEdit(chatId, "HARDCORE COMBO", () => getComboHard(), EM.loading + " Ломаю пространство...");
  }

  // RATE
  if (text === "🔥   Норм") {
    return bot.sendMessage(chatId, EM.success + " Принял.", mainMenu);
  }

  if (text === "💩   Не зашло") {
    return bot.sendMessage(chatId, EM.fail + " Учту.", mainMenu);
  }

  // BACK
  if (text === "⬅️   Назад") {
    return bot.sendMessage(chatId, "🏠 Главное меню:", mainMenu);
  }

  return;
});

// ERRORS
process.on("uncaughtException", (err) => console.error("UNCAUGHT:", err));
process.on("unhandledRejection", (reason) => console.error("UNHANDLED:", reason));