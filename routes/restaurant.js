// routes/restaurant.js
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

// 新增一筆 Restaurant 頁面
router.get('/new', (req, res) => {
  return res.render('new')
  // res.send('新增 Restaurant 頁面')
})

// 顯示一筆 restaurant 的詳細內容
router.get('/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    return res.render('detail', { restaurant: restaurant })
  })
  // res.send('顯示 Restaurant 的詳細內容')
})

// 新增一筆  Restaurant
router.post('/', (req, res) => {
  // 建立Todo model 實例
  const restaurant = new Restaurant({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    location: req.body.location,
    phone: req.body.phone,
    description: req.body.description,
    google_map: req.body.google_map,
    image: req.body.image,
    rating: req.body.rating
  })

  // 存入資料庫
  restaurant.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
  // res.send('建立 Restaurnat')
})

// 修改 Restaurant 頁面
router.get('/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    return res.render('edit', { restaurant: restaurant })
  })
  // res.send('修改 Restaurant 頁面')
})

// 修改 Restaurnat
router.put('/:id/edit', (req, res) => {
  console.log(req.body)
  Restaurant.findById(req.params.id, (err, restaurant) => {
    console.log(req.params.id)
    if (err) return console.error(err)
    restaurant.name = req.body.name
    restaurant.name_en = req.body.name_en
    restaurant.category = req.body.category
    restaurant.location = req.body.location
    restaurant.phone = req.body.phone
    restaurant.description = req.body.description
    restaurant.google_map = req.body.google_map
    restaurant.image = req.body.image
    restaurant.rating = req.body.rating

    restaurant.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
  // res.send('修改 Restaurant')
})

// 刪除 Restaurant
router.delete('/:id/delete', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    restaurant.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
  // res.send('刪除 Restaurant')
})


// 設定 /restaurant 路由
module.exports = router