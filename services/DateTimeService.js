const DateTime = require('machinepack-datetime');

exports.getTimeAgo = function (dateString) {
    let timeAgoString = DateTime.timeFrom({
    toWhen: DateTime.parse({
        datetime: this.updatedAt
    }).execSync(),
        fromWhen: new Date().getTime()
    }).execSync();
    return timeAgoString;
};