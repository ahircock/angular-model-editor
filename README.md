## Run Development

In order to run in a development environment, execute the folloiwng commands on SEPARATE command lines.
Each of these is a separate WATCH process and will not stop. So you need 3 different command lines.
Alternatively, you can use Visual Studio Code's "Tasks / Run Tasks" feature to launch these three processes

```
npm run build-dev-node
npm run start-dev-node
npm run start-dev-ng
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Debug development

Assume you are using Visual Studio Code
If you want to debug the angular client,  

## Build production 

In order to build a production version, do the following

```
npm run build
```
The build artifacts will be stored in the `dist/` directory.

Additionally, a production version will be built every time you 
install the npm dependencies (such as after cloning the GIT 
repository)

```
npm install
```


## Run production

Once it is built, you can run a production environment by doing the following

```
npm start
```

Navigate to `http://localhost:3000/`. The app will not automatically reload on file changes