const { Schema, model } = require('mongoose');
const reactionSchema = require("./Reaction");
const dateFormat = require('../utils/date.js');


// Schema to create a course model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => dateFormat(date)
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],

  }, 
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);
thoughtSchema.virtual("reactionCount").get(function(){
  return this.reactions.length
})

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
