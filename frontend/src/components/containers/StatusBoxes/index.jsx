import React from 'react';
import './style.scss';
import StatusBox from '../../ui/StatusBox';
import BoxIcon from '../../../icons/box';
import TransactionIcon from '../../../icons/transaction';
import {
	HiCheck,
	HiOutlineCash,
	HiOutlineSwitchHorizontal,
	HiOutlineViewGrid,
} from 'react-icons/hi';

export default function StatusBoxes({
	serviceDeviceCount,
	zkpCount,
	blockChainCount,
	dailyTransactions,
}) {
	return (
		<section className="status-container">
			<StatusBox
				color={'#FDE1AC'}
				loading={!serviceDeviceCount ? true : false}
				Icon={TransactionIcon}
				title={'Protocol Operations'}
				value={serviceDeviceCount}
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
			<StatusBox
				color={'#dedede'}
				loading={!serviceDeviceCount ? true : false}
				Icon={HiOutlineViewGrid}
				iconClass={'check-icon'}
				title={'Total Blocks'}
				value={blockChainCount}
			/>
			<StatusBox
				color={'#aedede'}
				loading={!serviceDeviceCount ? true : false}
				Icon={HiOutlineCash}
				iconClass={'check-icon'}
				title={'Total Transactions'}
				value={dailyTransactions}
			/>
		</section>
	);
}
