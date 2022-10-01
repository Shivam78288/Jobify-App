import { AuthenticationError } from "../errors/index.js";

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new AuthenticationError("Not authorized to access this job");
};

export default checkPermissions;
