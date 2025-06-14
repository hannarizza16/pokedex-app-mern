import { useState, useContext } from "react";
import { PokemonContext } from "../contexts/PokemonContext";
import { X } from "lucide-react";

const types = [
    "Normal",
    "Fire",
    "Water",
    "Grass",
    "Electric",
    "Ice",
    "Fighting",
    "Poison",
    "Ground",
    "Flying",
    "Psychic",
    "Bug",
    "Rock",
    "Ghost",
    "Dark",
    "Dragon",
    "Steel",
    "Fairy",
];

export default function EditPokemon({ pokemon, onClose }) {
    const {
        editPokemon,
        setSuccessMessage,
        successMessage,
        setErrorMessage,
        errorMessage,
    } = useContext(PokemonContext);

    const [name, setName] = useState(pokemon.pokemonName);
    const [loading, setLoading] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState(pokemon.pokemonTypes || []); // pokemon.pokemonTypes shows the selected pokemon types

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

    const handleUpdate = async () => {
        setLoading(true);

        const updatedPokemon = {
            pokemonName: name,
            pokemonTypes: selectedTypes,
        };

        try {
            await editPokemon(pokemon._id, updatedPokemon);
            setSuccessMessage("Pokémon updated successfully!");
            setErrorMessage(""); // clear error if any

            setTimeout(() => {
                onClose(); // close modal
                setSuccessMessage("");
                setErrorMessage(""); // clear error if any
            }, 2000);
        } catch (error) {
            setSuccessMessage("");
            console.error("Error updating Pokémon:", error);
            setErrorMessage("Failed to update Pokémon.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />

            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-10 w-11/12 sm:w-[600px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit a Pokémon</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-[#bd68eb] hover:text-[#9254b3] cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col items-start mb-4">
                    <label>Pokémon Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Charizard"
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                />
                </div>

                {/* Pokémon Types */}
                <div className="flex flex-col items-start mb-4">
                    <label>Pokémon Type (max 3)</label>

                    <div className="flex flex-wrap gap-2 mb-2">
                        {selectedTypes.map((type) => (
                            <span
                                key={type}
                                className="flex items-center gap-1 bg-purple-200 text-purple-900 text-sm px-2 py-1 rounded-full"
                            >
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

                    <div className="flex flex-wrap gap-2">
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
            
            <div className="flex justify-end gap-2">
                    <button
                        className="customButton"
                        onClick={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
                {errorMessage ? (
                    <p className="text-red-500">{errorMessage}</p>
                ) : successMessage ? (
                    <p className="text-green-400">{successMessage}</p>
                ) : null}
                
            </div>
        </div>
    );
}
