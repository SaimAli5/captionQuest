const express = require('express');
const apiRouter = express.Router();
const pool = require("./db")
// express-session
const session = require('express-session');
const store = new session.MemoryStore();
// passport.js
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

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
  done(null, user[0].id)
});

passport.deserializeUser( async (id, done) =>{
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
    const query = `SELECT * FROM users WHERE username = $1`

    await pool.query(query, [username], (err, user) =>{
      if(err){
        return done(err);
      }
      if(user.rowCount < 1){
        console.log('no user')
        return done(null, false);
      }
      if(user.rows[0].password !== password){
        console.log('wrong password')
        return done(null, false);
      }
      console.log('success')
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

// login
apiRouter.post("/login", 
      passport.authenticate('local', {failureRedirect: 'http://localhost:3000/login.html'}),
      (req, res, next) =>{
        res.redirect("http://localhost:3000/");
});

// register
apiRouter.post("/register", async (req, res, next) =>{
       const {username, password} = req.body;
       const query =  `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`;

  try{
       const newUser = await pool.query(query, [username, password]);
       if(newUser.rowCount > 0){
          res.redirect("http://localhost:3000/login.html")
       } else {
          res.status(400).send({
            message: "Registration failed"
            })
       };
  } catch(err) {
    next(err);
  }
});


// Error handler
apiRouter.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send("An error occurred, please try again later.");
})

module.exports = apiRouter;