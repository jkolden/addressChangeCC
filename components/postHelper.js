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

function getAddressArray(addressesUrl, accessToken) {
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
      let obj;

      //filter primary address:
      for (let i = 0; i < objArray.length; i++) {
        if (objArray[i].PrimaryFlag == true) {
          obj = objArray[i].links;
        }
      }

      //get url for changing
      let needle = "addresses";
      let changeAddressUrl;

      for (let i = 0; i < obj.length; i++) {
        if (obj[i].name == needle) {
          changeAddressUrl = obj[i].href;
        }
      }
      return changeAddressUrl;
    })
    .catch(function (error) {
      return error;
    });
}

function updateAddress(changeAddressUrl, obj, accessToken) {
  var data = JSON.stringify({
    AddressLine1: obj.address1,
    TownOrCity: obj.city,
    Region1: obj.county,
    Region2: obj.state,
    PostalCode: obj.zip,
  });

  var config = {
    method: "patch",
    url: changeAddressUrl,
    headers: {
      "REST-Framework-Version": "4",
      "Effective-Of":
        "RangeMode=UPDATE;RangeStartDate=2021-12-07;RangeEndDate=4712-12-31",
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then((response) => {
      return response.data.AddressId;
    })
    .catch(function (error) {
      return error;
    });
}

module.exports = {
  getPersonNumber,
  getWorker,
  getAddressArray,
  doStuff: async (obj) => {
    let personNumber = await getPersonNumber(
      obj.url,
      obj.accessToken,
      obj.userName
    );
    let url = await getWorker(personNumber, obj.url, obj.accessToken);
    let changeAddressUrl = await getAddressArray(url, obj.accessToken);
    let addressId = await updateAddress(
      changeAddressUrl,
      obj.address,
      obj.accessToken
    );
    return addressId;
  },
};
