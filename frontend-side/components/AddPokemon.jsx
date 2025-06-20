import React, { useState, useContext, useRef } from "react";
import { PokemonContext } from "../contexts/PokemonContext.jsx";
import { X } from "lucide-react";

const types = [
    "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison",
    "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dark", "Dragon", "Steel", "Fairy"
];

export default function AddPokemon({ onClose }) { 
    const { addPokemon, successMessage, setSuccessMessage, errorMessage ,setErrorMessage, state } = useContext(PokemonContext);
    const [pokemonName, setPokemonName] = useState("");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const [load, setLoading] = useState(false)


    ////////////////////////////////////////////////
    // handles the selection the type of pokemon
    ///////////////////////////////////////////////
    const handleSelect = (type) => {
        if (selectedTypes.includes(type)) return;
        if (selectedTypes.length < 3) {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    const handleRemove = (typeToRemove) => {
        setSelectedTypes(selectedTypes.filter((t) => t !== typeToRemove));
    };

    /////////////////////
    // adding a pokemon
    ////////////////////
    const handleSubmit = async (e) => {
        e.preventDefault();

        const resetForm = () => {
            setErrorMessage("") 
            setSuccessMessage("")
            setPokemonName("")
            setSelectedTypes([])
            setImage(null)

            // Reset the file input's value manually
            if (fileInputRef.current) {
            fileInputRef.current.value = null;
            }
            setLoading(false);
        }

        if (!pokemonName.trim()) {
            alert("Please enter a Pokémon name.");
            return;
        }
        if (selectedTypes.length === 0) {
            alert("Please select at least one Pokémon type.");
            return;
        }

        const newPokemon = {
            pokemonName: pokemonName,
            pokemonTypes: selectedTypes,
            pokemonImage: image
        };


        if (newPokemon.pokemonName.length < 2) {
            alert("Pokemon name must be at least 2 characters.");
            return;
        }
        
        const checkPokemonName = pokemonName.trim().toLowerCase()
        const isDuplicate = state.pokemons.some((pokemon) => pokemon.pokemonName.trim().toLowerCase() === checkPokemonName )
        if(isDuplicate){
            setErrorMessage(`Duplicate name: Pokemon name '${pokemonName}' already exist`)
            setTimeout(() => {
                resetForm()
            },2000)
            
            return
        }

        try {
            setLoading(true);
            // adding a delay after successfully adding a new pokemon
            await addPokemon(newPokemon);
            setSuccessMessage("New Pokémon added successfully!"); 
            setErrorMessage(""); // clear error if any

            setTimeout(() => {
                //clear pokemon name and selected pokemon type and success message
                resetForm()
            }, 2000);
            console.log("Sending newPokemon:", newPokemon);
        } catch (error) {
            setSuccessMessage(""); // clear any previous success
            //////////////////////////////////////////////////////////////////////////
            // checks the error and if message is === "Pokémon name already exists." 
            // this check in backend controller
            ///////////////////////////////////////////////////////////////////////////
            setErrorMessage( error?.response?.data?.message === "Pokémon name already exists." 
                ?  ("Duplicate name: This Pokémon already exists!")
                :  ("Something went wrong while adding Pokémon.")
            );
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-80" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-10 w-11/12 sm:w-[600px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Register a Pokémon</h2>
                    <button onClick={onClose} className="p-1 text-[#bd68eb] hover:text-[#9254b3] cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Pokémon Name */}
                    <div className="flex flex-col items-start mb-4">
                        <label htmlFor="pokemon-name" >
                            Pokémon Name
                        </label>
                        <input
                            type="text"
                            id="pokemon-name"
                            value={pokemonName}
                            onChange={(e) => setPokemonName(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                            placeholder="Enter Pokémon name"
                        />
                    </div>

                    {/* Pokémon Types */}
                    <div className="flex flex-col items-start mb-4">
                        <label>
                            Pokémon Type (max 3)
                        </label>

                        <div className="flex flex-wrap gap-2 mb-2">
                            {selectedTypes.map((type) => (
                                <span key={type} className="flex items-center gap-1 bg-purple-200 text-purple-900 text-sm px-2 py-1 rounded-full">
                                    {type}
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(type)}
                                        className="text-xs hover:text-red-600 cursor-pointer"
                                    >
                                        <X size={15} />
                                    </button>
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-5">
                            {types
                                .filter((type) => !selectedTypes.includes(type))
                                .map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => handleSelect(type)}
                                        className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded"
                                    >
                                        {type}
                                    </button>
                                ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-start ">
                            <label>Upload Pokemon Image</label>
                            <input id="file_input" type="file" accept="image/*" ref={fileInputRef} onChange={(e) => setImage(e.target.files[0])}  className="mt-1 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="submit" className="customButton">
                            {load ? "Adding..." : "Add"}
                        </button>
                    </div>
                    {errorMessage 
                        ? <p className="text-red-500">{errorMessage}</p>
                        : successMessage 
                            ? <p className="text-green-400">{successMessage}</p>
                            : null}
                </form>
            </div>
        </div>
    );
}
