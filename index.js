const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const config = require('./dbConfig.json');
const cors = require('cors');
const axios = require("axios");
const path = require("path");
const apiKey = require('./apiKey.json'); // 여기에 API 인증 키를 넣어주세요
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 3000;
const authCookieName = 'token';
let attendances = [];

// connecting mongodb
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('manageyourclub');
const collection = db.collection('attendances');
const userCollection = db.collection('user');

(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
  })().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  });

app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

app.use(express.static('public'));

app.use(cors());

var apiRouter = express.Router();
app.use(`/api`, apiRouter);



app.get('/soccer-results', async (req, res) => {
    try {
        const response = await axios.get('https://api.football-data.org/v4/competitions/PL/matches', {
            headers: {
                'X-Auth-Token': apiKey.key
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching soccer results:', error);
        res.status(500).json({ error: 'Failed to fetch soccer results' });
    }
});

//http://api.football-data.org/v4/competitions/PL/standings 프리미어리그 순서 가져오는 api endpoint

apiRouter.post('/auth/create', async (req, res) => {
    if (await getUser(req.body.email)) {
      res.status(409).send({ msg: 'Existing user' });
    } else {
        attendances = await initialClubAttds(req.body.club, attendances);
        const user = await createUser(req.body.email, req.body.password, req.body.name, req.body.club);
        attendances = await addUserToAttds(req.body.email, attendances);
        // Set the cookie
        setAuthCookie(res, user.token);
  
        res.send({ name: req.body.name, club: req.body.club });
    }
});

apiRouter.post('/auth/login', async (req, res) => {
const user = await getAttendance(req.body.email);
if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
    setAuthCookie(res, user.token);
    attendances = await initialClubAttds(user.club, attendances);
    res.send({ name: user.name, club: user.club });
    // 호출 시 외부의 attendances 변수를 업데이트함
    return;
    }
}
res.status(401).send({ msg: 'Unauthorized' });
});

  // DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
    res.clearCookie(authCookieName);
    res.status(204).end();
});


// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
authToken = req.cookies[authCookieName];
const user = await getUserByToken(authToken);
if (user) {
    next();
} else {
    res.status(401).send({ msg: 'Unauthorized' });
}
});

secureApiRouter.post('/save-attendance', async (req, res) => {
    await updateAttendances(req.body, attendances);
    attendances = await initialClubAttds(req.body.club, attendances);
    res.send(attendances);
})

secureApiRouter.post('/replace-attendances', async (req, res) => {
    attendances = await replaceAttentances(req.body, attendances);
    attendances = await initialClubAttds(req.body.club, attendances);
    res.send(attendances);
})

secureApiRouter.post('/attendances', async (req, res) => {
    try {
        const user = await getAttendance(req.body.email);
        const updatedAttendances = await initialClubAttds(user.club, attendances);
        res.send(updatedAttendances);
    } catch (error) {
        console.error('Error while fetching attendances:', error);
        res.status(500).json({ error: 'Failed to fetch attendances' });
    }
});

app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
  });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });


async function updateAttendances(newAttendance, attendances) {
    let dbUser = await collection.findOne({email:newAttendance.email});
            await collection.replaceOne(
                {_id: new ObjectId(dbUser._id)},
                newAttendance
            )
    attendances = await initialClubAttds(newAttendance.club, attendances);

    return attendances;
}

async function replaceAttentances(newAttendances, attendances) {
    for(let i = 0; i < newAttendances.length; i++) {
        let dbUser = await collection.findOne({email: newAttendances[i].email});
        if (dbUser) {
            const newAttendance = {
                name: newAttendances[i].name,
                club: newAttendances[i].club, 
                willAttend: newAttendances[i].willAttend, 
                actualAtt: newAttendances[i].actualAtt, 
                attNum: newAttendances[i].attNum, 
                notAttNum: newAttendances[i].notAttNum,
                fakeAttNum: newAttendances[i].fakeAttNum,
                password: newAttendances[i].password,
                email: newAttendances[i].email,
                token: newAttendances[i].token
            };
            await collection.replaceOne(
                {_id: new ObjectId(dbUser._id)},
                newAttendance
            );
        }else {
            await collection.insertOne(newAttendances);
        }
    }
    return attendances;
}

//  DATABASE
async function initialClubAttds(club, attendances) {
    try {
        const documents = await collection.find({'club': club}).toArray();
        // 업데이트된 attendances를 외부로 반환
        attendances = documents;
        return attendances;
    } catch (err) {
        console.error('Failed to fetch documents from the collection:', err);
        return;
    }
}

function getUser(email) {
    return userCollection.findOne({ email: email });
  }
  
function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

function getAttendance(email) {
    return collection.findOne({ email: email });
}

async function addUserToAttds(email, attendances) {
    const attd = await getAttendance(email);
    if (attd) {
        if (!attendances) {
            attendances = []; // 만약 비어있으면 빈 배열을 생성합니다.
        }
        attendances.push(attd);
    } else {
        console.error(`Attendance information not found for email: ${email}`);
    }
    return attendances;
}

async function createUser(email, password, name, club) {
    // Hash the password before we insert it into the database
    const passwordHash = await bcrypt.hash(password, 10);
    const token = uuid.v4();
    const user = {
      email: email,
      password: passwordHash,
      token: token
    };
    const newAttendance = {
        name: name , 
        club: club , 
        willAttend: null, 
        actualAtt: null, 
        attNum: null, 
        notAttNum: null, 
        fakeAttNum: null,
        password: passwordHash,
        email: email,
        token: token
    };
    await userCollection.insertOne(user);
    await collection.insertOne(newAttendance);
  
    return user;
  }

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
  }

module.exports = {
    createUser,
    getUser,
    getUserByToken,
    initialClubAttds
};