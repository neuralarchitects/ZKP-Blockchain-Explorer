import './style.scss';
import packageJson from '@/../../package.json';

export default function Footer() {
	return (
		<div className="footer-comp">
			<span>
				&copy; {`${new Date().getFullYear()}`}{' '}
				<strong>Fidesinnova</strong>. All rights reserved. (v
				{packageJson.version})
			</span>
			<div className="">
				<a
					className="text-gray"
					target="_blank"
					href="https://fidesinnova.io/privacy/"
				>
					Privacy & Policy
				</a>
			</div>
		</div>
	);
}
