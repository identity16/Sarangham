var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: '사랑함'});

});

/* Place list page. */
router.get('/places', function (req, res) {
    var options = {
        url: 'http://127.0.0.1:3000/api/places',
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        form: {}
    };


    var places = {};
    request(options, (function (res) {
        return function (err, response, body) {
            res.render('places', {title: 'Place List', places: JSON.parse(body).places});
        }
    })(res));
});

/* Locker list page. */
router.get('/places/:place_id/lockers', function (req, res) {
    var options = {
        url: 'http://127.0.0.1:3000/api/places/' + req.param('place_id') + '/lockers',
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        form: {}
    };


    var places = {};
    request(options, (function (req, res) {
        return function (err, response, body) {
            res.render('locker_list',
                {title: 'Locker List', place_id: req.param('place_id'), lockers: JSON.parse(body).lockers});
            console.log(body);
        }
    })(req, res));
});

module.exports = router;
