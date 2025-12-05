const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot("8132757841:AAF-NZ7Qyr8s2a0OPF_V-TI8MJMyVTQQd2o", { polling: true });


const allTricks = [
  "сальто",
  "угол",
  "двуха",
  "два угла",
  "две штуки",
  "два бланжа",
  "два с пол винтом",
  "винт заднее",
  "тройное сальто",
  "тройное углом",
  "бланш",
  "180°",
  "360•",
  "540°",
  "720°",
  "сальто вперед",
  "два вперед",
  "три вперед",
  "ЧЕТВЕРНОЕ",
  "три с пол винтом",
  "три с винтом",
  "два в рассрочку",
  "три в расрочку",
  "винт бланш",
  "360 360",
  "два с тремя",
  "два с четырьмя",
  "ПЯТЬ НАЗАД",
  "ПЯТЬ ВПЕРЕД",
  "ЧЕТЫРЕ ВПЕРЕД",
  "бланш вперед",
  "два бланша вперед",
  "арабское",
  "сальто поперек",
  "двойное арабское",
  "два поперек",
  "два твиста",
  "три твиста",
];

const tricksUno = [
  "сальто",
  "угол",
  "бланш",
  "180°",
  "360•",
  "сальто вперед",
  "бланш вперед",
];

const tricksDos = [
  "двуха",
  "два угла",
  "две штуки",
  "два бланша",
  "арабское",
  "сальто поперек",
  "винт бланш",
  "два бланша вперед",
  "два в рассрочку",
  "два с пол винтом",
  "два вперед",
  "два твиста",
  "винт заднее",
];

const tricksTri = [
  "тройное сальто",
  "тройное углом",
  "три твиста",
  "540°",
  "720°",
  "три вперед",
  "три с пол винтом",
  "три с винтом",
  "ЧЕТВЕРНОЕ",
  "ПЯТЬ НАЗАД",
  "ПЯТЬ ВПЕРЕД",
  "ЧЕТЫРЕ НАЗАД",
  "три в рассрочку",
  "два поперек",
  "двойное арабское",
  "360 360",
  "два с тремя",
  "два с четырьмя",
];

const comboCherezTemp = [
  "сальто, два, три",
  "сальто, два, два угла",
  "два два два",
];

const comboVTemp = [
  "два два два",
  "сальто два две штуки",
  "сальто угол бланш",
];

const comboHardcore = [
  "сальто два две штуки сальто два с 180",
  "два два два два два",
  "сальто два три"
];

bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id;

  const menu = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "ComboWombo", callback_data: "combomenu" }],
        [{ text: "ПолеЧудес🎲", callback_data: "polemenu" }],
      ]
    }
  };

  bot.sendMessage(chatId, "Выбери режим:", menu);
});

bot.on("callback_query", query => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "back_main") {
    const menu = {
      reply_markup: {
        inline_keyboard: [
         [{ text: "ComboWombo", callback_data: "combomenu" }],
         [{ text: "ПолеЧудес🎲", callback_data: "polemenu" }],
        ]
      }
    };

    bot.sendMessage(chatId, "Назад к меню:", menu);
}

  if (data === "combomenu") {
    const comboMenu = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "через темп", callback_data: "combo_cherez" }],
          [{ text: "в темп", callback_data: "combo_vtemp" }],
          [{ text: "☠", callback_data: "combo_hardcore" }],
          [{ text: "<— Назад", callback_data: "back_main" }],
        ]
      }
    };

    bot.sendMessage(chatId, "Комбо☠", comboMenu);
}

  if (data === "combo_cherez") {
    const pick = comboCherezTemp[Math.floor(Math.random() * comboCherezTemp.length)];
    bot.sendMessage(chatId, "Комбо (через темп)" + pick);
  }

  if (data === "combo_vtemp") {
    const pick = comboVTemp[Math.floor(Math.random() * comboVTemp.length)];
    bot.sendMessage(chatId, "Комбо (в темп)" + pick);
  }

  if (data === "combo_hardcore") {
    const pick = comboHardcore[Math.floor(Math.random() * comboHardcore.length)];
    bot.sendMessage(chatId, "Комбо (☠)" + pick);
  }

  if (data === "polemenu") {
    const poleMenu = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Uno", callback_data: "uno" }],
          [{ text: "Dos", callback_data: "dos" }],
          [{ text: "Tri", callback_data: "tri" }],
          [{ text: "Хз", callback_data: "random_all" }],
          [{ text: "<— Назад", callback_data: "back_main" }],
        ]
      }
    };

    bot.sendMessage(chatId, "Выбери уровень:", poleMenu);
}

  if (data === "uno") {
    const pick = tricksUno[Math.floor(Math.random() * tricksUno.length)];
    bot.sendMessage(chatId, "Трюк (Uno)" + pick);
  }

  if (data === "dos") {
    const pick = tricksDos[Math.floor(Math.random() * tricksDos.length)];
    bot.sendMessage(chatId, "Трюк (Dos)" + pick);
  }

  if (data === "tri") {
    const pick = tricksTri[Math.floor(Math.random() * tricksTri.length)];
    bot.sendMessage(chatId, "Трюк (Tres)" + pick);
  }

  if (data === "random_all") {
    const pick = allTricks[Math.floor(Math.random() * allTricks.length)];
    bot.sendMessage(chatId, "Трюк (🎲)" + pick);
  }

  bot.answerCallbackQuery(query.id);
});
