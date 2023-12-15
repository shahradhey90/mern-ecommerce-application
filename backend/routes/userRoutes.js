const express = require('express');
const {userRegistration,userLogin, passwordReset,passwordResetTokenConfirmation, updatePassword, logout, getUserDetails, updatePasswordUser, updateUserDetails, getAllUsers,updateAnyUser, getSingleUser, deleteSingleUser} = require('../controller/userController');
const {isAuthenticate, isRole} = require('../middleware/authenticate');

const router = express.Router();

router.post('/registration',userRegistration);
router.post('/login',userLogin);
router.post('/password/reset',passwordReset);
router.get('/password/reset/:token',passwordResetTokenConfirmation)
router.get('/logout',logout)
router.put('/password/reset/:token',updatePassword)
router.route('/me').get(isAuthenticate,getUserDetails)
router.route('/me/update').put(isAuthenticate,updateUserDetails)
router.route('/me/password/update').put(isAuthenticate,updatePasswordUser)
router.route('/admin/user').get(isAuthenticate,isRole('admin'),getAllUsers)
router.route('/admin/user/:id').put(isAuthenticate,isRole('admin'),updateAnyUser).get(isAuthenticate,isRole('admin'),getSingleUser).delete(isAuthenticate,isRole('admin'),deleteSingleUser)





module.exports = router;