const APP_PORT = process.env.PORT || 3000;

const USER_DB = process.env.USER_DB || "pokemon";
const PASS = process.env.PASS || "p0k3m0n.";
const DB = process.env.DB || "api";

// variables de entorno
module.exports = {
    "process.env.PORT": APP_PORT,
    "process.env.ODBC": `mongodb+srv://${USER_DB}:${PASS}@cluster0-eke4y.mongodb.net/${DB}?retryWrites=true&w=majority`,
    "process.env.CONFIG": {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};