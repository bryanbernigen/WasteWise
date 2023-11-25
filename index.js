//Import Modules
const express = require('express');
const cors = require("cors");
const Router = require('./Routes/routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

//Setup Server
const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(cors());

//To Check if the server is alive
app.get('/', (req, res) => {
    res.status(200).json({alive: true});
});

//To use the routes
app.use('/api', Router);

//To start the server
app.listen(process.env.PORT||8080, () => {
    console.log("Server is running");
});