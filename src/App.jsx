// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from './authStore/authSlice'
import Home from './pages/HomePage/Home'
import Login from './pages/Login'
import Register from './pages/Register'
// import Dashboard from './pages/Dashboard'; // Example of a protected route
import ProtectedRoute from './components/ProtectedRoute'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Notification from './notification/Notification'
import RoleBasedDashboard from './pages/RoleBasedDashboard'

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
})

function App() {
	const isAuthenticated = useSelector(selectIsAuthenticated)

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Router>
				<Routes>
					{/* Public Routes */}
					<Route path='/' element={<Home />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />

					{/* Protected Routes */}
					<Route
						path='/dashboard'
						element={
							<ProtectedRoute isAuthenticated={isAuthenticated}>
								<RoleBasedDashboard />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
			<Notification />
		</ThemeProvider>
	)
}

export default App
