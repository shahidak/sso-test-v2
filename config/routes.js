
module.exports = function (app, config, passport) {

  app.get('/', function (req, res) {
    if (req.isAuthenticated()) {
      res.render('home',
        {
          user: req.user
        });
    } else {
      res.render('home',
        {
          user: null
        });
    }
  });

  app.get('/login',
    passport.authenticate(config.passport.strategy,
      {
        successRedirect: '/',
        failureRedirect: '/login'
      })
  );

  app.post(config.passport.saml.path,
    passport.authenticate(config.passport.strategy,
      {
        failureRedirect: '/',
        failureFlash: true
      }),
    function (req, res) {

        res.cookie('nameID', req.user.nameID);
        res.cookie('nameIDFormat', req.user.nameIDFormat);
        res.cookie('sessionIndex', req.user.sessionIndex);
        res.cookie('sessionID', req.sessionID);

      res.redirect('/');
    }
  );

  app.get('/signup', function (req, res) {
    res.render('signup');
  });

  app.get('/profile', function (req, res) {
    if (req.isAuthenticated()) {
        // console.log(req);
      res.render('profile',
        {
          user: req.user
        });
    } else {
      res.redirect('/login');
    }
  });

  app.post('/post-logout', function (req, res){

      console.log("i am here in post logout");
      console.log("req.body--", req.body);

      res.status(200).send("all good logut on post");
    })

  app.get('/logout', function (req, res) {

      if (req.isAuthenticated()) {

          // const samlRequest = req.query.SAMLRequest;
          // const decodedRequest = Buffer.from(samlRequest, 'base64').toString('utf-8');

          let samlStrategy = passport.logoutSaml();
          req.user.nameID = req.cookies.nameID;
          req.user.nameIDFormat = req.cookies.nameIDFormat;
          req.user.sessionIndex = req.cookies.sessionIndex;

          samlStrategy.logout(req, (err, request) => {
              if (err) {
                  // Handle error
                  console.log("err---", err);
                  return res.status(500).send('Error parsing SAML Logout Request');
              }
              console.log("request--", request);
          });

          req.logout();
          res.clearCookie('connect.sid');
          res.clearCookie('nameIDFormat');
          res.clearCookie('nameID');
          res.clearCookie('sessionIndex');
          res.clearCookie('sessionID');
          req.user = null;
          req.session = null;
          res.redirect('/');

      } else {
          console.log("i am in else condition");
          res.redirect('/');
      }
  });

};
