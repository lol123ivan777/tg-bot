const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const {
  getUno,
  getDos,
  getTri,
  getHard,
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
    [{ text: '🎩 UNO / DOS / TRI / ЖЕСТЬ', callback_data: 'uno_menu' }],
    [{ text: '🌀 Комбо блок', callback_data: 'combo_menu' }],
    [{ text: '🎲 Поле чудес (рандом)', callback_data: 'any' }],
    [{ text: '📚 Справка', callback_data: 'help' }],
  ],
};

const unoMenuKb = {
  inline_keyboard: [
    [{ text: 'UNO — одинарные', callback_data: 'uno' }],
    [{ text: 'DOS — двойные', callback_data: 'dos' }],
    [{ text: 'TRI — тройные', callback_data: 'tri' }],
    [{ text: 'ЖЕСТЬ — очень сложные', callback_data: 'hard' }],
    [{ text: '⬅️ Назад в меню', callback_data: 'back_main' }],
  ],
};

const comboMenuKb = {
  inline_keyboard: [
    [{ text: 'Комбо через темп', callback_data: 'combo_cherez' }],
    [{ text: 'Комбо в темп', callback_data: 'combo_vtemp' }],
    [{ text: 'Комбо вомбо (hardcore)', callback_data: 'combo_hard' }],
    [{ text: '⬅️ Назад в меню', callback_data: 'back_main' }],
  ],
};

// ===== START =====
bot.onText(//start/, (msg) => {
  const chatId = msg.chat.id;

  const intro =
`👋 <b>Здарова, артист.</b>

Ты попал в генератор трюков.  
Жми кнопки под сообщением и лови идеи для тренировок.  

<b>Что тут есть:</b>
• UNO / DOS / TRI / ЖЕСТЬ — одиночные трюки по уровням  
• Комбо через темп, в темп и комбо вомбо  
• Поле чудес — случайный трюк  
`;

  bot.sendMessage(chatId, intro, {
    parse_mode: 'HTML',
    reply_markup: mainMenuKb,
  });
});

// ===== CALLBACKS =====
bot.on('callback_query', (q) => {
  const chatId = q.message.chat.id;
  const msgId = q.message.message_id;

  switch (q.data) {
    case 'back_main':
      return edit(
        bot,
        chatId,
        msgId,
        '🏠 <b>Главное меню</b>
Выбирай, что сгенерировать:',
        mainMenuKb,
      );

    case 'uno_menu':
      return edit(
        bot,
        chatId,
        msgId,
        '🎩 <b>Одинарные трюки</b>
Выбери уровень:',
        unoMenuKb,
      );

    case 'combo_menu':
      return edit(
        bot,
        chatId,
        msgId,
        '🌀 <b>Комбо блок</b>
Выбери тип комбо:',
        comboMenuKb,
      );

    // Одиночные трюки
    case 'uno':
      return edit(
        bot,
        chatId,
        msgId,
        'UNO — одинарный трюк:
' + getUno(),
        unoMenuKb,
      );

    case 'dos':
      return edit(
        bot,
        chatId,
        msgId,
        'DOS — двойной трюк:
' + getDos(),
        unoMenuKb,
      );

    case 'tri':
      return edit(
        bot,
        chatId,
        msgId,
        'TRI — тройной трюк:
' + getTri(),
        unoMenuKb,
      );

    case 'hard':
      return edit(
        bot,
        chatId,
        msgId,
        'ЖЕСТЬ — очень сложный трюк:
' + getHard(),
        unoMenuKb,
      );

    // Комбо
    case 'combo_cherez':
      return edit(
        bot,
        chatId,
        msgId,
        'Комбо через темп:
(элемент — темп — двойное — двойное)

' + getComboCherez(),
        comboMenuKb,
      );

    case 'combo_vtemp':
      return edit(
        bot,
        chatId,
        msgId,
        'Комбо в темп:
(элемент элемент, сальто два три три)

' + getComboVTemp(),
        comboMenuKb,
      );

    case 'combo_hard':
      return edit(
        bot,
        chatId,
        msgId,
        'Комбо вомбо (hardcore):

' + getComboHard(),
        comboMenuKb,
      );

    // Поле чудес / случайный трюк
    case 'any':
      return edit(
        bot,
        chatId,
        msgId,
        '🎲 Поле чудес — случайный трюк:
' + getAny(),
        mainMenuKb,
      );

    // Справка
    case 'help':
      return edit(
        bot,
        chatId,
        msgId,
`📚 <b>Краткая справка</b>

UNO — одинарные трюки.  
DOS — двойные.  
TRI — тройные.  
ЖЕСТЬ — самые сложные.

Комбо через темп — элемент, пауза, следующий.  
Комбо в темп — всё подряд, без пауз.  
Комбо вомбо — самые жёсткие связки.

Поле чудес — рандомный трюк из всех списков.`,
        mainMenuKb,
      );
  }
});
