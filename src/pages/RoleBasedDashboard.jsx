import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../authStore/authSlice'
import { Navigate } from 'react-router-dom'
import CustomerDashboard from '../pages/customer/CustomerDashboard'
import VendorDashboard from '../pages/vendor/VendorDashboard'
import AdminDashboard from '../pages/admin/AdminDashboard'

const RoleBasedDashboard = () => {
	const user = useSelector(selectUser)

	// If no user is found, redirect to login.
	if (!user) return <Navigate to='/login' replace />

	// Render dashboard based on role.
	switch (user.role) {
		case 'Vendor':
			return <VendorDashboard />
		case 'Admin':
			return <AdminDashboard />
		case 'Customer':
			return <CustomerDashboard />
		default:
			return <div>Unauthorized Role</div>
	}
}

export default RoleBasedDashboard
