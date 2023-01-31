const express = require('express');
const app = express();
const routes = require('./routes');
const ExpressError = require('./expressError');

app.use(express.json());
app.use("/", routes);

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    // console.log(err.message);
    return res.send(err.message);
})

module.exports = app;