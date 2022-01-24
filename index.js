const axios = require('axios');
const fs = require("fs");
const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const cron = require('node-cron');

const array = [{
    "group": "1",
    "server_start": "1",
    "server_end": "20"
}, {
    "group": "2",
    "server_start": "21",
    "server_end": "35"
}, {
    "group": "3",
    "server_start": "36",
    "server_end": "50"
}, {
    "group": "4",
    "server_start": "51",
    "server_end": "65"
}, {
    "group": "5",
    "server_start": "66",
    "server_end": "75"
}, {
    "group": "6",
    "server_start": "76",
    "server_end": "85"
}, {
    "group": "7",
    "server_start": "86",
    "server_end": "95"
}, {
    "group": "8",
    "server_start": "96",
    "server_end": "105"
}, {
    "group": "9",
    "server_start": "106",
    "server_end": "115"
}, {
    "group": "10",
    "server_start": "116",
    "server_end": "125"
}]

var app = express();
var server = app.listen(process.env.PORT || 3000, () => {
    console.log("server running!!!");
});
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use("/static", express.static(path.resolve(__dirname, "public", "static")))

app.use(bodyParser.json());


// Add headers
app.use(function (req, res, next) {

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

// cron.schedule('0 21 8 11 *', function() {
//     writeFile()
//   });

app.post("/api/data", async (req, res) => {
    let fromGroup = parseInt(req.body.fromGroup, 10);
    let toGroup = parseInt(req.body.toGroup, 10);
    var dataPush = await get_data(fromGroup, toGroup);
    res.json(dataPush);
})
app.get("/api/:id", async (req, res) => {
    var id = req.params.id;

    res.json(await get_data(id));

});

app.get("/oldData", (req, res) => {
    let rawdata = fs.readFileSync(__dirname + '/data/bxh_1619186400568.json');
    let data = JSON.parse(rawdata);
    res.json(data)
});

app.get("/newData", (req, res) => {
    let rawdata = fs.readFileSync(__dirname + '/data/bxh_1629554401291.json');
    let data = JSON.parse(rawdata);
    res.json(data);
});

app.get("/listGroup", (req, res) => {
    res.json(array);
})
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});
// writeFile();
async function writeFile() {

    var data = [];
    var dataPush = await get_data(35, 35);
    data.push(dataPush);
    var filename = "data/bxh_" + Date.now() + ".json";
    fs.writeFile(filename, data, (err) => {
        if (err) {
            return console.error(err);
        }
    });
};

async function get_data(fromGroup, toGroup) {
    var server_list = "";
    serverStart = 0;
    serverEnd = 0;
    if (fromGroup > 10) {
        serverStart = (fromGroup + 15) * 5 - 4;
        serverEnd = (toGroup + 15) * 5;
    } else if(toGroup < 10) {
        serverStart = parseInt(array.find(ele => ele.group == fromGroup).server_start, 10);
        serverEnd = parseInt(array.find(ele => ele.group == toGroup).server_end, 10);
    } 
    else if(fromGroup < 11 && toGroup > 10) {
        serverStart = parseInt(array.find(ele => ele.group == fromGroup).server_start, 10);
        serverEnd = (toGroup + 15) * 5;
    } else {
        serverStart = 1;
        serverEnd = 400;
    }

    for (var j = serverStart; j <= serverEnd; j++) {
        server_list += "," + j;
    }

    server_list = encodeURIComponent(server_list.substring(1));
    var data = [];
    await axios.get("https://vothan3q.playfun.vn/ApiF64vn/getRanks1?WorldID=" + server_list, {
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