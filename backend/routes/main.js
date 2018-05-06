const router = require('express').Router();
const faker = require('faker');
const Task = require('../models/task');

router.get('/add-task', function (req, res, next) {
	res.render('main/add-task')
});

/*to be able to add custom tasks*/
router.post('/add-task', (req, res, next) => {
	let task = new Task(),
		{name, time, startDate, endDate, description} = req.body;

	task.name = name;
	task.time = time;
	task.startDate = startDate;
	task.endDate = endDate;
	task.description = description;

	task.save(function (err) {
		if (err) throw err;
		res.redirect('/add-task');
	});

});

router.get('/api/search/:query', function (req, res, next) {
	Task
		.find({description: {$regex: `${req.params.query}`}})
		.exec((err, tasks) => {
			if (err) return next(err);
			return res.json(tasks);
		})
});


/*play with express ob backend*/
router.get('/tasks/:page', function (req, res, next) {
	let perPage = 10,
		page = req.params.page || 1;

	Task
		.find({})
		.skip((perPage * page) - perPage)
		.limit(perPage)
		.exec((err, tasks) => {
			Task.count().exec((err, count) => {
				if (err) return next(err);
				res.render('main/tasks', {
					tasks: tasks,
					current: page,
					pages: Math.ceil(count / perPage)
				})
			})
		})
});

router.post('/api/add-task', (req, res, next) => {
	let task = new Task(),
		{name, time, startDate, endDate, description} = req.body;

	task.name = name;
	task.time = time;
	task.startDate = startDate;
	task.endDate = endDate;
	task.description = description;

	task.save(function (err) {
		if (err) throw err;
		return res.json({status: 1});
	});

});


router.get('/api/tasks', (req, res, next) => {
	Task
		.find({})
		.exec((err, tasks) => {
			if (err) return next(err);
			return res.json(tasks);
		});
});

module.exports = router;