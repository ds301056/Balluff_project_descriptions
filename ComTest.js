// ComTest.js
function init(myscada) {
    console.log("[ComTest.js] Init function called");

    // Export the static value in an object
    exports.messageComTest = { value1: 7, value2: "Test Value from ComTest.js" };
    console.log("[ComTest.js] Exported messageComTest:", exports.messageComTest);

    // Read initial tags
    myscada.readTagsSymbolic("ComTest", (err, data) => {
        if (!err) {
            var word = data['word'] ? data['word'].value : null;
            console.log("[ComTest.js] Read initial tags:", data);
        } else {
            console.error("[ComTest.js] Error reading initial tags:", err);
        }
    });

    // Write tags for tag group ComTest
    var options = {
        name: "ComTest",
        values: {
            'word': 7,
            'message': "Test Value from ComTest.js"
        }
    };

    console.log("[ComTest.js] Writing tags with options:", options);

    myscada.writeTags(options, (err, data) => {
        if (err) {
            console.error("[ComTest.js] Error writing tags:", err);
        } else {
            console.log("[ComTest.js] Successfully wrote to tags:", data);
        }
    });
}

exports.init = init;
