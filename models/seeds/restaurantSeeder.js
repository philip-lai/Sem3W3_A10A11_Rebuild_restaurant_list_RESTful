const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')
const bcrypt = require('bcryptjs')
const restaurantlist = require('../restaurant.json').results
const userlist = require('../users.json').users

// 設定連線到 mongoDB
mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })

// mongoose 連線後透過mongoose.connection拿到Connection的物件
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})

// 連線成功
db.once('open', () => {
  console.log('db connected')
  for (let i = 0; i < userlist.length; i++) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(userlist[i].password, salt, (err, hash) => {
        const newUser = new User({
          name: userlist[i].name,
          email: userlist[i].email,
          password: hash
        })
        newUser.save().then(user => {
          // create restaurant data for each user
          for (let j = i * 3; j < (i + 1) * 3; j++) {
            Restaurant.create({
              name: restaurantlist[j].name,
              name_en: restaurantlist[j].name_en,
              category: restaurantlist[j].category,
              image: restaurantlist[j].image,
              location: restaurantlist[j].location,
              phone: restaurantlist[j].phone,
              google_map: restaurantlist[j].google_map,
              rating: restaurantlist[j].rating,
              description: restaurantlist[j].description,
              userId: user._id
            })
          }
        }).catch(err => {
          console.log(err)
        })
      })
    })
  }
  console.log('done')
})
