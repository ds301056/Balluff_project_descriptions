// NP_Condition_Monitoring.js
function init(myscada) {
    console.log("[NP_Condition_Monitoring.js] Init function called");

    // Export the static value in an object
    exports.messageNP_Condition_Monitoring = 14;
    console.log("[NP_Condition_Monitoring.js] Exported messageNP_Condition_Monitoring:", exports.messageNP_Condition_Monitoring);

    // Optional: Read tags to verify correct reading functionality
    myscada.readTagsSymbolic("NP_ConditionMonitoring", (err, data) => {
        if (!err) {
            console.log("[NP_Condition_Monitoring.js] Read tags:", data);
        } else {
            console.error("[NP_Condition_Monitoring.js] Error reading tags:", err);
        }
    });

    // Write tags for tag group NP_ConditionMonitoring
    var options = {};
    options['name'] = "NP_ConditionMonitoring";
    options['values'] = {};
    options['values']['temp'] = 7;
    options['values']['vibration'] = 9;
    options['values']['vibration_alarm'] = 2;
    console.log("[NP_Condition_Monitoring.js] Writing tags with options:", options);

    myscada.writeTags(options, (err, data) => {
        if (err) {
            console.error("[NP_Condition_Monitoring.js] Error writing tags:", err);
        } else {
            console.log("[NP_Condition_Monitoring.js] Successfully wrote to tags:", data);
        }
    });
}

exports.init = init;
 