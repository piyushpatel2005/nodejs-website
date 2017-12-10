const _ = require('lodash');

exports.validateVideo = function (data) {
    // data is posted video object from front end
    let title = _.escape(_.trim(data.title));
    let url = _.escape(_.trim(data.url));
    let hour = _.escape(_.trim(data.hour));
    let minutes = _.escape(_.trim(data.minutes));
    let seconds = _.escape(_.trim(data.seconds));

    if(!_.isUndefined(title) && _.isEmpty(title)) {
        return "Title is required.";
    }
    if(!_.isUndefined(url) && _.isEmpty(url)) {
        return "YouTube URL is required.";
    }
    if(!_.isUndefined(hour) && _.isEmpty(hour)) {
        return "Hour field is required.";
    }
    if(!_.isUndefined(minutes) && _.isEmpty(minutes)) {
        return "Minutes field is required.";
    }
    if(!_.isUndefined(seconds) && _.isEmpty(seconds)) {
        return "Seconds field is required.";
    }

    // make sure it's actually a number and nothing else
    console.log('going in try block');
    try {
        hour = _.toInteger(hour);
        minutes = _.toInteger(minutes);
        seconds = _.toInteger(seconds);
        if(_.isInteger(hour) && _.isInteger(minutes) && _.isInteger(seconds)) {
            // maximum upto only 10 hours.
            if(_.inRange(hour, 10) && _.inRange(minutes, 60) && _.inRange(seconds, 60)) {
                // valid time, then convert to duration
                let duration = hour * 60 * 60 + minutes * 60 + seconds;
                let video = {
                    title: title,
                    url: url,
                    duration: duration
                };
                return video;
            }
            return "Please, enter valid time data.";
        }
        return "It doesn't look like correct time.";
    } catch(err) {
        return "Hour, minute and second should be a number only.";
    }
}