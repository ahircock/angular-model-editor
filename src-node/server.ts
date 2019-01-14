// load the generic node & express libraries
import * as express from 'express';
import * as path from 'path'; // HTTP request path parser
import * as bodyParser from 'body-parser'; // HTTP request body parse
import * as cookieParser from 'cookie-parser'; // HTTP request body parse
import * as cors from 'cors'; // HTTP cross-origin resource sharing for API
import * as morgan from 'morgan'; // HTTP request logging
import authRouter from './routers/auth-router';
import modelsRouter from './routers/models-router';
import actionsRouter from './routers/actions-router';
import rulesRouter from './routers/rules-router';
import forcesRouter from './routers/forces-router';
import servicesRouter from './routers/services-router';

// create the express application
const app = express();

// log all HTTP requests to the consoles
app.use(morgan('tiny'));

// setup API routers
app.use('/api', bodyParser.json()); // parses the body of the HTTP request
app.use('/api', cookieParser()); // parses the body of the HTTP request
app.use('/api', cors({origin: true, credentials: true})); // allows access to API endpoints from any site
app.use('/api', authRouter ); // login, signup and verification of every call
app.use('/api/models', modelsRouter );
app.use('/api/rules', rulesRouter );
app.use('/api/forces', forcesRouter );
app.use('/api/actions', actionsRouter );
app.use('/api/services', servicesRouter );

// setup router for the static assets (images, icons, etc.)
app.use(express.static( path.join(__dirname, 'static') ) );

// all other GET requests should go to index.html, which is the angular app
app.get('/*', function(req, res) { res.sendFile(__dirname + '/static/index.html'); });

// start listening, port is configured using environment variables
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('App listening on port ' + PORT + '!');
});
