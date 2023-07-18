const axios = require('axios');

module.exports = {
  singleSend: async (to, message) => {
    try {
      const options = {
        method: 'POST',
        url: 'https://wazoid.com/api/create-message',
        data: {
          appkey: process.env.APPKEYWAZOID,
          authkey: process.env.AUTHKEYWAZOID,
          to,
          message,
        },
      };
      await axios(options);
    } catch (error) {
      console.log(error);
    }
  },
};
