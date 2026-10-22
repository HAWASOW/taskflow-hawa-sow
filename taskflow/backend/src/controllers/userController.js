
exports.getMe = (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

exports.updateMe = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (role !== undefined) {
      return res.status(403).json({
        message: "Vous ne pouvez pas modifier votre rôle",
      });
    }

    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Nom invalide" });
      }
      updates.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== "string" ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Email invalide" });
      }
      updates.email = email.trim().toLowerCase();
    }

    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({
          message: "Le mot de passe doit contenir au moins 8 caractères",
        });
      }

      const bcrypt = require("bcryptjs");
      updates.password = await bcrypt.hash(password, 10);
    }

    const User = require("../models/User");
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Profil mis à jour",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    res.status(500).json({ message: "Erreur serveur" });
  }
};
