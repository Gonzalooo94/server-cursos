const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../constants");

function createAccessToken(user) {
    const expToken = new Date();
    expToken.setHours(expToken.getHours() + 3); // define la duracion del token

    const payload =  { 
        token_type: "access",
        user_id: user._id,
        iat: Date.now(),
        exp: expToken.getTime(),
    };
    return jwt.sign(payload, JWT_SECRET_KEY); // las propiedades que tendra el token
}

function creareRefreshToken(user) {

    const expToken = new Date();
    expToken.getMonth(expToken.getMonth() + 1); // define la duracion del token

    const payload =  { 
        token_type: "refresh",
        user_id: user._id,
        iat: Date.now(),
        exp: expToken.getTime(),
    };
    return jwt.sign(payload, JWT_SECRET_KEY); // las propiedades que tendra el token

}

function decoded(token) {
    return jwt.decode(token, JWT_SECRET_KEY, true);
}

module.exports = {
    createAccessToken,
    creareRefreshToken,
    decoded,
}