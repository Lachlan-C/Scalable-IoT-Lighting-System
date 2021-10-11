const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const SERVER = "http://localhost:3000/"

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

var username;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    username = null;
    /*     axios.get(SERVER + "api/getlights", {})
            .then((response) => {
                console.log(response.data);
                res.render('lights', {
                    light: response.data
                });
            });  */
    res.render('lights', {
        light: []
    });
});

app.get('/:username', function (req, res) {
    username = req.params.username;
    axios.get(SERVER + "api/getuserlights/" + req.params.username, {})
        .then((response) => {
            console.log(response.data);
            res.render('lights', {
                light: response.data
            });
        });
});

app.post('/togglelight/:floor/:room/:id/:state', function (req, res) {
    console.log(username);
    if (req.params.state == 1) {
        state = 0;
    }
    else {
        state = 1;
    }
    console.log(req.params.state);
    console.log(state);
    axios.post(SERVER + "api/light", { "floor": req.params.floor, "room": req.params.room, "id": req.params.id, "state": state })
        .then((response) => {
            if (username != null) {
                res.redirect('/' + username);
            }
            else {
                res.redirect('/');
            }
        });
});


app.post("/getUserLights", function (req, res) {
    username = req.body.UserSearch;
    console.log(username);
    res.redirect('/' + username);
});

app.post("/addlight", function (req, res) {
    username = req.body.UserInput;
    floor = req.body.floor;
    room = req.body.room;
    id = req.body.id;
    state = req.body.state;
    axios.post(SERVER + "api/createlight/", { "floor": floor, "room": room, "id": id, "state": state, "users": username })
        .then((response) => {
            console.log(response.data);
            res.redirect('/' + username);
        });

});

app.listen(5000, function () {
    console.log("IoT Light Website is running at port 5000...")
});