import Controller from "Controllers/General";

/**
 * Manejo de rutas para el API.
 *
 * @param   {express} router Objeto de Express para el manjeo de routers.
 *
 * @return  {router}
 */
const ApiRouter = (router) => {
    const Router = router();
    const CONTROLLER = Controller.instance;

    // Router para crear un nuevo registro
    Router.post("/:Model", async (request, response) => {
        const {
            body = null,
            params: { Model = "" },
        } = request;
        CONTROLLER.create({ body, Model, response });
    });

    // Router para leer un registros
    Router.get("/:Model/:field/:value", async (request, response) => {
        const { Model = "", field = "", value = "" } = request.params;
        let body = {};
        if (field === "_id" || field === "id") {
            body = { _id: value };
        } else {
            const REG_EXP = new RegExp(value, "i");
            body[field] = { $in: [REG_EXP] };
        }
        CONTROLLER.read({ body, Model, response });
    });

    // Router para actualizar un registro
    Router.put("/:Model/:_id?", async (request, response) => {
        const {
            body = null,
            params: { Model = "", _id = "" },
        } = request;
        CONTROLLER.update({ body, query: { _id }, Model, response });
    });

    // Router para borrar un registro
    Router.delete("/:Model/:_id?", async (request, response) => {
        const { Model = "", _id = "" } = request.params;
        CONTROLLER.delete({
            body: { _id },
            Model,
            response,
        });
    });

    return Router;
};

export default ApiRouter;
