import * as dotenv from 'dotenv';
import * as express from 'express';
import * as session from 'express-session';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import { OIDCStrategy } from 'passport-azure-ad';
if (process.env.DEBUG) {
    dotenv.config({ path: './.env.local' });
} else {
    dotenv.config();
}

// ini
const INI = {
    REDIRECT_URI: 'http://localhost:3000/auth/callback',
    AUTHORITY: 'https://login.microsoftonline.com/common',
    ID_METADATA: '/v2.0/.well-known/openid-configuration',
    AUTHORIZE_ENDPOINT: '/oauth2/v2.0/authorize',
    TOKEN_ENDPOINT: '/oauth2/v2.0/token',
    SCOPES: [
        'profile',
        'offline_access',
        'user.read',
        'Files.Read',
        'Sites.Read.All'
    ]
};

// user database
const user_db: any = {};

// user data -> user identifier
passport.serializeUser((user: any, cb) => {
    cb(null, user.profile.oid);
});

// user identifier -> user data
passport.deserializeUser((id: string, cb) => {
    cb(null, user_db[id]);
});

passport.use(new OIDCStrategy(
    {
        identityMetadata: `${INI.AUTHORITY}${INI.ID_METADATA}`,
        clientID: process.env.CLIENT_ID,
        responseType: 'code',
        responseMode: 'form_post',
        redirectUrl: INI.REDIRECT_URI,
        allowHttpForRedirectUrl: true,
        clientSecret: process.env.CLIENT_SECRET,
        validateIssuer: false,
        scope: INI.SCOPES,
        passReqToCallback: false
    },
    (iss, sub, profile, access_token, refresh_token, done) => {
        try {
            if (profile.oid) {

                // create user data
                const user = {
                    iss,
                    sub,
                    profile,
                    access_token,
                    refresh_token
                };

                // register user data in user database
                // user identifier is profile.oid
                user_db[profile.oid] = user;

                return done(null, user);
            }
            return done(null, false);
        } catch (err) {
            return done(null, err);
        }
    }
));

// express
const app = express();
const PORT_NO = 3000;

// session
app.use(session({
    secret: 'secret_value_here',
    resave: false,
    saveUninitialized: false
}));

// template
app.set('views', path.dirname(__dirname) + '/view');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// etc
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// passport
app.use(passport.initialize());
app.use(passport.session());

// route
app.get('/', (req, res) => {
    res.render('index.html', { user: req.user });
});

app.get('/auth/signin',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/' })
    , (req, res) => {
        res.redirect('/');
    }
);

app.post('/auth/callback',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/' })
    , (req, res) => {
        res.redirect('/');
    }
);

app.get('/auth/signout',
    (req, res) => {
        // clear session database
        req.session.destroy(() => { });
        res.redirect('/');
    }
);

app.listen(PORT_NO);
