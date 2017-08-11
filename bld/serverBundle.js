/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var MongoClient = __webpack_require__(19).MongoClient;

var state = {
    db: null
};

exports.connect = function (url, done) {
    if (state.db) return done();

    MongoClient.connect(url, function (err, db) {
        if (err) return done(err);
        state.db = db;
        done();
    });
};

exports.get = function () {
    return new Promise(function (resolve, reject) {
        resolve(state.db);
    });
};

exports.close = function (done) {
    if (state.db) {
        state.db.close(function (err, result) {
            state.db = null;
            state.mode = null;
            done(err);
        });
    }
};

exports.mailExists = function (mail) {
    return this.get().then(function (db) {
        return db.collection('users').findOne({ email: mail }).then(function (o) {
            var exists = o != null ? 1 : 0;
            return exists;
        });
    });
};

exports.pseudoExists = function (pseudo) {
    return this.get().then(function (db) {
        return db.collection('users').findOne({ pseudo: pseudo }).then(function (o) {
            var exists = o != null ? 1 : 0;
            return exists;
        });
    });
};

exports.getUser = function (obj) {
    return this.get().then(function (db) {
        return db.collection('users').findOne(obj);
    });
};

exports.addLike = function (user, mail) {};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Promise = __webpack_require__(5);
var bcrypt = __webpack_require__(1);
Promise.promisifyAll(bcrypt);
var Database = __webpack_require__(0);
var saltRounds = 6;

var User = function User(data) {
    this.data = data;
};

User.create = function (data) {
    return Database.get().then(function (db) {
        return new Promise(function (resolve, reject) {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(data.password, salt, function (err, hash) {
                    data.password = hash;
                    db.collection('users').insertOne(data).then(function (res) {
                        console.log(res.insertedId);
                        var user = {
                            pseudo: data.pseudo,
                            email: data.email
                        };
                        resolve(user);
                    }).catch(function (err) {
                        console.log(err);
                    });
                });
            });
        }).catch(function (err) {
            console.log(err);
        });
    });
};

User.comparePassword = function (passwordToCompare, hash) {
    return bcrypt.compare(passwordToCompare, hash);
};

User.findByMail = function (email) {
    return Database.get().then(function (db) {
        return db.collection('users').findOne({ email: email });
    });
};

User.changePassword = function (token, hash) {
    return Database.get().then(function (db) {
        return db.collection('users').updateOne({ resetPasswordToken: token }, { $set: { password: hash } }).then(function (a) {
            return db.collection('users').update({ resetPasswordToken: token }, { $unset: { resetPasswordToken: 1 } }).catch(function (err) {
                console.log(err);
            });
        }).catch(function (err) {
            console.log(err);
        });
    }).catch(function (err) {
        console.log(err);
    });
};

User.addResetPasswordToken = function (mail, token) {
    return Database.get().then(function (db) {
        return db.collection('users').updateOne({ email: mail }, { $set: { resetPasswordToken: token } });
    }).catch(function (err) {
        console.log(err);
    });
};

User.getEmail = function () {
    return new Promise(function (res, rej) {
        User.asdf = localStorage.getItem('username');
        res(localStorage.getItem('username'));
    });
};

User.toggleLike = function () {
    console.log('this user has mail ' + User.asdf);
};
module.exports = User;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sanitizeMongo = sanitizeMongo;
exports.tokenForUser = tokenForUser;
exports.isPasswordValid = isPasswordValid;
exports.mailExists = mailExists;
exports.createResetPasswordToken = createResetPasswordToken;
exports.sendMail = sendMail;
exports.toggleLike = toggleLike;

var _axios = __webpack_require__(3);

var _axios2 = _interopRequireDefault(_axios);

var _auth_helper = __webpack_require__(7);

var _database = __webpack_require__(0);

var _database2 = _interopRequireDefault(_database);

var _user = __webpack_require__(4);

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwt = __webpack_require__(2);
var _ = __webpack_require__(8);
var nodemailer = __webpack_require__(20);

var bcrypt = __webpack_require__(1);
var saltRounds = 6;

var mailOptions = {
    from: 'youremail@gmail.com',
    subject: 'You asked us to change your password'
};

