const axios = require('axios');
const fs = require("fs");
const express = require("express");
const path = require('path');
const cron = require('node-cron');

const cum123 = "1,4,9,15,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50";
const cum45 = "51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,73,74,75";
const cum67 = "76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95";
const cum89 = "96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115";
const cum1011 = "116,117,118,119,120,121,122,123,124,125,126,127,128,129,130";
const cum1213 = "131,132,133,134,135,136,137,138,139,140";
const array = [cum123, cum45, cum67, cum89, cum1011, cum1213];

var app = express();
var server = app.listen(process.env.PORT || 3000, () => {
    console.log("server running!!!");
})

// Add headers
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

cron.schedule('0 21 * * *', function() {
    writeFile()
  });

app.get("/api/:id", async(req, res) => {
    var id = req.params.id;

    res.json(await get_data(encodeURIComponent(array[id])));

});

app.get("/oldData", (req, res) => {
    let rawdata = fs.readFileSync(__dirname+'/data/bxh_1619186400568.json');
    let data = JSON.parse(rawdata);
    res.json(data)
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

async function writeFile() {

    var data = [];
    array.forEach(async(element) => {
        var dataPush = await get_data(encodeURIComponent(element));
        data.push(dataPush);
     });
    var filename = "data/bxh_" + Date.now() + ".json";
    setTimeout(() => {
        data = "[" + data + "]";
        fs.writeFile(filename, data, (err) => {
            if (err) {
                return console.error(err);
            }
        });
    }, 3000);
};


async function get_data(id) {
    var data = [];
    await axios.get("https://vothan3q.playfun.vn/ApiF64vn/getRanks1?WorldID=" + id, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9,vi;q=0.8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://vothan3q.playfun.vn/intro",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then(response => {

        data = JSON.stringify(response.data.data.ranks);

    }).catch(error => {
        console.log(error);
    });
    return data;
};