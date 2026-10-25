const mongoose = require('mongoose');

const PriveledgedAccessSchema = new mongoose.Schema({
    companyName: {
        type: String,
    },
});

const Priveledged = mongoose.model('Priveledged', PriveledgedAccessSchema);

module.exports = Priveledged;