const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const config = require('./dbConfig.json');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

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

  // updates one attendance
async function updateAttendances(newAttendance, attendances) {
    let dbUser = await collection.findOne({email:newAttendance.email});
            await collection.replaceOne(
                {_id: new ObjectId(dbUser._id)},
                newAttendance
            )
    attendances = await initialClubAttds(newAttendance.club, attendances);

    return attendances;
}

// updates many attendances at once
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

module.exports = {
    getUser,
    getUserByToken,
    createUser,
    initialClubAttds,
    updateAttendances,
    replaceAttentances,
    getAttendance
};