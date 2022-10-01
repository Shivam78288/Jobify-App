import Job from "../models/Job.js";
import mongoose from "mongoose";
import moment from "moment";
import {
  BadRequestError,
  AuthenticationError,
  NotFoundError,
} from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import checkPermissions from "../utils/checkPermissions.js";

const createJob = async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Please provide all values");
  }
  // req.user coming from authMiddleware
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};

const getAllJobs = async (req, res) => {
  const { status, searchPosition, searchCompany, jobType, sort } = req.query;

  let queryObject = {
    createdBy: req.user.userId,
  };

  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  if (searchPosition) {
    // i means case insensitive
    queryObject.position = { $regex: searchPosition, $options: "i" };
  }

  if (searchCompany) {
    queryObject.company = { $regex: searchCompany, $options: "i" };
  }

  let result = Job.find(queryObject);

  if (sort === "latest") {
    result = result.sort("-createdAt");
  } else if (sort === "oldest") {
    result = result.sort("createdAt");
  } else if (sort === "a-z") {
    result = result.sort("position");
  } else if (sort === "z-a") {
    result = result.sort("-position");
  }

  const jobs = await result;

  res
    .status(StatusCodes.OK)
    .json({ totalJobs: jobs.length, jobs, numOfPages: 1 });
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Please provide all values");
  }
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json(updatedJob);
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  await job.remove();
  res.status(StatusCodes.OK).json("OK");
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        count: { $sum: 1 },
      },
    },
    // To get in descending order
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 8 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      // In moments, months is from 0 to 11 while in mongo it is 1-12. Hence subtracting 1
      const date = moment()
        .month(month - 1)
        .year(year)
        .format(`MMM Y`);

      return {
        date,
        count,
      };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, getAllJobs, showStats, updateJob, deleteJob };
