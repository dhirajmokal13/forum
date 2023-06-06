const loginCheck = async (req, res, next) => {
    try {
        if (!req.session.login) res.redirect('/')
        else next()
    } catch {
        res.sendStatus(500);
    }
}

export default loginCheck;