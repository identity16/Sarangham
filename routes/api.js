/**
 * Created by swj on 2017. 5. 7..
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser').json();

// Collections
var Places = require('../models/places');
router.use(bodyParser);

router.use(function (req, res, next) {
    // Authentication은 여기서!
    next();
});

router.route('/places')
// 장소 가져오기
    .get(function (req, res) {
        Places.find({}, function (err, places) {
            res.json({places: places});
        });
    });

router.route('/places/:place_id')
// 장소 추가
    .post(function (req, res) {
        Places.find({_id: req.param("place_id")}, function (err, places) {
            if (places.length === 0) {
                var newPlace = new Places();
                newPlace._id = req.params.place_id;
                newPlace.lockers = [];
                newPlace.save(function (err) {
                    if (err) res.status(500).json({error: 'database failure'});
                    else res.status(200).json({message: 'Success'});
                });
            }
            else res.json({message: 'place ' + req.param("place_id") + ' already exists!'});
        });
    })
    // 장소 정보 수정
    .put(function (req, res) {
        Places.update({_id: req.params.place_id}, {$set: req.body}, function (err, output) {
            if (err) return res.status(500).json({error: err});

            if (!output.n) return res.status(404).json({error: 'place not found'});
            res.json({message: 'place successfully updated!'});
        });
    })
    // 장소 삭제
    .delete(function (req, res) {
        Places.remove({_id: req.params.place_id}, function (err) {
            if (err) return res.status(500).json({error: "database failure"});
            else res.status(200).json({message: 'place ' + req.params.place_id + ' is Successfully Removed'});
        });
    });

router.route('/places/:place_id/lockers')
// 사물함 가져오기
    .get(function (req, res) {
        Places.findOne({_id: req.params.place_id}, function (err, place) {
            if (err) return res.status(500).json({error: "database failure"});
            res.json({lockers: place.lockers});
        });
    })
    // 사물함 추가
    .post(function (req, res) {
        Places.findOne({_id: req.params.place_id}, function (err, place) {
            if (err) res.status(500).json({error: "database failure"});
            place.lockers.push({
                _id: (place.lockers.length + 1),
                is_sharing: false,
                student_id: [],
                disable: false,
                due_date: null
            });
            place.save();
        });
        res.json({message: 'Locker has successfully added to ' + req.params.place_id + '.'});
    });

router.route('/places/:place_id/lockers/:locker_id')
// 사물함 정보 수정
// body는 json으로 날려야 함(form-data를 받는 법을 아직 모름ㅠ)
    .put(function (req, res) {
        Places.update({_id: req.param("place_id"), 'lockers._id': req.param("locker_id")},
            {
                '$set': {
                    'lockers.$.is_sharing': req.body.is_sharing,
                    'lockers.$.disable': req.body.disable,
                    'lockers.$.student_id': req.body.student_id,
                    'lockers.$.due_date': req.body.due_date
                }
            },
            function (err) {
                if (err) return res.status(500).json({error: 'database failure'});

                res.status(200).json({message: 'locker updated'});
            });
    });

// 사물함 삭제(맨 마지막 번호)
router.delete('/places/:place_id/lockers/last', function (req, res) {
    Places.update({_id: req.params.place_id}, {$pull: {lockers: {_id: lockers.length}}}, function (err) {
        if (err) console.log('something is wrong..');
    });

    res.json({message: "Successfully deleted!"});
});

// 사물함 전체 삭제
router.delete('/places/:place_id/lockers/all', function (req, res) {
    Places.update({_id: req.params.place_id}, {$pull: {lockers: {}}}, function (err) {
        if (err) console.log('something is wrong..');
    });
    res.json({message: "Succesfully deleted!"});
});

module.exports = router;