function sanitizeMongo(v) {
    if (v instanceof Object) {
        for (var key in v) {
            if (/^\$/.test(key)) {
                delete v[key];
            }
        }
    }
    return v;
};

function tokenForUser(user) {
    var token = jwt.sign(user, process.env.SECRET_KEY, {
        expiresIn: 4000
    });
    return token;
}

function isPasswordValid(req, res, next) {
    var password = req.body.password;
    (0, _auth_helper.validatePassword)(req.body).then(function () {
        next();
    }).catch(function (err) {
        console.log(err);
    });
}

function mailExists(req, res, next) {
    var mail = req.body.email;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(mail)) {
        _database2.default.mailExists(mail).then(function (exists) {
            req.exists = exists;
            next();
        }).catch(function (err) {
            console.log(err);
        });
    } else {
        console.log('This is not a valid mail ' + mail);
    }
}

function createResetPasswordToken(req, res, next) {
    var _req$body = req.body,
        email = _req$body.email,
        password = _req$body.password;

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            var pass = {
                email: email,
                hash: hash
            };
            jwt.sign(pass, process.env.SECRET_KEY, {
                expiresIn: 6000
            }, function (err, token) {
                if (err) {
                    res.send({
                        success: false,
                        message: 'Something went wrong when creating you token'
                    });
                } else {
                    req.token = token;
                    next();
                }
            });
        });
    });
}

function sendMail(req, res, next) {
    var _req$body2 = req.body,
        email = _req$body2.email,
        password = _req$body2.password;


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'wedonthaveallnight@gmail.com',
            pass: 'Ij7pycEa'
        }
    });

    mailOptions.to = email;
    mailOptions.text = 'You really want to change it, then click here http://localhost:3000/reset/' + req.token;

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send({
                success: false,
                message: error
            });
        } else {
            console.log('Email sent: ' + info.response);
            _user2.default.addResetPasswordToken(email, req.token).catch(function (err) {
                console.log(err);
            });
        }
    });
}

function toggleLike(req, res, next) {
    // var token = localStorage.
    // Database.
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sanitizeMongo = sanitizeMongo;
exports.validateTarget = validateTarget;
exports.validateEmail = validateEmail;
exports.validatePseudo = validatePseudo;
exports.validatePassword = validatePassword;
exports.validateGender = validateGender;
exports.validateLike = validateLike;
exports.validateBio = validateBio;
exports.validateTown = validateTown;
exports.validateAge = validateAge;
exports.validateTags = validateTags;
exports.signUp = signUp;
exports.checkUser = checkUser;
exports.signIn = signIn;
exports.checkTokenIsSet = checkTokenIsSet;

var _axios = __webpack_require__(3);

var _axios2 = _interopRequireDefault(_axios);

var _reactRouter = __webpack_require__(18);

var _database = __webpack_require__(0);

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = __webpack_require__(8);


var fields = ['pseudo', 'email', 'password', 'gender', 'like', 'bio', 'town', 'age', 'tag'];
var genders = ['male', 'female', '...'];
var likes = ['male', 'female', '...'];

function sanitizeMongo(v) {
    if (v instanceof Object) {
        for (var key in v) {
            if (/^\$/.test(key)) {
                delete v[key];
            }
        }
    }
    return v;
};

function validateTarget(target) {
    return new Promise(function (res, rej) {
        var infos = {};
        _.forOwn(target, function (value, key) {
            if (_.includes(fields, key)) {
                if (value != "" && key != "") {
                    infos[key] = value;
                } else {
                    throw 'Something is missing';
                }
            }
        });
        res(infos);
    });
}

function validateEmail(infos) {

    return new Promise(function (resolve, reject) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(infos.email)) {
            _database2.default.mailExists(infos.email).then(function (exists) {
                if (exists) {
                    resolve();
                }
                resolve(infos);
            }).catch(function (err) {
                console.log(err);
            });
        } else {
            throw 'This is not a valid mail';
        }
    }).then(function (infos) {
        if (!infos) {
            throw 'Email already used';
        } else {
            return infos;
        }
    });
}

function validatePseudo(infos) {
    if (infos.pseudo != "") {
        return _database2.default.pseudoExists(infos.pseudo).then(function (exists) {
            if (exists) {
                throw 'Pseudo already exists';
            }
            return infos;
        });
    } else {
        alert('Pseudo is empty');
        return false;
    }
}

