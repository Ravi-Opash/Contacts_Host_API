const express = require("express");

const {upload} = require("../middleware/csvfile");
const isAuth = require("../middleware/is-auth");

const contactController = require('../controllers/contacts')

const router = express.Router();

router.get("/contacts", contactController.getAllContacts);

router.post("/contacts/filter", isAuth, contactController.getFilteredContacts);

router.post("/contact", isAuth, contactController.getContact);

router.put("/contacts/important/:contactId", isAuth, contactController.addImportantContacts);

router.post("/contacts/important/filter", isAuth, contactController.getFilteredImportantContacts);

router.post("/contacts/import", isAuth, upload, contactController.postCsvData);


module.exports = router;
