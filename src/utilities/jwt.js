const Jwt = require('@hapi/jwt');

module.exports = {
  generate: (payload) => {
    const token = Jwt.token.generate(payload, process.env.JWT_TOKEN_KEY);
    return token;
  },
};
