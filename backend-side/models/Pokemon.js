import mongoose, { Schema } from "mongoose";

const allowedTypes = [
    'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting',
    'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
    'Dark', 'Dragon', 'Steel', 'Fairy'
];

const pokemonSchema = new Schema({
    pokemonName: {
        type: String,
        required: [true, "Pokemon name is required"],
        trim: true,
        unique: true
    },
    pokemonTypes: {
        type: [String], 
        enum: {
            values: allowedTypes,
            message: "Invalid Pokémon type",
        },
        validate: {
            validator: function (types) {
                return types.length > 0 && types.length <= 3;
            },
            message: "A Pokémon must have between 1 and 3 types",
        },
        required: [true, "At least one Pokémon type is required"],
    },
    imageUrl: {
        type: String,
        // required: false,
        // default: "image url"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);

export default Pokemon;
