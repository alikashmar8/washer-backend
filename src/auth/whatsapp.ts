import { Client } from 'whatsapp-web.js';

let qrCode = '';
let isAuthenticated = false;

let client = new Client({
  takeoverOnConflict: true,
  takeoverTimeoutMs: 0,
});

client.on('qr', (qr) => {
  if (!qrCode)
    console.log("QR Code Ready");
  qrCode = qr;
});

client.on('ready', () => {
  console.log('Client is ready!');
  isAuthenticated = true;
});

// client.on('message', msg => {
//     if (msg.body == '!ping') {
//         msg.reply('pong');
//     }
// });

client.initialize().catch(_ => _);

export async function isWhatsappReady() {
  const state = await client.getState();
  return !!state && !!client.info;
}

export function getWhatsappQrCode() {
  return qrCode;
}

export async function sendWhatsappMessage(number: string, message: string) {
  const isReady = await isWhatsappReady();
  if (!isReady) {
    return false;
  }
  // Getting chatId from the number.
  // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
  const firstChar = number.charAt(0);
  let chatId;
  if (firstChar == '+') chatId = number.substring(1) + '@c.us';
  else chatId = number + '@c.us';
  const res = await client.sendMessage(chatId, message);
  console.log('Whatsapp sending message response');
  console.log(res);
  return res.getInfo();
}

export async function sendWhatsappTestMessage() {
  const isReady = await isWhatsappReady();
  if (!isReady) {
    return false;
  }

  const myChatId = client.info.me._serialized;
  const res = await client.sendMessage(myChatId, 'Test message from server');
  console.log('Whatsapp sending message response');
  console.log(res);
  return res.getInfo();
}

export async function terminateWhatsappConfiguration() {
  try {
    // client.resetState();
    // client.logout();
    client.destroy();
    client.initialize().catch(_ => _);
    return true;
  } catch (err) {
    return false;
  }
}

// whatsapp_client.on("authenticated", (session) => {
//   console.log("Authenticated!");
//   sessionCfg = session;

//   socket.emit("authenticated", session);
// });


// setInterval(() => {
//   client.pupPage.evaluate(() => {
//   navigator.sendBeacon('https://WHATSAPP_BUSINESS_API/keepalive');
//   });
//   }, 300000);
