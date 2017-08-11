# IN PROGRESS... : web-Çavapecho
web site de rencontre, 1er test

## techno :
- react js
- node js
- mongo db
- express js
- babel | webpack |ecma6(es2015)


![alt text](https://github.com/rim31/web-cavapecho/blob/master/static/images/Capture%20d’écran%202017-08-11%20à%2001.33.15.png)

![alt text](https://github.com/rim31/web-cavapecho/blob/master/static/images/Capture%20d’écran%202017-08-11%20à%2001.40.36.png)

![alt text](https://github.com/rim31/web-cavapecho/blob/master/static/images/Capture%20d’écran%202017-08-11%20à%2001.41.14.png)

![alt text](https://github.com/rim31/web-cavapecho/blob/master/static/images/Capture%20d’écran%202017-08-11%20à%2001.39.57.png)


## start :
create a folder
```
npm init
```

## initialisation du projet

node js / express / babel / webpack / react / react-router
```
npm install --save babel-cli@6.11.x babel-core@6.13.x  \
  babel-preset-es2015@6.13.x babel-preset-react@6.11.x ejs@2.5.x \
  express@4.14.x react@15.3.x react-dom@15.3.x react-router@2.6.x
```

```
npm install --save-dev webpack@1.13.x babel-loader@6.2.x http-server@0.9.x
```


### architecture des fichiers

create a folder and file :
src/static/index.html

image, style in :
src/static/img/
src/static/css/style.css

data in :
src/data/

views in a folder :
src/components/...
don't forget 
Layout | NotFoundPage |Approutes

Route : avec react-router relié à Approutes
src/routes.js

Client logic : JavaScript logic that initializes the whole app in the browser
src/app-client.js


configuration file :
webpack.config.js

run this cmd
```
NODE_ENV=production node_modules/.bin/webpack -p
```

to see somme results : localhost:8080
```
node_modules/.bin/http-server src/static

```

replace index.html : using template ejs
src/views/index.ejs

hte  server : node js express :
src/server.js
```
NODE_ENV=production node_modules/.bin/babel-node --presets react,es2015 src/server.js

```

____________________________________________________________________________________________________________________________

nodemon : pour recharger des qu'on sauvegarde une modification

https://scotch.io/tutorials/react-on-the-server-for-beginners-build-a-universal-react-and-node-app
