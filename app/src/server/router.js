import Controller from "Controllers/General";

/**
 * Manejo de rutas para el API.
 *
 * @param   {express} router Objeto de Express para el manjeo de routers.
 *
 * @return  {router}
 */
const ApiRouter = (router, helpers) => {
    const Router = router();
    const { instance } = Controller;

    // Router para resolver el endpoint Create
    Router.post("/:Model", (request, response) => {
        const { setting } = helpers.prepareSetting(request);
        instance.create({ ...setting, response });
    });

    // Router para resolver el endpoint Read
    Router.get("/:Model/:field/:value", (request, response) => {
        const { setting, field, value } = helpers.prepareSetting(request);
        const query = {};
        const REG_EXP = new RegExp(value, "i");
        query[field] = (field === "_id") ? value : { $in: [REG_EXP] };
        instance.read({ query, ...setting, response });
    });

    // Router para resolver el endpoint que permite listar todos los registros
    Router.get("/:Model/all", (request, response) => {
        const { setting } = helpers.prepareSetting(request);
        instance.read({ ...setting, response });
    });

    // Router para conseguir un registro random
    Router.get("/:Model/random", (request, response) => {
        const { setting } = helpers.prepareSetting(request);
        instance.random({ ...setting, response });
    });

    Router.put("/:Model/:_id", (request, response) => {
        const { setting, _id } = helpers.prepareSetting(request);
        instance.update({ query: { _id }, ...setting, response });
    });

    // Router para resolver el endpoint Delete
    Router.delete("/:Model/:_id", (request, response) => {
        const { setting, _id } = helpers.prepareSetting(request);
        instance.delete({ query: { _id }, ...setting, response });
    });

    return Router;
};

export default ApiRouter;
