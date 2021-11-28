var mongoose = require('mongoose');

var agentSchema = new mongoose.Schema(
    {
        agent: { type: String, required: true },
    },
    {
        collection: 'agent',
        timestamps: false
    },
);

/* agentSchema.index({ agent: 1 }); */

const Agent = mongoose.model('agent', agentSchema);

module.exports = Agent
