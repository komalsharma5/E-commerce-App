require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRouter = require('./routes/auth/auth_routes')
const adminProductRouter = require('./routes/admin/product_routes')

const adminOrderRouter = require('./routes/admin/order_route')
const shopProductsRouter = require('./routes/shop/products_routes')
const shopCartRouter = require('./routes/shop/cart_route')
const shopAdressRouter = require('./routes/shop/adress_route')
const shopOrderRouter = require('./routes/shop/ordeer_routes')
const shopSearchRouter = require('./routes/shop/search_routes')
const shopReviewRouter = require('./routes/shop/review_routes')


const commonFeatureRouter = require('./routes/Common/Feature_route')



// Connect to MongoDB database
mongoose.connect("mongodb+srv://sharmakomalweb:3qvcLD00F3ps0Zo0@cluster0.1darij1.mongodb.net/e-commerce")
.then((data)=>{
    if(data){
        console.log("connected to database")
    }
}).catch((error)=>{
    console.log(error)
})


const app = express()
const PORT = process.env.PORT || 5001

//frontend connect with back-end
app.use(
    cors({
        origin: 'http://localhost:3000',
        methods : ['GET','POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization',
         'Cache-Control', 'Expires', 'Pragma'],
        credentials: true
        }
    )
)

app.use(cookieParser())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/admin/products', adminProductRouter)
app.use('/api/admin/orders', adminOrderRouter)


app.use('/api/shop/products',shopProductsRouter)
app.use('/api/shop/cart',shopCartRouter)
app.use('/api/shop/address',shopAdressRouter)
app.use('/api/shop/order',shopOrderRouter)
app.use('/api/shop/search',shopSearchRouter)
app.use('/api/shop/review',shopReviewRouter)

app.use('/api/common/feature', commonFeatureRouter)



app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})
