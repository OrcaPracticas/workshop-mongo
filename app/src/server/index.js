import BodyParser from "body-parser";
import Compression from "compression";
import Cors from "cors";
import Express, { Router, static as Statics } from "express";
import Helmet, { frameguard } from "helmet";
import Mongoose from "mongoose";
import Path from "path";

import ApiRouter from "./router";
import Tools from "Tools/Helpers";
// ======================== CONSTANTES ======================== //

const APP_PORT = process.env.PORT;
const ROOT_PATH = Path.join(__dirname, "../../");
const Helpers = Tools.instance;
const Server = Express();

// ==================== COMNFIGURACIONES ==================== //

Server.use(Cors());

Server.use(Helmet());
Server.use(frameguard({ action: "allow-from", domain: "*" }));

Server.use(Compression({ threshold: 0 }));

// ==================== PARSEO DE PARAMETROS ==================== //

Server.use(BodyParser.urlencoded({ extended: false }));
Server.use(BodyParser.json());

// ==================== ARCHIVOS STATICOS ==================== //

Server.use("/", Statics(`${ROOT_PATH}/public/`, {
    setHeaders(response) {
        Helpers.getTimeToLive(response, 31536000, "assets");
    }
}));

// ===================== MANEJO DE RUTAS ====================== //

Server.use(ApiRouter(Router));

// ====================== ESTABLECIENDO CONEXIÓN ====================== //

/**
 * Conexión a MongoDB Atlas.
 */
Mongoose.connect(
    process.env.ODBC,
    process.env.CONFIG,
    (mongoError) => {
        if (mongoError) {
            Helpers.messages("Problemas de conexión a MongoDB Atlas", "e");
            console.log(mongoError);
            process.exit(1);
        }
        /**
         * Inicializacion del servidor.
         *
         * @param {Number} PORT Puerto por el que estara escuhcando el server.
         * @param {Function} Callback Permite identificar el estado del proceso.
         *
         * return void.
         */
        Server.listen(APP_PORT, (error) => {
            Helpers.messages("Iniciando el Servidor", "i");
            Helpers.messages("🛰  Conexión establecida con MongoDB Altas", "s");
            if (error) {
                Helpers.messages("Problemas al inicar el servidor", "e");
                console.log(error); // eslint-disable-line
                process.exit(1);
            } else {
                Helpers.messages(`🚀 Servidor listo  en el puerto ${APP_PORT}`, "s");
            }
        });
    }
);

