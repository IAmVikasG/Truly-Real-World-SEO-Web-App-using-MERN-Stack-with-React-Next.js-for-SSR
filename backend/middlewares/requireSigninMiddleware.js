const { expressjwt: expressjwt } = require('express-jwt');


exports.requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
});
