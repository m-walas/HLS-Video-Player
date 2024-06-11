const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 8080;

app.use(express.static('public'));

app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    console.log(`Received exec command: ${cmd}`);
    if (cmd) {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${stderr}`);
                res.status(500).send(stderr);
            } else {
                console.log(`Command output: ${stdout}`);
                res.send(stdout);
            }
        });
    } else {
        res.status(400).send('No command provided');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
