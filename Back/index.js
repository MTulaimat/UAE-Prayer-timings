var express = require('express');
var cors = require('cors');
const fs = require('fs')
const csv = require('csv-parse');

const csvRows = [];
fs.createReadStream('Hijri-Gregorian-Solar_Hijri-V3-2.csv')
    .pipe(csv())
    .on('data', (row) => csvRows.push(row))
    .on('end', () => {

        console.log("done!");
    });

var prayTimes = require('./PrayTimes');
var prayTimesObj = new prayTimes();

const {
    request,
    response,
    query
} = require('express');
var app = express();
var router = express.Router();
const fetch = require('node-fetch');
app.use(cors());
app.use('/api', router);

router.use((request, response, next) => {

    next();
})

router.route('/GetNumberOfDays').get((request, response) => {

    var query = request.query;
    var url = `https://services.iacad.gov.ae/SmartPortal/PrayerTimings/Timings/GetNumberOfDaysInHijriMonth?year=${query.year}&month=${query.month}`;

    fetch(url)
        .then(res => res.json())
        .then(res => response.json(res))
})

router.route('/GetHijriDate').get((request, response) => {

    var query = request.query;
    var geoDate = {

        day: 1*(query.day),
        month: 1*(query.month) +1,
        year: 1*(query.year)
    }

    var hijriDate = hijriFromGeorgian(geoDate);

    response.json(hijriDate);
})

router.route('/GetPrayerTimes').get((request, response) => {

    var query = request.query;
    var currentDate;

    // console.log(query.year);

    if (query.isHijri) {

        currentDate = gregorianFromHijri(query);
    } else {

        currentDate = {

            day: query.day,
            month: query.month,
            year: query.year
        }
    }

    console.log(currentDate);
    var times = prayTimesObj.getTimes([1 * currentDate.year, 1 * currentDate.month, 1 * currentDate.day], [1 * query.lat, 1 * query.long], 4);

    response.json(times);
})

function gregorianFromHijri(query) {

    //0 , 1, 2,   3 , 4,  5
    //HD,HM, HY,  GD, GM, GY
    //25, 4, 1440, 1, 1, 2019

    var day = query.day;
    var month = query.month;
    var year = query.year;

    if (day.length == 2 && day[0] == 0) day = day[1];  
    if (month.length == 2 && month[0] == 0) month = month[1];  
    
    var geoDate;

    csvRows.forEach(row => {

        if (row[0] == day && row[1] == month && row[2] == year) {

            geoDate = {

                day: row[3],
                month: row[4],
                year: row[5]
            };
        }
    })

    return geoDate;
}

function hijriFromGeorgian(date) {

    //0 , 1, 2,   3 , 4,  5
    //HD,HM, HY,  GD, GM, GY
    //25, 4, 1440, 1, 1, 2019

    var day = date.day;
    var month = date.month;
    var year = date.year;

    if (month.length == 2 && month[0] == 0) month = month[1];  

    var hijriDate;

    csvRows.forEach(row => {

        if (row[3] == day && row[4] == month && row[5] == year) {

            geoDate = {

                day: row[0],
                month: row[1],
                year: row[2]
            };
        }
    })

    return geoDate;
}

// router.route('/GetPrayerTimes').get((request, response) => {

//     var query = request.query;
//     var url = `https://services.iacad.gov.ae/SmartPortal/PrayerTimings/Timings/DailyPrayingTimeOfCity?cityId=${query.cityId}&countryId=${query.countryId}&date=${query.date}&hijriOrGreg=${query.hijriOrGreg}`;

//     fetch(url)
//         .then(res => res.text())
//         .then(res => response.json(res))
//         .catch(err => {
//             response.json({
//                 error: "Error " + err
//             })
//         });
// })

var port = process.env.PORT || 8090;
app.listen(port);
console.log('order API is running at ' + port);