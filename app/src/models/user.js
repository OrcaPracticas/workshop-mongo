import { model as Model, Schema } from "mongoose";

/**
 * Esquema correspondiente al registro de un user.
 *
 * @return {Mongoose Schema}.
 */
const SCHEMA = new Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, default: "00-00-00-00-00" },
});

// Se indica el nombre de la colección y esquema a utillizar
export default Model("user", SCHEMA);