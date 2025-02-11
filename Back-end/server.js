const express = require('express');
// const Quote = require('inspirational-quotes')
const cors = require('cors');
const generatePayload = require('promptpay-qr');
const qrcode = require('qrcode');
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');

const app = express();

app.use(cors({
    origin: true,
    credentials: true,
}));


// app.use(compression());
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    return res.send("hello");
})

app.post('/generateQR',(req,res)=>{
    try {
        let mobileNumber = req.body.phone || '000-000-0000';
        let amount = req.body.amount || 0;


        const generQRCode = (payload) => {
            const options = { type: 'svg', color: { dark: '#000', light: '#fff' } };
            qrcode.toString(payload, options, (err, svg) => {
                if (err) return console.log(err)
                fs.writeFileSync(`QRCODE/QRCODE-${Date.now()}.svg`, svg)
            })
        }

        if (mobileNumber == "000-000-0000"){
            return res.statusCode(404);
        }

        const payload = generatePayload(mobileNumber, {amount})
        generQRCode(payload);
        return res.send(payload)

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

})

app.listen(5000,()=>{
    console.log("server runnig")
})