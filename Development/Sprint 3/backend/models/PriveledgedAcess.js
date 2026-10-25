// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const PriveledgedAccessSchema = new mongoose.Schema({
    companyName: {
        type: String,
    },
});

const Priveledged = mongoose.model('Priveledged', PriveledgedAccessSchema);

// module.exports = Priveledged;
export default Priveledged;