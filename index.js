const axios = require('axios');
const fs = require("fs");
const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
// const cron = require('node-cron');

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
}, {
    "group": "11",
    "server_start": "126",
    "server_end": "130"
}, {
    "group": "12",
    "server_start": "131",
    "server_end": "135"
}, {
    "group": "13",
    "server_start": "136",
    "server_end": "140"
}, {
    "group": "14",
    "server_start": "141",
    "server_end": "145"
}, {
    "group": "15",
    "server_start": "146",
    "server_end": "150"
}, {
    "group": "16",
    "server_start": "151",
    "server_end": "155"
}, {
    "group": "17",
    "server_start": "156",
    "server_end": "160"
}, {
    "group": "18",
    "server_start": "161",
    "server_end": "165"
}, {
    "group": "19",
    "server_start": "166",
    "server_end": "170"
}, {
    "group": "20",
    "server_start": "171",
    "server_end": "175"
}, {
    "group": "21",
    "server_start": "176",
    "server_end": "180"
}, {
    "group": "22",
    "server_start": "181",
    "server_end": "185"
}, {
    "group": "23",
    "server_start": "186",
    "server_end": "190"
}, {
    "group": "24",
    "server_start": "191",
    "server_end": "195"
}, {
    "group": "25",
    "server_start": "196",
    "server_end": "200"
}, {
    "group": "26",
    "server_start": "201",
    "server_end": "205"
}, {
    "group": "27",
    "server_start": "206",
    "server_end": "210"
}, {
    "group": "28",
    "server_start": "211",
    "server_end": "215"
}, {
    "group": "29",
    "server_start": "216",
    "server_end": "220"
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

// cron.schedule('0 21 1 9 *', function() {
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
    var dataPush = await get_data(28, 28);
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
    for (let i = fromGroup; i <= toGroup; i++) {
        let server = array.find(ele => ele.group == i);
        for (var j = parseInt(server.server_start, 10); j <= parseInt(server.server_end, 10); j++) {
            server_list += "," + j;
        }
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