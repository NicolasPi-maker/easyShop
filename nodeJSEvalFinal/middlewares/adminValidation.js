async function checkRole(req, res, next, roles) {
    const user = req.user
    if(Array.isArray(roles)) {
        for(const role in roles) {
            if(user.role.name === roles[role]) {
                next();
                return;
            }
        }
        res.status(401);
        res.send('Unauthorized');
    } else {
        if(user.role.name === roles) {
            next();
            return;
        }
        res.status(401);
        res.send('Unauthorized');
    }
}

module.exports = { checkRole }