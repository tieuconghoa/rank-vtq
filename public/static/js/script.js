const url = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;

function renderData(id) {
    var data = [];
    // $.getJSON(`${url}/oldData`, oldData => {
    //     $.getJSON(`${url}/newData`, function(newData) {
    //         $("#table").empty();
    //         oldData[id].forEach((itemOld, keyOld) => {
    //             newData[id].forEach((itemNew, keyNew) => {
    //                 if (itemOld.name == itemNew.name && itemNew.areaName == itemOld.areaName) {
    //                     data.push({
    //                         "areaName": itemOld.areaName,
    //                         "name": itemOld.name,
    //                         "value": itemNew.value - itemOld.value,
    //                         "itemNew": itemNew.value,
    //                         "itemOld": itemOld.value

    //                     })
    //                 }

    //             });

    //         });
    //     }).then(() => {
    //         data.sort((a, b) => (a.value < b.value) ? 1 : -1);
    //         data.forEach((item, key) => {
    //             $("#table")
    //                 .append(`<tr class="item"><td class='text-center'>${key+1}</td><td class='text-center'>${item.name}</td><td class='text-center'>${item.areaName}</td><td class='text-center'>${String(item.itemOld).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</td><td class='text-center'>${String(item.itemNew).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</td><td class='text-center chenh-lenh'>${String(item.value).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</td></tr>`)

    //         })
    //     })
    // })

    $.getJSON(`${url}/api/${id}`, oldData => {
        $("#table").empty();
        JSON.parse(oldData).forEach((itemOld, keyOld) => {
            $("#table")
                .append(
                    `<tr><td class='text-center'>${keyOld+1}</td><td class='text-center'>${itemOld.name}</td><td class='text-center'>${itemOld.areaName}</td><td class='text-center chenh-lenh'>${String(itemOld.value).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</td></tr>`
                )
        })
    })
}

function renderData2() {
    var fromGroup = parseInt($("#fromGroup").val(), 10);
    var toGroup = parseInt($("#toGroup").val(), 10);
    $("#fromGroup").css("border", "1px solid #ced4da");
    $("#toGroup").css("border", "1px solid #ced4da");

    if (fromGroup <= toGroup && toGroup <= 28) {
        $.ajax({
            url: `${url}/api/data`,
            method: "post",
            data: {
                fromGroup: fromGroup,
                toGroup: toGroup
            },
            success: function(oldData) {
                $("#table").empty();
                JSON.parse(oldData).forEach((itemOld, keyOld) => {
                    $("#table")
                        .append(
                            `<tr class="item"><td class='text-center'>${keyOld+1}</td><td class='text-center'>${itemOld.name}</td><td class='text-center'>${itemOld.areaName}</td><td class='text-center'>${String(itemOld.value).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</td></tr>`
                        )
                })
            }
        })
    } else {
        $("#fromGroup").css("border", "1px solid red");
        $("#toGroup").css("border", "1px solid red");
    }
}

function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
        month = '0' + month;
    }
    if (day.toString().length == 1) {
        day = '0' + day;
    }
    if (hour.toString().length == 1) {
        hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
        minute = '0' + minute;
    }
    if (second.toString().length == 1) {
        second = '0' + second;
    }
    var dateTime = hour + ':' + minute + ':' + second + ' ' + day + '/' + month + '/' + year;
    return dateTime;
}