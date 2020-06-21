import Compression from "compression";
import Cors from "cors";
import Express, { Router, static as Statics } from "express";
import BodyParser from "body-parser";
import Helmet, { frameguard } from "helmet";
import Path from "path";

import ApiRouter from "./router";

// ======================== CONSTANTES ======================== //

const APP_PORT = process.env.PORT;
const ROOT_PATH = Path.join(__dirname, "../../");
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

Server.use("/", Statics(`${ROOT_PATH}/public/`));

// ===================== MANEJO DE RUTAS ====================== //

Server.use(ApiRouter(Router));

// ====================== ESTABLECIENDO CONEXIÓN ====================== //

Server.listen(APP_PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Servidro listo ${APP_PORT}`);
    }
});
