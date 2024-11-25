const mqtt = require('mqtt');
//const fs = require('fs');

const mqttIP = 'mqtts://10.10.13.21:8883';    //LAN is mqtts://192.168.0.121:8883
const topic = 'cmtk/cmtkv1/port1/pd';
const options = {
    clientId: 'DIH',
    username: 'user',
    password: 'Balluff#1',
    rejectUnauthorized: false                //ca is self signed so it can't be used within this script. 
    //ca: fs.readFileSync('ca.crt')          //when 'rejectUnauthorized' is set to false, ca file may not be included at all
};

const init = (myscada) => {
    //Connecting mqtt broker
    const client = mqtt.connect(mqttIP, options);

    client.on('connect', function () {
        //console.log('connected');
        client.subscribe(topic, {qos: 1}); //single topic
    });

    client.on('error', (err) => {
        //console.log('Connection error: ', err);
    });

    client.on('message', function (topic, message, packet) {
        const messageJSON = JSON.parse(message);

        // Extract the relevant sensor data from the JSON
    const temperature = messageJSON['Contact Temperature Contact Temperature'];
    const ambientPressure = messageJSON['Ambient Pressure Ambient Pressure'];
    const humidity = messageJSON['Humidity Humidity'];

        //Write tags for tag group cmtk
        const options = {};
        options['name'] = 'BCM0002';
        options['values'] = {};
        options['values']['temperature'] = temperature;
        options['values']['ambientpressure'] = ambientPressure;
        options['values']['humidity'] = humidity;
        myscada.writeTags(options, (err, data) => {
            if (err) {
                //write error
            }
        });
        exports.messageBCM0002 = messageJSON;
    });
};
exports.init = init;

