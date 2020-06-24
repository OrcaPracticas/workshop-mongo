const APP_PORT = process.env.PORT || 3000;

const { USER_DB, PASS, DB, HEROKU } = process.env;
const HOST = HEROKU || `http://localhost:${APP_PORT}`;

// variables de entorno
module.exports = {
    "process.env.PORT": APP_PORT,
    "process.env.ODBC": `mongodb+srv://${USER_DB}:${PASS}@cluster0-eke4y.mongodb.net/${DB}?retryWrites=true&w=majority`,
    "process.env.HOST": HOST,
    "process.env.CONFIG": {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};
