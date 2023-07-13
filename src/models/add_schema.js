const { Schema, model } = require('mongoose')

const addSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    redeemCode: {
        type: String,
        required: true,
    },
    roleGiven: {
        type: String,
        required: true,
    },
    timesToRedeem: {
        type: Number,
        required: true,
    },
});

module.exports = model('Redeem', addSchema);