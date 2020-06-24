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
            data: { _id: null },
            body: null,
            helpers: Helpers.instance,
            response: null,
            query: {},
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
            await CREATE.save((error, data) => {
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
            const { query, Model } = this.#config;
            await Model.find(query, (error, data) => {
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
            await Model.updateOne(query, body, (error, data) => {
                this.#send(error, data, 202, "update");
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
            await Model.deleteOne(body, (error, data) => {
                this.#send(error, data, 202, "delete");
            });
        }
    }

    async random(setting) {
        const IS_LOAD = await this.#load(setting);
        if (IS_LOAD) {
            const { Model, helpers } = this.#config;
            await Model.find({}, { _id: true }, (error, data) => {
                if (error) {
                    helpers.error(response, `Problemas consiguiendo los elementos`, error);
                } else {
                    const MAX = data.length;
                    const INDEX = Math.floor(Math.random() * (MAX - 0)) + 0;
                    setting.query = { _id: data[INDEX] };
                    this.read(setting);
                }
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
            helpers.error(response, `Surgio un problema en ${type} en la operacion ${edge}`, error);
        } else {
            helpers.getTimeToLive(response, 108000, `${edge}_${type}`);
            helpers.messages(`Respuesta enviada`, "s");
            response.status(status);
            const DATA = (data.n >= 0) ? { action: edge, count: data.n } : data;
            response.json(DATA);
        }
    }
}

export default General;
