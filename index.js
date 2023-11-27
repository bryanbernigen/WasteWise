//Import Modules
const express = require("express");
const cors = require("cors");
const Router = require("./Routes/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const fileUpload = require("express-fileupload");

//Setup Server
const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(fileUpload({ limits: { fileSize: 3840 * 2160 } }));
app.use(cors());

//To Check if the server is alive
app.get("/", (req, res) => {
    res.status(200).json({ alive: true });
});

//To use the routes
app.use("/api", Router);

//To start the server
app.listen(process.env.PORT || 8080, () => {
    const port = process.env.PORT || 8080;
    console.log("Server is running at localhost:" + port);
});
