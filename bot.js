const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

const data = JSON.parse(fs.readFileSync("./tricks.json", "utf8"));

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

//======== одинарные ====
function getUno() { return random(data.tricksUno); }
function getDos() { return random(data.tricksDos); }
function getTri() { return random(data.tricksTri); }

//--------- combo ----------
function getComboCherez() { return random(data.comboCherezTemp); }
function getComboVTemp() { return random(data.comboVTemp); }
function getComboHard() { return random(data.comboHardcore); }

//--------- ANY ------------
function getAny() {
  return random([
    ...data.tricksUno,
    ...data.tricksDos,
    ...data.tricksTri,
    ...data.comboCherezTemp,
    ...data.comboVTemp,
    ...data.comboHardcore
  ]);
}

// Инлайн-кнопки — большие и понятные
const mainMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🎩 Одинарные трюки", callback_data: "uno_menu" }],
      [{ text: "🌀 Комбо блок", callback_data: "combo_menu" }],
      [{ text: "🎲 Случайный трюк", callback_data: "any" }],
      [{ text: "📚 Справка", callback_data: "help" }]
    ]
  }
};

const unoMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "💠 Uno", callback_data: "uno" }],
      [{ text: "💠 Dos", callback_data: "dos" }],
      [{ text: "💠 Tri", callback_data: "tri" }],
      [{ text: "⬅️ Назад", callback_data: "back_main" }]
    ]
  }
};

const comboMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🔥 Через темп", callback_data: "combo_cherez" }],
      [{ text: "⚡ В темп", callback_data: "combo_vtemp" }],
      [{ text: "💀 Hardcore", callback_data: "combo_hard" }],
      [{ text: "⬅️ Назад", callback_data: "back_main" }]
    ]
  }
};

//========== BOT ==========
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Приветствие
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const intro =
`👋 Добро пожаловать в TrickMachine!

Это бот, который выдает трюки, комбо и комбинации для твоих сценариев, выступлений или тренировок.

🧩 Внутри:
• Одинарные трюки (Uno, Dos, Tri)
• Комбо: через темп, в темп, hardcore
• Генератор случайного трюка
• Полный список всех трюков для просмотра

👇 Ниже кнопки. Нажимай — и поехали.
`;

  // Список всех трюков на главном экране:
  const allTricks =
`📜 Все доступные трюки:

🔹 Uno: ${data.tricksUno.length}
🔹 Dos: ${data.tricksDos.length}
🔹 Tri: ${data.tricksTri.length}
🔹 Combo через темп: ${data.comboCherezTemp.length}
🔹 Combo в темп: ${data.comboVTemp.length}
🔹 Hardcore: ${data.comboHardcore.length}
`;

  bot.sendMessage(chatId, intro + "\n" + allTricks, mainMenu);
});

//========== CALLBACKS ==========
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;

  switch (query.data) {

    // меню
    case "back_main":
      return bot.sendMessage(chatId, "Главное меню:", mainMenu);

    case "uno_menu":
      return bot.sendMessage(chatId, "Выбери тип одинарного трюка:", unoMenu);

    case "combo_menu":
      return bot.sendMessage(chatId, "Выбери тип комбо:", comboMenu);

    // одиночные
    case "uno":
      return bot.sendMessage(chatId, "🎩 Uno:\n" + getUno());
    case "dos":
      return bot.sendMessage(chatId, "🎩 Dos:\n" + getDos());
    case "tri":
      return bot.sendMessage(chatId, "🎩 Tri:\n" + getTri());

    // комбо
    case "combo_cherez":
      return bot.sendMessage(chatId, "🔥 Комбо через темп:\n" + getComboCherez());
    case "combo_vtemp":
      return bot.sendMessage(chatId, "⚡ Комбо в темп:\n" + getComboVTemp());
    case "combo_hard":
      return bot.sendMessage(chatId, "💀 Hardcore:\n" + getComboHard());

    // рандом
    case "any":
      return bot.sendMessage(chatId, "🎲 Случайный трюк:\n" + getAny());

    // справка
    case "help":
      return bot.sendMessage(chatId,
`📚 Справка:

🔸 Одинарные трюки — простые элементы.
🔸 Combo через темп — связки с паузами.
🔸 Combo в темп — быстрые связки без остановок.
🔸 Hardcore — максимально жесткие штуки.

Используй меню, выбирай режим и получай трюки.`);
  }
});