import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";

const initialState = {
  countries: [],
  states: [],
  cities: [],
  accountManagers: [],
  selectedCountry: {
    id: "",
    name: "",
    iso2: "",
  },
  selectedState: {
    id: "",
    name: "",
    iso2: "",
  },
  selectedCity: {
    id: "",
    name: "",
  },
  isLoading: false,
  fetchError: "",
  errorDetailFromServer: "",
  advFilterState: {},
};

// fetching country API
export const fetchCountries = createAsyncThunk("/countries", async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/countries/`
  ).then((res) => res.json());
  return response;
});

// fetching States API of a particular country
export const fetchStates = createAsyncThunk(
  "/country/states",
  async (countryIsoCode) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/countries/${countryIsoCode}/states/`
    ).then((res) => res.json());
    return response;
  }
);
// fetching Cities API of a particular state
export const fetchCities = createAsyncThunk(
  "/country/cities",
  async (countryAndStateIsoCode) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/countries/${
        countryAndStateIsoCode.countryIso
      }/states/${countryAndStateIsoCode.stateIso}/cities`
    ).then((res) => res.json());
    return response;
  }
);

export const fetchAccountManagers = createAsyncThunk(
  "account_manager",
  async () => {
    const response = await customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/account_manager/get_all`,
      ApiCallHeaderAndBody(
        Cookies.get("jwtTokenCredentialsAccessToken"),
        "GET"
      ),
      true
    ).then((res) => res.json());
    return response;
  }
);

export const countrySlice = createSlice({
  name: "countrySlice",
  initialState,
  reducers: {
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    setSelectedState: (state, action) => {
      state.selectedState = action.payload;
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
  },
  extraReducers: (builder) => {
    // set countries
    builder.addCase(fetchCountries.fulfilled, (state, action) => {
      if (!action.payload.detail) {
        state.countries = action.payload;
      } else {
        state.errorDetailFromServer = action.payload.detail;
      }
      state.isLoading = false;
    });
    builder.addCase(fetchCountries.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCountries.rejected, (state, action) => {
      state.fetchError = action.error.message;
    });

    // set states
    builder.addCase(fetchStates.fulfilled, (state, action) => {
      if (!action.payload.detail) {
        state.states = action.payload;
        state.advFilterState = { states: action.payload };
      } else {
        state.errorDetailFromServer = action.payload.detail;
      }
      state.isLoading = false;
    });
    builder.addCase(fetchStates.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchStates.rejected, (state, action) => {
      state.fetchError = action.error.message;
    });

    // set cities
    builder.addCase(fetchCities.fulfilled, (state, action) => {
      if (!action.payload.detail) {
        state.cities = action.payload;
      } else {
        state.errorDetailFromServer = action.payload.detail;
      }
      state.isLoading = false;
    });
    builder.addCase(fetchCities.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCities.rejected, (state, action) => {
      state.fetchError = action.error.message;
    });

    // set accountManagers
    builder.addCase(fetchAccountManagers.fulfilled, (state, action) => {
      if (!action.payload.detail) {
        state.accountManagers = action.payload?.data;
      } else {
        state.errorDetailFromServer = action.payload.detail;
      }
      state.isLoading = false;
    });
    builder.addCase(fetchAccountManagers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAccountManagers.rejected, (state, action) => {
      state.fetchError = action.error.message;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedCountry, setSelectedState, setSelectedCity } =
  countrySlice.actions;

export default countrySlice.reducer;
