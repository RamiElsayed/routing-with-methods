const { getPayloadWithValidFieldsOnly } = require("../../helpers/index.js");
const User = require("../../models/User.js");

const getUserById = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findByPk(id);

    if (user) {
      return res.json(user);
    }
    return res.status(404).json({ message: "No user with this id!" });
  } catch ({ message = " Something went wrong " }) {
    return res.status(500).json({ message });
  }
};

const createUser = async (req, res) => {
  try {
    const payload = getPayloadWithValidFieldsOnly(
      ["email", "password", "username"],
      req.body
    );

    if (Object.keys(payload).length !== 3) {
      return res
        .status(400)
        .json({ message: "Please provide required fields" });
    }

    const user = await User.create(payload);

    return res.json(user);
  } catch ({ message = " Something went wrong " }) {
    return res.status(500).json({ message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const payload = getPayloadWithValidFieldsOnly(
      ["username", "email", "password"],
      req.body
    );
    if (!Object.keys(payload).length) {
      return res
        .status(400)
        .json({ message: "Please provide a valid request" });
    }
    const { id } = req.params;
    const user = await User.update(payload, {
      where: { id },
      individualHooks: true,
    });
    if (!user[0]) {
      return res.status(404).json({ message: "No user with this id!" });
    }
    return res.json({ message: " Successfully updated user" });
  } catch ({ message = " Something went wrong " }) {
    return res.status(500).json({ message });
  }
};

const login = async (req, res) => {
  try {
    const payload = getPayloadWithValidFieldsOnly(
      ["email", "password"],
      req.body
    );

    if (Object.keys(payload).length !== 2) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ where: { email: payload.email } });

    if (!user) {
      return res.status(404).json({ message: "user does not exist" });
    }

    const isValidPassword = user.checkPassword(payload.checkPassword);

    if (!isValidPassword) {
      res.status(400).json({ message: "Please provide email and password" });
    }

    return res.json({ message: "Successfully logged in" });
  } catch ({ message = " Something went wrong " }) {
    return res.status(500).json({ message });
  }
};

module.exports = {
  getUserById,
  createUser,
  updateUserById,
  login,
};
