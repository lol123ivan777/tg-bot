const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const {
  getUno,
  getDos,
  getTri,
  getComboCherez,
  getComboVTemp,
  getComboHard,
  getAny,
} = require('./tricks');
const { edit } = require('./utils');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// ===== Клавиатуры =====
const mainMenuKb = {
  inline_keyboard: [
    [{ text: '🎩 Одинарные трюки (Uno, Dos, Tri)', callback_data: 'uno_menu' }],
    [{ text: '🌀 Комбо блок (любые комбинации)', callback_data: 'combo_menu' }],
    [{ text: '🎲 Случайный трюк', callback_data: 'any' }],
    [{ text: '📚 Справка о режимах', callback_data: 'help' }],
  ],
};

const unoMenuKb = {
  inline_keyboard: [
    [{ text: '💠 Uno — простые элементы', callback_data: 'uno' }],
    [{ text: '💠 Dos — средняя сложность', callback_data: 'dos' }],
    [{ text: '💠 Tri — жесткие элементы', callback_data: 'tri' }],
    [{ text: '⬅️ Вернуться в меню', callback_data: 'back_main' }],
  ],
};

const comboMenuKb = {
  inline_keyboard: [
    [{ text: '🔥 Комбо через темп (с паузами)', callback_data: 'combo_cherez' }],
    [{ text: '⚡ Комбо в темп (быстрые)', callback_data: 'combo_vtemp' }],
    [{ text: '💀 Hardcore (максимальный разгон)', callback_data: 'combo_hard' }],
    [{ text: '⬅️ Вернуться в меню', callback_data: 'back_main' }],
  ],
};

// ===== START =====
bot.onText(//start/, (msg) => {
  const chatId = msg.chat.id;

  const intro =
`👋 <b>TrickMachine</b>

Ты попал в генератор трюков и комбо. 

<b>

// ===== CALLBACKS =====
bot.on('callback_query', (q) => {
  const chatId = q.message.chat.id;
  const msgId = q.message.message_id;

  switch (q.data) {
    case 'back_main':
      return edit(bot, chatId, msgId, '🏠 <b>Главное меню</b>
Выбирай режим:', mainMenuKb);

    case 'uno_menu':
      return edit(bot, chatId, msgId, '🎩 <b>Одинарные трюки</b>
Выбери категорию:', unoMenuKb);

    case 'combo_menu':
      return edit(bot, chatId, msgId, '🌀 <b>Комбо блок</b>
Выбери тип комбо:', comboMenuKb);

    // Одинарные трюки
    case 'uno':
      return edit(bot, chatId, msgId, '💠 <b>Uno</b>
' + getUno(), unoMenuKb);

    case 'dos':
      return edit(bot, chatId, msgId, '💠 <b>Dos</b>
' + getDos(), unoMenuKb);

    case 'tri':
      return edit(bot, chatId, msgId, '💠 <b>Tri</b>
' + getTri(), unoMenuKb);

    // Комбо
    case 'combo_cherez':
      return edit(bot, chatId, msgId, '🔥 <b>Комбо через темп</b>
' + getComboCherez(), comboMenuKb);

    case 'combo_vtemp':
      return edit(bot, chatId, msgId, '⚡ <b>Комбо в темп</b>
' + getComboVTemp(), comboMenuKb);

    case 'combo_hard':
      return edit(bot, chatId, msgId, '💀 <b>Hardcore</b>
' + getComboHard(), comboMenuKb);

    // Случайный
    case 'any':
      return edit(bot, chatId, msgId, '🎲 <b>Случайный трюк</b>
' + getAny(), mainMenuKb);

    // Help
    case 'help':
      return edit(
        bot,
        chatId,
        msgId,
`📚 <b>Справка о режимах</b>

<b>Uno</b> — простые элементы.  
<b>Dos</b> — средняя сложность.  
<b>Tri</b> — самые жесткие одиночные трюки.

<b>Комбо через темп</b> — Элемент через темп.  
<b>Комбо в темп</b> — Элементы без темпа(сальто сальто сальто.  
<b>Hardcore</b> — максимально жесткие комбинации.

Используй кнопки ниже.`,
        mainMenuKb,
      );
  }
});