function validatePassword(infos) {
    return new Promise(function (resolve, reject) {
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        if (re.test(infos.password)) {
            resolve(infos);
        }
        throw 'This is not a valid password';
    });
}

function validateGender(infos) {
    return new Promise(function (resolve, reject) {
        if (_.includes(genders, infos.gender)) {
            resolve(infos);
        } else {
            throw 'This is not a valid gender';
        }
    });
}

function validateLike(infos) {
    return new Promise(function (resolve, reject) {
        if (_.includes(likes, infos.like)) {
            resolve(infos);
        } else {
            throw 'This is not a valid \'like\' parameter';
        }
    });
}

function validateBio(infos) {
    return new Promise(function (resolve, reject) {
        if (infos.bio && infos.bio.length <= 150) {
            resolve(infos);
        } else {
            throw 'Your bio it\'s longer than 150 characters';
        }
    });
}

function validateTown(infos) {
    return new Promise(function (resolve, reject) {
        if (infos.town && infos.town.length <= 20) {
            resolve(infos);
        } else {
            throw 'Your town\'s name is too long';
        }
    });
}

function validateAge(infos) {

    function isInteger(x) {
        return typeof x === 'number' && x % 1 === 0;
    }

    return new Promise(function (resolve, reject) {
        infos.age = parseInt(infos.age);
        if (!isInteger(infos.age)) {
            throw 'Please put a number as you age';
        }
        if (infos.age && infos.age > 17 && infos.age <= 99) {
            resolve(infos);
        } else {
            throw 'You are not allowed, you are too old or too young for this sh*t';
        }
    });
}

function validateTags(infos) {
    return new Promise(function (resolve, reject) {
        var tags = infos.tag.trim().replace(/\s\s+/g, ' ').split(' ');
        for (var i = 0; i < tags.length; i++) {
            if (tags[i].length > 10) {
                throw 'One of you tags is longer than 10 characters';
            }
        }
        resolve(infos);
    });
}

function signUp(infos) {
    return _axios2.default.post('signup', infos).then(function (res) {
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', infos.email);
            console.log('token was generated and saved');
        } else {
            console.log('Something went wrong, you did not sign up');
        }
    });
}

function checkUser(infos) {
    infos.action = 'check_user';
    return _axios2.default.get('user', {
        params: infos
    });
}

function signIn(infos) {
    console.log('infos', infos);
    return _axios2.default.post('signin', infos).then(function (res) {
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', infos.email);
            console.log('token was generated and saved');
        } else {
            console.log('Something went wrong, you did not sign in');
        }
    });
}

function checkTokenIsSet(location) {
    var token = localStorage.getItem('token');
    var username = localStorage.getItem('username');
    _axios2.default.post('/checktoken', {
        token: token,
        username: username
    }).then(function (res) {
        if (!res.data.success) {
            if (location != 'main') {
                _reactRouter.browserHistory.push("/");
            }
        } else {
            if (location == 'main') {
                _reactRouter.browserHistory.push("/map");
            }
        }
    }).catch(function (err) {
        console.log('errorr = ');
        console.log(err);
    });
}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(10);
module.exports = __webpack_require__(11);


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(12);
var http = __webpack_require__(13);
var bodyParser = __webpack_require__(14);
var path = __webpack_require__(15);
var fs = __webpack_require__(16);
var Promise = __webpack_require__(5);
var router = __webpack_require__(17);
var url = "mongodb://localhost:27017/mydb";
var database = __webpack_require__(0);
var initApp = __webpack_require__(23);
var jwt = __webpack_require__(2);
var mychat = __webpack_require__(24);
var io = __webpack_require__(26);

var app = new express();
// var secureRoutes = express.Router();

