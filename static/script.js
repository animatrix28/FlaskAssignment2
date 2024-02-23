let cdata, sdata, tdata, chdata, ldata;
$(document).ready(function () {
    $('#searchbutton').click(function (event) {
        stocktabs_container.style.display = 'none';
        stockcontainer.style.display = 'none';
        cdata = "", sdata = "", chdata = "", ldata = "";
        if ($("#inputTicker").val() !== "") {
            companyTab();
        }
    });
    $("#clearbutton").click(function (event) {
        event.preventDefault();
        $("#inputTicker").val("")
        stockcontainer.style.display = 'none';
        stocktabs_container.style.display = 'none';
        cdata = "", sdata = "", chdata = "", ldata = "";
    })
})

function removeTabStyle() {
    let stockSummaryTab = document.getElementById("stockSummaryTab");
    let companyTab = document.getElementById("companyTab");
    let chartsTab = document.getElementById("chartsTab");
    let latestNewsTab = document.getElementById("latestNewsTab");
    companyTab.classList.remove("isselected");
    chartsTab.classList.remove("isselected");
    latestNewsTab.classList.remove("isselected");
    stockSummaryTab.classList.remove("isselected");
}

function queryNotFound() {
    let data_table = `
    <h2 id="queryError">Error : No record has been found, please enter a valid symbol</h2>
    `
    stocktabs_container.style.display = 'flex';
    stocktabs_container.style.height = '600px';
    stocktabs_container.style.alignItems = "center";
    stocktabs_container.style.marginTop = "60px";
    document.getElementById("stocktabs_container").innerHTML = data_table;
}

