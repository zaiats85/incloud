const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 8888;
const mainRoutes = require('./backend/routes/main');

/*MongoCreds*/
const DB_name = 'incloud';
const DB_port = 27017;
const host = 'localhost';
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

mongoose.set('debug', false);

//Setting public directory for front end
app.use(express.static(path.join(__dirname, '../src')));
app.set('views', __dirname + '/backend/views');

//Using bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*Set routing*/
app.use(mainRoutes);

app.set('view engine', 'ejs');

app.listen(8888, () => console.info(`Way we go server running on: ${port}`));

//Setting public directory for front end
app.use(express.static(path.join(__dirname, '../src')));
app.use((request, response, next) => {
	response.header("Access-Control-Allow-Origin", "*");
	response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	response.header("Content-Type",'application/json');
	next();
});

mongoose.connect(`mongodb://${host}:${DB_port}/${DB_name}`);
