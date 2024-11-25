const mqtt = require('mqtt');
//const fs = require('fs');

// Simplifying the MQTT broker connection details
// Assuming you're connecting without TLS for simplicity. Change the protocol to 'mqtts://' if TLS is needed
const mqttIP = 'mqtt://10.10.13.22:1883';
const topic = 'cmtk/cmtkv1/port2/pd';
const options = {
    clientId: 'BSP00YRClient' // Providing a unique client ID specific to this connection
};

// Initialize and set up connection to the MQTT broker
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
    const Pressure = messageJSON.Pressure;
    const SwitchState1 = messageJSON['Switch1 State'];
    const SwitchState2 = messageJSON['Switch2 State'];

        //Write tags for tag group BSP00YR
        const options={};
        options['name']="BSP00YR";
        options['values']={};
        options['values']['bsp00yr_Pressure']=Pressure;
        options['values']['bsp00yr_SwitchState1']=SwitchState1;
        options['values']['bsp00yr_SwitchState2']=SwitchState2;
        myscada.writeTags(options, (err,data)=>{
          if (err){
            //write error
          }
        });
        exports.messageBSP00YR = messageJSON;
    });
};
exports.init = init;

