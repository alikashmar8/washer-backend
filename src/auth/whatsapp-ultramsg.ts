var qs = require("querystring");
var http = require("https");

var options = {
  "method": "POST",
  "hostname": "api.ultramsg.com",
  "port": null,
  "path": "/instance78368/messages/chat",
  "headers": {
    "content-type": "application/x-www-form-urlencoded"
  }
};

export async function isWhatsappReady(){return true;}

export function getWhatsappQrCode() {return '';}

export async function sendWhatsappMessage(number, message){
    var req = http.request(options, function (res) {
        var chunks = [];
      
        res.on("data", function (chunk) {
          chunks.push(chunk);
        });
      
        res.on("end", function () {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
        });
      });
      
      var postData = qs.stringify({
          "token": "eq78xwd29w5igpkv",
          "to": number,
          "body": message
      });
      req.write(postData);
      req.end();
}

export async function sendWhatsappTestMessage(){
    var req = http.request(options, function (res) {
        var chunks = [];
      
        res.on("data", function (chunk) {
          chunks.push(chunk);
        });
      
        res.on("end", function () {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
        });
      });
      
      var postData = qs.stringify({
          "token": "eq78xwd29w5igpkv",
          "to": "96178914474",
          "body": "WhatsApp API on UltraMsg.com works good"
      });
      req.write(postData);
      req.end();
}