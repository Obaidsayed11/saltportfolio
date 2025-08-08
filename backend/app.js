import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();
app.use(express.json({ limit: '16kb' }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: "2mb" }))
app.use(express.static("public"))


app.use(
  cors({
    // origin:process.env.ORIGIN,
    origin:'https://saltportfolio-frontend.onrender.com',
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"], 

  })
);


import authRoutes from './Routes/Auth.route.js'
import portfolioRoutes from './Routes/portfolio.route.js'

app.use('/api/v1/users',authRoutes)
app.use('/api/v1/portfolio',portfolioRoutes)

export default app