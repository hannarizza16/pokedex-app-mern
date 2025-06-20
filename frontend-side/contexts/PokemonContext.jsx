import { createContext, useEffect, useReducer, useState } from "react";
import { ACTION_TYPES } from "../action_types/actionType.js";
import axios from 'axios'
import { initialState, pokemonReducer } from "../reducers/pokemonReducer.js";

export const PokemonContext = createContext()

export function PokemonProvider({ children }) {
    const [state, dispatch] =useReducer(pokemonReducer, initialState)
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true)


    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

    useEffect(() => {
        fetchPokemons();
    }, [])

    const fetchPokemons = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/all`);
            dispatch({
                type: ACTION_TYPES.LOAD_POKEMONS,
                data: response.data
            })
        } catch (error) {
            console.error('Error fetching pokemons', error)
            setErrorMessage('Failed to fetch data, please try again later.')
            //set loading
        } finally {
            setLoading(false)
        }
    }

    const addPokemon = async (newPokemon) => {
    const formData = new FormData();

    formData.append("pokemonName", newPokemon.pokemonName);

    newPokemon.pokemonTypes.forEach((type) => {
        formData.append("pokemonTypes", type); // Allows multiple types
    });

    if (newPokemon.pokemonImage) {
        formData.append("image", newPokemon.pokemonImage); // actual file
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/create`, formData);
        console.log("Pokemon added:", response.data);

        dispatch({
            type: ACTION_TYPES.ADD_POKEMON,
            data: response.data.newPokemon,
        });

        return { success: true };
    } catch (error) {
        throw error;
    }
};

    
    const editPokemon = async(pokemonId, updpatedPokemon) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${pokemonId}`, updpatedPokemon)
            console.log("POkemon Updated:", response.data)
            dispatch({
                type: ACTION_TYPES.EDIT_POKEMON,
                data: response.data.updatedPokemon
            })
            return {success: true}
        } catch (error) {
            throw error; // Let the calling component handle the error
        }
    } 

    const deletePokemon = async(pokemonId) => {
        try {
            await axios.delete(`${API_BASE_URL}/${pokemonId}`)
            dispatch({
                type:ACTION_TYPES.DELETE_POKEMON,
                data: pokemonId
            })
        } catch (error) {
            throw error 
        }
    }

    return (
        <PokemonContext.Provider value={{
            state,
            dispatch,
            addPokemon,
            editPokemon,
            deletePokemon,
            successMessage,
            setSuccessMessage,
            errorMessage,
            setErrorMessage,
            loading
        }}>
            {children}

        </PokemonContext.Provider>
    )


}

