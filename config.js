require("dotenv").config();
const path = require('path')

const config = {
  port: process.env.PORT || 3000,
  geoIpDbPath: path.join(__dirname, 'GeoLite2-City.mmdb'),
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,
  formRecipientEmail: process.env.FORM_RECIPIENT_EMAIL,
  nodemailerTransport: {
    host: process.env.SMTP_EMAIL_HOST,
    port: process.env.SMTP_EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL_USER,
      pass: process.env.SMTP_EMAIL_PASSWORD
    }
  }
};

module.exports = config