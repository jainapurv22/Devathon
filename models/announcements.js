const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    description: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('Announcement', AnnouncementSchema);