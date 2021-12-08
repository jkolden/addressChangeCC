const postHelper = require("./postHelper.js");

("use strict");

// You can use your favorite http client package to make REST calls, however, the node fetch API is pre-installed with the bots-node-sdk.
// Documentation can be found at https://www.npmjs.com/package/node-fetch
// Un-comment the next line if you want to make REST calls using node-fetch.
// const fetch = require("node-fetch");

module.exports = {
  metadata: () => ({
    name: "addressService",
    properties: {
      address1: { required: false, type: "string" },
      city: { required: false, type: "string" },
      county: { required: false, type: "string" },
      state: { required: false, type: "string" },
      zip: { required: false, type: "string" },
      accessToken: { required: true, type: "string" },
      userName: { required: true, type: "string" },
      url: { required: true, type: "string" },
    },
    supportedActions: [],
  }),
  invoke: (context, done) => {
    /*address info for POST*/
    const address1 = context.properties().address1;
    const city = context.properties().city;
    const county = context.properties().county;
    const state = context.properties().state;
    const zip = context.properties().zip;

    const url = context.properties().url;
    const accessToken = context.properties().accessToken;
    const userName = context.properties().userName;

    // Determine the current date
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" });
    const isWeekend = [0, 6].indexOf(now.getDay()) > -1;
    // Send two messages, and transition based on the day of the week

    postHelper
      .doStuff({
        address: {
          address1: address1,
          city: city,
          zip: zip,
          state: state,
          county: county,
        },
        accessToken: accessToken,
        userName: userName,
        url: url,
      })
      .then((result) => {
        if (result > 0) {
          context.reply("Thank you! Your address has been updated 👍");
        } else {
          context.reply("We encountered an issue, please check back later");
        }

        context.transition();
        done();
      });
  },
};
