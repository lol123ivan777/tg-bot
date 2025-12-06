const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const combos = require("./combos.js");

//-------превью все трюкво----
function getAllTricksPreviw() {
  return (
    " uno  " + combos.getUno () + "\n\" +
    " dos  " + combos.getDos () + "\n\" +
    " tri  " + combos.getTri () + "\n\" +
    " dos  " + combos.getComboCherez () + "\n\" +
    " uno  " + combos.getComboVTemp () + "\n\" +
    " dos  " + combos.getCombohard ()

  );
}


//--------старт экран----
bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id;

  const greeting =
    "Ну что Артист, здарова. Это акробатическое казино🎰\n" +
    "Не знаешь что прыг-нуть?🤸‍ Сейчас подберем \n\n" +
    "Выбирай, может пятерик хочешь😎\n" +

  bot.sendMessage(chatId, greeting, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "ComboWombo": , callback_data: "explain_combo }],
        [{ text: "ПолеЧудес": , callback_data:"explain_combo }]
      ]
    }
  });
});
     





  bot.sendMessage(chatId, "Выбери режим:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "ComboWombo", callback_data: "combomenu" }],
        [{ text: "Поле Чудес 🎲", callback_data: "polemenu" }]
      ]
    }
  });
});

bot.on("callback_query", query => {
  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const data = query.data;

  // ===== Главное меню =====
  if (data === "back_main") {
    return bot.editMessageText("Выбери режим:", {
      chat_id: chatId,
      message_id: msgId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "ComboWombo", callback_data: "combomenu" }],
          [{ text: "Поле Чудес 🎲", callback_data: "polemenu" }]
        ]
      }
    });
  }

  // ===== Меню Комбо =====
  if (data === "combomenu") {
    return bot.editMessageText("Комбо ☠", {
      chat_id: chatId,
      message_id: msgId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "Через темп", callback_data: "combo_cherez" }],
          [{ text: "В темп", callback_data: "combo_vtemp" }],
          [{ text: "☠ Хардкор", callback_data: "combo_hardcore" }],
          [{ text: "← Назад", callback_data: "back_main" }]
        ]
      }
    });
  }

  // ===== Отдельные комбо =====
  if (data === "combo_cherez") {
    return bot.editMessageText("Комбо (через темп):\n" + combos.getComboCherez(), {
      chat_id: chatId,
      message_id: msgId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "← Назад", callback_data: "combomenu" }]
        ]
      }
    });
  }

  if (data === "combo_vtemp") {
    return bot.editMessageText("Комбо (в темп):\n" + combos.getComboVTemp(), {
      chat_id: chatId,
      message_id: msgId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "← Назад", callback_data: "combomenu" }]
        ]
      }
    });
  }

  if (data === "combo_hardcore") {
    return bot.editMessageText("Комбо (☠):\n" + combos.getComboHard(), {
      chat_id: chatId,
      message_id: msgId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "← Назад", callback_data: "combomenu" }]
        ]
      }
    });
  }

  // ===== Поле Чудес =====
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

  // ===== Отдельные трюки =====
  if (data === "uno") {
    return bot.editMessageText("Трюк (Uno):\n" + combos.getUno(), {
      chat_id: chatId,
      message_id: msgId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "← Назад", callback_data: "polemenu" }]
        ]
      }
    });
  }

  if (data === "dos") {
    return bot.editMessageText("Трюк (Dos):\n" + combos.getDos(), {
      chat_id: chatId,
      message_id: msgId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "← Назад", callback_data: "polemenu" }]
        ]
      }
    });
  }

  if (data === "tri") {
    return bot.editMessageText("Трюк (Tri):\n" + combos.getTri(), {
      chat_id: chatId,
      message_id: msgId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "← Назад", callback_data: "polemenu" }]
        ]
      }
    });
  }

  // ===== Рандом =====
  if (data === "random_all") {
    const list = [
      combos.getUno(),
      combos.getDos(),
      combos.getTri(),
      combos.getComboCherez(),
      combos.getComboVTemp(),
      combos.getComboHard()
    ];

    const r = list[Math.floor(Math.random() * list.length)];

    return bot.editMessageText("Трюк (🎲):\n" + r, {
      chat_id: chatId,
      message_id: msgId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "← Назад", callback_data: "polemenu" }]
        ]
      }
    });
  }
});
