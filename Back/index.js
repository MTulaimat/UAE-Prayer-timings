var express = require('express');
var cors = require('cors');
const {
    request,
    response
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

router.route('/GetPrayerTimes').get((request, response) => {

    var query = request.query;
    var url = `https://services.iacad.gov.ae/SmartPortal/PrayerTimings/Timings/DailyPrayingTimeOfCity?cityId=${query.cityId}&countryId=${query.countryId}&date=${query.date}&hijriOrGreg=${query.hijriOrGreg}`;

    fetch(url)
        .then(res => res.text())
        .then(res => response.json(res))
        .catch(err => {
            response.json({
                error: "Error " + err
            })
        });
})

var port = process.env.PORT || 8090;
app.listen(port);
console.log('order API is running at ' + port);