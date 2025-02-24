const express = require('express');
const { register, login, logout, authMiddlewere } = require('../../controllers/auth/auth_controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check-auth', authMiddlewere, (req, res) => {
   const user = req.user;
    res.status(200).json({
        success : true,
        message : 'Authenticated User!!!',
        user : user
    })
})

module.exports = router;