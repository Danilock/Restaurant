const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../Models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id); //Buscando el usuario.
  done(null, user);
});

//Definiendo el localStrategy
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });
      if (user) {
        return done(
          null,
          false,
          req.flash("signupMessage", "This email already exist")
        );
      } else {
        const newUser = new User();
        newUser.name = req.body.name;
        newUser.lastName = req.body.lastName;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.accountType = req.body.accountType;
        await newUser.save(); //Registrando el usuario
        done(null, newUser);
      }
    }
  )
);

passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, req.flash("signinMessage", "Not user found"));
      }
      if (!user.validatePassword(password)) {
        return done(
          null,
          false,
          req.flash("signinMessage", "Password is incorrect")
        );
      }
      done(null, user);
    }
  )
);
