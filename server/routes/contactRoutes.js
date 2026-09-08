const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

// GET all contacts
router.get("/", async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({message: "Failed to fetch contacts"});
    }
});

// POST create a contact
router.post("/", async (req, res) => {
    try {
        const {name, email, phone} = req.body;
        const contact = await Contact.create({
            name, 
            email,
            phone,
        });
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({message: "Failed to create contact"});
    }
});

// PUT update a contact
router.put("/:id", async (req, res) => {
    try {
        const {name, email, phone} = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {name, email, phone},
            {new: true}
        );

        res.json(contact);
    } catch (error) {
        res.status(500).json({message: "Failed to update contact"});
    }
});

// DELETE a contact
router.delete("/:id", async (req, res) => {
    try {
       await Contact.findByIdAndDelete(req.params.id);

    res.json({ message: "Contact deleted successfully" });
    } catch (error) {
        res.status(500).json({message: "Failed to delete contacts"});
    }
});

module.exports = router;