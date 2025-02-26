import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'

export default function ViewImages(props) {
	return (
		<ImageList sx={{ width: 650, height: 225, marginY: 0 }} cols={3} gap={10} rowHeight={220}>
			{props.urls.map(item => (
				<ImageListItem key={item}>
					<img
						// srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
						src={`${item}`}
						alt={'Image'}
						loading='lazy'
						// height={'200px'}
						// width={'200px'}
						style={{ objectFit: 'cover' }}
					/>
				</ImageListItem>
			))}
		</ImageList>
	)
}
