process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Import axios for making HTTP requests
const axios = require('axios');

// Define the hostname (IP address of the Balluff camera)
const HOSTNAME = '10.10.13.50';

// Define the API endpoint
const API_ENDPOINT = `https://${HOSTNAME}/api/balluff/v1/`;

// Variable to store the fetched data
let messageBVS01ZC = null;

// Function to fetch data from the Balluff camera using Axios
function fetchData() {
  const resource = 'vision/inspection/data/fromdevice';
  const url = `${API_ENDPOINT}${resource}`;
  console.log('Requesting URL:', url);

  return axios.get(url, {
    headers: { 'Content-Type': 'application/json' },
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }), // Ignore self-signed certificates
  })
    .then(response => {
      // Check if the response data is a valid JSON object
      if (typeof response.data === 'object') {
        console.log('Received JSON Data:', response.data);
        messageBVS01ZC = response.data; // Store the data in the global variable
        return response.data;
      } else {
        console.error('Received non-JSON data:', response.data);
        return null;
      }
    })
    .catch(error => {
      console.error('Error fetching data from the Balluff camera:', error);
      return null;
    });
}

// Function to switch the inspection ID on the Balluff camera
function switchInspectionID(inspectionID) {
  const resource = 'vision/inspection/id';
  const url = `${API_ENDPOINT}${resource}`;
  console.log('Switching inspection ID to:', inspectionID);

  return axios.put(url, { inspectionID: inspectionID }, {
    headers: { 'Content-Type': 'application/json' },
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }), // Ignore self-signed certificates
  })
    .then(response => {
      console.log('Inspection ID switched successfully:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error switching inspection ID:', error.response ? error.response.data : error);
      return null;
    });
}

// Function to read and write tags in mySCADA using Promises
function updateMySCADATags(myscada) {
  fetchData().then(data => {
    if (data) {
      // Log the structure of the data to verify its content
      console.log('Data structure:', JSON.stringify(data, null, 2));

      // Prepare the options for writing tags
      var options = {};
      options['name'] = "bvs01zc";
      options['values'] = {};

      // Write the results fetched from the API to the 'results' tag
      options['values']['results'] = JSON.stringify(data); // Assuming the results are to be stored as a string

      console.log('Prepared tag options:', options);

      // Write the new data to the tags in mySCADA
      myscada.writeTags(options, (err, result) => {
        if (err) {
          console.error('Error writing tags to mySCADA:', err);
        } else {
          console.log('Tags written to mySCADA successfully:', result);
        }
      });
    } else {
      console.error('No valid data received, skipping tag update.');
    }
  }).catch(error => {
    console.error('Error updating mySCADA tags:', error);
  });
}

// Function to monitor a tag for inspection ID changes
function monitorInspectionIDTag(myscada) {
  // Subscribe to changes on a tag, e.g., 'inspectionID'
  var options = {};
  options['name'] = 'bvs01zc';
  options['items'] = ['inspectionID'];

  myscada.subscribe(options, (err, result) => {
    if (err) {
      console.error('Error subscribing to inspectionID tag:', err);
      return;
    }
    console.log('Subscribed to inspectionID tag:', result);

    // Listen for tag value changes
    myscada.on('changed', (data) => {
      if (data.name === 'bvs01zc' && data.values && data.values.inspectionID !== undefined) {
        const inspectionID = data.values.inspectionID;
        console.log('Received inspectionID change:', inspectionID);
        switchInspectionID(inspectionID);
      }
    });
  });
}

// Initialize the script with mySCADA integration
const init = (myscada) => {
  const interval = 5000; // Update every 5 seconds

  // Start periodic data fetching
  setInterval(() => {
    updateMySCADATags(myscada);
  }, interval);

  // Start monitoring the inspectionID tag
  monitorInspectionIDTag(myscada);
};

// Export the init function and the message variable
exports.init = init;
exports.messageBVS01ZC = messageBVS01ZC;
