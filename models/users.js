/**
 * Created by swj on 2017. 5. 7..
 */
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    student_id: String,
    is_admin: Boolean
});

module.exports = mongoose.model('user', userSchema, 'users');