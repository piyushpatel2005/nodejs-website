exports.index = (req, res) => {
    res.render('index', {
        title: 'Home'
    });
};

exports.signup = (req, res) => {
    res.render('signup', {
        title: 'Sign up'
    });
};

exports.signin = (req, res) => {
    res.render('signin', {
        title: 'Login'
    })
};

exports.getTutorials = (req, res) => {
    res.render('partials/tutorials/tutorials', {
        title: 'List of Tutorials'
    });
};
