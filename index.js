const express = require('express');
const useragent = require('useragent');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const bodyParser = require('body-parser');
const Saml2js = require('saml2js');
const xml2js = require('xml2js');
var xmldom    = require('xmldom'),
_         = require('lodash'),
profile   = {},
    xpath     = require('xpath');
    const parser = new xml2js.Parser();
    const util = require('util');


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));


app.use(bodyParser.json());


const userAgentHandler = (req, res, next) => {
    const agent = useragent.parse(req.headers['user-agent']);
    const deviceInfo = Object.assign({}, {
      device: agent.device,
      os: agent.os,
    });
    req.device = deviceInfo;
    next();
  };
  
// Configure passport with the SAML strategy
passport.use(new SamlStrategy({
    // Okta Identity Provider settings
    entryPoint: 'https://demoa.onelogin.com/trust/saml2/http-post/sso/eca3d219-ed8a-4fb7-8791-db37abe9a840',
    issuer: 'https://app.onelogin.com/saml/metadata/eca3d219-ed8a-4fb7-8791-db37abe9a840',
    cert: `-----BEGIN CERTIFICATE-----
MIID2DCCAsCgAwIBAgIUM/OlsELLA/eZu9kEGDlu/AIcjx8wDQYJKoZIhvcNAQEF
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
hRkwM2PFqOF7fNmlTyYu71w7Z3ByDRQqkJOyeA==
-----END CERTIFICATE-----
`,
    identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    // Service Provider settings
    callbackUrl: 'http://localhost:3000/saml/callback',
    logoutUrl: 'https://demoa.onelogin.com/trust/saml2/http-redirect/slo/2163463'
}, (profile, done) => {
    // Handle the authenticated user's profile here
    console.log("profile---", profile);

    return done(null, profile);
}));

// Initialize passport and set up middleware
app.use(passport.initialize());

// Add a route for initiating SSO
app.get('/login',
    passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
    (req, res) => {

        console.log(res);
        res.redirect('/after-login-v1');
    }
);

app.post('/saml/callback',
  userAgentHandler,
   async (req, res, next) => {
    console.log("req.body.SAMLResponse--", req.body.SAMLResponse);

    const xmlResponse = Buffer.from(req.body.SAMLResponse, 'base64').toString('utf8');    
    let emailId = await parseXml(xmlResponse);
    console.log("emailId--", emailId);    
    next();
  },
  (req, res) =>{
    res.redirect('/after-login-v2');  
  });

  async function parseXml(xml) {
   
    return new Promise((resolve, reject) => {
        parser.parseString(xml, (err, result) => {
          if (err) {
            reject(err);
          } else {
            const emailAddress = result['samlp:Response']['saml:Assertion'][0]['saml:Subject'][0]['saml:NameID'][0]['_'];
            resolve(emailAddress);
          }
        });
      });
  }

createUserSession = ( (req, res)=> {
    console.log(req);
    res.redirect('/after-login');  
})


// Add a route for logging out
app.get('/logout',  bodyParser.urlencoded({ extended: false }), async (req, res) => {

    console.log("in logout");
    // console.log(req.path);
    console.log(req.query);
    const xmlResponse = Buffer.from(req.query.SAMLResponse, 'base64').toString('utf8');    
    console.log("xmlResponse---", xmlResponse);

    let emailId = await parseXml(xmlResponse);
    console.log("logout emailId--", emailId);    

    req.logout(() => {
        // console.log(req);
        // Redirect the user to the home page or login page
        res.redirect('/after-logout');
      });
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

