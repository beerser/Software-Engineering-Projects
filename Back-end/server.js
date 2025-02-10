const express = require('express');
const Quote = require('inspirational-quotes')

const app = express();
app.get('/',(req,res)=>{
    res.setDefaultEncoding()
})

app.listen(5000,()=>{
    console.log("server runnig")
})