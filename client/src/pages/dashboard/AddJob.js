import React from "react";
import { FormRow, Alert, FormRowSelect } from "../../components";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { useNavigate } from "react-router-dom";

const AddJob = () => {
  const navigate = useNavigate();

  const {
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    jobStatus,
    jobStatusOptions,
    handleInputChange,
    handleClearJob,
    isLoading,
    createJob,
    editJob,
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!position || !company || !jobLocation) {
      displayAlert();
      return;
    }

    if (isEditing) {
      editJob();
      setTimeout(() => {
        navigate("/all-jobs");
      }, 600);
      return;
    }

    createJob();
  };

  const clearJob = (e) => {
    e.preventDefault();
    handleClearJob();
  };

  const handleJobInput = (e) => {
    handleInputChange({ key: e.target.name, value: e.target.value });
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? "edit job" : "add job"}</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type="text"
            name="position"
            value={position}
            handleChange={handleJobInput}
          />
          <FormRow
            type="text"
            name="company"
            value={company}
            handleChange={handleJobInput}
          />
          <FormRow
            type="text"
            name="jobLocation"
            value={jobLocation}
            labelText="job location"
            handleChange={handleJobInput}
          />
          <FormRowSelect
            name="jobStatus"
            labelText="status"
            value={jobStatus}
            options={jobStatusOptions}
            handleChange={handleJobInput}
          />
          <FormRowSelect
            name="jobType"
            labelText="job type"
            value={jobType}
            options={jobTypeOptions}
            handleChange={handleJobInput}
          />
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
            <button className="btn btn-block clear-btn" onClick={clearJob}>
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
