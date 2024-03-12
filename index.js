const express = require('express');
const cors = require('cors');
const axios = require("axios");
const path = require("path");
const apiKey = '75f916f699ad49f79edba73078d9d347'; // 여기에 API 인증 키를 넣어주세요
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());
app.use(express.static('public'));

app.use(cors());

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.get('/attendances', (_req, res) => {
    res.send(attendances);
})

app.get('/soccer-results', async (req, res) => {
    try {
        const response = await axios.get('https://api.football-data.org/v4/competitions/PL/matches', {
            headers: {
                'X-Auth-Token': apiKey
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching soccer results:', error);
        res.status(500).json({ error: 'Failed to fetch soccer results' });
    }
});

apiRouter.post('/save-attendances', (req, res) => {
    attendances = updateAttendances(req.body, attendances);
    res.send(attendances);
})

apiRouter.post('/replace-attendances', (req, res) => {
    attendances = replaceAttentances(req.body, attendances);
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
        if (user.name == newAttendance.name && user.club == newAttendance.club) {
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

function replaceAttentances(newAttendances, attendances) {
    attendances = newAttendances;
    return attendances;
}