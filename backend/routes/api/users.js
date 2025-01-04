const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

//Sign up
router.post("/", async (req, res) => {
    const { email, password, username, name, role } = req.body;

    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
        username,
        email,
        hashedPassword,
        name,
        role
    });

    const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
    }

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser,
    });
})

module.exports = router;
