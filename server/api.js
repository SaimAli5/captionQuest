const express = require('express');
const apiRouter = express.Router();
const pool = require("./db")
// express-session
const session = require('express-session');
const store = new session.MemoryStore();
// passport.js
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
// password hash
const bcrypt = require("bcrypt");

// session config
apiRouter.use(
  session({
       secret: "fj9328rdhf29f823hf",
       cookie: {maxAge: 1000000},
       saveUninitialized: false,
       resave: false,
       store
  })
);

// passport config
apiRouter.use(passport.initialize());
apiRouter.use(passport.session());

passport.serializeUser((user, done) =>{
  console.log("serialize")
  done(null, user[0].id)
});

passport.deserializeUser( async (id, done) =>{
  console.log("deserialize")
  const query =  `SELECT * FROM users WHERE id = ${id}`
  await pool.query(query, (err, user) =>{
    if(err){
      return done(err)
    };
    return done(null, user.rows);
  })
})


// login authentication
passport.use( new localStrategy(
  async (username, password, done) =>{
    // hashed-password check
    const passwordQuery = `SELECT password FROM users WHERE username = $1`
    const hashedPassword = await pool.query(passwordQuery, [username]);
    // return false if password is wrong
    const userPassword = await bcrypt.compare(password, hashedPassword.rows[0].password);

    const usernameQuery = `SELECT * FROM users WHERE username = $1`
    await pool.query(usernameQuery, [username], (err, user) =>{
      if(err){
        return done(err);
      }
      if(user.rowCount < 1){
        console.log('no user')
        return done(null, false);
      }
      if(!userPassword){
        console.log('wrong password')
        return done(null, false);
      }
      console.log('successfull authentication')
      return done(null, user.rows)
    });
  }
));


// Caption submition 
apiRouter.post("/", async (req, res, next) =>{
       const {caption, image_id} = req.body;
       const query = `INSERT INTO caption_table (caption, user_id, image_id) VALUES ($1, $2, $3) RETURNING *`

  try{
       const newCaption = await pool.query(query, [caption, req.session.passport.user, image_id]);
       res.status(201).send({
          status: 'Success',
          message: 'Caption submited successfully',
          data: newCaption.rows
          });
  } catch(err) {
    next(err);
  }
});

apiRouter.get("/caption/:imageId", async (req, res, next) =>{
  const imageId = req.params.imageId;
  const query = `SELECT caption_table.caption, users.username FROM caption_table JOIN users 
  ON users.id = caption_table.user_id
  WHERE image_id = $1`;

  try{
      const allCaptions = await pool.query(query, [imageId]);
      if(allCaptions.rowCount < 1){
        res.send({
          message: "No caption found "
        })
      }
      res.send({
        status: "Success",
        message: "Captions successfully found",
        data: allCaptions.rows
      });
  } catch(err){
    next(err);
  }
});

// login
apiRouter.post("/login", 
      passport.authenticate('local', {failureRedirect: 'http://localhost:3000/login.html'}),
      (req, res, next) =>{
        console.log(req.session);
        res.redirect("http://localhost:3000/index.html");
});

// register
apiRouter.post("/register", async (req, res, next) =>{
       const {username, password} = req.body;
       const query =  `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`;
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);

  try{
       const newUser = await pool.query(query, [username, hashedPassword]);
       if(newUser.rowCount > 0){
          console.log("successfull registration");
          res.redirect("http://localhost:3000/login.html");
       } else {
          res.status(400).send({
            message: "Registration failed"
          })
       };
  } catch(err) {
    next(err);
  }
});

// logout
apiRouter.get("/logout", (req, res, next) =>{
  req.logout((err) => {
    if (err) {
      console.log("error here")
      console.error(err);
      return next(err);
    }
    console.log("successfull logout")
    res.redirect("http://localhost:3000/login.html");
  });
})

// Error handler
apiRouter.use((err, req, res, next)=>{
    console.error(err);
    console.error(err.stack);
    res.status(500).send("An error occurred, please try again later.");
})

module.exports = apiRouter;