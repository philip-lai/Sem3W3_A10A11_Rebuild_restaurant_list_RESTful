const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const mongoose = require('mongoose')
// 引用 express-handlebars
const exphbs = require('express-handlebars')
// 引用 body-parser
const bodyParser = require('body-parser')
// 引用 methodOverride
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

// 告訴 express 使用 handlebars 當作 template engine 並預設 layout 是 main
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// 設定 bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
// 設定 method-override
app.use(methodOverride('_method'))

// 設定連線到 mongoDB
mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

// mongoose 連線後透過mongoose.connection拿到Connection的物件
const db = mongoose.connection

// 使用passport
app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())


// setting static files
app.use(express.static('public'))

app.use(flash())

// 載入passport
require('./config/passport')(passport)
app.use((req, res, next) => {
  res.locals.user = req.user
  // 辨識使用者是否已經登入的變數，讓view可以使用
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})

// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


// 載入restaurant model
const Restaurant = require('./models/restaurant')


// 列出全部 Restaurant
app.get('/restaurants', (req, res) => {
  return res.render('new')
  //res.send('列出所有 Restaurant')
})




// 載入路由器
app.use('/', require('./routes/home.js'))
app.use('/restaurants', require('./routes/restaurant.js'))
app.use('/search', require('./routes/search.js'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auths'))


//設定express port 3000
app.listen(3000, () => {
  console.log('app is running')
})