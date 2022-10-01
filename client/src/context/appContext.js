import React, { useReducer, useContext } from "react";
import axios from "axios";
import reducer from "./reducer";
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  HANDLE_CHANGE,
  CLEAR_JOB,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOB_BEGIN,
  GET_JOB_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
} from "./actions";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const userLocation = localStorage.getItem("location");

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation ? userLocation : "",
  showSidebar: false,
  editJobId: "",
  isEditing: false,
  position: "",
  company: "",
  jobLocation: userLocation ? userLocation : "",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  jobStatusOptions: ["interview", "pending", "declined"],
  jobStatus: "pending",
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  searchPosition: "",
  searchCompany: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Creating an axios instance so we wont have to pass headers separately again and again in code
  const authFetch = axios.create({
    baseURL: "/api/v1",
  });

  // Middleware used just before request is sent
  authFetch.interceptors.request.use(
    (config) => {
      config.headers.common["Authorization"] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Middleware used just before response is received
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem(`user`, JSON.stringify(user));
    localStorage.setItem(`token`, token);
    localStorage.setItem(`location`, location);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem(`user`);
    localStorage.removeItem(`token`);
    localStorage.removeItem(`location`);
  };

  const setupUser = async ({ currentUser, endpoint, successText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const response = await axios.post(
        `/api/v1/auth/${endpoint}`,
        currentUser
      );
      const { user, location, token } = response.data;
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, location, token, successText },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (err) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: err.response.data.msg },
      });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const response = await authFetch.patch("/auth/update", currentUser);
      const { user, location, token } = response.data;
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location, token },
      });
      addUserToLocalStorage({ user, location, token });
    } catch (err) {
      if (err.response.status !== 401)
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: err.response.data.msg },
        });
    }

    clearAlert();
  };

  const handleInputChange = ({ key, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { key, value } });
  };

  const handleClearJob = () => {
    dispatch({ type: CLEAR_JOB });
  };

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { jobType, jobLocation, position, company, jobStatus } = state;

      await authFetch.post("/jobs", {
        position,
        company,
        jobLocation,
        jobType,
        status: jobStatus,
      });
      dispatch({
        type: CREATE_JOB_SUCCESS,
      });
      dispatch({ type: CLEAR_JOB });
    } catch (err) {
      if (err.response.status !== 401)
        dispatch({
          type: CREATE_JOB_ERROR,
          payload: { msg: err.response.data.msg },
        });
    }

    clearAlert();
  };

  const getJobs = async () => {
    const { searchCompany, searchPosition, searchType, searchStatus, sort } =
      state;
    let url = "/jobs";
    url = `${url}?status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (searchCompany) {
      url = `${url}&searchCompany=${searchCompany}`;
    }
    if (searchPosition) {
      url = `${url}&searchPosition=${searchPosition}`;
    }

    dispatch({ type: GET_JOB_BEGIN });
    try {
      const response = await authFetch.get(url);
      const { jobs, totalJobs, numOfPages } = response.data;

      dispatch({
        type: GET_JOB_SUCCESS,
        payload: { jobs, totalJobs, numOfPages },
      });
    } catch (err) {
      console.log(err.response);
      logoutUser();
    }
    clearAlert();
  };

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });

    try {
      const { position, company, jobStatus, jobLocation, jobType } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        position,
        company,
        jobLocation,
        jobType,
        status: jobStatus,
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_JOB });
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch({
          type: EDIT_JOB_ERROR,
          payload: { msg: err.response.data.msg },
        });
      }
    }
  };

  const deleteJob = async (id) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${id}`);
      getJobs();
    } catch (err) {
      logoutUser();
    }
  };

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const response = await authFetch.get("/jobs/stats");
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: response.data.defaultStats,
          monthlyApplications: (await response).data.monthlyApplications,
        },
      });
    } catch (err) {
      console.log(err);
      logoutUser();
    }
    clearAlert();
  };

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleInputChange,
        handleClearJob,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { useAppContext, AppProvider, initialState };
