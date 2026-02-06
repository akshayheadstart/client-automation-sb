import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";

const initialState = {
  tags: [],
  loading: false,
  error: false,
  internalServerWError: false,
};

// fetching Tags Api
export const fetchTemplateTags = createAsyncThunk(
  "/emailTags",
  async ({ token, tagType, collegeId }) => {
    const response = await customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/templates/tags/?template_type=${tagType}${
        collegeId ? "&college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "GET")
    ).then((res) => res.json());
    return response;
  }
);

export const templateSlice = createSlice({
  name: "templateSlice",
  initialState,
  reducers: {
    setTags: (state, action) => {
      state.tags = action.payload;
    },
  },
  extraReducers: (builder) => {
    // set logout
    builder.addCase(fetchTemplateTags.fulfilled, (state, action) => {
      state.loading = false;
      state.tags = action?.payload?.data;
    });
    builder.addCase(fetchTemplateTags.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(fetchTemplateTags.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const { setTags } = templateSlice.actions;

// Action creators are generated for each case reducer function
export default templateSlice.reducer;
