const getHelper = require("./getHelper.js");

("use strict");

// You can use your favorite http client package to make REST calls, however, the node fetch API is pre-installed with the bots-node-sdk.
// Documentation can be found at https://www.npmjs.com/package/node-fetch
// Un-comment the next line if you want to make REST calls using node-fetch.
// const fetch = require("node-fetch");

module.exports = {
  metadata: () => ({
    name: "getAddressService",
    properties: {
      accessToken: { required: true, type: "string" },
      userName: { required: true, type: "string" },
      url: { required: true, type: "string" },
    },
    supportedActions: [],
  }),
  invoke: (context, done) => {
    // Determine the current date
    const url = context.properties().url;
    const accessToken = context.properties().accessToken;
    const userName = context.properties().userName;

    getHelper
      .doStuff({ accessToken: accessToken, userName: userName, url: url })
      .then((result) => {
        context.variable("AddressLine1", result.AddressLine1);
        context.variable("TownOrCity", result.TownOrCity);
        context.variable("Region1", result.Region1);
        context.variable("Region2", result.Region2);
        context.variable("PostalCode", result.PostalCode);
        context.transition();
        done();
      });
  },
};
