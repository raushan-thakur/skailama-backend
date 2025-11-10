const Joi = require("joi");
const Profile = require("../models/Profile");

const profileSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    "string.empty": "Name is required"
  })
});

const createProfile = async (profileData) => {
  const { error, value } = profileSchema.validate(profileData, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    const msg = error.details.map((d) => d.message).join(", ");
    throw new Error(msg);
  }

  const profile = new Profile({
    name: value.name,
  });

  return await profile.save();
};

const listProfiles = async () => {
  return await Profile.find().sort({ createdAt: -1 });
};

const getProfileById = async (profileId) => {
  const profile = await Profile.findById(profileId);
  if (!profile) {
    throw new Error("Profile not found");
  }
  return profile;
};


module.exports = {
  createProfile,
  listProfiles,
  getProfileById,
};
