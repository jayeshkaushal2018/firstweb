const createError = require('http-errors');
const express  = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const log = require('@newyugster/utilities').logging;
const mongoose = require('mongoose');
require('@newyugster/models');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const flash = require('express-flash');
const hbs = require('hbs');
const csrf = require('csurf');    //csrf module
const auth = require('./lib/auth');


require('./config/hbs_helper');
const ensureLogin = require('connect-ensure-login').ensureLoggedIn;
const User = require('mongoose').model('User');

// setup handled to catch anything unhandled and log it for reference!
process.on('unhandledRejection', e => {
  log.error({err: e}, 'unhandledRejection');
});


// set environment variables
if (process.env.NODE_ENV !== 'production') {
  let envConfig = "";
  if (process.env.NODE_ENV === 'prod') envConfig = "./config/prod.env";
  if (process.env.NODE_ENV === 'staging') envConfig = "./config/staging.env";
    require('dotenv').config({
        path: envConfig
    });
} else {
  require('dotenv').config({
      path: "./config/secrets.env"
  });
}

const env = process.env.NODE_ENV || 'development';
const config = require('./config/mongo')[env];

// setup the express engine
var app = express();
app.enable('trust proxy');

// setup MongoDB
var envUrl = process.env[config.use_env_variable];
var localUrl = `mongodb://${ config.host }:27017/${ config.database }`;
var mongoUrl = envUrl ? envUrl : localUrl;
mongoose.connect(mongoUrl,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    socketTimeoutMS: 1000000,
    useFindAndModify: false,
    useUnifiedTopology: true
  }, (err) => {
    if (err) {
        log.error('connection error');
    }
});

// set CORS options
const corsOptions = {
    origin: /untilgone\.com$/,
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({
        path: './config/.env'
    });
    corsOptions.origin = 'http://localhost:3000';
}


// controllers
const home = require('./controllers/home');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// register all partials into the system
hbs.registerPartials(path.join(__dirname,'/views/partials'));

// express setup
app.use(cors(corsOptions));
app.options('*', cors());
app.use(helmet());



const csrfProtection = csrf({ cookie: false });
app.use(cookieParser());

const security = require('./lib/security');
app.use(security.rateLimiterMiddleware);

app.use(bodyParser.json({limit: '5mb'}));

app.use(bodyParser.urlencoded({
    extended: true, limit: '5mb', parameterLimit: 1000000
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    //  key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    //secret: "sdsd",
    proxy: 'true',
    cookie: {
        httpOnly: true,
        secure: 'auto'
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: mongoUrl
    }),
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy(User.authenticate({
    flash: true,
    session: true
})));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// log all requests either by email or IP if not logged in
app.use((req, res, next) => {
    log.info(((req.user !== undefined) ? req.user.username : req.ip) + ' ' + req.method + ' ' + req.url);
    next();
});



app.get('/_ah/start', (req, res) => {
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(mongoUrl,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        socketTimeoutMS: 1000000,
        useFindAndModify: false,
        useUnifiedTopology: true
      }, (err) => {
        if (err) {
            log.error({err: err},'connection error');
            throw err;
        }
        return res.status(200).send('health check');
    });
   }

});

app.get('/liveness_check', (req, res) => {
  return res.status(200).send('health check');
});

// auth routes
const authRoute = require('./routes/auth.router.js');
app.use(authRoute.router);

app.use(security.changeRequired);

app.use(security.lastLogin);

// admin routes static pages
const adminRoute = require('./routes/admin.router.js');
app.use(adminRoute.router);

// product routes
const productsRoute = require('./routes/products.router.js');
app.use(productsRoute.router);

// marketing routes
const mktgRoute = require('./routes/marketing.router.js');
app.use(mktgRoute.router);

// campaign tool routes
const cmpgTool = require('./routes/campaign.router.js');
app.use(cmpgTool.router);

// campaign tool routes
const deals = require('./routes/deals.router.js');
app.use(deals.router);

// label routes
const labelsRoute = require('./routes/labels.router.js');
app.use(labelsRoute.router);

//finance routes
const financeRoute = require('./routes/finance.router.js');
app.use(financeRoute.router);

// order routes
const orderRoute = require('./routes/orders.router.js');
app.use(orderRoute.router);

// vendor routes
const vendorsRoute = require('./routes/vendors.router.js');
app.use(vendorsRoute.router);

// reporting routes
const reportsRoute = require('./routes/reports.router.js');
app.use(reportsRoute.router);

// user admin and Profile
const userRoute = require('./routes/user.router.js');
app.use(userRoute.router);

// user admin and Profile
const notification = require('./routes/notification.router.js');
app.use(notification.router);

// user admin and Profile
const infoCenter = require('./routes/informationcenter.router.js');
app.use(infoCenter.router);

//operations
const operations = require('./routes/operations.router.js');
app.use(operations.router);

// gift certificates
const gc = require('./routes/gc.router.js');
app.use(gc.router);

app.all('/', ensureLogin('/login'), csrfProtection, home.page);
app.get('/dashboardAjaxDataCredits', ensureLogin('/login'), csrfProtection, home.dashboardAjaxCredits);
app.get('/dashboardAjaxDataTopProds', ensureLogin('/login'), csrfProtection, home.dashboardAjaxTopProd);
app.get('/dashboardAjaxVendorData', ensureLogin('/login'), auth.notVendor, csrfProtection, home.dashboardAjaxVendorData);
app.get('/dashboardAjaxShipmentStatus', ensureLogin('/login'), csrfProtection, home.dashboardAjaxShipmentStatus);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    log.error(req.url);
    next(createError(404, `${req.url} not found.`));
});
// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    log.error(err);
    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        layout: 'layout_no_nav.hbs',
        title: 'UntilGone.com',
        errorCode: err.status || 500
    });
});
module.exports = app;
