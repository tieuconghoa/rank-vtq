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
        oldData.forEach((itemOld, keyOld) => {
            $("#table")
                .append(
                    `<tr><td class='text-center'>${keyOld+1}</td><td class='text-center'><div class='name-character' onclick="copyName(this)">${itemOld.name}</div></td><td class='text-center'>${itemOld.areaName}</td><td class='text-center chenh-lenh'>${String(itemOld.value).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</td></tr>`
                )
        })
    })
}

function renderData2() {
    var fromGroup = parseInt($("#fromGroup").val(), 10);
    var toGroup = parseInt($("#toGroup").val(), 10);
    $("#fromGroup").css("border", "1px solid #ced4da");
    $("#toGroup").css("border", "1px solid #ced4da");

    if (fromGroup <= toGroup) {
        $.ajax({
            url: `${url}/api/data`,
            method: "post",
            data: {
                fromGroup: fromGroup,
                toGroup: toGroup
            },
            success: function(oldData) {
                $("#table").empty();
                if(oldData == "[]") {
                    $("#fromGroup").css("border", "1px solid red");
                    $("#toGroup").css("border", "1px solid red");
                } else {
                    oldData.forEach((itemOld, keyOld) => {
                        $("#table")
                            .append(
                                `<tr class="item"><td class='text-center'>${keyOld+1}</td><td class='text-center'><div class='name-character' onclick="copyName(this)">${itemOld.name}</div></td><td class='text-center'>${itemOld.areaName}</td><td class='text-center'>${String(itemOld.value).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</td></tr>`
                            )
                    })
                }
                
            }
        })
    } else {
        $("#fromGroup").css("border", "1px solid red");
        $("#toGroup").css("border", "1px solid red");
    }
}

function getDateTime() {
    var now = new Date();
    var time = now.toLocaleString('vi-VN', {
        weekday: 'short', // long, short, narrow
        day: 'numeric', // numeric, 2-digit
        year: 'numeric', // numeric, 2-digit
        month: 'long', // numeric, 2-digit, long, short, narrow
        hour: 'numeric', // numeric, 2-digit
        minute: 'numeric', // numeric, 2-digit
        second: 'numeric', // numeric, 2-digit
    })

    return time;
}

function copyName(e){
    let span = document.createElement("span");
    span.innerHTML = "Copied";
    span.classList.add('copied');
    navigator.clipboard.writeText(e.innerText);
    
    if(e.childElementCount == 0) {
        e.appendChild(span);
        setTimeout(() => {e.removeChild(span)} , 300);
    }
    
}