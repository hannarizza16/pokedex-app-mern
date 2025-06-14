export const initialState = {
    pokemons: []
}

// aad
// edit
// load
// delete


export function pokemonReducer(state, action){
    switch(action.type){
        case 'ADD_POKEMON':
            return {
                ...state,
                pokemons: [...state.pokemons, action.data]
            }
        case 'LOAD_POKEMONS': 
        return {
            ...state,
            pokemons: action.data
        }
        case 'EDIT_POKEMON':
            return {
                ...state,
                pokemons: state.pokemons.map(pokemon => 
                    pokemon._id === action.data._id // Check if the Pokémon ID matches the one being edited
                    //this updates the ui instantly after the change

                        ? { ...pokemon, ...action.data } // Update the existing Pokémon
                        : pokemon // Keep the existing Pokémon unchanged
                 )
            }
        case 'DELETE_POKEMON':
            return {
                ...state,
                pokemons: state.pokemons.filter(pokemons => pokemons._id !== action.data) // Filter out the deleted Pokémon
            }
        default:
            return state
    }
}