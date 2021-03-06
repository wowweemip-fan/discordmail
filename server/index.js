console.log('Welcome to Moustacheminer Server Services');

const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const engines = require('consolidate');
const path = require('path');
const cors = require('cors');
const discord = require('./discord');
const apiRouter = require('./api');
const docsRouter = require('./docs');
const urlRouter = require('./url');

const app = express();

app.locals.name = config.get('name');

// Middleware
app.use(bodyParser.json({
	limit: '20mb'
}))
	.use(bodyParser.urlencoded({
		extended: true,
		limit: '20mb'
	}))
	.set('views', path.join(__dirname, '/dynamic'))
	.engine('html', engines.mustache)
	.set('view engine', 'html')
	.use(cors())
	.get('/', (req, res) => {
		res.status(200).render('index.html', {
			guilds: discord.guilds.size,
			users: discord.users.size
		});
	})
	.use('/api', apiRouter)
	.use('/docs', docsRouter)
	.use('/url', urlRouter)
	.use(express.static(path.join(__dirname, '/static')))
	.use('*', (req, res) => res.status(404).render('error.html', { status: 404, domain: config.get('api').mailgun.domain }));

console.log('Listening on', config.get('webserver').port);
app.listen(config.get('webserver').port);
