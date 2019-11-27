// routes/home.js
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

// 載入 auth middleware 裡的 authenticated 方法
const { authenticated } = require('../config/auth')


// 設定第一個首頁路由
router.get('/', authenticated, (req, res) => {
  Restaurant.find({ userId: req.user._id })            // 只會列出登入使用者的 todo
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      return res.render('index', { restaurants: restaurants })
    })

  // return res.render('index')
  // res.send('hello world')
})

module.exports = router