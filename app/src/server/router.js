const ApiRouter = (router) => {
    const Router = router();
    Router.use((request, response) => {
        response.status(200);
        response.send("<h1>Hola Mundo !</h1>");
    });

    return Router;
};

export default ApiRouter;
