const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
	name: { type: String, index: true },
	time: Number,
	description: String,
	startDate: Date,
	endDate: Date
});

module.exports = mongoose.model('Task', TaskSchema);
