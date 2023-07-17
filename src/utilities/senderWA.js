const axios = require('axios');

module.exports = {
  singleSend: async (noHp, message) => {
    try {
      let to = '62';
      for (let i = 1; i < noHp.length; i++) {
        to += noHp[i];
      }
      console.log(to, message);
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
