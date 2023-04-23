const express = require('express');
const passport = require('passport');
const { Strategy } = require('passport-saml');
const session = require('express-session');


const app = express();

// Set up the SAML configuration
const samlConfig = {
    entryPoint: 'https://demoa.onelogin.com/trust/saml2/http-post/sso/eca3d219-ed8a-4fb7-8791-db37abe9a840',
    issuer: 'https://app.onelogin.com/saml/metadata/eca3d219-ed8a-4fb7-8791-db37abe9a840',
    cert: `MIID2DCCAsCgAwIBAgIUM/OlsELLA/eZu9kEGDlu/AIcjx8wDQYJKoZIhvcNAQEF
    BQAwRDEPMA0GA1UECgwGUk5NS1JTMRUwEwYDVQQLDAxPbmVMb2dpbiBJZFAxGjAY
    BgNVBAMMEU9uZUxvZ2luIEFjY291bnQgMB4XDTIzMDQyMTAzMzcwOFoXDTI4MDQy
    MTAzMzcwOFowRDEPMA0GA1UECgwGUk5NS1JTMRUwEwYDVQQLDAxPbmVMb2dpbiBJ
    ZFAxGjAYBgNVBAMMEU9uZUxvZ2luIEFjY291bnQgMIIBIjANBgkqhkiG9w0BAQEF
    AAOCAQ8AMIIBCgKCAQEA15HSasWb9P3tXzukGBR2mzE9AKH+glm96O7gYtEHmXPR
    crSeVSM71ddysrsRvsNK09kHYvf+9IRKznPdM/e3RS9JoVwwXJg3T4YFGmTMiB3p
    ZwUpT5cnCLkDiVzFcbGIqSldHLvWBQ+6dnxLfDmjVfSrsmGXA+QbeiW3fcu/ZCJw
    rMYey4091sv3N6RqpD/W+sEsrzHEV3cpo0d595PtKpkrDrDU6c0Xzk3Fnp7Okuj7
    fsKpqyp2D3uMSIjBg2OJsMN+Bbp7J6vH7VH9EBGwCUtBV4v3lltfVgd9fSSZadet
    ss6Bmz9cuqA8rjck+jGOOpteOM7s1FrS3zZTk7Nh/wIDAQABo4HBMIG+MAwGA1Ud
    EwEB/wQCMAAwHQYDVR0OBBYEFKXphCFWGpXFwjF9OeWjSFTPbLS9MH8GA1UdIwR4
    MHaAFKXphCFWGpXFwjF9OeWjSFTPbLS9oUikRjBEMQ8wDQYDVQQKDAZSTk1LUlMx
    FTATBgNVBAsMDE9uZUxvZ2luIElkUDEaMBgGA1UEAwwRT25lTG9naW4gQWNjb3Vu
    dCCCFDPzpbBCywP3mbvZBBg5bvwCHI8fMA4GA1UdDwEB/wQEAwIHgDANBgkqhkiG
    9w0BAQUFAAOCAQEAgGzQhSHCKDhyhzPQhP1HooBcrAo8ejKVD8jo2FTsWbxJ6+GD
    qpgvaIeEVp1VES/cYD3YoMIkQlzMAIuUsIYQUfXk77OOr6+OhauqCpbrXEFom2zG
    aZ0ttIVHZjbZwmO7HCOhKEfwAW1DN4ucvU7kATFy6LhOPRm0gmje+YQra3nqnU/V
    C5feeTWGd8jv7oyKCHMwOzLW6GmaNt5JOxwl4qe460gZipZ8jdoCDom6WbNnI9mX
    X1R1v3retnA+vMHwBnHyki6yVgW4o9XDFzWHItZ0UtwnOEnaMEzXfq93yubUjkfq
    hRkwM2PFqOF7fNmlTyYu71w7Z3ByDRQqkJOyeA==`,
    identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    // Service Provider settings
    callbackUrl: 'http://localhost:3000/saml/callback',
    logoutUrl: 'https://demoa.onelogin.com/trust/saml2/http-redirect/slo/2163463'
  };

  // Set up the session middleware
app.use(session({
    secret: 'thisissessionsecrettoentrythesession',
    resave: false,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Initialize the SAML strategy
const samlStrategy = new Strategy(samlConfig, (profile, done) => {
    // The user details are contained in the `profile` object
    const user = {
      id: profile.nameID,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName
    };
    
    // Call the `done` function to pass the user details to passport
    done(null, user);
  });

  passport.use('saml', samlStrategy);
  

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  })

// Set up the login and callback routes
app.get('/login', (req, res) => {
    const { idp } = req.query;
    req.session.idp = idp;
    passport.authenticate('saml', { idp })(req, res);
  });
  
//   app.post('/saml/callback', passport.authenticate('saml'), (req, res) => {
app.post('/saml/callback', (req, res) => {
    const user = req.user;
    console.log("user---", req.user);
    const redirectUrl = '/profile';
    res.redirect(redirectUrl);
  });

// // Add a route for initiating SSO
// app.get('/login',
//     passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
//     (req, res) => {

//         console.log(res);
//         res.redirect('/after-login');
//     }
// );

// // Add a route for handling the SSO callback
// app.post('/saml/callback',
//     passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
//     (req, res) => {
//         console.log(req.body);
//         res.redirect('/after-login');
//     }
// );

// Add a route for logging out
app.get('/logout', (req, res) => {

    console.log("in logout");
    // console.log(req.path);
    console.log(req.query);

    res.status(200).send("logged-out successfully");
    // req.logout(() => {
        // console.log(req);
        // Redirect the user to the home page or login page
        // res.redirect('/after-logout');
    //   });
});

app.get("/after-login", (req, res) => {
    console.log("I am in after login")
    // console.log(req);
    res.status(200).send("we are good");
})

app.get("/after-logout", (req, res) => {
    console.log("I am in after logout")
    // console.log(req);
    res.status(200).send("we are good after logout");
})


// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});

