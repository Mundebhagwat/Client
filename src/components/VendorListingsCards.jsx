import React from 'react'
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material'

const VendorListingsCards = ({ listings, handleStatusChange }) => {
	return (
		<Box sx={{ mt: 3 }}>
			<Typography variant='h6' gutterBottom>
				Vendor Listings
			</Typography>
			<Grid container spacing={2}>
				{listings.map(listing => (
					<Grid item xs={12} sm={6} md={4} key={listing._id || listing.id}>
						<Card>
							{listing.images && listing.images.length > 0 && (
								<CardMedia
									component='img'
									height='200'
									image={listing.images[0]}
									alt={listing.name}
									sx={{ objectFit: 'cover' }}
								/>
							)}
							<CardContent>
								<Typography variant='h6'>{listing.name}</Typography>
								<Typography variant='subtitle2' color='text.secondary'>
									{listing.vendorId?.name || 'Vendor N/A'}
								</Typography>
								<Typography variant='body2' sx={{ mt: 1 }}>
									<strong>Address: </strong>
									{listing.address.areaStreet}, {listing.address.district},{' '}
									{listing.address.city}, {listing.address.state} -{' '}
									{listing.address.zip}
								</Typography>
								<Typography variant='body2'>
									<strong>Contact: </strong>
									{listing.contactInfo}
								</Typography>
								<Typography variant='body2'>
									<strong>Type: </strong>
									{listing.type}
								</Typography>
								<Typography variant='body2'>
									<strong>Available Types: </strong>
									{listing.availableTypes && listing.availableTypes.join(', ')}
								</Typography>
								<Typography variant='body2'>
									<strong>Facilities: </strong>
									{listing.facilities && listing.facilities.join(', ')}
								</Typography>
								<Typography variant='body2'>
									<strong>Pricing: </strong>₹{listing.pricing}
								</Typography>
								{listing.description && (
									<Typography variant='body2' sx={{ mt: 1 }}>
										{listing.description}
									</Typography>
								)}
								<Box sx={{ mt: 2 }}>
									{listing.status === 'Pending' ? (
										<>
											<Button
												variant='contained'
												color='success'
												size='small'
												onClick={() =>
													handleStatusChange(listing._id, 'Approved')
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
													handleStatusChange(listing._id, 'Rejected')
												}
											>
												Reject
											</Button>
										</>
									) : (
										<Typography variant='body2'>{listing.status}</Typography>
									)}
								</Box>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	)
}

export default VendorListingsCards
