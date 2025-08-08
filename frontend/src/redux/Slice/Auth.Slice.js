import BaseApi from '../BaseQuery/baseQuery.js';


export const AuthApi = BaseApi.injectEndpoints({
    endpoints :(builder) => ({
        
    registerUser: builder.mutation({
        query: (data) => ({
            url : '/api/v1/users/register',
            method: 'POST',
            body : data
        })
    }),
        loginUser: builder.mutation({
            query : (data) => ({
                url : '/api/v1/users/login',
                method : 'POST',
                body :  data
            })
        }),
        logoutUser: builder.mutation({
            query : () => ({
                url : '/api/v1/users/logout',
                method : 'POST',
                
            })
        }),
})
});


export const {  useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation } = AuthApi;