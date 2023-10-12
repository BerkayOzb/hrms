module.exports = {
  userId: {
    in: ["body"],
    errorMessage: "UserId is not given",
    exists: true,
  },
  projectId: {
    in: ["body"],
    errorMessage: "ProjectId is not given",
    exists: true,
  },
};
