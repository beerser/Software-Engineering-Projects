const express = require('express');
const cors = require('cors');
const generatePayload = require('promptpay-qr');
const qrcode = require('qrcode');
const bodyParser = require('body-parser');

const app = express();

app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    return res.send("hello");
});

app.post('/generateQR', async (req, res) => {
    try {
        const mobileNumber = req.body.phone || '000-000-0000';
        const amount = req.body.amount || 0;

        if (mobileNumber === "000-000-0000") {
            return res.status(404).json({
                RespCode: 404,
                RespMessage: 'Invalid phone number'
            });
        }

        const payload = generatePayload(mobileNumber, { amount });
        
        // Generate QR code as data URL instead of saving to file
        const qrCodeDataURL = await qrcode.toDataURL(payload, {
            type: 'image/png',
            width: 500,
            margin: 1
        });

        return res.json({
            RespCode: 200,
            Result: qrCodeDataURL,
            RespMessage: 'Success'
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            RespCode: 400,
            RespMessage: error.message
        });
    }
});

app.listen(5000, () => {
    console.log("server running");
});