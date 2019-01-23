## Run Development

In order to run in a development environment, you will need to install the MongoDB CE database locally.

https://docs.mongodb.com/manual/installation/

You can then use the following script to install baseline data into the local MongoDB database.

```
/mongodb/global-data/import-data-local.bat
```

Once the MongoDB database is up and running, execute the folloiwng commands on SEPARATE command lines.
Alternatively, you can use Visual Studio Code's "Tasks / Run Tasks" feature to launch these processes

```
npm run start-dev-node
npm run start-dev-ng
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
Alternatively, you can use Visual Studio Code's "Debug / Start Debugging (F5)" to launch the browser in debug mode.
You can call the API calls directly (for testing) by opening `http://localhost:3000/`

## Build production 

In order to build a production version, do the following

```
npm run build
```
The build artifacts will be stored in the `dist/` directory.

Once it is built, you can run a production environment by doing the following

```
npm start
```

Navigate to `http://localhost:3000/`. The app will not automatically reload on file changes