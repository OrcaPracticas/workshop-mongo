import Colors from "cli-color";
import { readdirSync } from "fs";

/* eslint-disable class-methods-use-this */
class Helper {
    // Propiedad privada
    static #instanceClass = null;

    /**
     * Permite manejar el error 404
     *
     * @param {express} response Objeto de express
     * @param {string} message Mensaje a mostrar
     * @param {any} error error que surge al mandar la data.
     *
     * @return {void}
     */
    error(response, message, error = "") {
        const DATA = {
            error,
            success: false,
            message,
        };
        this.messages(message, "e");
        response.status(404);
        response.json(DATA);
    }

    /**
     * Permite limpiar y formatear una cadena
     *
     * @param {string} string Cadena a limpiar.
     * @param {string} union Cararter con el que sera unida.
     *
     * @retur {string}
     */
    formatString(string = "", union = "") {
        let ascii = 0;
        let char = "";
        let newString = "";
        const STRING = string.toLowerCase();
        const SPECIAL = {
            á: "a",
            é: "e",
            í: "i",
            ó: "o",
            ú: "u",
            ñ: "n",
            "♀": "f",
            "♂": "m",
        };

        for (let i = 0; i < STRING.length; i += 1) {
            char = STRING[i];
            char = typeof SPECIAL[char] !== "undefined" ? SPECIAL[char] : char;
            if (typeof char !== "function") {
                ascii = char.charCodeAt();
                newString
                    += ascii === 32 || (ascii >= 48 && ascii <= 57) || (ascii >= 97 && ascii <= 122)
                        ? char
                        : "";
            }
        }
        newString = newString.split(" ").filter(Boolean);
        return newString.join(union);
    }

    /**
     * Permite el seteo de las metas de cache.
     *
     * @param {express} response Respuesta de express.
     * @param {Number} ttl Tiempo de vida de elemento.
     * @param {String} type Tipo de elemento.
     *
     * @return  {void}
     */
    getTimeToLive(response, ttl = 100, type = "generic") {
        const EDGE_VALUE = `API_${type}`.toUpperCase();
        response.setHeader("Edge-Control", `!no-store, cache-maxage=${ttl}s`);
        response.setHeader("Edge-Cache-Tag", EDGE_VALUE);
        response.setHeader("Cache-Control", `max-age=${ttl}`);
    }

    /**
     * Permite listar los modelos referentes a las colecciones disponibles.
     *
     * @param {String} path Ruta de donde se pueden cargar los modelos.
     * @param {String} host Url del host donde se esta probando.
     *
     * @return {Object}.
     */
    listModels(path, host, readme) {
        const CONTENT = readdirSync(path);
        const models = CONTENT.reduce((list, file) => {
            if (file !== "index.js") {
                const MODEL = file.replace(/\..*/g, "");
                list[MODEL] = `${host}${MODEL}/all`;
            }
            return list;
        }, {});
        return { readme, models };
    }

    /**
     * Permite el envio de mensajes
     *
     * @param  String text Mensaje que se desea mostrar.
     * @param  String type (Optional) Tipo de mensaje
     *
     * e = error
     * s = succses
     * w = warning
     * t = tracking
     * default = info
     *
     * @return void.
     */
    messages(text, type = "") {
        let log = "";
        let msg = "";
        let auxText = typeof text === "object" ? JSON.stringify(text) : text;
        const lon = auxText.length < 90 ? 100 - auxText.length : 0;
        switch (type) {
        case "e":
            log = Colors.xterm(15).bgXterm(124).bold;
            msg = " 🚨  ERROR    ";
            break;
        case "s":
            log = Colors.xterm(15).bgXterm(34).bold;
            msg = " 🙌  SUCCESS  ";
            break;
        case "w":
            log = Colors.xterm(232).bgXterm(214).bold;
            msg = " ⚠️  WARNING  ";
            break;
        case "t":
            log = Colors.xterm(15).bgXterm(90).bold;
            msg = " 🔎  TRACKING ";
            break;
        default:
            log = Colors.xterm(15).bgXterm(12).bold;
            msg = " ℹ️  INFO     ";
            break;
        }
        for (let i = 0; i < lon; i += 1) {
            auxText += " ";
        }
        console.log(log(` [${msg}] => ${auxText}`)); // eslint-disable-line
    }

    /**
     * Permite conseguir los parametros que son enviados a las consultas.
     *
     * @param {Express} request Objeto referen te a expess.
     *
     * @returns {void}.
     */
    prepareSetting(request) {
        const { body = {}, params } = request;
        const { field = "" } = params;
        params.field = (/_?id/.test(field)) ? "_id" : field;
        if (params.Model === "pokemon" && !body.img) {
            const { name = "default" } = body;
            const IMG = this.formatString(name);
            body.img = `${process.env.HOST}/pokemons/${IMG}.jpg`;
        }
        const setting = { body, Model: params.Model };
        delete params.Model;
        return { setting, ...params };
    }

    /**
     * Permite conseguir una instancia de la clase.
     *
     * @returns {Helper}
     */
    static get instance() {
        if (!Helper.#instanceClass) {
            Helper.#instanceClass = new Helper();
        }
        return Helper.#instanceClass;
    }
}
/* eslint-enable class-methods-use-this */

export default Helper;
