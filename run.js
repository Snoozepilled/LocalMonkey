const express = require('express');
const fs = require('fs');
const path = require('path');

const meta = require('./package.json');
const config = require("./config/localmonkey");

const app = express();

app.use('/', (req, res, next) => {
    console.log(`Handling request: ${req.url}`);
    next();
});

// app.use('/script/userscript.js', (req, res) => {
//     // TODO: Userscript configs that prefill data?
//     let script = path.join(config.scriptPath, req.params.name);
//     let content = fs.readFileSync(script);
//     return res.status(200).send(content);
// });

app.get('/script/:name', (req, res) => {
    console.log(`Serving script ${req.params.name}`);
    res.setHeader('Content-Disposition', 'inline; filename="userscript.user.js"');
    res.contentType('application/javascript'); 

    let script = path.join(config.scriptPath, req.params.name);

    if(!fs.existsSync(script)) {
        return res.status(404).json({
            message: `Script ${req.params.name} not found in ${config.scriptPath}`
        });
    };

    try {
        let content = fs.readFileSync(script);
        return res.status(200).send(content);
    } catch(err) {
        return res.status(500).json({
            message: 'Server error.',
            err
        });
    };
});

app.get('/script', (req, res) => {
    return res.status(400).json({
        message: 'Missing script name.'
    });
});

app.get('/', (req, res) => {
    return res.status(200).json({
        version: meta.version
    });
});

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}.`);
});