const { ObjectId } = require('mongoose').Types;
const { User, Thought}  = require('../models');
const { create } = require('../models/User');

module.exports = {
  getAllUsers(req, res) {
    User.find().populate('thoughts').populate('friends')
    .then((users) => res.json(users)) 
    .catch((err) => res.status(500).json(err));
  },

  getUser(req, res) {
    User.findOne({ _id: req.params.userId })
    .select('-__v')
    .then((user) => res.json(user)) 
    .catch((err) => res.status(500).json(err));
  },

  createUser(req,res) {
    User.create(req.body)
    .then((user) => res.json(user)) 
    .catch((err) => res.status(500).json(err));
  },

  updateUser(req,res) {
    User.findOneAndUpdate(
      { _id: req.params.userId }, 
      { $set: req.body }, 
      { new: true }
    )
    .then((user) => res.json(user)) 
    .catch((err) => res.status(500).json(err));
  },

  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
    .then((user) => res.json(user)) 
    .catch((err) => res.status(500).json(err));
  },

  addFriend(req, res) {
    console.log('You are adding a friend');
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    ) 
    .then((user) => res.json(user)) 
    .catch((err) => res.status(500).json(err));
  },

  removeFriend(req, res) {
    console.log('You are removing a friend');
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    ) 
    .then((user) => res.json(user)) 
    .catch((err) => res.status(500).json(err));
  }
};