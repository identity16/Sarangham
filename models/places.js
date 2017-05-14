/**
 * Created by swj on 2017. 5. 7..
 */
var mongoose = require('mongoose');

var placeSchema = mongoose.Schema({
    _id: Number,                           // id는 건물 번호
    lockers: [{
        _id: Number,
        is_sharing: Boolean,
        student_id: [Number],
        disable: Boolean,
        due_date: Date
    }]
});

module.exports = mongoose.model("place", placeSchema, "places");