var mongoose = require('mongoose');

var agentSchema = new mongoose.Schema(
    {
        agent: { type: String, required: true },
        /* user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        } */
    },
    {
        collection: 'agent',
        timestamps: false
    },
);

/* agentSchema.index({ agent: 1 }); */

const Agent = mongoose.model('agent', agentSchema);

module.exports = Agent
