import { createSlice } from '@reduxjs/toolkit';
import {
  createProperty,
  updateProperty,
  getMyProperties,
  transferProperty,
  getOneProperty,
  NewProperty,
} from '../api/endpoints';

export type sampleProperty = {
  propertyId?: string;
  title?: string;
  description?: string;
  price?: string;
  owner?: string;
  userId?: string;
  createdAt?: string;
};

interface PropertyInitialState {
  currentProperty: sampleProperty | null;
  propertyList: sampleProperty[];
  isLoading: boolean;
  error: Record<string, unknown> | null;
}

const propertyInitialState: PropertyInitialState = {
  currentProperty: null,
  propertyList: [],
  isLoading: false,
  error: null,
};

function startLoading(state: PropertyInitialState) {
  state.isLoading = true;
}

function loadingFailed(
  state: PropertyInitialState,
  action: { payload: Record<string, unknown> | null }
) {
  state.isLoading = false;
  state.error = action.payload;
}

const properties = createSlice({
  name: 'properties',
  initialState: propertyInitialState,
  reducers: {
    getPropertyStart: startLoading,
    getPropertiesStart: startLoading,
    getPropertySuccess(state, { payload }) {
      state.currentProperty = payload;
      state.isLoading = false;
      state.error = null;
    },
    getPropertiesSuccess(state, { payload }) {
      state.propertyList = payload;
      state.isLoading = false;
      state.error = null;
    },
    getPropertyFailure: loadingFailed,
    getPropertiesFailure: loadingFailed,

    addPropertyStart: startLoading,
    addPropertySuccess(state, action) {
      state.propertyList.unshift(action.payload.data.property);
      state.currentProperty = action.payload.data.property;
      state.isLoading = false;
      state.error = null;
    },
    addPropertyFailure: loadingFailed,
    editPropertyStart: startLoading,
    editPropertySuccess(state, action) {
      state.currentProperty = { ...state.currentProperty, ...action.payload.updatedProperty };
      const propertyIndex = state.propertyList.findIndex(
        (property) => property.propertyId === action.payload.propertyId
      );

      if (propertyIndex !== -1) {
        const propertyListCopy = [...state.propertyList];
        propertyListCopy[propertyIndex] = action.payload.updatedProperty;
        state.propertyList = propertyListCopy;
      }
      state.isLoading = false;
    },
    editPropertyFailure: loadingFailed,
  },
});

export const {
  getPropertyStart,
  getPropertiesStart,
  getPropertySuccess,
  getPropertiesSuccess,
  getPropertyFailure,
  getPropertiesFailure,
  addPropertyStart,
  addPropertySuccess,
  addPropertyFailure,
  editPropertyStart,
  editPropertySuccess,
  editPropertyFailure,
} = properties.actions;

export default properties.reducer;

interface IAction {
  type: string;
  payload?: Record<string, unknown> | null;
}

/**
 *
 * @param property
 * @returns
 */
export const addProperty = (property: NewProperty) => async (dispatch: (arg: IAction) => void) => {
  try {
    dispatch(addPropertyStart());
    const newProperty = await createProperty(property);
    dispatch(addPropertySuccess(newProperty));
  } catch (err: any) {
    dispatch(addPropertyFailure(err.toString()));
  }
};

/**
 *
 * @param propertyId
 * @param updatedProperty
 * @returns
 */
export const editProperty =
  (propertyId: string, updatedProperty: Partial<NewProperty>) =>
  async (dispatch: (arg: IAction) => void) => {
    try {
      dispatch(editPropertyStart());
      await updateProperty(propertyId, updatedProperty);
      dispatch(editPropertySuccess({ propertyId, updatedProperty }));
      const property = await getOneProperty(propertyId);
      dispatch(getPropertySuccess(property.data));
    } catch (err: any) {
      dispatch(editPropertyFailure(err.toString()));
    }
  };

export const fetchMyProperties = () => async (dispatch: (arg: IAction) => void) => {
  try {
    dispatch(getPropertiesStart());
    const myProperties = await getMyProperties();
    dispatch(getPropertiesSuccess(myProperties.data));
  } catch (err: any) {
    dispatch(getPropertiesFailure(err.toString()));
  }
};

/**
 *
 * @param propertyId
 * @returns
 */
export const fetchProperty = (propertyId: string) => async (dispatch: (arg: IAction) => void) => {
  try {
    dispatch(getPropertyStart());
    const property = await getOneProperty(propertyId);
    dispatch(getPropertySuccess(property.data));
  } catch (err: any) {
    dispatch(getPropertyFailure(err.toString()));
  }
};

export const emptyCurrentSurvey = () => async (dispatch: (arg: IAction) => void) => {
  try {
    dispatch(getPropertyStart());
    dispatch(getPropertySuccess(null));
  } catch (err: any) {
    dispatch(getPropertyFailure(err.toString()));
  }
};
