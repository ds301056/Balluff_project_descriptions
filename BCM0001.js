const mqtt = require('mqtt');
//const fs = require('fs');

const mqttIP = 'mqtts://10.10.13.21:8883';    //LAN is mqtts://192.168.0.121:8883
const topic = 'cmtk/cmtkv1/port2/pd';
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

        const temperature = messageJSON['Contact Temperature Contact Temperature'];
        const vRMSX = messageJSON['Vibration Velocity RMS v-RMS X'];
        const vRMSY = messageJSON['Vibration Velocity RMS v-RMS Y'];
        const vRMSZ = messageJSON['Vibration Velocity RMS v-RMS Z'];


        //Write tags for tag group cmtk
        const options = {};
        options['name'] = 'BCM0001';
        options['values'] = {};
        options['values']['temperature'] = temperature;
        options['values']['vx'] = vRMSX;
        options['values']['vy'] = vRMSY;
        options['values']['vz'] = vRMSZ;
        myscada.writeTags(options, (err, data) => {
            if (err) {
                //write error
            }
        });
        exports.messageBCM0001 = messageJSON;
    });
};
exports.init = init;

