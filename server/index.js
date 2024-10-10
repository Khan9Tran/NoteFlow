import { setRoutes, startServer } from "./common/server";
import routes from "./routes";
import "./common/env";


setRoutes((app) => routes(app)); 

// Start the server
console.log("Starting server on port " + process.env.PORT);

export default startServer(process.env.PORT);
