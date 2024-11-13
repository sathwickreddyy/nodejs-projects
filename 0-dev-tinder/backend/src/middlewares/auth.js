const adminAuth = (req, res, next) => {
    console.log("Admin auth middleware");
    const token = "abc";
    const isAdminAuthorized = token === "abc";
    if (isAdminAuthorized) {
        next();
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
};


const userAuth = (req, res, next) => {
    console.log("User auth middleware");
    const token = "abc";
    const isUserAuthorized = token === "abc";
    if (isUserAuthorized) {
        next();
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
};

module.exports = {
    adminAuth,
    userAuth
}
