const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')
const bcrypt = require('bcryptjs')
const restaurant = require('../restaurant.json').results
const users = require('../users.json').users

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
  for (let i = 0; i < users.length; i++) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(users[i].password, salt, (err, hash) => {
        const newUser = new User({
          name: users[i].name,
          email: users[i].email,
          password: hash
        })
        newUser.save().then(user => {
          // create restaurant data for each user
          for (let j = i * 3; j < (i + 1) * 3; j++) {
            Restaurant.create({
              name: restaurant[j].name,
              name_en: restaurant[j].name_en,
              category: restaurant[j].category,
              image: restaurant[j].image,
              location: restaurant[j].location,
              phone: restaurant[j].phone,
              google_map: restaurant[j].google_map,
              rating: restaurant[j].rating,
              description: restaurant[j].description,
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
