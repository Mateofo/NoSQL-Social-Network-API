const { Schema } = require('mongoose');
const dateFormat = require('../utils/date.js');

const reactionSchema = new Schema(
  {
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280,
    },
    username: {
      type: String, 
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => dateFormat(date),
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

module.exports = reactionSchema;

