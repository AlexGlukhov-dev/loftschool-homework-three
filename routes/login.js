const express = require('express')

const router = express.Router()
const passport = require('passport');

router.get('/', (req, res, next) => {
  if(req.isAuthenticated()) {
    res.redirect("/admin")
  }
  res.render('pages/login', { title: 'SigIn page' })
})

router.post('/', (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if(err){
      return next(err)
    }
    if(!user){
      return res.send("Wrong email or password")
    }
    req.login(user, () => {
      res.redirect("/admin")
    })
  })(req, res, next)
})

module.exports = router
