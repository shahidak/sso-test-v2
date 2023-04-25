const SamlStrategy = require('passport-saml').Strategy;

module.exports = function (passport, config) {

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  var samlStrategy = new SamlStrategy(
      config.passport.saml,
      function (profile, done) {
          // console.log("profile---", profile);
          return done(null,
              {
                  id: profile.id,
                  email: profile.nameID,
                  displayName: profile.nameID,
                  firstName: profile.nameID,
                  lastName: profile.nameID,
                  nameID: profile.nameID,
                  nameIDFormat: profile.nameIDFormat,
                  sessionIndex: profile.sessionIndex
              });
      })

  passport.use(samlStrategy);

    passport.logoutSaml = function() {
        //Here add the nameID and nameIDFormat to the user if you stored it someplace.
        return samlStrategy;
    };
};
