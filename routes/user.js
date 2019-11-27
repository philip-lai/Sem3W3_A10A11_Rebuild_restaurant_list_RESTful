// routes/user.js
const express = require('express')
const router = express.Router()
const User = require('../models/user')

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 登入檢查
router.post('/login', (req, res) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })(req, res, next)
  // res.send('login')
})

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 註冊檢查
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  User.findOne({ email: email }).then(user => {
    if (user) {
      // 如果email存在，將不能送出，並回到註冊表單頁面
      console.log('user already exists')
      res.render('register', {
        name,
        email,
        password,
        password2
      })
    } else {
      // 如果email不存在就新增使用者
      // 新增完成後導回首頁
      const newUser = new User({
        name,
        email,
        password
      })
      newUser
        .save()
        .then(user => {
          res.redirect('/')
        })
        .catch(err => console.log(err))
    }
  })
  // res.send('register')
})

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
  //res.send('logout')
})

module.exports = router