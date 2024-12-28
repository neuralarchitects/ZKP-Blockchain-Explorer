import { HiChip } from 'react-icons/hi';
import DevicesSlideShow from '../../ui/DevicesSlideShow';
import './style.scss';

export default function ZkpDevices() {
	return (
		<main className="zkp-devices-container">
			<div className="zkp-devices-header">
				<HiChip className="logo" />
				<h1>ZKP Devices</h1>
			</div>
			<DevicesSlideShow />
		</main>
	);
}
