// src/pages/VendorDashboard.jsx
import React, { useEffect, useState } from 'react'
import {
	Container,
	Box,
	Tabs,
	Tab,
	Typography,
	TextField,
	Button,
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	MenuItem,
	InputAdornment,
	FormControlLabel,
	Switch,
} from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'
import { toast } from 'react-toastify'
import { getURL } from '../../util/imgUpload'
import ViewImages from '../../util/ViewImages'
import axios from 'axios'
import { useSelector } from 'react-redux'

function VendorDashboard() {
	const token = useSelector(state => state.auth.token)
	const [tabIndex, setTabIndex] = useState(0)
	const [listings, setListings] = useState([])
	const [loading, setLoading] = useState(false)

	const [showAddUnitTab, setShowAddUnitTab] = useState(false)

	const handleOpenAddUnit = listing => {
		setSelectedListing(listing)
		setShowAddUnitTab(true)
		setTabIndex(1) // Assuming Add Unit is at index 1
	}

	const [listingForm, setListingForm] = useState({
		name: '',
		address: {
			areaStreet: '',
			city: '',
			state: '',
			zip: '',
			district: '',
		},
		contactInfo: '',
		description: '',
		pricing: '',
		availableTypes: '',
		images: [],
		type: '',
		facilities: '',
	})

	const [unitForm, setUnitForm] = useState({
		unitType: '',
		capacity: 0,
		price: 0,
		availability: true,
	})

	const [selectedListing, setSelectedListing] = useState(null)

	//state for image viewing
	const [viewImages, setViewImages] = useState(false)

	const getAllListings = async token => {
		try {
			const response = await axios.get('http://localhost:5000/api/vendor/listing', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			return response.data.data
		} catch (error) {
			console.error(error.response?.data?.message || error.message)
			toast.error(error.response?.data?.message || error.message)
		}
	}

	useEffect(() => {
		const fetchListings = async () => {
			const data = await getAllListings(token)
			setListings(data)
		}
		fetchListings()
	}, [tabIndex, token, getAllListings])

	const handleChangeTab = (event, newValue) => {
		setTabIndex(newValue)
	}

	const handleListingFormChange = async e => {
		const { name, value, files } = e.target

		if (name === 'images') {
			const fileArray = Array.from(files)
			setLoading(true)
			const uploadedUrls = await Promise.all(fileArray.map(file => getURL(file)))

			setListingForm(prev => ({ ...prev, images: uploadedUrls.filter(url => url) }))

			setLoading(false)
			//seting viewImages
			setViewImages(true)
		} else if (['areaStreet', 'city', 'state', 'zip', 'district'].includes(name)) {
			setListingForm(prev => ({
				...prev,
				address: {
					...prev.address,
					[name]: value,
				},
			}))
		} else {
			setListingForm(prev => ({
				...prev,
				[name]: value,
			}))
		}
	}

	const handleAddListing = async e => {
		e.preventDefault()

		try {
			const response = await axios.post(
				'http://localhost:5000/api/vendor/listing',
				{
					type: listingForm.type,
					name: listingForm.name,
					address: { ...listingForm.address },
					description: listingForm.description,
					facilities: listingForm.facilities,
					pricing: listingForm.pricing,
					images: listingForm.images,
					contactInfo: listingForm.contactInfo,
					availableTypes: listingForm.availableTypes,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`, // Sending the token in the headers
					},
				}
			)
			toast.success(response.data.message)
		} catch (error) {
			console.error(error.response?.data?.message || error.message)
			toast.error(error.response?.data?.message || error.message)
		}

		// Reset

		setListingForm({
			name: '',
			address: {
				areaStreet: '',
				city: '',
				state: '',
				zip: '',
				district: '',
			},
			contactInfo: '',
			description: '',
			pricing: '',
			availableTypes: '',
			images: [],
			type: '',
			facilities: '',
		})
		setViewImages(false)
	}

	const dummyBookings = [
		{
			id: 1,
			listing: 'Hotel Sunshine',
			customer: 'Alice',
			date: '2023-10-10',
			status: 'Confirmed',
		},
		{
			id: 2,
			listing: 'Restaurant Delight',
			customer: 'Bob',
			date: '2023-10-12',
			status: 'Pending',
		},
	]

	const analyticsData = {
		totalListings: listings?.length,
		totalBookings: dummyBookings.length,
		revenue: '$10,000',
	}

	const handleUnitFormChange = event => {
		const { name, value } = event.target
		// Convert to number if necessary
		const newValue = name === 'capacity' || name === 'price' ? Number(value) : value
		setUnitForm(prev => ({
			...prev,
			[name]: newValue,
		}))
	}

	const handleAddUnit = async e => {
		e.preventDefault()

		try {
			const response = await axios.post(
				'http://localhost:5000/api/vendor/unit', // Adjust the endpoint if needed
				{
					listingId: selectedListing._id,
					unitType: unitForm.unitType,
					capacity: unitForm.capacity,
					price: unitForm.price,
					availability: unitForm.availability,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`, // Sending the token in the headers
					},
				}
			)
			toast.success(response.data.message)
			console.log(response.data)
		} catch (error) {
			console.error(error.response?.data?.message || error.message)
			toast.error(error.response?.data?.message || error.message)
		}

		// Reset the unit form
		setUnitForm({
			unitType: '',
			capacity: '',
			price: '',
			availability: true,
		})
		setSelectedListing(null)
		setTabIndex(2)
	}

	const handleAvailabilityChange = event => {
		const { checked } = event.target
		setUnitForm(prev => ({
			...prev,
			availability: checked,
		}))
	}

	// Function to fetch all units
	const getAllUnits = async token => {
		try {
			const response = await axios.get('http://localhost:5000/api/vendor/unit', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			return response.data.data
		} catch (error) {
			console.error(error.response?.data?.message || error.message)
			toast.error(error.response?.data?.message || error.message)
		}
	}

	const [units, setUnits] = useState([])

	useEffect(() => {
		const fetchUnits = async () => {
			const data = await getAllUnits(token)
			setUnits(data)
		}
		fetchUnits()
	}, [tabIndex, token, getAllListings])

	return (
		<Container maxWidth='lg'>
			<Box sx={{ my: 4 }}>
				<Typography variant='h4' component='h1' gutterBottom>
					Vendor Dashboard
				</Typography>
				<Tabs value={tabIndex} onChange={handleChangeTab} aria-label='Dashboard Tabs'>
					<Tab label='Add Listing' />
					<Tab label='Add Unit' style={{ display: 'none' }} /> //showAddUnitTab ? 'block'
					<Tab label='Manage Listings' />
					<Tab label='Manage Units' />
					<Tab label='Booking Requests' />
					<Tab label='Analytics' />
				</Tabs>

				{tabIndex === 0 && (
					<Box sx={{ mt: 3 }}>
						<Typography variant='h6' gutterBottom>
							Add New Listing
						</Typography>
						<Box component='form' onSubmit={handleAddListing} sx={{ mt: 2 }}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										select
										label='Listing Type'
										name='type'
										value={listingForm.type}
										onChange={handleListingFormChange}
									>
										<MenuItem value='Hotel'>Hotel</MenuItem>
										<MenuItem value='Restaurant'>Restaurant</MenuItem>
									</TextField>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										label='Property Name'
										name='name'
										value={listingForm.name}
										onChange={handleListingFormChange}
									/>
								</Grid>
								<Grid item xs={8}>
									<TextField
										required
										fullWidth
										label='Address (Area & Street)'
										name='areaStreet'
										value={listingForm.address.areaStreet}
										onChange={handleListingFormChange}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										required
										fullWidth
										label='City'
										name='city'
										value={listingForm.address.city}
										onChange={handleListingFormChange}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										required
										fullWidth
										label='District'
										name='district'
										value={listingForm.address.district}
										onChange={handleListingFormChange}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										required
										fullWidth
										label='State'
										name='state'
										value={listingForm.address.state}
										onChange={handleListingFormChange}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										required
										fullWidth
										label='Zip'
										name='zip'
										value={listingForm.address.zip}
										onChange={handleListingFormChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										label='Contact Information'
										name='contactInfo'
										value={listingForm.contactInfo}
										onChange={handleListingFormChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										label='Description'
										name='description'
										multiline
										rows={4}
										value={listingForm.description}
										onChange={handleListingFormChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										fullWidth
										label='Facilities (comma separated)'
										name='facilities'
										value={listingForm.facilities}
										onChange={handleListingFormChange}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										required
										fullWidth
										label='Pricing Information (Avreage price per unit)'
										name='pricing'
										value={listingForm.pricing}
										onChange={handleListingFormChange}
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>₹</InputAdornment>
											),
										}}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										required
										fullWidth
										label='Available Room/Table Types (comma separated)'
										name='availableTypes'
										value={listingForm.availableTypes}
										onChange={handleListingFormChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<Button
										variant='contained'
										component='label'
										startIcon={<UploadIcon />}
									>
										Upload Images
										<input
											type='file'
											hidden
											multiple
											name='images'
											onChange={handleListingFormChange}
										/>
									</Button>
								</Grid>
								{viewImages && (
									<Grid
										item
										xs={12}
										style={{ display: 'flex', justifyContent: 'center' }}
									>
										<ViewImages urls={listingForm.images} />
									</Grid>
								)}
								<Grid item xs={12}>
									<Button
										type='submit'
										fullWidth
										variant='contained'
										loading={loading}
									>
										Add Listing
									</Button>
								</Grid>
							</Grid>
						</Box>
					</Box>
				)}

				{tabIndex === 1 && (
					<Box sx={{ mt: 3 }}>
						<Typography variant='h6' gutterBottom>
							Add New Unit
						</Typography>
						<Box component='form' onSubmit={handleAddUnit} sx={{ mt: 2 }}>
							<Grid container spacing={2}>
								{/* Unit Type */}
								<Grid item xs={12}>
									<TextField
										// required
										fullWidth
										label='Property name'
										// name='unitType'
										disabled
										value={selectedListing.name}
										onChange={handleUnitFormChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										label='Unit Type'
										name='unitType'
										value={unitForm.unitType}
										onChange={handleUnitFormChange}
									/>
								</Grid>
								{/* Capacity */}
								<Grid item xs={6}>
									<TextField
										required
										fullWidth
										label='Capacity'
										name='capacity'
										type='number'
										value={unitForm.capacity}
										onChange={handleUnitFormChange}
									/>
								</Grid>
								{/* Price */}
								<Grid item xs={6}>
									<TextField
										required
										fullWidth
										label='Price'
										name='price'
										type='number'
										value={unitForm.price}
										onChange={handleUnitFormChange}
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>₹</InputAdornment>
											),
										}}
									/>
								</Grid>
								{/* Availability */}
								<Grid item xs={12}>
									<FormControlLabel
										control={
											<Switch
												checked={unitForm.availability}
												onChange={handleAvailabilityChange}
												name='availability'
												color='primary'
											/>
										}
										label='Available'
									/>
								</Grid>
								{/* Submit Button */}
								<Grid item xs={12}>
									<Button type='submit' fullWidth variant='contained'>
										Add Unit
									</Button>
								</Grid>
							</Grid>
						</Box>
					</Box>
				)}

				{tabIndex === 2 && (
					<Box sx={{ mt: 3 }}>
						<Typography variant='h6' gutterBottom>
							Manage Listings
						</Typography>
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Property Name</TableCell>
										<TableCell>City</TableCell>
										<TableCell>State</TableCell>
										<TableCell>Status</TableCell>
										<TableCell></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{listings?.map(listing => (
										<TableRow key={listing._id || listing.id}>
											<TableCell>{listing.name}</TableCell>
											<TableCell>{listing.address.city}</TableCell>
											<TableCell>{listing.address.state}</TableCell>
											<TableCell>{listing.status}</TableCell>
											<TableCell>
												<Button
													variant='contained'
													onClick={() => handleOpenAddUnit(listing)}
												>
													Add Unit
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
				)}

				{tabIndex === 3 && (
					<Box sx={{ mt: 3 }}>
						<Typography variant='h6' gutterBottom>
							Manage Units
						</Typography>
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Listing Name</TableCell>
										<TableCell>Unit Type</TableCell>
										<TableCell>Capacity</TableCell>
										<TableCell>Price</TableCell>
										<TableCell>Availability</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{units?.map(unit => (
										<TableRow key={unit._id || unit.id}>
											<TableCell>
												{/* If listingId is populated with listing details */}
												{unit.listingId?.name || unit.listingId}
											</TableCell>
											<TableCell>{unit.unitType}</TableCell>
											<TableCell>{unit.capacity}</TableCell>
											<TableCell>₹{unit.price}</TableCell>
											<TableCell>
												{unit.availability ? 'Available' : 'Unavailable'}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
				)}

				{tabIndex === 4 && (
					<Box sx={{ mt: 3 }}>
						<Typography variant='h6' gutterBottom>
							Booking Requests
						</Typography>
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Listing</TableCell>
										<TableCell>Customer</TableCell>
										<TableCell>Date</TableCell>
										<TableCell>Status</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{dummyBookings.map(booking => (
										<TableRow key={booking.id}>
											<TableCell>{booking.listing}</TableCell>
											<TableCell>{booking.customer}</TableCell>
											<TableCell>{booking.date}</TableCell>
											<TableCell>{booking.status}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
				)}

				{tabIndex === 5 && (
					<Box sx={{ mt: 3 }}>
						<Typography variant='h6' gutterBottom>
							Analytics
						</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12} md={4}>
								<Paper elevation={3} sx={{ p: 2 }}>
									<Typography variant='h6'>Total Listings</Typography>
									<Typography variant='h4'>
										{analyticsData.totalListings}
									</Typography>
								</Paper>
							</Grid>
							<Grid item xs={12} md={4}>
								<Paper elevation={3} sx={{ p: 2 }}>
									<Typography variant='h6'>Total Bookings</Typography>
									<Typography variant='h4'>
										{analyticsData.totalBookings}
									</Typography>
								</Paper>
							</Grid>
							<Grid item xs={12} md={4}>
								<Paper elevation={3} sx={{ p: 2 }}>
									<Typography variant='h6'>Revenue</Typography>
									<Typography variant='h4'>{analyticsData.revenue}</Typography>
								</Paper>
							</Grid>
						</Grid>
					</Box>
				)}
			</Box>
		</Container>
	)
}

export default VendorDashboard
