// config/passport.js
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')

// 載入user model
const User = require('../models/user')
module.exports = passport => {
  // 使用Passport的官方文件上的語法
  // 定義usernameField為email
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, passowrd, done) => {
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'that email is not registered' })
        }
        if (user.password != password) {
          return done(null, false, { message: 'email or password incorrect' })
        }
        return done(null, user)
      })
    })
  )
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}