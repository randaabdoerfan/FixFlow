const express = require('express');
const router = express.Router();
const {
    createDocument,
    getDocumentById,
    getAllDocuments,
    getDocumentsByTeamId,
    getDocumentsByUserId,
    deleteDocument,
    getDocumentsByTicketId,
    getMyDocuments
} = require('../controllers/document.controller');
const { upload } = require('../middleware/uploadfile.middleware');
const verifyToken = require('../middleware/verifytoken.middleware');

router.post('/', verifyToken('login'), upload.array('file_url',5), createDocument);
router.get('/my', verifyToken('login'), getMyDocuments);
router.get('/ticket/:ticketId', verifyToken('login'), getDocumentsByTicketId);
router.get('/user/:userId', verifyToken('login'), getDocumentsByUserId);
router.get('/team/:teamId', verifyToken('login'), getDocumentsByTeamId);
router.get('/:id', verifyToken('login'), getDocumentById);
router.get('/', verifyToken('login'), getAllDocuments);
router.delete('/:id', verifyToken('login'), deleteDocument);

module.exports = router;