function companyTab() {
    let search_query = $("#inputTicker").val()
    let data_to_save = { "search_query": search_query }

    if (search_query != "") {
        $.ajax({
            type: "GET",
            url: "/searchStock",
            dataType: "json",
            // contentType: "application/json; charset=utf-8",
            // data: JSON.stringify(data_to_save),
            data: data_to_save,
            success: function (result) {
                let all_data = result["data"]
                cdata = all_data
                if (cdata['error']) {
                    cdata = "", sdata = "", chdata = "", ldata = "";
                    stocktabs_container.style.display = 'none';
                    queryNotFound();
                }
                else {
                    stocktabs_container.style.display = 'none';
                    stockSummaryTab();
                    stockTrends();
                    chartsTab();
                    latestNewsTab();
                    setTimeout(function () {
                        stockcontainer.style.display = 'flex';
                        companyData();
                    }, 500);
                    // console.log(cdata);
                }
            },
            error: function (request, status, error) {
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        });

        stocktabs_container.style.display = 'flex';
        stocktabs_container.style.height = '600px';
        stocktabs_container.style.alignItems = "center";
        stocktabs_container.style.marginTop = "45px";
    }
}

function companyData() {
    let companyTab = document.getElementById("companyTab");
    removeTabStyle();
    companyTab.classList.add("isselected");
    let data_table = `
    <table class="companytabtable" style="border-collapse:collapse;">
        <div style="display:flex; height:130px;width:130px;padding-bottom:25px"><img src="${cdata['logo']}" style="height:130px;width:130px;"alt="Error Loading Logo"></div>
        <tr><th style="text-align: right;">Company Name</th>  <td>${cdata['name']}</td></tr>
        <tr><th style="text-align: right;">Stock Ticker Symbol</th><td>${cdata['ticker']}</td></tr>
        <tr><th style="text-align: right;">Stock Exchange Code</th><td>${cdata['exchange']}</td></tr>
        <tr><th style="text-align: right;">Company Start Date</th><td>${cdata['ipo']}</td></tr>
        <tr><th style="text-align: right;">Category</th><td>${cdata['finnhubIndustry']}</td></tr>
    </table>`
    stocktabs_container.style.display = 'flex';
    stocktabs_container.style.height = '600px';
    stocktabs_container.style.alignItems = "center";
    stocktabs_container.style.marginTop = "45px";
    document.getElementById("stocktabs_container").innerHTML = data_table;
}


function stockSummaryTab() {
    let search_query = $("#inputTicker").val()
    let data_to_save = { "search_query": search_query }

    $.ajax({
        type: "GET",
        url: "/stockSummary",
        dataType: "json",
        data: data_to_save,
        success: function (result) {
            let all_data = result["data"]
            sdata = all_data
            // console.log(sdata);
        },
        error: function (request, status, error) {
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

function stockTrends() {
    let search_query = $("#inputTicker").val()
    let data_to_save = { "search_query": search_query }

    $.ajax({
        type: "GET",
        url: "/trends",
        dataType: "json",
        data: data_to_save,
        success: function (result) {
            let all_data = result["data"]
            tdata = all_data
            // console.log(tdata);
        },
        error: function (request, status, error) {
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

function stockSummaryData() {

    let stockSummaryTab = document.getElementById("stockSummaryTab");
    removeTabStyle();
    stockSummaryTab.classList.add("isselected");
    var greenUp = "/static/images/img/GreenArrowUp.png";
    var redDown = "/static/images/img/RedArrowDown.png";
    var change, percent;
    if (sdata['d'] >= 0)
        change = greenUp;
    else change = redDown;
    if (sdata['dp'] >= 0)
        percent = greenUp;
    else percent = redDown;
    let data_table = `
    <table class="summarytabtable" style="border-collapse:collapse;">
        <tr><th style="text-align: right;">Stock Ticker Symbol</th><td>${sdata['ticker']}</td></tr>
        <tr><th style="text-align: right;">Trading Day</th><td>${sdata['t']}</td></tr>
        <tr><th style="text-align: right;">Previous Closing Price</th><td>${sdata['pc']}</td></tr>
        <tr><th style="text-align: right;">Opening Price</th><td>${sdata['o']}</td></tr>
        <tr><th style="text-align: right;">High Price</th><td>${sdata['h']}</td></tr>
        <tr><th style="text-align: right;">Low Price</th><td>${sdata['l']}</td></tr>
        <tr><th style="text-align: right;">Change</th><td>${sdata['d']} <img src="${change}" style="height:23px;" alt="Arrow"> </td></tr>
        <tr><th style="text-align: right;">Change Percent</th><td>${sdata['dp']} <img src="${percent}" style="height:23px;" alt="Arrow"> </td></tr>
    </table>
    <div id="recommendation">
        
        <table style="padding-top:15px;"><tr>
        <td style="color:#d4193e;font-size: 22px;">Strong<br>Sell</td>
        
        <td id="rec" style="background-color:#dd1539;width:15px;">${tdata['strongSell']}</td>
        <td id="rec" style="background-color:#ab584a;width:15px;">${tdata['sell']}</td>
        <td id="rec" style="background-color:#799959;width:30px;">${tdata['hold']}</td>
        <td id="rec" style="background-color:#48de70;width:30px;">${tdata['buy']}</td>
        <td id="rec" style="background-color:#15ff82;width:30px;">${tdata['strongBuy']}</td>
        
        <td style="color:#2fed7c;font-size: 22px;">Strong<br>Buy</td>
        </tr></table>
        
    </div>
    <div style="font-size:25px;padding-top:10px;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
    Recommendation Trends
    </div>
    `
    stocktabs_container.style.display = 'flex';
    stocktabs_container.style.height = '600px';
    stocktabs_container.style.alignItems = "center";
    stocktabs_container.style.marginTop = "40px";
    document.getElementById("stocktabs_container").innerHTML = data_table;
}

function chartsTab() {
    let search_query = $("#inputTicker").val()
    let data_to_save = { "search_query": search_query }

    $.ajax({
        type: "GET",
        url: "/chartTab",
        dataType: "json",
        data: data_to_save,
        success: function (result) {
            let all_data = result["data"]
            chdata = all_data
            // console.log(chdata);
        },
        error: function (request, status, error) {
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

function chartsData() {
    let search_query = $("#inputTicker").val()
    let chartsTab = document.getElementById("chartsTab");
    removeTabStyle();
    chartsTab.classList.add("isselected");
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
    let day = currentDate.getDate().toString().padStart(2, '0');
    search_query = search_query.toUpperCase();
    // console.log(chdata)
    Highcharts.stockChart('stocktabs_container', {
        chart: {
            height: 600,
        },
        accessibility: {
            enabled: false
        },
        title: {
            text: `Stock Price ${search_query} ${year}-${month}-${day}`,
            style: {
                fontSize: 20
            }
        },
        subtitle: {
            text: '<a href="https://polygon.io/" style="color:#0000eb; text-decoration:underline; font-weight:bold;" target="_blank">Source: Polygon.io</a>',
            style: { fontSize: 16 }
        },
        plotOptions: {
            column: { pointPlacement: 'on' }
        },
        yAxis: [{
            opposite: false,
            title: {
                text: 'Stock Price',
                style: { fontSize: 17 }
            }
        }, {
            opposite: true,
            title: {
                text: 'Volume',
                style: { fontSize: 17 }
            }
        }],

        rangeSelector: {
            selected: 0,
            inputEnabled: false,
            buttons: [{
                type: 'day',
                count: 7,
                text: '7d',
            }, {
                type: 'day',
                count: 15,
                text: '15d',
            },
            {
                type: 'month',
                count: 1,
                text: '1m',
            },
            {
                type: 'month',
                count: 3,
                text: '3m',
            },
            {
                type: 'month',
                count: 6,
                text: '6m',
            }
            ]
        },

        navigator: {
            series: {
                accessibility: {
                    exposeAsGroupOnly: true
                }
            }
        },

        series: [{
            name: 'Stock Price',
            data: chdata['x1y1'],
            type: 'area',
            threshold: null,
            tooltip: {
                valueDecimals: 2,
                split: true
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        },
        {
            name: 'Volume',
            data: chdata['x2y2'],
            type: 'column',
            threshold: null,
            yAxis: 1,
            color: 'black',
            pointWidth: 5,
            tooltip: {
                valueDecimals: 2
            },
        }]
    });
    stocktabs_container.style.display = 'flex';
    stocktabs_container.style.height = '600px';
    stocktabs_container.style.marginTop = "40px";
    stocktabs_container.style.alignItems = "center";
};

function latestNewsTab() {
    let search_query = $("#inputTicker").val()
    let data_to_save = { "search_query": search_query }

    $.ajax({
        type: "GET",
        url: "/newsTab",
        dataType: "json",
        data: data_to_save,
        success: function (result) {
            let all_data = result["data"]
            ldata = all_data
            // console.log(ldata);
        },
        error: function (request, status, error) {
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

function latestNewsData() {
    let latestNewsTab = document.getElementById("latestNewsTab");
    removeTabStyle();
    latestNewsTab.classList.add("isselected");
    let data_table = `
    <div style="display:flex;flex-direction:row;background-color:#f8f9fa;width:98%; height:fit-content; margin:20px 0px; padding:25px 18px;">
        <span><img src="${ldata['image'][0]}" style="height: 130px; width:130px;padding-right:20px;padding-top:8px;" alt="Error Loading"></span>
        <span><div id="headline">${ldata['headline'][0]}</div>
        <div id="date">${ldata['datetime'][0]}</div>
        <div id="post"><a href="${ldata['url'][0]}" target="_blank">See Original Post</a></div></span>
    </div>
    <div style="display:flex;flex-direction:row;background-color:#fafafa;width:98%; height:fit-content; margin:20px 0px; padding:25px 18px;">
        <span><img src="${ldata['image'][1]}" style="height: 130px; width:130px;padding-right:20px;padding-top:8px;" alt="Error Loading"></span>
        <span><div id="headline">${ldata['headline'][1]}</div>
        <div id="date">${ldata['datetime'][1]}</div>
        <div id="post"><a href="${ldata['url'][1]}" target="_blank">See Original Post</a></div></span>
    </div>
    <div style="display:flex;flex-direction:row;background-color:#fafafa;width:98%; height:fit-content; margin:20px 0px; padding:25px 18px;">
        <span><img src="${ldata['image'][2]}" style="height: 130px; width:130px;padding-right:20px;padding-top:8px;" alt="Error Loading"></span>
        <span><div id="headline">${ldata['headline'][2]}</div>
        <div id="date">${ldata['datetime'][2]}</div>
        <div id="post"><a href="${ldata['url'][2]}" target="_blank">See Original Post</a></div></span>
    </div>
    <div style="display:flex;flex-direction:row;background-color:#fafafa;width:98%; height:fit-content; margin:20px 0px; padding:25px 18px;">
        <span><img src="${ldata['image'][3]}" style="height: 130px; width:130px;padding-right:20px;padding-top:8px;" alt="Error Loading"></span>
        <span><div id="headline">${ldata['headline'][3]}</div>
        <div id="date">${ldata['datetime'][3]}</div>
        <div id="post"><a href="${ldata['url'][3]}" target="_blank">See Original Post</a></div></span>
    </div>
    <div style="display:flex;flex-direction:row;background-color:#fafafa;width:98%; height:fit-content; margin:20px 0px; padding:25px 18px;">
        <span><img src="${ldata['image'][4]}" style="height: 125px; width:130px;padding-right:20px; display:flex" alt="Error Loading"></span>
        <span><div id="headline">${ldata['headline'][4]}</div>
        <div id="date">${ldata['datetime'][4]}</div>
        <div id="post"><a href="${ldata['url'][4]}" target="_blank">See Original Post</a></div></span>
    </div>
    `
    stocktabs_container.style.display = 'flex';
    stocktabs_container.style.height = '60%';
    stocktabs_container.style.alignItems = "flex-start";
    stocktabs_container.style.marginTop = "12px";
    document.getElementById("stocktabs_container").innerHTML = data_table;
}

