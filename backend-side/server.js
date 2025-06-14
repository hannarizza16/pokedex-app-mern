import express from 'express'
import cors from 'cors'
import connectDb from './database/connectDb.js'
import pokemonRouter from './routers/pokemonRouter.js'

import Pokemon from './models/Pokemon.js'

connectDb()

const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true })); // OK for URL-encoded
// multer handles multipart/form-data, don't need bodyParser for that


// Ensure indexes like `unique: true` are built
await Pokemon.init();


app.use(cors())

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.use('/api/v1/pokemon', pokemonRouter)


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})