const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const light = require('./models/light');

const DATABASE = "mongodb+srv://testuser:testuser@iot-lights.d0cu4.mongodb.net/lights?retryWrites=true&w=majority"

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function publish(client, topic, message) {
    client.publish(topic, message);
    console.log('published to Topic: ' + topic + " with Message: " + message);
};

function Update_Light(floor_num, room_num, id_num, state_num) {
    var connect = mongoose.createConnection(DATABASE, { useNewUrlParser: true });
    var LightModel = connect.model('Light', require("./models/light"))
    console.log(floor_num, room_num, id_num, state_num);
    LightModel.findOne({ floor: floor_num, room: room_num, id: id_num }, (err, light) => {
        var statusUpdate;
        if (light != null) {
            console.log(light);
            LightModel.updateOne({ floor: floor_num, room: room_num, id: id_num }, { $set: { state: state_num } })
                .then(() => {
                    connect.close();
                    publish(client, "/smartlightsystem" + "/" + floor_num + "/" + room_num + "/" + id_num, "State: " + state_num)
                    statusUpdate = "Light Updated";
                });
        } else {
            statusUpdate = "Light Not Found";
        }
        console.log(statusUpdate);
        return statusUpdate;
    });
}

function Create_Light(floor_num, room_num, id_num, state_num, username) {
    var connect = mongoose.createConnection(DATABASE, { useNewUrlParser: true });
    var LightModel = connect.model('Light', require("./models/light"))
    console.log(floor_num, room_num, id_num, state_num);
    LightModel.findOne({ floor: floor_num, room: room_num, id: id_num }, (err, light) => {
        if (light === null) {
            const newLight = new LightModel({
                floor: floor_num,
                room: room_num,
                id: id_num,
                state: state_num,
                users: [username]
            });
            console.log(newLight);
            newLight.save();
            publish(client, "/smartlightsystem" + "/" + floor_num + "/" + room_num + "/" + id_num, "State: " + state_num)
        }
    });
}

app.post('/api/light', function (req, res) {
    var floor_num = req.body.floor;
    var room_num = req.body.room;
    var id_num = req.body.id;
    var state_num = req.body.state;
    var connect = mongoose.createConnection(DATABASE, { useNewUrlParser: true });
    var LightModel = connect.model('Light', require("./models/light"))
    console.log(floor_num, room_num, id_num, state_num);
    LightModel.findOne({ floor: floor_num, room: room_num, id: id_num }, (err, light) => {
        if (light != null) {
            console.log(light);
            LightModel.updateOne({ floor: floor_num, room: room_num, id: id_num }, { $set: { state: state_num } })
                .then(() => {
                    connect.close();
                    publish(client, "/smartlightsystem" + "/" + floor_num + "/" + room_num + "/" + id_num, "State: " + state_num)
                    return res.send("Light Updated");
                });
        } else {
            return res.send("Light Not Found");
        }
    });
});

app.post('/api/Createlight', function (req, res) {
    var floor_num = req.body.floor;
    var room_num = req.body.room;
    var id_num = req.body.id;
    var state_num = req.body.state;
    var username = req.body.users;
    console.log(username);
    var connect = mongoose.createConnection(DATABASE, { useNewUrlParser: true });
    var LightModel = connect.model('Light', require("./models/light"))
    console.log(floor_num, room_num, id_num, state_num);
    LightModel.findOne({ floor: floor_num, room: room_num, id: id_num }, (err, light) => {
        if (light === null) {
            const newLight = new LightModel({
                floor: floor_num,
                room: room_num,
                id: id_num,
                state: state_num,
                users: [username]
            });
            console.log(newLight);
            newLight.save();
            publish(client, "/smartlightsystem" + "/" + floor_num + "/" + room_num + "/" + id_num, "State: " + state_num)
            return res.send('Light Created');
        }
    });
    
});

app.get('/api/getlights', function (req, res) {
    var connect = mongoose.createConnection(DATABASE, { useNewUrlParser: true });
    var LightModel = connect.model('Light', require("./models/light"))
    LightModel.find({}, (err, lights) => {
        return err ? res.send(err) : res.send(lights);
    });
});

app.get('/api/getuserlights/:user', function (req, res) {
    var username = req.params.user;
    console.log(username)
    var connect = mongoose.createConnection(DATABASE, { useNewUrlParser: true });
    var LightModel = connect.model('Light', require("./models/light"))
    LightModel.find({ "users": username }, (err, lights) => {
        return err ? res.send(err) : res.send(lights);
    });
});

app.get('/', function (req, res) {
    res.send('Hello world\n');
});

app.listen('3000', function () {
    console.log('Server listening on port 3000');
});