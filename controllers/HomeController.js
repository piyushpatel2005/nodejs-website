exports.index = (req, res) => {
    res.render('index', {
        user: null,
        title: 'Home'
    });
};

exports.signup = (req, res) => {
    res.render('signup', {
        user: null,
        title: 'Sign up'
    });
};

exports.signin = (req, res) => {
    res.render('signin', {
        user: null,
        title: 'Login'
    })
};

exports.getTutorials = (req, res) => {
    res.render('partials/tutorials/tutorials', {
        title: 'List of Tutorials',
        user: null
    });
};
