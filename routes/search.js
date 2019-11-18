// routes/search.js
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

router.get('/', (req, res) => {
  const keyword = req.query.keyword
  if (keyword.trim().length === 0) {
    return res.redirect('/')
  } else {
    Restaurant.find((err, restaurants) => {
      if (err) return console.error(err)
      const searchResults = restaurants.filter(restaurant => {
        return (restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.name_en.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase()) || restaurant.location.toLowerCase().includes(keyword.toLowerCase()) || restaurant.description.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      res.render('index', { restaurants: searchResults })
    })

  }
})

module.exports = router