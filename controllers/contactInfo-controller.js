const {ContactInfo, validateContactInfo} = require('../models/contact_info');
exports.getContactInfo =async (req, res) => {
    const contactInfo = await ContactInfo.find().sort('email');
    res.send(contactInfo);
};

exports.createContactInfo =async (req, res) => {
    const { error } = validateContactInfo(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let contactInfo = new ContactInfo({ name: req.body.name,email:req.body.email,content:req.body.content });
    contactInfo = await contactInfo.save();
    
    res.send(contactInfo);
};
exports.updateContactInfo = async (req, res) => {
    const { error } = validateContactInfo(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const contactInfo = await ContactInfo.findByIdAndUpdate(req.params.id, { name: req.body.name,email:req.body.email,content:req.body.content }, {
      new: true
    });
  
    if (!contactInfo) return res.status(404).send('The Contact Information with the given ID was not found.');
    
    res.send(contactInfo);
};


exports.deleteContactInfo =async (req, res) => {
    const contactInfo = await ContactInfo.findByIdAndRemove(req.params.id);
  
    if (!contactInfo) return res.status(404).send('The Contact Information with the given ID was not found.');
  
    res.send(contactInfo);
};
exports.geteContactInfo = async (req, res) => {
    const contactInfo= await ContactInfo.findById(req.params.id);
  
    if (!contactInfo) return res.status(404).send('The Contact Information with the given ID was not found.');
  
    res.send(contactInfo);
};
