import Pokemon from "../models/Pokemon.js";

export const getAllPokemon = async (req, res) => {
    try {
        const pokemons = await Pokemon.find()
        res.status(200).json(pokemons)
    } catch (error) {
        res.status(500).json({message: 'Error fetchin pokemons', error})
    }
}

export const createPokemon = async(req, res) => {

    try {
        const {pokemonName, pokemonTypes}=req.body
        console.log('REQ.FILE:', req.file);
        console.log("req.body:", req.body); // 👈 Check if pokemonName and pokemonTypes are being sent

        if(!pokemonName || !pokemonTypes || !pokemonTypes.length ) {
            return res.status(400).json({ 
                message: 'Pokemon Name and choose at least one pokemon type are required', 
                error: 'Missing required fields: pokemonName,  pokemonTypes expects an array'})
        } 

         // ✅ Handle uploaded image
        const imageUrl = req.file?.path; // multer + Cloudinary gives this

        const newPokemon = new Pokemon({
            pokemonName, 
            pokemonTypes,
            imageUrl
        })

        await newPokemon.save()
        res.status(200).json({newPokemon})
        
    } catch (error) {
        ///////////////////////////////////
        // Handle error for duplicate name
        ///////////////////////////////////
        if (error.code === 11000 && error.keyPattern?.pokemonName) {
        return res.status(400).json({
            message: 'Pokémon name already exists.',
            error: error.message,
        });
        ///////////////////////////////////////////////////////////////////////////
    }   // this error is thrown when the pokemonName is not unique
        // if client send an duplicate name this errors triggers and front end ui 
        // can handle it and show a message to user
        /////////////////////////////////////////////////////////////////////////

        res.status(500).json({
            message: 'Error creating new pokemon character', 
            error: error.message || error})
        
    }
}

export const deletePokemon = async (req, res) => {
    try {
        
        const pokemon = await Pokemon.findById(req.params.id)
        if(!pokemon) {
            return res.status(404).json({message:'Pokemon not found'})
        }
        await pokemon.deleteOne() //delete in databasse
        res.status(200).json({updatedPokemon: pokemon, message: 'Pokemon deleted successfully'})
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting this Pokemon',
            error:error.message || error })        
    }
}

export const editPokemon = async (req, res) => {
    try {
        const {pokemonName, pokemonTypes} = req.body
        if(!pokemonName || !pokemonTypes || !pokemonTypes.length) {
            return res.status(400).json({ 
                message: 'Pokemon Name and choose at least one pokemon type are required', 
                error: 'Missing required fields: pokemonName,  pokemonTypes expects an array'})
        } 

        const pokemon = await Pokemon.findById(req.params.id)
        if(!pokemon) {
            return res.status(404).json({message:'Pokemon not found'})
        }

        // update the pokemon
        pokemon.pokemonName = pokemonName
        pokemon.pokemonTypes = pokemonTypes

        await pokemon.save()
        res.status(200).json({ updatedPokemon: pokemon})
        
    } catch (error) {
        res.status(500).json({
            message: 'Error editing Pokemon',
            error: error.message || error})
        
    }
}