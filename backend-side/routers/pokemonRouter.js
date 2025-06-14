import express from 'express'
import { getAllPokemon, createPokemon, deletePokemon, editPokemon } from '../controllers/pokemonController.js'
import upload from '../config/cloudinary.js'

const router = express.Router()

router.get('/all', getAllPokemon)
router.post('/create', upload.single('image'), createPokemon)
router.delete('/:id', deletePokemon)
router.put('/:id', editPokemon)

export default router