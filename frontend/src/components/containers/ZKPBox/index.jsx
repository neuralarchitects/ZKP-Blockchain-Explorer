import Button from '../../ui/Button';
import ImageLoader from '../../ui/Image';
import './style.scss';

export default function ZKPBox() {
	return (
		<section className="zkp-banner">
			<div className='text-holder'>
				<h1>Discover Innovation with Fides Innova!</h1>
				<p>
					Explore cutting-edge solutions and learn how Fides Innova
					empowers individuals and organizations through innovation.
					Whether you're looking for resources, insights, or tools, we
					have everything you need to succeed.
				</p>
				<Button className={'button'}>Visit Us</Button>
			</div>

			<ImageLoader
				width={100}
				height={65}
				src={
					'https://fidesinnova.io/wp-content/uploads/2024/11/explorer-1-1024x1024.png'
				}
				className="image-holder"
			/>
		</section>
	);
}
