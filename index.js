const express = require('express');
const cors = require('cors');
const axios = require("axios");
const path = require("path");

const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 80;

app.use(express.json());
app.use(express.static('public'));

app.use(cors());

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.get('/attendances', (_req, res) => {
    res.send(attendances);
})

apiRouter.post('/save-attendances', (req, res) => {
    attendances = updateAttendances(req.body, attendances);
    res.send(attendances);
})


app.use((_req, res) => {
    res.sendFile('login.html', { root: 'public' });
  });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });


let attendances = [];

function updateAttendances(newAttendance, attendances) {
    let found = false;
    let user;
    for (let i = 0; i < attendances.length; i++) {
        user = attendances[i];
        if (user.name == newAttendance[i].name && user.club == newAttendance[i].club) {
            attendances[i] = newAttendance;
            found = true;
            break;
        }
    }

    if (!found) {
        attendances.push(newAttendance);
    }

    return attendances;
}