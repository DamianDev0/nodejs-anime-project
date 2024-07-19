const express = require('express')
const animeRoutes = require('./routes/anime')
const errorHandler = require('./middlewares/errorHandler')


const app = express()
const PORT = 3000

app.use(express.json())
app.use('/anime',animeRoutes)
app.use(errorHandler)

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})