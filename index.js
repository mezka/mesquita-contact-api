const express = require('express')
const geoip = require('./geoip/geoip')
const config = require('./config'); //Deleting semi-colon causes all sorts of problems
const { body, validationResult } = require('express-validator');
const TelegramBot = require("node-telegram-bot-api");
const nodemailer = require('nodemailer');
const cors = require('cors');
const { nodemailerTransport } = require('./config');
const renderTemplate = require('./utils/renderTemplate');
const formatTypeString = require('./utils/formatTypeString');

(async () => { await geoip.init(config.geoIpDbPath) })()

const port = 3000
const app = express()

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport(config.nodemailerTransport);

bot = new TelegramBot(config.telegramBotToken)

formBodyRequirements = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('type').notEmpty().isIn(['puerta_blindada', 'cerramiento_blindado']).withMessage("Either 'puerta_blindada' or 'cerramiento_blindado' type is required")
]

app.post('/api/form/submit', formBodyRequirements, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Form validation error', errors: errors.array() });
    }

    const { name, email, phone, message, type } = req.body;

    let geoData = null

    try{
        geoData = geoip.getGeo(req.ip);
    } catch (err) {
        console.error('Error getting geoData:', err);
    }

    const renderData = {
        origin: req.headers.origin? `Mesquita Hnos (${req.headers.origin})`:'(Error: Origen no disponible)',
        name,
        phone,
        email,
        message,
        ip: req.ip,
        country: geoData && geoData.country?.names?.es || 'No disponible',
        region: geoData && geoData.subdivisions?.[0]?.names?.es || 'No disponible',
        city: geoData && geoData.city?.names?.es || 'No disponible'
    };
    
    const text = renderTemplate('contact_template.mustache', renderData);

    const mailOptions = {
        from: `"${nodemailerTransport.auth.user}" <${nodemailerTransport.auth.user}>`,
        to: config.formRecipientEmail,
        subject: `Solicitud de presupuesto ${formatTypeString(type)}`,
        text
    };

    try {

        const smtpResponse = await transporter.sendMail({ ...mailOptions, text });
        console.log('Email sent:', smtpResponse.messageId);
    } catch (err) {
        console.error('Error sending email:', err);
    }

    try {
        await bot.sendMessage(config.telegramChatId, text);
        res.status(200).json({ success: true, message: 'Form succesfully submitted to Telegram Bot' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Form submission failed to Telegram Bot', errors: [err] })
    }

})

app.listen(port, () => {
    console.log(`Mesquita Contact API listening on port: ${port}`)
})