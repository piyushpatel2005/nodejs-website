const _ = require('lodash');

exports.validateTutorial = function (data)  {
    let title = _.escape(_.trim(data.title));
    let description = _.escape(_.trim(data.description));
    if(_.isUndefined(title) || _.isEmpty(title) || title.length < 3) {
        return "Title is required.";
    }

    if(_.isUndefined(description) || _.isEmpty(description) || description.length < 3) {
        return "Description is required.";
    }

    return {
        title: title,
        description: description
    };
};
