// load the generic node & express libraries
import * as express from 'express';
import * as path from 'path'; // HTTP request path parser
import * as bodyParser from 'body-parser'; // HTTP request body parse
import * as cors from 'cors'; // HTTP cross-origin resource sharing for API
import * as morgan from 'morgan'; // HTTP request logging
import { RestApiRouter } from './routers/rest-api-router'

// create the express application
const app = express();

// log all HTTP requests to the consoles
app.use(morgan("tiny"));

// setup router for the static files, including those generated by angular
app.use(express.static( path.join(__dirname, 'static') ) );

// setup API routers
app.use("/api", bodyParser.json()); // parses the body of the HTTP request
app.use("/api", cors()); // allows access to API endpoints from any site
app.use("/api/models", new RestApiRouter("models").getExpressRouter() );
app.use("/api/rules", new RestApiRouter("rules").getExpressRouter() );
app.use("/api/forces", new RestApiRouter("forces").getExpressRouter() );

// start listening, port is configured using environment variables
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("App listening on port " + PORT + "!");
});