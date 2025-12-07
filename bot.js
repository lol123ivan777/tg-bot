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

// ============ EMOJI SET ============
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

// ============ KEYBOARDS (INLINE) ============
const mainMenu = {
  inline_keyboard: [
    [{ text: "🖤 COMBOWOMBO — ЖЕСТЬ", callback_data: "combo_menu" }],
    [{ text: "☠️ Поле Чудес — трюки", callback_data: "tricks_menu" }],
    [{ text: "🕳️ Рандомный трюк", callback_data: "random" }],
    [{ text: "📜 Справка", callback_data: "help" }],
    [{ text: "🔄 Рестарт", callback_data: "restart" }]
  ]
};

const tricksMenu = {
  inline_keyboard: [
    [{ text: "⚫ UNO", callback_data: "uno" }],
    [{ text: "🔘 DOS", callback_data: "dos" }],
    [{ text: "☠️ TRI", callback_data: "tri" }],
    [{ text: "💀 ЖЕСТЬ", callback_data: "hard" }],
    [{ text: "⬅️ Назад", callback_data: "back_main" }]
  ]
};

const combosMenu = {
  inline_keyboard: [
    [{ text: "☣️ Через темп", callback_data: "c_cherez" }],
    [{ text: "⚡ В темп", callback_data: "c_temp" }],
    [{ text: "💀 Hardcore", callback_data: "c_hard" }],
    [{ text: "⬅️ Назад", callback_data: "back_main" }]
  ]
};

const rateMenu = {
  inline_keyboard: [
    [
      { text: "🔥 Норм", callback_data: "rate_norm" },
      { text: "💩 Не зашло", callback_data: "rate_bad" }
    ],
    [{ text: "⬅️ Назад", callback_data: "back_main" }]
  ]
};

// ============ HELPERS ============
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ультра-анимация для меню (работает с объектом callback_query q)
async function ultraThanosEdit(q, finalText, finalKb) {
  try {
    const chatId = q.message.chat.id;
    const msgId = q.message.message_id;

    const steps = [
      "🫰 Щёлк...",
      "🌪️ Пошло расслоение материи...",
      "🌫️ Реальность рассыпается на пиксели...",
      "💫 Пространство собирается заново...",
      "✨ Создаю новую вселенную..."
    ];

    for (const t of steps) {
      // редактируем то же сообщение — чтобы не засорять чат
      await bot.editMessageText(t, { chat_id: chatId, message_id: msgId }).catch(() => {});
      await sleep(220);
    }

    // финальный текст — передаём finalKb как объект inline_keyboard (без обёртки)
    return bot.editMessageText(finalText, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: "HTML",
      reply_markup: finalKb
    });
  } catch (err) {
    console.log("ULTRA THANOS ERROR:", err && err.message ? err.message : err);
  }
}

async function showMenuThanos(q, text, keyboard) {
  // отвечаем на callback, чтобы убрать "часики" в клиенте
  await bot.answerCallbackQuery(q.id).catch(() => {});
  return ultraThanosEdit(q, text, keyboard);
}

// плавная генерация трюка поверх того же сообщения
async function processTrick(q, title, fn) {
  const chatId = q.message.chat.id;
  const msgId = q.message.message_id;

  await bot.answerCallbackQuery(q.id).catch(() => {});

  try {
    const waitSteps = [
      EM.loading + " Думаю...",
      EM.loading + " " + EM.loading + " Генерация...",
      "✨ Почти готово..."
    ];

    for (const step of waitSteps) {
      await bot.editMessageText(step, { chat_id: chatId, message_id: msgId });
      await sleep(200);
    }

    const content = fn();

    const card =
      "<b>" + escapeHtml(title) + "</b>\n\n" +
      "<code>" + escapeHtml(content) + "</code>\n\n" +
      EM.success + " Оценивай.";

    await bot.editMessageText(card, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: "HTML",
      reply_markup: rateMenu
    });
  } catch (err) {
    console.log("processTrick error:", err && err.message ? err.message : err);
  }
}

// ============ START ============
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  const sent = await bot.sendMessage(chatId, "Загрузка интерфейса...");

  // собираем «фейковый» объект как у callback_query,
  // чтобы переиспользовать ultraThanosEdit
  const fakeCallback = {
    id: String(Date.now()),
    message: sent
  };

  await ultraThanosEdit(
    fakeCallback,
    EM.brand + " <b>TRICK MACHINE — RIZZ EDITION</b>\n\n" +
      "Добро пожаловать. Выбирай режим.",
    mainMenu
  );
});

// ============ CALLBACK HANDLER ============
bot.on("callback_query", async (q) => {
  const data = q.data;

  // MAIN
  if (data === "back_main") {
    return showMenuThanos(q, "🏠 <b>Главное меню</b>", mainMenu);
  }

  if (data === "restart") {
    return showMenuThanos(
      q,
      "🔄 <b>Полный рестарт интерфейса выполнен.</b>",
      mainMenu
    );
  }

  if (data === "combo_menu") {
    return showMenuThanos(
      q,
      EM.combo + " <b>COMBOWOMBO</b>\nВыбери тип связки:",
      combosMenu
    );
  }

  if (data === "tricks_menu") {
    return showMenuThanos(
      q,
      EM.tri + " <b>Поле Чудес — выбери сложность:</b>",
      tricksMenu
    );
  }

  if (data === "help") {
    const help =
      "<b>RIZZ HELP</b>\n\n" +
      EM.uno + " UNO — базовые элементы\n" +
      EM.dos + " DOS — средние\n" +
      EM.tri + " TRI — сложные\n" +
      EM.hard + " ЖЕСТЬ — хардкор\n\n" +
      EM.combo + " Комбо через темп\n" +
      "⚡ В темп\n" +
      "💀 Hardcore\n\n" +
      "<i>Жми кнопки, текст игнорю.</i>";

    return showMenuThanos(q, help, mainMenu);
  }

  // RANDOM
  if (data === "random") {
    return processTrick(q, "RANDOM TRICK", getAny);
  }

  // TRICKS
  if (data === "uno") return processTrick(q, EM.uno + " UNO", getUno);
  if (data === "dos") return processTrick(q, EM.dos + " DOS", getDos);
  if (data === "tri") return processTrick(q, EM.tri + " TRI", getTri);
  if (data === "hard") return processTrick(q, EM.hard + " ЖЕСТЬ", getHard);

  // COMBOS
  if (data === "c_cherez") return processTrick(q, EM.combo + " Через темп", getComboCherez);
  if (data === "c_temp") return processTrick(q, "⚡ В темп", getComboVTemp);
  if (data === "c_hard") return processTrick(q, EM.hard + " Hardcore", getComboHard);

  // RATING
  if (data === "rate_norm") {
    return showMenuThanos(q, EM.success + " Понял. Записал.", mainMenu);
  }

  if (data === "rate_bad") {
    return showMenuThanos(q, EM.fail + " Приму к сведению.", mainMenu);
  }
});

// ============ ERROR LOG ============
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT:", err && err.stack ? err.stack : err);
});
process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED:", reason);
});