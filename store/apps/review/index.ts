import { combineReducers, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '@/store/httpclient';

interface ReviewData {
    user_id:string , 
    review_star:string,
     review_text: string , 
     review_images : string[] 
}


export const POST_REVIEW = createAsyncThunk('nhsf/POST_REVIEW', async ({addReviewData, service_id} : {addReviewData :ReviewData, service_id:number}) => {
    const response = await axiosInstance.post(`/api/reviews/create/${service_id}`, addReviewData);

    return response.data; 
});

export interface GetReviewData {
    service_id: number
    user_id : number
    review_id : number
    review_text : string 
    review_star : number
    review_images: string[];
}

interface AddReviewState {
    data : GetReviewData[]
    loading : boolean
    error : string | null
}

export const GET_REVIEWS = createAsyncThunk('nhsf/GET_REVIEWS', async ({service_id} : {service_id:number}) => {
    const response = await axiosInstance.get(`/api/reviews/${service_id}`);

    return response.data; 
});

const review_list = createSlice({
    name: 'services_list',
    initialState: {
        data: [],
        loading: false,
        error: null,
    } as AddReviewState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(GET_REVIEWS.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.data = []; 
            })
            .addCase(GET_REVIEWS.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.error = null;
            })
            .addCase(GET_REVIEWS.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null;
            });
    },
});

const rootReducers = combineReducers({
   review : review_list.reducer
});

export default rootReducers;
