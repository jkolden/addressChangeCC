let axios = require("axios");

function getPersonNumber(faUrl, accessToken, userName) {
  var config = {
    method: "get",
    url:
      faUrl +
      `/hcmRestApi/resources/latest/publicWorkers?q=upper(Username) = '${userName}'`,
    headers: {
      "REST-Framework-Version": "2",
      Authorization: "Bearer " + accessToken,
    },
  };

  return axios(config)
    .then((response) => {
      return response.data.items[0].PersonNumber;
    })
    .catch(function (error) {
      return error;
    });
}

function getWorker(personNumber, faUrl, accessToken) {
  var config = {
    method: "get",
    url:
      faUrl +
      `/hcmRestApi/resources/11.13.18.05/workers?q=upper(PersonNumber) = '${personNumber}'`,
    headers: {
      "REST-Framework-Version": "2",
      Authorization: "Bearer " + accessToken,
    },
  };

  return axios(config)
    .then((response) => {
      let needle = "addresses";

      let obj = response.data.items[0].links;
      let addressesUrl;

      for (let i = 0; i < obj.length; i++) {
        if (obj[i].name == needle) {
          addressesUrl = obj[i].href;
        }
      }
      return addressesUrl;
    })
    .catch(function (error) {
      return error;
    });
}

function getPrimaryAddress(addressesUrl, accessToken) {
  var config = {
    method: "get",
    url: addressesUrl,
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };

  return axios(config)
    .then((response) => {
      let objArray = response.data.items; //array of objects
      let primaryAddressObj;

      //filter primary address:
      for (let i = 0; i < objArray.length; i++) {
        if (objArray[i].PrimaryFlag == true) {
          primaryAddressObj = objArray[i];
        }
      }

      return primaryAddressObj;
    })
    .catch(function (error) {
      return error;
    });
}

module.exports = {
  getWorker,
  getPrimaryAddress,
  doStuff: async (obj) => {
    let personNumber = await getPersonNumber(
      obj.url,
      obj.accessToken,
      obj.userName
    );
    let url = await getWorker(personNumber, obj.url, obj.accessToken);
    let primaryAddressObj = await getPrimaryAddress(url, obj.accessToken);
    return primaryAddressObj;
  },
};
