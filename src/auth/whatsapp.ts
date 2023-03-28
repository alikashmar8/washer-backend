const { Client } = require('whatsapp-web.js');

let qrCode = '';

const client = new Client({
  takeoverOnConflict: true,
  takeoverTimeoutMs: 0,
});

client.on('qr', (qr) => {
  qrCode = qr;
});

client.on('ready', () => {
  console.log('Client is ready!');
});

// client.on('message', msg => {
//     if (msg.body == '!ping') {
//         msg.reply('pong');
//     }
// });

client.initialize();

export async function isWhatsappReady() {
  const state = await client.getState();
  return !!state && !!client.info;
}

export function getWhatsappQrCode() {
  return qrCode;
}

export async function sendWhatsappMessage(number, message) {
  const isReady = await isWhatsappReady();
  if (!isReady){
    return false;
  }
  // Getting chatId from the number.
  // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
  const chatId = number.substring(1) + '@c.us';
  const res = await client.sendMessage(chatId, message);
  return res.getInfo();
}

