import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  loading: false,
  status: false,
  userData: null,
};


const getErrorMessage = (error) =>
  error?.response?.data?.error || "Something went wrong. Please try again.";

export const createAccount = createAsyncThunk("register", async (data, { rejectWithValue }) => {
  const formData = new FormData();
  formData.append("avatar", data.avatar[0]);
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("fullName", data.fullName);
  if (data.coverImage) {
    formData.append("coverImage", data.coverImage[0]);
  }

  try {
    const response = await axiosInstance.post("/users/register", formData);
    toast.success("Registered successfully!!!");
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});


export const userLogin = createAsyncThunk("login", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/users/login", data);
    return response.data.data.user;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});


export const userLogout = createAsyncThunk("logout", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/users/logout");
    toast.success(response.data?.message);
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const getCurrentUser = createAsyncThunk("getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/users/current-user");
    return response.data.data;
  } catch (error) {
    return rejectWithValue("Failed to fetch user data");
  }
});


export const updateAvatar = createAsyncThunk("updateAvatar", async (avatar, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch("/users/update-avatar", avatar);
    toast.success("Avatar updated successfully!");
    return response.data.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const updateCoverImg = createAsyncThunk("updateCoverImg", async (coverImage, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch("/users/update-coverImg", coverImage);
    toast.success("Cover image updated successfully!");
    return response.data.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const updateUserDetails = createAsyncThunk("updateUserDetails", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch("/users/update-user", data);
    toast.success("Details updated successfully!");
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});



export const changePassword = createAsyncThunk(
  "changePassword",
  async (data) => {
    try {
      const response = await axiosInstance.post("/users/change-password", data);
      toast.success(response.data?.message);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAccount.rejected, (state) => {
        state.loading = false;
      })

      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
      })
      .addCase(userLogin.rejected, (state) => {
        state.loading = false;
      })

      .addCase(userLogout.fulfilled, (state) => {
        state.status = false;
        state.userData = null;
      })

      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.status = false;
        state.userData = null;
      })

      .addCase(updateAvatar.fulfilled, (state, action) => {
        if (state.userData) {
          state.userData.avatar = action.payload.avatar;
        }
      })

      .addCase(updateCoverImg.fulfilled, (state, action) => {
        if (state.userData) {
          state.userData.coverImage = action.payload.coverImage;
        }
      })

      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.userData = { ...state.userData, ...action.payload };
      });
  },
});

export default authSlice.reducer;
