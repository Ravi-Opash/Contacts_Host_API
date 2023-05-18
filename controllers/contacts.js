const Contact = require("../models/contact");

const mongoose = require('mongoose')
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

exports.getAllContacts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 1;
  try {
    const totalContacts = await Contact.find().countDocuments();
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Fetched contacts successfully.",
      contacts: contacts,
      totalContacts: totalContacts,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getFilteredContacts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 3;

  const _id = req.body._id;
  const fullName = req.body.fullName;
  const mobileNumber = req.body.mobileNumber;
  const address = req.body.address;

  try {
    let contacts;
    let totalContacts;
    if (_id !== undefined) {
      totalContacts = await Contact.find({
        $and: [{ userId: req.userId }, { _id: _id }],
      }).countDocuments();
      contacts = await Contact.find({
        $and: [{ userId: req.userId }, { _id: _id }],
      })
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      if (!contacts) {
        const error = new Error("A user with this id not be found.");
        error.statusCode = 401;
        throw error;
      }
    } else if (fullName !== undefined) {
      totalContacts = await Contact.find({
        $and: [{ userId: req.userId }, { fullName: fullName }],
      }).countDocuments();
      contacts = await Contact.find({
        $and: [{ userId: req.userId }, { fullName: fullName }],
      })
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      if (!contacts) {
        const error = new Error("A user with this fullname not be found.");
        error.statusCode = 401;
        throw error;
      }
    } else if (mobileNumber !== undefined) {
      totalContacts = await Contact.find({
        $and: [{ userId: req.userId }, { mobileNumber: mobileNumber }],
      }).countDocuments();
      contacts = await Contact.find({
        $and: [{ userId: req.userId }, { mobileNumber: mobileNumber }],
      })
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      if (!contacts) {
        const error = new Error("A user with this mobile number not be found.");
        error.statusCode = 401;
        throw error;
      }
    } else if (address !== undefined) {
      totalContacts = await Contact.find({
        $and: [{ userId: req.userId }, { address: address }],
      }).countDocuments();
      contacts = await Contact.find({
        $and: [{ userId: req.userId }, { address: address }],
      })
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      if (!contacts) {
        const error = new Error("A user with this address not be found.");
        error.statusCode = 401;
        throw error;
      }
    } else {
      const error = new Error(
        "Enter id, mobile number, address or full name only...!"
      );
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({
      message: "Fetched filtered contacts successfully.",
      contacts: contacts,
      totalContacts: totalContacts,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getContact = async (req, res, next) => {
  const _id = req.body._id;
  const fullName = req.body.fullName;
  const mobileNumber = req.body.mobileNumber;

  try {
    let contact;
    if (_id !== undefined) {
      contact = await Contact.findOne({
        $and: [{ userId: req.userId }, { _id: _id }],
      });
      if (!contact) {
        const error = new Error("A user with this id not be found.");
        error.statusCode = 401;
        throw error;
      }
    } else if (fullName !== undefined) {
      contact = await Contact.find({
        $and: [{ userId: req.userId }, { fullName: fullName }],
      });
      if (!contact) {
        const error = new Error("A user with this fullName not be found.");
        error.statusCode = 401;
        throw error;
      }
      console.log(contact);
    } else if (mobileNumber !== undefined) {
      contact = await Contact.findOne({
        $and: [{ userId: req.userId }, { mobileNumber: mobileNumber }],
      });
      if (!contact) {
        const error = new Error("A user with this mobile number not be found.");
        error.statusCode = 401;
        throw error;
      }
    } else {
      const error = new Error("Enter id, mobile number or full name only...!");
      error.statusCode = 401;
      throw error;
    }
    res.status(200).json({
      message: "Fetched single contact successfully.",
      contact: contact,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addImportantContacts = async (req, res, next) => {
  const contactId = req.params.contactId;

  // console.log(req.params);
  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      const error = new Error("no contact found...!");
      error.statusCode = 401;
      throw error;
    }
    if (contact.userId.toString() !== req.userId) {
      const error = new Error(
        "You can not add this number to favorite bcs you didn't added it to your list...!"
      );
      error.statusCode = 401;
      throw error;
    }
    contact.importFlag = true;
    await contact.save();
    res.status(200).json({
      message: "added flag...!",
      contact: contact,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getFilteredImportantContacts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 1;

  const _id = req.body._id;
  const fullName = req.body.fullName;
  const mobileNumber = req.body.mobileNumber;
  const address = req.body.address;

  try {
    let contacts;
    let totalContacts;
    if (_id !== undefined) {
      totalContacts = await Contact.find({
        $and: [{ userId: req.userId }, { _id: _id }, { importFlag: true }],
      }).countDocuments();
      contacts = await Contact.find({ $and: [{ userId: req.userId }, { _id: _id }, { importFlag: true }] })
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      if (contacts.length === 0) {
        const error = new Error("A user with this Id not be found.");
        error.statusCode = 401;
        throw error;
      }
    } else if (fullName !== undefined) {
      totalContacts = await Contact.find({
        $and: [{ userId: req.userId }, { fullName: fullName }, { importFlag: true }],
      }).countDocuments();
      contacts = await Contact.find({
        $and: [{ userId: req.userId }, { fullName: fullName }, { importFlag: true }],
      })
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      if (contacts.length === 0) {
        const error = new Error("A user with this FullName not be found.");
        error.statusCode = 401;
        throw error;
      }
    } else if (mobileNumber !== undefined) {
      totalContacts = await Contact.find({
        $and: [{ userId: req.userId }, { mobileNumber: mobileNumber }, { importFlag: true }],
      }).countDocuments();
      contacts = await Contact.find({
        $and: [{ userId: req.userId }, { mobileNumber: mobileNumber }, { importFlag: true }],
      })
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      if (contacts.length === 0) {
        const error = new Error("A user with this mobile number not be found.");
        error.statusCode = 401;
        throw error;
      }
    } else if (address !== undefined) {
      totalContacts = await Contact.find({
        $and: [{ userId: req.userId }, { address: address }, { importFlag: true }],
      }).countDocuments();
      contacts = await Contact.find({
        $and: [{ userId: req.userId }, { address: address }, { importFlag: true }],
      })
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      if (contacts.length === 0) {
        const error = new Error("A user with this address not be found.");
        error.statusCode = 401;
        throw error;
      }
    } else {
      const error = new Error(
        "Enter id, mobile number, address or full name only...!"
      );
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({
      message: "Fetched filtered contacts successfully.",
      contacts: contacts,
      totalContacts: totalContacts,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postCsvData = async (req, res, next) => {
  const results = [];
  console.log(req.userId);
  try {
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        if (!results) {
          const error = new Error("A user with this address not be found.");
          error.statusCode = 401;
          throw error;
        }
        // console.log(results);
        for (let contact of results) {
          const find = await Contact.find({
            userId: req.userId,
            fullName: contact.fullName,
            mobileNumber: contact.mobileNumber,
            address: contact.address,
          });
          if (find.length) {
            console.log("match data");
          } else {
            const matchEmailAndName = await Contact.findOne({
              $and: [
                { userId: req.userId },
                {
                  $or: [
                    { mobileNumber: contact.mobileNumber },
                    { fullName: contact.fullName },
                  ],
                },
              ],
            });
            if (matchEmailAndName) {
              await Contact.findOneAndUpdate(
                {
                  $or: [
                    { mobileNumber: contact.mobileNumber },
                    { fullName: contact.fullName },
                  ],
                },
                {
                  $set: {
                    fullName: contact.fullName,
                    mobileNumber: contact.mobileNumber,
                    address: contact.address,
                  },
                }
              );
            } else {
              const newContact = new Contact({
                userId: req.userId,
                fullName: contact.fullName,
                mobileNumber: contact.mobileNumber,
                address: contact.address,
              });
              const result = await newContact.save();
              console.log(newContact);
            }
          }
        }
        res.status(201).json({ message: "file successfully added!" });
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
