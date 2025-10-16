const express = require('express');
const AddressController = require('../controllers/addressController');
const router = express.Router();

router.get('/user/:userId', AddressController.getUserAddresses);
router.post('/', AddressController.createAddress);
router.put('/:addressId', AddressController.updateAddress);
router.delete('/:addressId', AddressController.deleteAddress);
router.put("/set-default/:address_id", AddressController.setDefault);
module.exports = router;
