const express = require('express');
const router = express.Router();
const { getSupplements, addSupplement, deleteSupplement } = require('../controllers/supplementController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getSupplements);
router.post('/', addSupplement);
router.delete('/:id', deleteSupplement);

module.exports = router;
