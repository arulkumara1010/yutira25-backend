import axios from "axios";

export const META_CONFIG = {
  APP_ID: "558468879580334",
  APP_SECRET: "9f94f00483a3d5548a039f867f93b808",
  RECIPIENT_WAID: "9659604838",
  VERSION: "v15.0",
  PHONE_NUMBER_ID: "104405222586791",
  ACCESS_TOKEN:
    // "EAAH77KsvfK4BALrPxP005MqkWpMwpYvVCZCI0zOB71eCZAlZCpAp0DOBx99NO2GZBYnci9W6DAZCatR4VwZB3wKuEQw0chjnQpfaYd0hodUbziUP7ZBxqbDByvRmXtjAPt1uRqEQfBQsOgYJSXH2My150ZCzga2xWaZCGZBVHyLurjLTpHZC3qhhBps",
    // "EAAH77KsvfK4BAJ7W9j0JZBPRyjSRO6I1pHYeKGfZCa0j25Crfo5PPgjKfUxDs7viAXlFHAzQpNPyJllDBZApAKuIQa6M6OhiCQzYHc0I6ecPNt9prAvV0XJBPkagQfyplox4OmjEFOf7nRfCDfJtzMve16wuYZA3FcZA8Hr6NIZCVqPwt7jXZCxZCDJOzFYVqe5N42294Uh3UAZDZD",
    "EAAH77KsvfK4BABkoU1WhMgIMWtoYemejzLCRRt03MgovxoN6STjIQZCmERAeIs3RzAIL3roAfd6IhZCKT6KZC9ocHb3JJAXcLbfVtuQHsmtYr5ZCZAzgtVQrMHdKZAwDEl8PR9H9J5AwJEPD1feWQakfxnryLpLfZBZA2VuZB7mOYyrhSlM7iQSk4",
};

export const sendMessage = (data) => {
  var config = {
    method: "post",
    url: `https://graph.facebook.com/${META_CONFIG.VERSION}/${META_CONFIG.PHONE_NUMBER_ID}/messages`,
    headers: {
      Authorization: `Bearer ${META_CONFIG.ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config);
};

export const getTextMessageInput = (recipient, text) => {
  //   return JSON.stringify({
  //     messaging_product: "whatsapp",
  //     preview_url: false,
  //     recipient_type: "individual",
  //     to: recipient,
  //     type: "text",
  //     text: {
  //       body: text,
  //     },
  //   });

  return JSON.stringify({
    messaging_product: "whatsapp",
    to: "919659604838",
    type: "template",
    template: {
      name: "hello_world",
      language: {
        code: "en_US",
      },
    },
  });
};
