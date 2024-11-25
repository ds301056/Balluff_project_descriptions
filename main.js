const myscada = require('./myscada');
myscada.init();
console.log("myscada initialized");

const BCM0001 = require('./BCM0001');
BCM0001.init(myscada);
console.log("BCM0001 initialized");

const BCM0002 = require('./BCM0002');
BCM0002.init(myscada);
console.log("BCM0002 initialized");

const BSP00YR = require('./BSP00YR');
BSP00YR.init(myscada);
console.log("BSP00YR initialized");

const bvs01zc = require('./bvs01zc');
bvs01zc.init(myscada);
console.log("bvs01zc initialized");


// Process data sent from the view script
myscada.dataFromViewScripts = function (data, callback) {
    console.log("Data received from view script:", data);

    if (data.id === 'getDataBCM0001') {
        console.log("Returning data for BCM0001");
        callback(BCM0001.messageBCM0001);
    }
    else if (data.id === 'getDataBCM0002') {
        console.log("Returning data for BCM0002");
        callback(BCM0002.messageBCM0002);
    }
    else if (data.id === 'getDataBSP00YR') {
        console.log("Returning data for BSP00YR");
        callback(BSP00YR.messageBSP00YR);
    }
    else if (data.id === 'getDataBVS01ZC') {  // New condition for bvs01zc
        console.log("Returning data for bvs01zc");
        callback(bvs01zc.messageBVS01ZC); // Adjust this based on your module's export
    }    
    else {
        console.log("Unknown data request ID:", data.id);
        callback('return value');
    }
};

console.log("Initialization complete.");