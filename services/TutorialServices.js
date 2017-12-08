const _ = require('lodash');

module.exports = function validateTutorial(req, res)  {
    let title = _.escape(_.trim(data.title));
    let description = _.escape(_.trim(data.description));
    if(_.isUndefined(title) && _.isEmpty(title) && title.length < 3) {
        return "Title is required.";
    }

    if(_.isUndefined(title) && _.isEmpty(title) && title.length < 3) {
        return "Description is required.";
    }

    return {
        title: title,
        description: description
    };
};