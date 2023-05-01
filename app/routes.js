module.exports = function (app, passport, db) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, async (req, res) => {
    const entries = await db.collection("userEntries").find().toArray();
    // db.collection("userEntries")
    //   .find()
    //   .toArray((err, result) => {
    //     if (err) return console.log(err);
    res.render("profile.ejs", {
      entries: entries,
      user: req.user,
      // entries: result,
    });
    console.log(`these are the resuls: ${res}`);
    //});
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout(() => {
      console.log("User has logged out!");
    });
    res.redirect("/");
  });

  // message board routes ===============================================================

  app.post("/notionMockUp", (req, res) => {
    //let entry = req.body.entry;
    let prompt = req.body.questions;
    let mood;
    let productivity;
    let toDo;
    let date = new Date();

    if (req.body.questions === "mood") {
      mood = req.body.entry;
      db.collection("userEntries").insertOne(
        {
          name: req.body.name,
          mood: mood,
          prompt,
          date: date,
          thumbUp: 0,
        },
        console.log(req.body.questions),
        (err, result) => {
          if (err) return console.log(err);
          console.log("saved to database");
          res.redirect("/profile");
        }
      );
    } else if (req.body.questions === "productivity") {
      productivity = req.body.entry;
      db.collection("userEntries").insertOne(
        {
          name: req.body.name,
          productivity: productivity,
          prompt,
          date: date,
          thumbUp: 0,
        },
        (err, result) => {
          if (err) return console.log(err);
          console.log("saved to database");
          res.redirect("/profile");
        }
      );
    } else if (req.body.questions === "toDo") {
      toDo = req.body.entry;
      db.collection("userEntries").insertOne(
        {
          name: req.body.name,
          toDo: toDo,
          prompt,
          date: date,
          thumbUp: 0,
        },
        (err, result) => {
          if (err) return console.log(err);
          console.log("saved to database");
          res.redirect("/profile");
        }
      );
    }
    //let newEntry = entry.replace(/\s/g, "");

    //let newDate = date.replace(/\s/g, "");
    // console.log("prompt:", prompt);

    // db.collection("userEntries").insertOne(
    //   {
    //     name: req.body.name,
    //     mood: mood,
    //     productivity: productivity,
    //     toDo: toDo,
    //     date: date,
    //     thumbUp: 0,
    //   },
    //   (err, result) => {
    //     if (err) return console.log(err);
    //     console.log("saved to database");
    //     res.redirect("/profile");
    //   }
    // );
  });

  app.put("/notionMockUp/thumbsUp", (req, res) => {
    db.collection("userEntries").findOneAndUpdate(
      { name: req.body.name.trim() },
      {
        $inc: {
          thumbUp: 1,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.delete("/delete", (req, res) => {
    console.log(req.body);
    db.collection("userEntries").findOneAndDelete(
      { name: req.body.name, entry: req.body.entry },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
