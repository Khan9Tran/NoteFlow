import { setRoutes, startServer } from "../server/common/server.js";
import routes from "./routes.js";
import "./common/env.js";


setRoutes((app) => routes(app)); 

// Start the server
console.log("Starting server on port " + process.env.PORT);

export default startServer(process.env.PORT);
