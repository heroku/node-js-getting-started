const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

console.log('Sleeping 10 seconds before inserting record in database.')
setTimeout(function () {
	const Sequelize = require('sequelize');
	const sequelize = new Sequelize('clproject', 'user', 'password', {
	  host: 'db',
	  dialect: 'postgres',

	  pool: {
	    max: 5,
	    min: 0,
	    acquire: 30000,
	    idle: 10000
	  },

	  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
	  operatorsAliases: false
	});

	const Car = sequelize.define('cars_test', {
	  license_plate: Sequelize.STRING,
	  color: Sequelize.STRING
	}, {
  		timestamps: false,
  		freezeTableName: true
	});

	sequelize.sync()
	  .then(() => Car.create({
	    license_plate: Math.floor(Math.random() * Math.floor(1000000)),
	    color: 'blue'
	  }))
	  .then(c => {
	  	console.log('Wrote this record to database:')
	    console.log(c.toJSON());
	    console.log('Yay!')
	  });
}, 10000);

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
