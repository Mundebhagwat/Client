import React, { useState, useEffect } from 'react'
import {
	Container,
	Box,
	Typography,
	Tabs,
	Tab,
	TextField,
	Button,
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	InputAdornment,
	IconButton,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import VendorListingsCards from '../../components/VendorListingsCards'

const AdminDashboard = () => {
	const token = useSelector(state => state.auth.token)
	// State for active tab
	const [tabIndex, setTabIndex] = useState(0)
	const [showPassword, setShowPassword] = useState(false)

	// State for vendor form
	const [vendorForm, setVendorForm] = useState({
		name: '',
		email: '',
		phoneNumber: '',
		password: '',
		role: 'Vendor',
	})

	// State for listings
	const [listings, setListings] = useState([])

	// Handle tab change
	const handleChangeTab = (event, newValue) => {
		setTabIndex(newValue)
	}

	// Handle vendor form input change
	const handleVendorFormChange = e => {
		const { name, value } = e.target
		setVendorForm(prev => ({
			...prev,
			[name]: value,
		}))
	}

	// Function to add a new vendor
	const handleAddVendor = async e => {
		e.preventDefault()

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(vendorForm.email)) {
			toast.error('Invalid email address')
			return
		}

		if (vendorForm.password.length < 6) {
			toast.error('Password must be at least 6 characters long')
			return
		}

		try {
			const response = await axios.post(
				'http://localhost:5000/api/admin/register-vendor', // Adjust the endpoint as needed
				vendorForm,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			toast.success(response.data.message)
			// Reset the form after successful submission
			setVendorForm({
				name: '',
				email: '',
				phoneNumber: '',
				password: '',
			})
		} catch (error) {
			console.error(error.response?.data?.message || error.message)
			toast.error(error.response?.data?.message || error.message)
		}
	}

	// Function to get all listings (with status: Pending, Approved, or Rejected)
	const getAllListings = async () => {
		try {
			const response = await axios.get('http://localhost:5000/api/admin/aprove-listing', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			setListings(response.data.data)
		} catch (error) {
			console.error(error.response?.data?.message || error.message)
			toast.error(error.response?.data?.message || error.message)
		}
	}

	// When the Listings tab is active, fetch the listings
	useEffect(() => {
		if (tabIndex === 1) {
			getAllListings()
		}
	}, [tabIndex, listings])

	const handleStatusChange = async (listingId, newStatus) => {
		try {
			const response = await axios.put(
				`http://localhost:5000/api/admin/aprove-listing`,
				{ status: newStatus, listingId },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			toast.success(response.data.message)
			getAllListings()
		} catch (error) {
			console.error(error.response?.data?.message || error.message)
			toast.error(error.response?.data?.message || error.message)
		}
	}

	return (
		<Container maxWidth='lg'>
			<Box sx={{ my: 4 }}>
				<Typography variant='h4' component='h1' gutterBottom>
					Admin Dashboard
				</Typography>
				<Tabs value={tabIndex} onChange={handleChangeTab} aria-label='Admin Dashboard Tabs'>
					<Tab label='Add Vendor' />
					<Tab label='Listings' />
				</Tabs>

				{/* Tab 0: Add Vendor */}
				{tabIndex === 0 && (
					<Box component='form' onSubmit={handleAddVendor} sx={{ mt: 3 }}>
						<Typography variant='h6' gutterBottom>
							Add New Vendor
						</Typography>
						<TextField
							required
							fullWidth
							label='Vendor Name'
							name='name'
							value={vendorForm.name}
							onChange={handleVendorFormChange}
							sx={{ my: 1 }}
						/>
						<TextField
							required
							fullWidth
							label='Email'
							name='email'
							value={vendorForm.email}
							onChange={handleVendorFormChange}
							sx={{ my: 1 }}
						/>
						<TextField
							required
							fullWidth
							label='Phone Number'
							name='phoneNumber'
							value={vendorForm.phoneNumber}
							onChange={handleVendorFormChange}
							sx={{ my: 1 }}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>+91&nbsp;</InputAdornment>
								),
							}}
						/>
						<TextField
							required
							fullWidth
							label='Password'
							name='password'
							type={showPassword ? 'text' : 'password'}
							value={vendorForm.password}
							onChange={handleVendorFormChange}
							sx={{ my: 1 }}
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
						<Button type='submit' variant='contained' sx={{ mt: 2 }}>
							Add Vendor
						</Button>
					</Box>
				)}

				{/* Tab 1: Listings */}
				{tabIndex === 1 && (
					<VendorListingsCards
						listings={listings}
						handleStatusChange={handleStatusChange}
					/>
				)}
				{/* {tabIndex === 1 && (
					<Box sx={{ mt: 3 }}>
						<Typography variant='h6' gutterBottom>
							Vendor Listings
						</Typography>
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Vendor Name</TableCell>
										<TableCell>Listing Name</TableCell>
										<TableCell>Listing Name</TableCell>
										<TableCell>Status</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{listings.map(listing => (
										<TableRow key={listing._id || listing.id}>
											<TableCell>
												{listing.vendorId?.name || 'N/A'}
											</TableCell>
											<TableCell>{listing.name}</TableCell>
											<TableCell>
												{listing.status === 'Pending' ? (
													<>
														<Button
															variant='contained'
															color='success'
															size='small'
															onClick={() =>
																handleStatusChange(
																	listing._id,
																	'Approved'
																)
															}
															sx={{ mr: 1 }}
														>
															Approve
														</Button>
														<Button
															variant='contained'
															color='error'
															size='small'
															onClick={() =>
																handleStatusChange(
																	listing._id,
																	'Rejected'
																)
															}
														>
															Reject
														</Button>
													</>
												) : (
													<Typography variant='body2'>
														{listing.status}
													</Typography>
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
				)} */}
			</Box>
		</Container>
	)
}

export default AdminDashboard
