const express = require('express');
var cors = require('cors');
var swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');

var app = express();
 //const PORT = process.env.PORT || 5000;



app.use(express.json()); //parse application/json
app.use(express.urlencoded({ extended:true }));
app.use(cors())

//Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));


// //configure 
app.use("/employees",require('./routes/employee-routes').router);

//404 error handler(client side error)
app.use((req, res, next) => {
    return res.status(404).json({
      error: "Not Found",
    });
  });

// //configure error handlers(server side error)
app.use(function (err, req, res, next) {
if (process.env.NODE_ENV == "development") {
console.error(err.stack);
}
res.status(500).send({ 'error': 'Something broke!' })
});



module.exports = app;

