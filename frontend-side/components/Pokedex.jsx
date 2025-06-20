import { useContext, useState } from "react";
import AddPokemon from "./AddPokemon.jsx";
import EditPokemon from "./EditPokemon.jsx";
import { PokemonContext } from "../contexts/PokemonContext.jsx";
import { X } from "lucide-react";

export default function Pokedex() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const { state, deletePokemon, loading, errorMessage } = useContext(PokemonContext);
  const { pokemons } = state;

  const handleCardClick = (pokemon) => {
    setSelectedPokemon(pokemon);
    setShowEditModal(true);
  };

  const handleDelete = async (pokemonId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this Pokémon?')
      if (!confirmDelete) return;

    console.log("Deleting:", pokemonId);
    await deletePokemon(pokemonId)
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center my-5">Pokédex</h1>

      <div className="m-5 text-center">
        <button className="customButton" onClick={() => setShowAddModal(true)}>
          Add Pokémon
        </button>
      </div>

      {showAddModal && <AddPokemon onClose={() => setShowAddModal(false)} />}
      {showEditModal && selectedPokemon && (
        <EditPokemon
          pokemon={selectedPokemon}
          onClose={() => {
            setSelectedPokemon(null);
            setShowEditModal(false);
          }}
        />
      )}

      {/* Pokémon Cards */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="flex justify-center items-center col-span-full min-h-[200px]">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : errorMessage ? (
          <div className="text-red-500 text-center col-span-full">{errorMessage}</div>
        ) : pokemons.length === 0 ? (
          <p className="text-center col-span-full">No Pokémon found.</p>
        ) : (
          pokemons.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((pokemon) => (
            <div
              key={pokemon._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-4 hover:shadow-lg transition duration-200 cursor-pointer"
              onClick={() => handleCardClick(pokemon)}
            >
              <div className="flex justify-between">
                <h3 className="flex text-lg font-semibold capitalize text-purple-700 dark:text-purple-300 mb-2 truncate">
                {pokemon.pokemonName}
                </h3>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(pokemon._id)}} className="p-1 text-[#bd68eb] hover:text-red-600  cursor-pointer">
                        <X size={20} />
                </button>

              </div>

              {pokemon.imageUrl && (
                <img src={pokemon.imageUrl} alt={pokemon.pokemonName} className="w-full h-40 object-contain my-2 rounded" />
              )}
              
              {/* <p className="text-sm text-gray-700 dark:text-gray-300">Image</p> */}
              <div className="flex flex-wrap gap-2 mt-1">
                {pokemon.pokemonTypes.map((type) => (
                  <span
                    key={type}
                    className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
