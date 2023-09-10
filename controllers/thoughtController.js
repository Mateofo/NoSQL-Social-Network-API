const { User, Thought } = require('../models');
const { ObjectId } = require('mongoose').Types;

module.exports = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a course
  getThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // Create a course
  async addNewThought(req, res) {
    try {
      const newThought = await Thought.create(req.body);
      if (newThought) {
        await User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: newThought._id } },
          { new: true }
        );
        return res.json(newThought);
      }
      res.status(404).json('Thought not created');
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  async removeThought(req, res) {
    try {
      const deletedThought = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
        userId: req.body.userId,
      });
      if (deletedThought) {
        await User.findOneAndUpdate(
          { _id: req.body.userId },
          { $pull: { thoughts: deletedThought._id } },
          { new: true }
        );
        return res.json('Thought removed');
      }
      res.status(404).json('Thought not found');
    } catch (err) {
      res.status(500).json(err);
    }
  }
};
  