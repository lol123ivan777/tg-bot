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
  fail: "💩",
  back: "⬅️",
  restart: "🔄"
};

// ============ UNIVERSAL SNAP FX ============
async function thanosEdit(chatId, msgId, finalText, finalKb) {
  try {
    const steps = [
      "🫰 Щёлк...",
      "🌫️ Реальность рассыпается...",
      "✨ Формирую новую вселенную..."
    ];

    for (const t of steps) {
      await bot.editMessageText(t, {
        chat_id: chatId,
        message_id: msgId
      });
      await new Promise(res => setTimeout(res, 180));
    }

    return bot.editMessageText(finalText, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: "HTML",
      reply_markup: finalKb
    });

  } catch (_) {}
}

// ============ KEYBOARDS ============
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
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function processTrick(chatId, msgId, title, fn) {
  try {
    const wait = [
      EM.loading + " Думаю...",
      EM.loading + " " + EM.loading + " Генерация...",
      "✨ Почти готово..."
    ];

    for (const step of wait) {
      await bot.editMessageText(step, {
        chat_id: chatId,
        message_id: msgId
      });
      await new Promise(res => setTimeout(res, 200));
    }

    const content = fn();

    const card =
      "<b>" + title + "</b>\n\n" +
      "<code>" + escapeHtml(content) + "</code>\n\n" +
      EM.success + " Оценивай.";

    await bot.editMessageText(card, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: "HTML",
      reply_markup: rateMenu
    });

  } catch (_) {}
}

// ============ START ============
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId,
    EM.brand + " <b>TRICK MACHINE — RIZZ EDITION</b>\n\n" +
    "Добро пожаловать. Выбирай режим.\n",
    {
      parse_mode: "HTML",
      reply_markup: mainMenu
    }
  );
});

// ============ CALLBACK HANDLER ============
bot.on("callback_query", async (q) => {
  const chatId = q.message.chat.id;
  const msgId = q.message.message_id;
  const data = q.data;

  // MAIN
  if (data === "back_main") {
    return thanosEdit(
      chatId,
      msgId,
      "🏠 <b>Главное меню</b>",
      mainMenu
    );
  }

  if (data === "restart") {
    return thanosEdit(
      chatId,
      msgId,
      "🔄 <b>Полный рестарт интерфейса выполнен.</b>",
      mainMenu
    );
  }

  if (data === "combo_menu") {
    return thanosEdit(
      chatId,
      msgId,
      EM.combo + " <b>COMBOWOMBO</b>\nВыбери тип связки:",
      combosMenu
    );
  }

  if (data === "tricks_menu") {
    return thanosEdit(
      chatId,
      msgId,
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
      EM.combo + " Комбо через темп\n⚡ В темп\n💀 Hardcore\n\n" +
      "<i>Жми кнопки, текст игнорю.</i>";

    return thanosEdit(chatId, msgId, help, mainMenu);
  }

  // RANDOM
  if (data === "random") {
    return processTrick(chatId, msgId, "RANDOM TRICK", getAny);
  }

  // TRICKS
  if (data === "uno") return processTrick(chatId, msgId, EM.uno + " UNO", getUno);
  if (data === "dos") return processTrick(chatId, msgId, EM.dos + " DOS", getDos);
  if (data === "tri") return processTrick(chatId, msgId, EM.tri + " TRI", getTri);
  if (data === "hard") return processTrick(chatId, msgId, EM.hard + " ЖЕСТЬ", getHard);

  // COMBOS
  if (data === "c_cherez") return processTrick(chatId, msgId, EM.combo + " Через темп", getComboCherez);
  if (data === "c_temp") return processTrick(chatId, msgId, "⚡ В темп", getComboVTemp);
  if (data === "c_hard") return processTrick(chatId, msgId, EM.hard + " Hardcore", getComboHard);

  // RATING
  if (data === "rate_norm") {
    return thanosEdit(
      chatId,
      msgId,
      EM.success + " Понял. Записал.",
      mainMenu
    );
  }

  if (data === "rate_bad") {
    return thanosEdit(
      chatId,
      msgId,
      EM.fail + " Приму к сведению.",
      mainMenu
    );
  }
});

// ============ ERROR LOG ============
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT:", err.stack || err);
});
process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED:", reason);
});