app.use(express.static('static'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use('/api', secureRoutes);
process.env.SECRET_KEY = 'ThisIsMySecretKey';

router(app);

app.get('*', function (req, res) {
	var indexPage = fs.readFileSync(path.resolve('index.html'));
	var out = String(indexPage);
	res.send(out);
});

// database.connect(url, function () {
// initApp();

var port = 3000;
var server = http.createServer(app);

server.listen(port, function (err) {
	if (err) {
		console.log('\n\t\t\t\tError!\n\t\t\t\tmessage: ' + err.message + '\n\t\t\t\ttype: ' + err.type + '\n\t\t\t\tdescription: ' + err.description + '\n\t\t\t\t');
	} else {
		console.log('Server listening on port:', port);
		io = io.listen(server);
		mychat(io);
	}
});

// });

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _routesHelpers = __webpack_require__(6);

var auth = __webpack_require__(21);
var jwt = __webpack_require__(2);

module.exports = function (app) {

    // app.post('/user',
    // function(req, res, next) {
    //     next();
    // },
    // require('./controllers/users/create_user'));

    app.get('/user',
    // auth.checktoken,
    __webpack_require__(22), function (req, res) {
        if (req.exists) {
            res.send({
                success: true
            });
        } else {
            res.send({
                success: false
            });
        }
    });

    app.post('/signup', auth.signup);

    app.post('/signin', auth.checklogin, auth.signin, function (req, res) {
        res.send({ success: true });
    });

    app.post('/checktoken', auth.checktoken);

    app.get('/reset/:token', auth.changePassword);

    app.post('/sendmail', _routesHelpers.mailExists, _routesHelpers.isPasswordValid, _routesHelpers.createResetPasswordToken, _routesHelpers.sendMail, function (req, res) {
        res.send({ success: true });
    });

    app.post('/togglelike');
};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("react-router");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("mongodb");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("nodemailer");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _user = __webpack_require__(4);

var _user2 = _interopRequireDefault(_user);

var _database = __webpack_require__(0);

var _database2 = _interopRequireDefault(_database);

var _routesHelpers = __webpack_require__(6);

var _auth_helper = __webpack_require__(7);

var Validator = _interopRequireWildcard(_auth_helper);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bcrypt = __webpack_require__(1);
var saltRounds = 6;

var jwt = __webpack_require__(2);


exports.signup = function (req, res, next) {
    Validator.validateTarget(req.body).then(Validator.validateEmail).then(Validator.validatePseudo).then(Validator.validatePassword).then(Validator.validateGender).then(Validator.validateLike).then(Validator.validateBio).then(Validator.validateTown).then(Validator.validateAge).then(Validator.validateTags).then(function (data) {
        _user2.default.create(data).then(function (user) {
            return (0, _routesHelpers.tokenForUser)(user);
        }).then(function (token) {
            res.send({
                success: true,
                token: token
            });
        }).catch(function (err) {
            console.log(err);
        });
    }).catch(function (err) {
        console.log(err);
    });
};

exports.signin = function (req, res, next) {
    res.send({
        success: true,
        token: (0, _routesHelpers.tokenForUser)(req.user)
    });
};

exports.checktoken = function (req, res, next) {
    var token = req.body.token;
    var mail = req.body.mail;
    jwt.verify(token, process.env.SECRET_KEY, function (err, decode) {
        if (token) {
            if (err) {
                console.log(err);
                res.send({
                    success: false,
                    message: "Invalide Token"
                });
            } else {
                console.log(decode);
                res.send({
                    success: true
                });
            }
        } else {
            res.send({
                success: false,
                message: 'You don\'t have a token'
            });
        }
    });
};

exports.checklogin = function (req, res, next) {
    _user2.default.findByMail(req.body.email).then(function (user) {
        _user2.default.comparePassword(req.body.password, user.password).then(function (passwordMatch) {
            if (passwordMatch) {
                console.log(user);
                req.user = {
                    pseudo: user.pseudo,
                    email: req.body.email
                };
                next();
            } else {
                res.send({
                    success: false,
                    message: 'Your password does not match, try again'
                });
            }
        }).catch(function (err) {
            console.log(err);
        });
    }).catch(function (err) {
        console.log(err);
    });
};

exports.checkMail = function (req, res, next) {
    return _user2.default.findByMail(req.body.email).then(function (user) {
        if (user) {
            req.user = user;
            next();
        } else {
            res.send({
                success: false,
                message: 'You don\'t have an account with this mail'
            });
        }
    });
};

exports.changePassword = function (req, res, next) {
    var resetPasswordToken = req.params.token;
    jwt.verify(resetPasswordToken, process.env.SECRET_KEY, function (err, decode) {
        if (err) {
            res.send('This is not for you son, get the hell of here');
        } else {
            _user2.default.changePassword(resetPasswordToken, decode.hash);
            res.send('<h1>Your password has been changed, click <a href="http://localhost:3000">here</a></h1>');
        }
    });
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _user = __webpack_require__(4);

var _user2 = _interopRequireDefault(_user);

var _database = __webpack_require__(0);

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bcrypt = __webpack_require__(1);

module.exports = function (req, res, next) {

    if (req.query.action && req.query.action == 'validate_pseudo') {
        _database2.default.pseudoExists(req.query.pseudo).then(function (o) {
            req.exists = o;
            next();
        });
    } else if (req.query.action && req.query.action == 'check_user') {
        // return Database.mailExists(req.query.)
        _database2.default.get().then(function (db) {
            db.collection('users').findOne({
                email: req.query.email
            }).then(function (user) {
                if (!user) {
                    res.send({
                        success: false
                    });
                }
                var hash = user.password;
                bcrypt.compare(req.query.password, hash).then(function (same) {
                    if (same) {
                        res.send({
                            success: true
                        });
                    }
                });
            }).catch(function (err) {
                console.log(err);
            });
        });
    } else if (req.query.action && req.query.action == 'validate_email') {
        _database2.default.mailExists(req.query.email).then(function (o) {
            req.exists = o;
            next();
        });
    }
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _axios = __webpack_require__(3);

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var database = __webpack_require__(0);

module.exports = function () {
    // database.get().createCollection('users').then((cursor) => {
    //     cursor.insertOne({ name: "olivier", address: "Paris" });
    // })

    _axios2.default.defaults.port = 3000;
    database.get().then(function (db) {
        db.createCollection('users');
        return db;
    }).then(function (db) {
        db.createCollection('photos');
    }).catch(function (err) {
        if (err) {
            console.log('this is : ' + err);
        }
    });
    // }
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (io) {

	var me = false; //variable des messages pour stocker l'user du chat
	var users = {};
	var allmessages = [];
	var history = 99; //on limite a 9 messages pour ne pas tout peter
	var msg;
	var d;
	var ent = __webpack_require__(25); //sontre les failles xss : https://edutechwiki.unige.ch/fr/Socket.io


	io.sockets.on('connection', function (socket) {
		// console.log('new user');//test
		//on parcours tous les utilisateurs
		for (var k in users) {
			socket.emit('newusr', users[k]);
		}
		for (var k in allmessages) {
			socket.to(allmessages[k].room).emit('newmsg', allmessages[k]);
			console.log(allmessages[k]);
		}

		// =========== je me connecte ============
		//on ecoute l'evenement envoy2 du Chat
		socket.on('login', function (user) {
			// console.log(user);
			me = user;
			me.login = user.pseudo;
			me.id = user.room;
			// me.txt = user.txt;
			socket.join(user.room);
			socket.emit('logged', user.room); //pour supprimer le mail la 1ere fois
			users[me.id] = me;
			//on emit un evenement cote seveur pour que le client recoive
			// socket.emit('newuser');//socket actuel
			// socket.broadcast.emit('newuser');//alert tous les autre user sauf soi
			io.sockets.emit('newuser', me); //alert tous lesuser
		});

		// ============= reception de messages =============
		socket.on('newmsg', function (message) {
			console.log(message);
			msg = message;
			msg.room = message.room;
			allmessages.push(message); //on stcoke dans un tableau les messages
			if (allmessages.length > history) {
				allmessages.shift(); //supprime le message le plus anciens du tableau
			}
			msg.message = ent.encode(message.message); //pour enpecher les failles XSS
			// msg.message = message.message;// dans portection de la faille xss
			msg.login = message.login;
			io.sockets.to(msg.room).emit('newmsg', msg);
			// io.sockets.to('toto').emit('newmsg', msg);
		});

		// ============= je quitte le chat =============
		socket.on('disconnect', function () {
			if (!me) {
				return false; //pour eviter qund un utilsateur n'est pas connecté
			}
			delete users[me.id];
			io.sockets.emit('discusr', me);
		});
	});
};

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("ent");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })
/******/ ]);