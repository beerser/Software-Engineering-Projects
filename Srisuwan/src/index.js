const express = require('express');
const app = express();
const QRcode = require('qrcode');
const generatePayload = require('promptpay-qr');
const bodyParser = require('body-parser');
const _ = require('lodash');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.post('/generateQR', (req, res) => {
  const amount = parseFloat(_.get(req, "body.amount", 0));

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      RespCode: 400,
      RespMessage: 'Invalid amount'
    });
  }

  const payload = generatePayload('0969962367', { amount });
  const option = {
    color: {
      dark: '#000',
      light: '#fff'
    }
  };

  QRcode.toDataURL(payload, option, (err, url) => {
    if (err) {
      return res.status(500).json({
        RespCode: 500,
        RespMessage: 'QR Generation Error: ' + err
      });
    }
    res.status(200).json({
      RespCode: 200,
      RespMessage: 'QR Code Generated Successfully',
      Result: url
    });
  });
});

module.exports = app;
