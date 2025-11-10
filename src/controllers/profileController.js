const profileService = require("../service/Profile");

  const createProfile = async (req, res) => {
    try {
      const profile = await profileService.createProfile(req.body);
      res.status(201).json(profile);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  const listProfiles = async (req, res) => {
    try {
      const profiles = await profileService.listProfiles();
      res.status(200).json(profiles);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  const getProfileById = async (req, res) => {
    try {
      const profile = await profileService.getProfileById(req.params.id);
      res.status(200).json(profile);
    } catch (err) {
      if (err.message === "Profile not found") {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ message: err.message });
    }
  }

module.exports = {
  createProfile,
  listProfiles,
  getProfileById,
};

