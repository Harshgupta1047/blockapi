const express = require('express');
const districtController = require('../controllers/districtController');
const router = express.Router();

router.get('/', districtController.getAllDistricts);
router.get('/:id', districtController.getDistrictById);
router.post('/', districtController.createDistrict);
router.put('/:id', districtController.updateDistrict);
router.delete('/:id', districtController.deleteDistrict);
router.get('/:id/blocks', districtController.getDistrictBlocks);

module.exports = router;