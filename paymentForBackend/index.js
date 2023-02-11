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
        "merchantId": "MYULUTRIPUAT",
        "merchantTransactionId": "MT" + txn,
        "merchantUserId": "MUID" + txn,
        "amount": 100,
        "redirectUrl": "http://localhost:3000",
        "redirectMode": "POST",
        "callbackUrl": "http://localhost:3000",
        "mobileNumber": req.body.mobile,
        "paymentInstrument": {
            "type": "PAY_PAGE"
        }
    }


    function fancyString(obj) {
        return Object.keys(obj)
            .map(function (k, i) {
                if (typeof obj[k] === "object") {
                    return (
                        "" + `"` + k + `"` + ": " + `{` + "\n\t" + "" + `"` + k + `"` + ": " + `"` + obj[k] + `"` + "\n" + "\t}\n"
                    );
                } else {
                    if (i === 0) {
                        return "" + " " + `"` + k + `"` + ": " + `"` + obj[k] + `"` + ",\n";
                    }
                    return "" + "" + `"` + k + `"` + ": " + `"` + obj[k] + `"` + ",\n";
                }
            })
            .join(" ");
    }

    const n = btoa("{\n" + fancyString(data) + "}");


    const Payload = n


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
