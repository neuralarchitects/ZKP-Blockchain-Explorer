import React from 'react';
import './style.scss';
import StatusBox from '../../ui/StatusBox';
import BoxIcon from '../../../icons/box';
import TransactionIcon from '../../../icons/transaction';
import { HiCheck, HiOutlineCash, HiOutlineViewGrid } from 'react-icons/hi';
import { BiServer } from 'react-icons/bi';

export default function StatusBoxes({
	totalOperations,
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
				iconClass={'check-icon'}
				title={'Protocol Operations'}
				value={totalOperations}
			/>
			<StatusBox
				color={'#f7d4fb'}
				loading={!serviceDeviceCount ? true : false}
				Icon={BiServer}
				title={'Services / Devices'}
				iconClass={'check-icon'}
				value={serviceDeviceCount}
			/>
			<StatusBox
				color={'#BAE5F5'}
				loading={!serviceDeviceCount ? true : false}
				Icon={BoxIcon}
				iconClass={'check-icon'}
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
