import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Tabs,
    Tab,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import axios from 'axios';
import { useSelector } from 'react-redux'

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CustomerDashboard = () => {
    const token = useSelector(state => state.auth.token)
    const [tabIndex, setTabIndex] = useState(0);
    const [search, setSearch] = useState('');
    const [Unit, setUnits] = useState([]);
    const [filter, setFilter] = useState({
        city: '',
        state: '',
        district: '',
        areaStreet: '',
        price: '',
        rating: '',
    });
    const [availableHotels, setAvailableHotels] = useState([]);
    const [userBookings, setUserBookings] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [open, setOpen] = useState(false);

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/customer/dashboard', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data)
                setAvailableHotels(response.data.availableHotels); // Assuming the API returns an array of hotels
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);


    const handleViewDetails = async hotel => {
        setSelectedHotel(hotel);
        setOpen(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/unit/${hotel._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUnits(response.data.units);
            console.log(response.data);

        } catch (error) {
            console.error('Error fetching units', error);
        }
    };


    // Settings for the react-slick carousel
    const carouselSettings = {
        dots: true, // Show dot indicators
        infinite: true, // Infinite looping
        speed: 500, // Transition speed
        slidesToShow: 1, // Number of slides to show at a time
        slidesToScroll: 1, // Number of slides to scroll
        autoplay: true, // Auto-play the carousel
        autoplaySpeed: 3000, // Auto-play speed in milliseconds
    };

    const handleChangeTab = (event, newValue) => setTabIndex(newValue);
    const handleFilterChange = event =>
        setFilter({ ...filter, [event.target.name]: event.target.value });
    const handleClose = () => {
        setOpen(false);
        setSelectedHotel(null);
    };

    const fetchUserBookings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/bookings/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserBookings(response.data.bookings);
        } catch (error) {
            console.error('Error fetching user bookings', error);
        }
    };

    useEffect(() => {
        fetchUserBookings();  
}, [tabIndex, token]);

    const handleBookUnit = async unitId => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/bookings/',
                { listingId: selectedHotel._id, unitId, amount: selectedHotel.pricing },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                alert('Booking successful!');
                // Refresh the list of bookings
                fetchUserBookings();
                // Refresh unit availability
                handleViewDetails(selectedHotel);
            }
        } catch (error) {
            console.error('Error booking unit', error);
            alert('Booking failed. Please try again.');
        }
    };


    const filteredHotels = availableHotels.filter(
        hotel =>
            (filter.city === '' || hotel.address?.city === filter.city) &&
            (filter.state === '' || hotel.address?.state === filter.state) &&
            (filter.district === '' || hotel.address?.district === filter.district) &&
            (filter.areaStreet === '' || hotel.address?.areaStreet === filter.areaStreet) &&
            (filter.price === '' ||
                (filter.price === 'low' ? hotel.pricing <= 150 : hotel.pricing > 150)) &&
            (filter.rating === '' || hotel.rating >= parseFloat(filter.rating)) &&
            (search === '' || hotel.name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <Container maxWidth='xl'>
            <Box sx={{ my: 4, textAlign: 'center' }}>
                <Typography variant='h3' component='h1' gutterBottom fontWeight='bold'>
                    Explore Luxury Hotels & Restaurants
                </Typography>
                <Tabs value={tabIndex} onChange={handleChangeTab} centered>
                    <Tab label='Browse Listings' />
                    <Tab label='My Bookings' />
                </Tabs>
            </Box>
            {tabIndex === 0 && (<>
                <Box display='flex' justifyContent='center' mb={4}>
                    <TextField
                        label='Search'
                        variant='outlined'
                        sx={{ width: 300, mr: 2 }}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <FormControl sx={{ width: 200, mr: 2 }}>
                        <InputLabel>City</InputLabel>
                        <Select name='city' value={filter.city} onChange={handleFilterChange}>
                            <MenuItem value=''>All</MenuItem>
                            <MenuItem value='New York'>New York</MenuItem>
                            <MenuItem value='Los Angeles'>Los Angeles</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: 200, mr: 2 }}>
                        <InputLabel>State</InputLabel>
                        <Select name='state' value={filter.state} onChange={handleFilterChange}>
                            <MenuItem value=''>All</MenuItem>
                            <MenuItem value='NY'>NY</MenuItem>
                            <MenuItem value='CA'>CA</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: 200, mr: 2 }}>
                        <InputLabel>Price</InputLabel>
                        <Select name='price' value={filter.price} onChange={handleFilterChange}>
                            <MenuItem value=''>All</MenuItem>
                            <MenuItem value='low'>Low (≤ $150)</MenuItem>
                            <MenuItem value='high'>High ( $150)</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: 200, mr: 2 }}>
                        <InputLabel>Rating</InputLabel>
                        <Select name='rating' value={filter.rating} onChange={handleFilterChange}>
                            <MenuItem value=''>All</MenuItem>
                            <MenuItem value='4.0'>4.0+</MenuItem>
                            <MenuItem value='4.5'>4.5+</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Grid container spacing={4} justifyContent='center'>
                    {filteredHotels.map(hotel => (
                        <Grid item key={hotel._id} xs={12} sm={6} md={4} lg={3}>
                            <Card sx={{ maxWidth: 400, borderRadius: 4, boxShadow: 3 }}>
                                <Slider {...carouselSettings}>
                                    {hotel.images.map((image, index) => (
                                        <CardMedia
                                            key={index}
                                            component='img'
                                            height='250'
                                            image={image}
                                            alt={`${hotel.name} - Image ${index + 1}`}
                                            sx={{ objectFit: 'cover', width: '100%' }}
                                        />
                                    ))}
                                </Slider>
                                <CardContent>
                                    <Typography variant='h5' fontWeight='bold'>
                                        {hotel.name}
                                    </Typography>
                                    <Typography variant='body2' color='textSecondary'>
                                        {hotel.address?.city}, {hotel.address?.state}
                                    </Typography>
                                    <Typography variant='h6' color='primary'>
                                        ₹{hotel.pricing}
                                    </Typography>
                                    <Typography variant='body2' color='textSecondary'>
                                        Rating: {hotel.rating} ⭐
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size='large'
                                        color='primary'
                                        variant='contained'
                                        onClick={() => handleViewDetails(hotel)}
                                    >
                                        View Details
                                    </Button>
                                    <Button size='large' color='secondary' variant='outlined'>
                                        Book Now
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </>)}

            {tabIndex === 1 && (<>

                <Container>
                    <Typography variant='h5' mt={4}>Your Bookings</Typography>
                    {userBookings.length > 0 ? (
                        <List>
                            {userBookings.map(booking => (
                                <ListItem key={booking._id} divider>
                                    <ListItemText
                                        primary={`Hotel: ${booking.listingId.name} - ${booking.unitId.unitType}`}
                                        secondary={`Price: ₹${booking.unitId.price} | Date: ${new Date(booking.bookingDate).toLocaleDateString()}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" mt={2}>No bookings found.</Typography>
                    )}
                </Container>


            </>)}

            {selectedHotel && (
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
                    <DialogTitle>{selectedHotel.name}</DialogTitle>
                    <DialogContent>
                        <Carousel>
                            {selectedHotel.images.map((image, index) => (
                                <CardMedia
                                    key={index}
                                    component='img'
                                    height='300'
                                    image={image}
                                    alt={selectedHotel.name}
                                    sx={{ objectFit: 'cover' }}
                                />
                            ))}
                        </Carousel>
                        <Typography variant='h6' mt={2}>
                            Location: {selectedHotel.address?.city}, {selectedHotel.address?.state}
                        </Typography>
                        <Typography variant='h6' color='primary'>
                            ₹{selectedHotel.pricing}
                        </Typography>
                        <Typography variant='body1' mt={1}>
                            {selectedHotel.description}
                        </Typography>
                        <Typography variant='h6' mt={2}>Available Units:</Typography>
                        <List>
                            {Unit.map(unit => (
                                <ListItem key={unit._id} divider>
                                    <ListItemText
                                        primary={`${unit.unitType} - Capacity: ${unit.capacity} people`}
                                        secondary={`Price: ₹${unit.price} | ${unit.availability ? 'Available' : 'Not Available'}`}
                                    />
                                    {unit.availability && (
                                        <Button
                                            color='secondary'
                                            variant='contained'
                                            onClick={() => handleBookUnit(unit._id)}
                                        >
                                            Book Now
                                        </Button>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color='primary'>
                            Close
                        </Button>
                        <Button color='secondary' variant='contained'>
                            Book Now
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
};

export default CustomerDashboard;