// src/pages/Register.jsx
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
import { toast } from 'react-toastify'
import InputAdornment from '@mui/material/InputAdornment'
import { useNavigate } from 'react-router-dom'

function Register() {
	const [nameError, setNameError] = useState('')
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const [confirmPasswordError, setConfirmPasswordError] = useState('')
	const [phoneError, setPhoneError] = useState('')
	const navigate = useNavigate()

	const handleSubmit = async event => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const name = formData.get('name')
		const email = formData.get('email')
		const password = formData.get('password')
		const confirmPassword = formData.get('confirmPassword')
		const phoneInput = formData.get('phoneNumber') // This is the 10-digit number entered by the user

		let valid = true

		// Name validation
		if (!name || name.trim() === '') {
			setNameError('Name is required')
			valid = false
		} else {
			setNameError('')
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			setEmailError('Invalid email address')
			valid = false
		} else {
			setEmailError('')
		}

		// Password validation (at least 6 characters)
		if (password.length < 6) {
			setPasswordError('Password must be at least 6 characters long')
			valid = false
		} else {
			setPasswordError('')
		}

		// Confirm password validation
		if (password !== confirmPassword) {
			setConfirmPasswordError('Passwords do not match')
			valid = false
		} else {
			setConfirmPasswordError('')
		}

		// Phone number validation: ensure exactly 10 digits are entered
		const phoneCombined = `+91 ${phoneInput}`
		const phoneRegex = /^\+91\s\d{10}$/
		if (!phoneRegex.test(phoneCombined)) {
			setPhoneError('Please enter a valid 10-digit phone number')
			valid = false
		} else {
			setPhoneError('')
		}

		if (valid) {
			try {
				const response = await axios.post('http://localhost:5000/api/register', {
					name,
					email,
					password,
					phoneNumber: phoneCombined,
					role: 'Customer',
				})
				toast.success(response.data.message)
				navigate('/login')
			} catch (error) {
				console.error(error.response?.data)
				toast.error(error.response?.data.message || 'Registration failed')
			}
		}
	}

	return (
		<Container component='main' maxWidth='xs'>
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
					Register
				</Typography>
				<Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin='normal'
						required
						fullWidth
						id='name'
						label='Full Name'
						name='name'
						autoFocus
						error={!!nameError}
						helperText={nameError}
					/>
					<TextField
						margin='normal'
						required
						fullWidth
						id='email'
						label='Email Address'
						name='email'
						error={!!emailError}
						helperText={emailError}
					/>
					<TextField
						margin='normal'
						required
						fullWidth
						name='password'
						label='Password'
						type='password'
						id='password'
						error={!!passwordError}
						helperText={passwordError}
					/>
					<TextField
						margin='normal'
						required
						fullWidth
						name='confirmPassword'
						label='Confirm Password'
						type='password'
						id='confirmPassword'
						error={!!confirmPasswordError}
						helperText={confirmPasswordError}
					/>
					<TextField
						margin='normal'
						required
						fullWidth
						id='phoneNumber'
						label='Phone Number'
						name='phoneNumber'
						type='tel'
						error={!!phoneError}
						helperText={phoneError}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>+91&nbsp;</InputAdornment>
							),
						}}
					/>
					<Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
						Register
					</Button>
					<Link href='/login' variant='body2'>
						{'Already have an account? Login'}
					</Link>
				</Box>
			</Box>
		</Container>
	)
}

export default Register
