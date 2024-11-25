const axios = require('axios');

// Function to get sensor value from a specified parameterIndex and subindex
const getSensorValue = async (parameterIndex, subindex) => {
  const baseUrl = 'http://10.10.13.62/iolink/v1/devices/master1port1/parameters';
  const url = `${baseUrl}/${parameterIndex}/subindices/${subindex}/value?format=byteArray`;

  try {
    // Use axios to make the HTTP request
    const response = await axios.get(url);

    // Check if the response is OK (status code 200-299)
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the data from the response
    const data = response.data;
    console.log(`Fetched data for parameterIndex ${parameterIndex}, subindex ${subindex}:`, data.value);
    return data.value;
  } catch (error) {
    console.error('Fetch error:', error.message);
    return [];
  }
};

// Function to initialize the myscada application
const init = async (myscada) => {
  try {
    // Get the inclination status from the sensor
    const inclinationStatus = await getSensorValue(8530, 0);

    console.log('Inclination Status:', inclinationStatus);

    // Prepare options for writing tags to myscada
    const options = {};
    options['name'] = 'BOS0285';
    options['values'] = {};
    options['values']['inclinationStatus'] = inclinationStatus;

    // Write the tags to myscada
    myscada.writeTags(options, (err, data) => {
      if (err) {
        console.error('Write error:', err);
      } else {
        console.log('Write successful:', data);
      }
    });

    // Export the fetched values
    exports.messageBOS0285 = {
      inclinationStatus
    };
  } catch (error) {
    console.error('Initialization error:', error.message);
  }
};

// Export the init function
exports.init = init;
