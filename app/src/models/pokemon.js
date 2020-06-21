import { model as Model, Schema } from "mongoose";

/**
 * Esquema correspondiente al registro de un pokemon.
 *
 * @return {Mongoose Schema}.
 */
const SCHEMA = new Schema({
    abilities: [String],
    evolution: [String],
    height: { type: String, default: "0′0″ (0.0m)" },
    name: { type: String, required: true },
    species: { type: String, required: true },
    stats: {
        attack: Number,
        defense: Number,
        hp: Number,
        sp: {
            atk: Number,
            def: Number,
        },
        speed: Number,
        total: Number,
    },
    types: [String],
    weight: { type: String, default: "0 lbs (0 kg)" },
    img: { type: String, default: "https://pbs.twimg.com/profile_images/1155697750664609802/ClNE-F8S_400x400.jpg" },
});

// Se indica el nombre de la colección y esquema a utillizar
export default Model("pokemons", SCHEMA);