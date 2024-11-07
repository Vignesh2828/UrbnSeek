import { combineReducers, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '@/store/httpclient';
import { RootState } from '@/store';

interface User {
    user_email: string;
    user_name: string;
    user_image?: string;
    user_aadhar: string;
    user_pan : string;
    user_phone : string;
    user_whatsapp? : string;
    user_address : string;
    user_lat? : number;
    user_lon? : number;
    user_city : string;
}

export  const updateUser = createAsyncThunk('nhsf/updateUser', async ({user, user_id}: {user:User, user_id:number}) => {
    const response = await axiosInstance.put(`/api/users/${user_id}`, user);

    return response.data;
});

interface UserProfileImage {
    user_image: string;
}

export  const updateUserProfileImage = createAsyncThunk('nhsf/updateUserProfileImage', async ({user_image, user_id}: {user_image:UserProfileImage, user_id:number}) => {
    const response = await axiosInstance.put(`/api/users/${user_id}`, user_image);

    return response.data;
});

interface UserState {
    data :{
        user_email: string;
    user_name: string;
    user_image?: string;
    user_aadhar: string;
    user_pan : string;
    user_phone : string;
    user_whatsapp? : string;
    user_address : string;
    user_lat? : number;
    user_lon? : number;
    user_city : string;
    },
    loading : boolean;
    error : string | null;
}
export const getUser = createAsyncThunk('nhsf/getUser', async ({user_id}: {user_id :number}) => {
    const response = await axiosInstance.get(`/api/users/${user_id}`);

    return response.data;
}  );

export const userSlice = createSlice({
    name : 'userSlice',
    initialState : {
        data : {} ,
        loading : false,
        error : null
    }as UserState,
    reducers : {},
    extraReducers(builder) {
        builder
          .addCase(getUser.pending, state => {
            state.loading = true
            state.error = null
          })
          .addCase(getUser.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.loading = false
            state.error = null
          })
          .addCase(getUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message ?? null
          })
      }
})

interface UserNameState {
    names: { [key: number]: string };
    loading: boolean;
    error: string | null;
  }
  
  const initialState: UserNameState = {
    names: {},
    loading: false,
    error: null,
  };
  
  // Thunk to get user name by ID
  export const getUserNameById = createAsyncThunk(
    'users/getUserNameById',
    async (user_id: number) => {
      const response = await axiosInstance.get(`/api/users/getName/${user_id}`);
      return { user_id, user_name: response.data.data.user_name };
    }
  );
  
  const userNameSlice = createSlice({
    name: 'userNames',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getUserNameById.pending, (state) => {
          state.loading = true;
        })
        .addCase(getUserNameById.fulfilled, (state, action) => {
          state.loading = false;
          const { user_id, user_name } = action.payload;
          state.names[user_id] = user_name; 
        })
        .addCase(getUserNameById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch username';
        });
    },
  });
  
  export const selectUserName = (state: RootState, user_id: number) =>
    state.user.userName.names[user_id];

const rootReducers = combineReducers({
  user : userSlice.reducer,
  userName : userNameSlice.reducer
});

export default rootReducers;
