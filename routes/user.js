const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.status(500).json(error);
      }
    }
    try {
      await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json("Account has been updated");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can update only your account");
  }
});
// Delete User
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findOneAndDelete(req.params.id);
      !user && res.status(404).json("User doesn't exist");

      res.status(200).json("User Successfully deleted!!!");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(401).json("You can only delete your own account");
  }
});
// GET A USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...others } = user._doc;
    !user && res.status(404).json("User doesn't exist");

    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});
// Follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });

        res.status(200).json("User has been followed");
      } else {
        res.status(401).json("You already followed this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You cannot follow yourself");
  }
});
// UnFollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
  
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
  
          res.status(200).json("User has been unfollowed");
        } else {
          res.status(401).json("You don't follow this user");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("You cannot unfollow yourself");
    }
  });

module.exports = router;
