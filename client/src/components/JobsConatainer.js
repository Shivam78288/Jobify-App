import React, { useEffect } from "react";
import { useAppContext } from "../context/appContext";
import Loading from "./Loading";
import Job from "./Job";
import Wrapper from "../assets/wrappers/JobsContainer";
import PageButtonContainer from "./PageButtonContainer";

const JobsConatainer = () => {
  const {
    getJobs,
    jobs,
    isLoading,
    page,
    numOfPages,
    totalJobs,
    sort,
    searchCompany,
    searchPosition,
    searchType,
    searchStatus,
  } = useAppContext();

  useEffect(() => {
    getJobs();
  }, [sort, searchCompany, searchPosition, searchType, searchStatus, page]);

  if (isLoading) {
    return <Loading center />;
  }

  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h5>
        {totalJobs} job{jobs.length > 1 && "s"} found
      </h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
      {numOfPages > 1 && <PageButtonContainer />}
    </Wrapper>
  );
};

export default JobsConatainer;
