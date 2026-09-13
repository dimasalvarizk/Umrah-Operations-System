const express = require('express');
const router = express.Router();
const ContractsController = require('../controllers/contractsController');

router.get('/', ContractsController.getContracts);
router.post('/', ContractsController.createContract);
router.get('/:id', ContractsController.getContractById);
router.put('/:id', ContractsController.updateContract);
router.patch('/:id/status', ContractsController.updateContractStatus);
router.delete('/:id', ContractsController.deleteContract);

module.exports = router;
