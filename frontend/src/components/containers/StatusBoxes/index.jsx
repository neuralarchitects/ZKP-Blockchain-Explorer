import React from 'react';
import './style.scss';
import StatusBox from '../../ui/StatusBox';
import BoxIcon from '../../../icons/box';
import TransactionIcon from '../../../icons/transaction';
import { HiCheck } from 'react-icons/hi';

export default function StatusBoxes({ serviceDeviceCount, zkpCount }) {
	return (
		<section className="status-container">
			<StatusBox
				color={'#FDE1AC'}
				loading={!serviceDeviceCount ? true : false}
				Icon={TransactionIcon}
				title={'Protocol Operations'}
				value={serviceDeviceCount + zkpCount}
			/>
			<StatusBox
				color={'#BAE5F5'}
				loading={!serviceDeviceCount ? true : false}
				Icon={BoxIcon}
				title={'ZKPs'}
				value={zkpCount}
			/>
			<StatusBox
				color={'#CCEFBF'}
				loading={!serviceDeviceCount ? true : false}
				Icon={HiCheck}
				iconClass={'check-icon'}
				title={'Device Commitments'}
				value={15}
			/>
		</section>
	);
}
