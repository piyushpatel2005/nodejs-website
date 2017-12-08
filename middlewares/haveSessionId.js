module.exports = function (req, res) {
    if(req.session.id) {
        console.log("Session ID: ", req.session.userId);
    }
    console.log("Not set: ");
}