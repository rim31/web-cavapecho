# IN PROGRESS... : web-Çavapecho
web site de rencontre, 1er test

## techno :
- react js
- node js
- mongo db
- express js
- babel | webpack |ecma6(es2015)

## start :
create a folder

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
Layout | NotFoundPage 

Route : avec react-router
src/routes.js


____________________________________________________________________________________________________________________________

a file server.js
```
npm init
```
ok
```
npm i --save express
npm i --save nodemon
npm i --save ejs
```
nodemon : pour recharger des qu'on sauvegarde une modification

https://scotch.io/tutorials/react-on-the-server-for-beginners-build-a-universal-react-and-node-app
