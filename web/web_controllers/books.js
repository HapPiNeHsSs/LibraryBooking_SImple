var path = "/books"
module.exports = function (app, models, passport, jwt, connectEnsureLogin, logger) {
  app.post(path, (req, res, next) => {

    let books = new models.Books({
      isbn: req.body.isbn,
      name: req.body.name,
      author: req.body.author,
      publish_date: req.body.publish_date,
      summary: req.body.summary,

    })
    books.save()
      .then(doc => {
        logger.info(doc)
        return res.status(200).json({ "Success": "Book Added" });
      })
      .catch(err => {
        return res.status(500).json({ "Error": err });
      })
  });

  app.put(path, async (req, res, next) => {
    let query = {}
    if (!req.body.id) {
      return res.json({ "Error": "Parameter id is required" });
    } else {
      query['_id'] = req.body.id
    }

    let modify = {}

    if (req.body.name) {
      modify['name'] = req.body.name
    }
    if (req.body.isbn) {
      modify['isbn'] = req.body.isbn
    }

    if (req.body.author) {
      modify['author'] = req.body.author
    }

    if (req.body.publish_date) {
      modify['publish_date'] = req.body.publish_date
    }

    if (req.body.summary) {
      modify['summary'] = req.body.summary
    }

    //check if this book is present
    bookRes = await models.Books.findOne(query).lean().exec()
    if (bookRes === null) {
      return res.json({ "Error": "That book is not in the catalog" });
    }
    models.Books.update(query, modify, {}, function (err, result) {
      if (!err) {
        return res.send({ "Updated": "Book with ID " + req.body.id + " has been updated" });
      } else {
        logger.error(err);
        return res.status(500).json({ "Error": err });
      }
    })
  })

  app.get(path, (req, res, next) => {
    let filter = {}
    if (req.query.name) {
      filter['name'] = new RegExp(`^${req.query.name}$`, 'i')
    }
    if (req.query.isbn) {
      filter['isbn'] = new RegExp(`^${req.query.isbn}$`, 'i')
    }
    models.Books.find(filter).lean().exec(function (err, result) {
      if (!err) {
        modres = JSON.stringify(result).replace(/"_id":/g, '"id":')
        return res.send(modres)
      } else {
        logger.error(err);
        return res.status(500).json({ "Error": err });
      }
    })

  });

  app.delete(path, async (req, res, next) => {
    let filter = {}
    if (req.query.id) {
      filter['_id'] = req.query.id
    }

    var bookRes = await models.Books.findOne({ _id: req.query.id }).lean().exec()
    if (bookRes === null) {
      return res.json({ "Error": "That book is not in the catalog" });
    }

    models.Books.deleteOne(filter).lean().exec(function (err, result) {
      if (!err) {
        return res.send({ "Updated": "Book with ID " + req.query.id + " has been deleted" });
      } else {
        logger.error(err);
        return res.status(500).json({ "Error": err });
      }
    })

  });

  //BORROW SYSTEM

  app.post(path + '/borrow', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

    if (!req.body.book_id) {
      return res.json({ "Error": "Parameter book_id is required" });
    }
    var userRes = await models.Users.findOne({ username: req.user.username }).lean().exec()

    var bookRes = await models.Books.findOne({ _id: req.body.book_id }).lean().exec()
    if (bookRes === null) {
      return res.json({ "Error": "That book is not in the catalog" });
    }

    models.Borrows.find({ user: userRes._id, book: bookRes._id, returned: false }).lean().exec(function (err, result) {

      if (!err) {
        if (result.length < process.env.MAX_BORROW) {
          var date = new Date(); // Now
          date.setDate(date.getDate() + 30);
          let borrow = new models.Borrows({
            book: bookRes._id,
            user: userRes._id,
            returned: false,
            expiry_date: date
          })
          borrow.save()
            .then(doc => {
              logger.info(doc)
              return res.status(200).json({ "Success": "Book Borrowed", "borrow_id": borrow._id });
            })
            .catch(err => {
              return res.status(500).json({ "Error": err });
            })

        }
        else {
          return res.status(400).json({ "Error": "Exceeded Allowed Borrows" });
        }


      } else {
        logger.error(err);
        return res.status(500).json({ "Error": err });
      }
    })


  });

  app.post(path + '/return', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    var query={}
    if (!req.body.borrow_id) {
      return res.json({ "Error": "Parameter borrow_id is required" });
    } else {
      query['_id'] = req.body.borrow_id
      query['returned'] = false;
    }

    //check if this book was really borrowwd is present
    borrowsRes = await models.Borrows.findOne(query).lean().exec()
    if (borrowsRes === null) {
      return res.json({ "Error": "That book was not borrowed" });
    }

    models.Borrows.update(query, { returned: true, return_date: Date.now() }, {}, function (err, result) {
      if (!err) {
        return res.send({ "Updated": "Book with borrow ID " + req.body.borrow_id + " has been returned" });
      } else {
        logger.error(err);
        return res.status(500).json({ "Error": err });
      }
    })

  });

}
