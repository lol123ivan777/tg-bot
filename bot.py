from telegram.ext import ApplicationBuilder

async def start(update, context):
    await update.message.reply_text("Привет, я тестбот лол:)")

app = ApplicationBuilder().token("8132757841:AAF-NZ7Qyr8s2a0OPF_V-TI8MJMyVTQQd2o").build()
app.add_handler(CommandHandler("start", start))

app.run_polling()
