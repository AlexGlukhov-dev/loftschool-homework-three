const express = require('express')
const logger = require('morgan')

const createError = require('http-errors')
const path = require('path')

const mainRouter = require('./routes/')

const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const app = express()

app.use(
	session({
		store: new FileStore(),
		secret: "secret",
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());

const user = {
  id: '1',
  email: "spoot@bk.ru",
  password: '12345'
}

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const _user = user.id === id ? user : false;
  done(null, _user)
})

passport.use(new LocalStrategy({
  usernameField: "email"
}, (email, password, done) => {
  if(email === user.email && password === user.password){
    return done(null, user)
  }else{
    return done(null, false)
  }
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

process.env.NODE_ENV === 'development'
  ? app.use(logger('dev'))
  : app.use(logger('short'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', mainRouter)

// catch 404 and forward to error handler
app.use((req, __, next) => {
  next(
    createError(404, `Ой, извините, но по пути ${req.url} ничего не найдено!`)
  )
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(3000, () => {})
