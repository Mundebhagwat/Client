import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	token: null,
	user: null,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.token = action.payload.token
			state.user = action.payload.user
		},
		logout: state => {
			state.token = null
			state.user = null
		},
	},
})

export const { loginSuccess, logout } = authSlice.actions

// Selector to check if the user is authenticated
export const selectIsAuthenticated = state => Boolean(state.auth.token)

// Selector to check user role
export const selectUser = state => state.auth.user

export default authSlice.reducer
