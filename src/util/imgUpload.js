import axios from 'axios'
// CLOUDINARY_URL=cloudinary://751229482659936:8Gsejz0mdoJdI9F-T-5TzseLAPQ@dw5pimd8i
export const getURL = async img => {
	const formData = new FormData()
	formData.append('file', img)
	formData.append('upload_preset', 'rtuc9ytk')

	try {
		const response = await axios.post(
			'https://api.cloudinary.com/v1_1/dw5pimd8i/image/upload',
			formData
		)

		return response.data.secure_url
	} catch (error) {
		console.error('Error uploading image:', error)
		return null
	}
}
