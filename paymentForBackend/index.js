const axios = require('axios');
const crypto = require('crypto');
const express = require("express");
const cors = require('cors');
const bodyparser = require('body-parser');



var app = express();

app.use(cors())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())



var txn = (Math.random() * 100000).toString();
var i = txn.indexOf(".");
txn = txn.substring(0, i);

app.post("/open", (req, res) => {
    const uri = "/pg/v1/pay"
    const key = "42e5c3f3-3c34-4f98-9980-76924ce2c148";
    const keyindex = "1"
    const data = {
        "merchantId": "SELLULARUAT",
        "merchantTransactionId": "MT" + txn,
        "merchantUserId": "MUID" + txn,
        "amount": 100,
        "redirectUrl": "https://webhook.site/redirect-url",
        "redirectMode": "POST",
        "callbackUrl": "https://webhook.site/callback-url",
        "mobileNumber": req.body.mobile,
        "paymentInstrument": {
            "type": "PAY_PAGE"
        }
    }

    const n = Buffer.from(JSON.stringify(data)).toString('base64');
    console.log(n)   

    const Payload = 'ewogICJtZXJjaGFudElkIjogIk1ZVUxVVFJJUFVBVCIsCiAgIm1lcmNoYW50VHJhbnNhY3Rpb25JZCI6ICJNVDc4NTA1OTAwNjgxODgxMDQiLAogICJtZXJjaGFudFVzZXJJZCI6ICJNVUlEMTIzIiwKICAiYW1vdW50IjogMTAwLAogICJyZWRpcmVjdFVybCI6ICJodHRwczovL2hhY2tkYXlzLnNlbGx1bGFyLmNsdWIiLAogICJyZWRpcmVjdE1vZGUiOiAiUE9TVCIsCiAgImNhbGxiYWNrVXJsIjogImh0dHBzOi8vd2ViaG9vay5zaXRlL2NhbGxiYWNrLXVybCIsCiAgIm1vYmlsZU51bWJlciI6ICI5OTk5OTk5OTk5IiwKICAicGF5bWVudEluc3RydW1lbnQiOiB7CiAgICAidHlwZSI6ICJQQVlfUEFHRSIKICB9Cn0='


    const checksum = crypto.createHash("sha256").update(Payload + uri + key).digest().toString('hex')

    const options = {
        method: 'POST',
        url: 'https://api-preprod.phonepe.com/apis/merchant-simulator/pg/v1/pay',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum + '###' + keyindex
        },
        data: {
            request: Payload
        }
    };

    axios
        .request(options)
        .then(function (response) {
            res.send(response.data.data.instrumentResponse.redirectInfo.url)
        })
        .catch(function (error) {
            console.error(error);
        });
})


app.listen(4000, () => {
    console.log("Running on port 4000");
});
