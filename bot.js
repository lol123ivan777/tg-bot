const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
require("dotenv").config();

const data = JSON.parse(fs.readFileSync("./tricks.json", "utf8"));
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// ===== Helpers =====
const random = arr => arr[Math.floor(Math.random() * arr.length)];

const getUno = () => random(data.tricksUno);
const getDos = () => random(data.tricksDos);
const getTri = () => random(data.tricksTri);

const getComboCherez = () => random(data.comboCherezTemp);
const getComboVTemp = () => random(data.comboVTemp);
const getComboHard = () => random(data.comboHardcore);

const getAny = () =>
  random([
    ...data.tricksUno,
    ...data.tricksDos,
    ...data.tricksTri,
    ...data.comboCherezTemp,
    ...data.comboVTemp,
    ...data.comboHardcore
  ]);

function edit(chatId, msgId, text, keyboard) {
  return bot.editMessageText(text, {
    chat_id: chatId,
    message_id: msgId,
    parse_mode: "HTML",
    reply_markup: keyboard
  });
}

// ===== Keyboards =====
const mainMenuKb = {
  inline_keyboard: [
    [{ text: "🎩 Одинарные трюки (Uno, Dos, Tri)", callback_data: "uno_menu" }],
    [{ text: "🌀 Комбо блок (любые комбинации)", callback_data: "combo_menu" }],
    [{ text: "🎲 Случайный трюк", callback_data: "any" }],
    [{ text: "📚 Справка о режимах", callback_data: "help" }]
  ]
};

const unoMenuKb = {
  inline_keyboard: [
    [{ text: "💠 Uno — простые элементы", callback_data: "uno" }],
    [{ text: "💠 Dos — средняя сложность", callback_data: "dos" }],
    [{ text: "💠 Tri — жесткие элементы", callback_data: "tri" }],
    [{ text: "⬅️ Вернуться в меню", callback_data: "back_main" }]
  ]
};

const comboMenuKb = {
  inline_keyboard: [
    [{ text: "🔥 Комбо через темп (с паузами)", callback_data: "combo_cherez" }],
    [{ text: "⚡ Комбо в темп (быстрые)", callback_data: "combo_vtemp" }],
    [{ text: "💀 Hardcore (максимальный разгон)", callback_data: "combo_hard" }],
    [{ text: "⬅️ Вернуться в меню", callback_data: "back_main" }]
  ]
};

// ===== START =====
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const intro =
`👋 <b>TrickMachine</b>

Ты попал в генератор трюков и комбо.  
Никакого мусора в чате — одно живое меню.  

<b>Что умеет бот:</b>
• Одинарные трюки: Uno, Dos, Tri  
• Комбо: через темп, в темп, hardcore  
• Генерация случайного трюка  
• Справка по режимам  
`;

  bot.sendMessage(chatId, intro, {
    parse_mode: "HTML",
    reply_markup: mainMenuKb
  });
});

// ===== CALLBACKS =====
bot.on("callback_query", (q) => {
  const chatId = q.message.chat.id;
  const msgId = q.message.message_id;

  switch (q.data) {

    case "back_main":
      return edit(chatId, msgId, "🏠 <b>Главное меню</b>\nВыбирай режим:", mainMenuKb);

    case "uno_menu":
      return edit(chatId, msgId, "🎩 <b>Одинарные трюки</b>\nВыбери категорию:", unoMenuKb);

    case "combo_menu":
      return edit(chatId, msgId, "🌀 <b>Комбо блок</b>\nВыбери тип комбо:", comboMenuKb);

    // Одинарные трюки
    case "uno":
      return edit(chatId, msgId, "💠 <b>Uno</b>\n" + getUno(), unoMenuKb);

    case "dos":
      return edit(chatId, msgId, "💠 <b>Dos</b>\n" + getDos(), unoMenuKb);

    case "tri":
      return edit(chatId, msgId, "💠 <b>Tri</b>\n" + getTri(), unoMenuKb);

    // Комбо
    case "combo_cherez":
      return edit(chatId, msgId, "🔥 <b>Комбо через темп</b>\n" + getComboCherez(), comboMenuKb);

    case "combo_vtemp":
      return edit(chatId, msgId, "⚡ <b>Комбо в темп</b>\n" + getComboVTemp(), comboMenuKb);

    case "combo_hard":
      return edit(chatId, msgId, "💀 <b>Hardcore</b>\n" + getComboHard(), comboMenuKb);

    // Случайный
    case "any":
      return edit(chatId, msgId, "🎲 <b>Случайный трюк</b>\n" + getAny(), mainMenuKb);

    // Help
    case "help":
      return edit(
        chatId,
        msgId,
`📚 <b>Справка о режимах</b>

<b>Uno</b> — простые элементы.  
<b>Dos</b> — средняя сложность.  
<b>Tri</b> — самые жесткие одиночные трюки.

<b>Комбо через темп</b> — связки с паузами.  
<b>Комбо в темп</b> — быстрые связки без остановок.  
<b>Hardcore</b> — максимально жесткие комбинации.

Используй кнопки ниже.`,
        mainMenuKb
      );
  }
});