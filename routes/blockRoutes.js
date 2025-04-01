const express = require('express');
const blockController = require('../controllers/blockController');
const router = express.Router();

router.get('/', blockController.getAllBlocks);
router.get('/:id', blockController.getBlockById);
router.post('/', blockController.createBlock);
router.put('/:id', blockController.updateBlock);
router.delete('/:id', blockController.deleteBlock);

module.exports = router;