const express = require('express');
const router = express.Router();
const {
    createDocument,
    getDocumentById,
    getAllDocuments,
    getDocumentsByTeamId,
    getDocumentsByUserId,
    deleteDocument,
    getDocumentsByTicketId
} = require('../controllers/document.controller');
const { upload } = require('../middleware/uploadfile.middleware');

router.post('/',upload.array('file_url',5), createDocument);
router.get('/:id', getDocumentById);
router.get('/', getAllDocuments);
router.get('/team/:teamId', getDocumentsByTeamId);
router.get('/user/:userId', getDocumentsByUserId);
router.get('/ticket/:ticketId', getDocumentsByTicketId);
router.delete('/:id', deleteDocument);

module.exports = router;