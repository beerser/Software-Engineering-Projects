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
    const mobileNumber = '0969962367';


    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
            RespCode: 400,
            RespMessage: 'Invalid amount'
        });
    }

    const payload = generatePayload(mobileNumber, { amount });
    const option = {
        color: {
            dark: '#000',
            light: '#fff'
        }
    };

    QRcode.toDataURL(payload, option, (err, url) => {
        if (err) {
            console.log("QR Code Generation Error:", err);
            return res.status(400).json({
                RespCode: 400,
                RespMessage: 'Bad: ' + err
            });
        } else {
            console.log("QR Code Generated Successfully:", url);
            return res.status(200).json({
                RespCode: 200,
                RespMessage: 'Good',
                Result: url
            });
        }
    });
});

module.exports = app;
