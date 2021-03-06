const { USER_DB, PASS, DB, HEROKU } = process.env;
const HOST = HEROKU || `http://localhost:3000/`;

// variables de entorno
module.exports = {
    "process.env.ODBC": `mongodb+srv://${USER_DB}:${PASS}@cluster0-eke4y.mongodb.net/${DB}?retryWrites=true&w=majority`,
    "process.env.HOST": HOST,
    "process.env.README": "https://github.com/OrcaPracticas/workshop-mongo/blob/develop/README.md",
    "process.env.CONFIG": {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};
