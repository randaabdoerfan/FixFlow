const { createDocument,
    getDocumentById,
    getAllDocuments,
    getDocumentsByTeamId,
    getDocumentsByUserId,
    deleteDocument,
getDocumentsByTicketId } = require('../services/document.service');
const { getUserById } = require('../services/user.service');

AppError = require('../utilities/appError');

exports.createDocument = async (req, res) => {
    try {
 if (!req.files || req.files.length === 0) {
            throw new AppError('No files uploaded', 400);
        }
        const files = req.files.map(file => file.path)
        const sender = req.body.sender;
        const receiver = req.body.receiver;
        const SenderName = await getUserById(sender)
        const ReceiverName = await getUserById(receiver)
        const document = await createDocument({ ...req.body,file_url:files });

       res.status(201).json({  
    message: "Document created successfully",
    document,
    senderName: SenderName.name,
    receiverName: ReceiverName.name
})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getDocumentById = async (req, res) => {
    try {
        const id = req.params.id;
        const document = await getDocumentById(id);
        res.status(200).json(document);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await getAllDocuments();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDocumentsByTeamId = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const documents = await getDocumentsByTeamId(teamId);
        res.status(200).json(documents);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.getDocumentsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const documents = await getDocumentsByUserId(userId);
        res.status(200).json(documents);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getDocumentsByTicketId = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;
        const documents = await getDocumentsByTicketId(ticketId);
        res.status(200).json(documents);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const id = req.params.id;
        await deleteDocument(id);
        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.getMyDocuments = async (req, res) => {
    try {
        const userId = req.user.userId;
        const documents = await require('../services/document.service').getMyDocuments(userId);
        res.status(200).json(documents);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
