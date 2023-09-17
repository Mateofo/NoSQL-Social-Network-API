const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  getThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  async createThought(req, res) {
    try {
      const newThought = await Thought.create(req.body);
      if (newThought) {
        await User.findOneAndUpdate(
          { _id: req.body.userId }, 
          { $addToSet: { thoughts: newThought._id } },
          { new: true }
        );
      }
      res.json(newThought); 
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : User.findOneAndUpdate({ _id: thought.userId }, { $pull: { thoughts: thought._id } })
      )
      .then(() => res.json({ message: 'Thought deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  createReaction(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json({ message: 'Reaction deleted!', thought })
      )
      .catch((err) => res.status(500).json(err));
  },
};