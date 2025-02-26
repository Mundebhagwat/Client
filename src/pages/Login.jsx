// // src/pages/Login.jsx
// import React, { useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { loginSuccess } from '../authStore/authSlice'
// import { useNavigate } from 'react-router-dom'

// const Login = () => {
// 	const [email, setEmail] = useState('')
// 	const [password, setPassword] = useState('')
// 	const dispatch = useDispatch()
// 	const navigate = useNavigate()

// 	const handleSubmit = async e => {
// 		e.preventDefault()

// 		// Simulate an API login request and response data
// 		const responseData = {
// 			message: 'Login successful',
// 			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2JjNjFkZjFkOGRkNjlhNDQyMzAwZGEiLCJyb2xlIjoiQ3VzdG9tZXIiLCJpYXQiOjE3NDA0MDAyNDIsImV4cCI6MTc0MTAwNTA0Mn0.3tVWc1zk5RxZPo2cJbuwbbKD5FgzDSFSwrnd0ZiLf4g',
// 			user: {
// 				id: '67bc61df1d8dd69a442300da',
// 				name: 'John Doe',
// 				email: 'johndoe@example.com',
// 				role: 'Customer',
// 				phoneNumber: '+91 9876543210',
// 			},
// 		}

// 		// Dispatch the login action with the response data
// 		dispatch(loginSuccess({ token: responseData.token, user: responseData.user }))

// 		// Navigate to a protected route (e.g., Dashboard)
// 		navigate('/dashboard')
// 	}

// 	return (
// 		<form onSubmit={handleSubmit}>
// 			<input
// 				type='email'
// 				placeholder='Email'
// 				value={email}
// 				onChange={e => setEmail(e.target.value)}
// 				required
// 			/>
// 			<input
// 				type='password'
// 				placeholder='Password'
// 				value={password}
// 				onChange={e => setPassword(e.target.value)}
// 				required
// 			/>
// 			<button type='submit'>Login</button>
// 		</form>
// 	)
// }

// export default Login

// src/pages/Login.jsx
import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../authStore/authSlice'
import { toast } from 'react-toastify'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { IconButton, InputAdornment } from '@mui/material'
// import NavBar from '../components/NavBar'
import { useNavigate } from 'react-router-dom'

function Login() {
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleSubmit = async event => {
		event.preventDefault()
		const data = new FormData(event.currentTarget)
		const email = data.get('email')
		const password = data.get('password')

		let valid = true

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			setEmailError('Invalid email address')
			valid = false
		} else {
			setEmailError('')
		}

		// Password validation
		if (password.length < 6) {
			setPasswordError('Password must be at least 6 characters long')
			valid = false
		} else {
			setPasswordError('')
		}

		if (valid) {
			try {
				const response = await axios.post('http://localhost:5000/api/login', {
					email,
					password,
				})

				// Dispatch login action with token and user details
				dispatch(
					loginSuccess({
						token: response.data.token,
						user: response.data.user,
					})
				)

				if (response.data.token != null) {
					navigate('/dashboard')
				} else {
					toast.error(response.data.message)
				}
			} catch (error) {
				console.error(error.response.data)
				toast.error(error.response.data.message)
			}
		}
	}

	return (
		<>
			{/* <NavBar /> */}
			<Container
				component='main'
				maxWidth='xs'
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Sign in
					</Typography>
					<Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							id='email'
							label='Email Address'
							name='email'
							autoComplete='email'
							autoFocus
							error={!!emailError}
							helperText={emailError}
						/>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type={showPassword ? 'text' : 'password'}
							id='password'
							autoComplete='current-password'
							error={!!passwordError}
							helperText={passwordError}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton onClick={() => setShowPassword(prev => !prev)}>
											{showPassword ? (
												<VisibilityIcon />
											) : (
												<VisibilityOffIcon />
											)}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						<Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
							Sign In
						</Button>
						<Link href='/register' variant='body2'>
							{"Don't have an account? Register"}
						</Link>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default Login
