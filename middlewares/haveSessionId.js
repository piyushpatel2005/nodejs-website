module.exports = function (req, res, next) {
    if(req.session.id) {
        // req.session.userId = "5a2cbc824932a6151acfcba8";
        // console.log("Session ID: ", req.session.userId);
        next();
    }
    console.log("Not set: ");
}