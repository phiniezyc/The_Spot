const express = require('express');
const app = express();
const routes = require('./controllers/routes.js');

app.use('/', routes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`App has started on PORT: 3000`);
});
