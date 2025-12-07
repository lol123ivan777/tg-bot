function edit(bot, chatId, msgId, text, keyboard) {
  return bot.editMessageText(text, {
    chat_id: chatId,
    message_id: msgId,
    parse_mode: 'HTML',
    reply_markup: keyboard,
  });
}

module.exports = { edit };