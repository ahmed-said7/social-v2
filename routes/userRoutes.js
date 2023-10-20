const {createUser,getUser} = require('../services/userServices');
const express= require('express');
const router =express.Router();

router.route('/').post(createUser);
router.route('/:id').get(getUser);

module.exports = router;