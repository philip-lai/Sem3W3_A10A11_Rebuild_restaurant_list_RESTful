// routes/search.js
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
// 載入auth middleware裡的authenticated方法
const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  const keyword = req.query.keyword
  const sort = req.query.sort
  let sortMeth
  let sortBy
  let searchResults
  const regex = new RegExp(keyword, 'i')

  switch (sort) {
    case 'name_en-asc':
      sortMeth = { name_en: 'asc' }
      sortBy = '依英文店名(A-Z)'
      break;
    case 'name_en-desc':
      sortMeth = { name_en: 'desc' }
      sortBy = '依英文店名(Z-A)'
      break
    case 'category-asc':
      sortMeth = { category: 'asc' }
      sortBy = '依餐廳類別'
      break
    case 'rating-asc':
      sortMeth = { rating: -1 }
      sortBy = '依餐廳評分(高分優先)'
      break
    case 'rating-desc':
      sortMeth = { rating: 1 }
      sortBy = '依餐廳評分(低分優先)'
      break
    default:
      sortMeth = { _id: 'asc' }
      break
  }

  Restaurant.find(
    {
      userId: req.user._id,
      $or: [
        { name: regex },
        { name_en: regex },
        { category: regex },
        { location: regex },
        { description: regex }
      ]
    }
  )
    .sort(sortMeth)
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      return res.render('index', { restaurants, keyword })
    })
})

module.exports = router