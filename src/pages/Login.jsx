
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
				const response = await axios.post('https://server-863d.onrender.com/api/login', {
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
