var path = "/"
module.exports = function (app, models, passport, jwt, connectEnsureLogin, logger) {
  app.post(path + 'login', (req, res, next) => {
    passport.authenticate('local',
      (err, user, info) => {
        logger.info(err + user + info)
        if (err) {
          logger.error(err);
          return res.status(500).json({ "Error": err });
        }

        if (!user) {
          logger.error(err);
          return res.status(401).json({ "Error": "Unauthorized" });
        }

        req.logIn(user, function (err) {
          if (err) {
            return res.status(500).json({ "Error": err });
          }
          const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_TOKEN);
          return res.json({ user: user.username, token });
        });

      })(req, res, next);
  });

  //Get User Info
  app.get(path + 'user',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      models.Borrows.find({ user: req.user._id,  returned: false }).lean().exec(function (err, result) {

        if (!err) {
          return res.send({ user_info: req.user, books_borrowed:result })
  
  
        } else {
          logger.error(err);
          return res.status(500).json({ "Error": err });
        }
      })
      
    }
  );

  //Register A new User
  app.post(path + 'user', (req, res) => {
    var user_name = req.body.user_id;
    var name = req.body.name;
    var password = req.body.password;
    models.Users.register({ username: user_name, customer_name: name }, password, (err, data) => {
      if (!err) {
        res.status(200).json({ username: user_name, status: "registered" })
      } else {
        logger.error(err);
        return res.status(500).json({ "Error": err });
      }
    })
  }
  );
  //other routes..
}
