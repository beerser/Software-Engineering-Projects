const express = require('express');
const app = express();
const QRcode = require('qrcode');
const generatePayload = require('promptpay-qr');
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(3000, () => {
  console.log("Server running on port 3000");
});


app.post('/generateQR', (req, res) => {
  const amount = parseFloat(req.body.amount);  
  const mobileNumber = '0969962367';  


  const payload = generatePayload(mobileNumber, { amount });
  const options = {
    color: {
      dark: '#000',
      light: '#fff',
    },
  };

  
  QRcode.toDataURL(payload, options, (err, url) => {
    if (err) {
      return res.status(400).json({
        RespCode: 400,
        RespMessage: 'QR Generation Error: ' + err,
      });
    }
    res.status(200).json({
      RespCode: 200,
      RespMessage: 'QR Code Generated Successfully',
      Result: url,  
    });
  });
});

module.exports = app;
