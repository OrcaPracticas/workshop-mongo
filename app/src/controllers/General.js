import Helpers from "Tools/Helpers";
import { Model } from "mongoose";

class General {
    // Propiedad privada
    static #instanceClass = null;
    // Configuracion
    #config = {};

    /**
     * Metodo principal.
     */
    constructor() {
        this.#config = {
            helpers: Helpers.instance,
            body: null,
            data: { _id: null },
            response: null,
        };
    }

    /**
     * Permite configurar la petición para crear un nuevo registro.
     *
     * @param {Object} setting Parametros de configuracion.
     *
     * @return {void}.
     */
    async create(setting) {
        const IS_LOAD = await this.#load(setting);
        if (IS_LOAD) {
            const { body, Model } = this.#config;
            const CREATE = new Model(body);
            CREATE.save((error, data) => {
                this.#send(error, data, 201, "create");
            });
        }
    }

    /**
     * Permite configurar la petición para realizar una busqueda.
     *
     * @param {Object} setting Parametros de configuracion.
     *
     * @return {void}.
     */
    async read(setting) {
        const IS_LOAD = await this.#load(setting);
        if (IS_LOAD) {
            const { body, Model } = this.#config;
            Model.find(body, (error, data) => {
                this.#send(error, data, 200, "read");
            });
        }
    }

    /**
     * Permite configurar la petición para actualizar un registro.
     *
     * @param {Object} setting Parametros de configuracion.
     *
     * @return {void}.
     */
    async update(setting) {
        const IS_LOAD = await this.#load(setting);
        if (IS_LOAD) {
            const { body, query, Model } = this.#config;
            Model.updateMany(query, body, (error, data) => {
                this.#send(error, data, 202, "UPDATE");
            });
        }
    }

    /**
     * Permite configurar la petición para eliminar un registro.
     *
     * @param {Object} setting Parametros de configuracion.
     *
     * @return {void}.
     */
    async delete(setting) {
        const IS_LOAD = await this.#load(setting);
        if (IS_LOAD) {
            const { body, Model } = this.#config;
            Model.deleteMany(body, (error, data) => {
                this.#send(error, data, 204, "delete");
            });
        }
    }

    // ======================================== //
    //                 GETTERS                  //
    // ======================================== //

    /**
     * Permite conseguir una instancia de la clase.
     *
     * @returns {General}
     */
    static get instance() {
        if (!General.#instanceClass) {
            General.#instanceClass = new General();
        }
        return General.#instanceClass;
    }

    // ======================================== //
    //                 PRIVATE                  //
    // ======================================== //

    /**
     * Permite cargar de manera dinamica el modulo a utilizar.
     *
     * @param {Object} setting Parametros de configuración para armar la petición.
     *
     * @return {boolean}
     */
    async #load(setting) {
        const { helpers, Model, response } = Object.assign(this.#config, setting);
        let isLoad = false;
        try {
            const MODEL = await import(`../models/${Model}`);
            this.#config.Model = MODEL.default || MODEL;
            this.#config.type = Model;
            isLoad = true;
            helpers.messages(`Cargando el modelo ${Model}`, "t");
        } catch (error) {
            helpers.error(response, `El modulo ${Model} no existe`, error);
        }
        return isLoad;
    }

    /**
     * Permite resolver la peticion realiada a mongo.
     *
     * @param {MongooseError} error Error que surge en la petición.
     * @param {MongooseRequest} data Respuesta correspondiente a la petición.
     * @param {number} status Respuesta de la solicitud.
     * @param {string} edge Nombre de la acción.
     *
     * @return {void}.
     */
    #send(error, data, status = 200, edge = "generic") {
        const { response, helpers, type } = this.#config;
        helpers.messages(`Procesando petición de ${edge}`, "t");
        if (error) {
            helpers.error(response, `Surgio un problema en ${type}`, error);
        } else {
            helpers.getTimeToLive(response, 108000, `${edge}_${type}`);
            helpers.messages(`Respuesta enviada`, "s");
            response.status(status);
            response.json(data);
        }
    }
}

export default General;
