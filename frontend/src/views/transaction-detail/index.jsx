import React, { useEffect, useState } from 'react';
import './style.scss';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchData from '../../services/api/useFetchData';
import TransactionIcon from '../../icons/transaction';
import CopyIcon from '../../icons/copy';
import {
	copyText,
	formatBigInt,
	formatUnixTimestamp,
	timeStamptimeAgo,
} from '../../utility/functions';
import { Toaster } from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { HiCheckCircle, HiOutlineClock } from 'react-icons/hi';
import GradientCircle from '../../components/ui/GradientCircle';
import JsonDisplay from '../../components/ui/JsonDisplay';

export default function TransactionDetail() {
	const { fetchData, loading } = useFetchData();
	const [detailData, setDetailData] = useState({});
	const { id } = useParams();
	const decodedId = decodeURIComponent(id);
	const navigateTo = useNavigate();

	async function getTransactionDetail() {
		const res = await fetchData(
			`contract/search-data?search=${encodeURIComponent(id)}`
		);

		if (res.data.length > 0) {
			const selectedItem =
				res.data.find((item) => item.commitmentData) || res.data[0];

			setDetailData(selectedItem);
		} else {
			setDetailData(false);
			navigateTo('/');
		}
	}

	useEffect(() => {
		getTransactionDetail();
	}, [decodedId]);

	return (
		<main className="transaction-detail-container">
			<h1 className="main-header">Transaction Details</h1>
			<Toaster />
			{loading == false && detailData != false && (
				<>
					{/* <div className="hash-holder">
						<TransactionIcon className={'icon'} />
						<p>{detailData.transactionHash}</p>
						<CopyIcon
							onClick={() =>
								copyText(
									detailData.transactionHash,
									'Transaction Hash'
								)
							}
							className={'icon copy'}
						/>
					</div> */}
					<div className="grid-container">
						<p className="title">Transaction hash</p>
						<div className="hash-holder">
							<p>{detailData.transactionHash}</p>
							<CopyIcon
								onClick={() =>
									copyText(
										detailData.transactionHash,
										'Transaction Hash'
									)
								}
								className={'icon copy'}
							/>
						</div>

						<p className="title">Status and method</p>

						<div className="badge-holder">
							<Badge
								Icon={HiCheckCircle}
								color={'#23543E'}
								text={'Success'}
							/>
						</div>

						<p className="title">Timestamp</p>
						<div className="timestamp-holder">
							<HiOutlineClock className="icon" />
							<p className="right-data">
								{timeStamptimeAgo(
									detailData?.timestamp ||
										detailData?.transactionTime
								)}{' '}
								<span>|</span>{' '}
								{formatUnixTimestamp(
									detailData?.timestamp ||
										detailData?.transactionTime
								)}{' '}
								<span>{`| Confirmed within <= 4 secs`}</span>
							</p>
						</div>

						<div className="line"></div>

						<p className="title">From</p>
						<div className="wallet-holder">
							<GradientCircle width={24} height={24} />
							<p
								onClick={() =>
									copyText(detailData.from, 'Wallet')
								}
							>
								{detailData.from}
							</p>
							<CopyIcon
								onClick={() =>
									copyText(detailData.from, 'Wallet')
								}
								className="icon"
							/>
						</div>

						<p className="title">To</p>
						<div className="wallet-holder">
							<GradientCircle width={24} height={24} />
							<p
								onClick={() =>
									copyText(detailData.to, 'Wallet')
								}
							>
								{detailData.to}
							</p>
							<CopyIcon
								onClick={() =>
									copyText(detailData.to, 'Wallet')
								}
								className="icon"
							/>
						</div>

						<div className="line"></div>

						<p className="title">Value</p>
						<p className="right-data">
							{detailData?.value || 0} FDS
						</p>

						<p className="title">Transaction fee</p>
						<p className="right-data">
							{formatBigInt(detailData.gasFee)} FDS
						</p>

						{detailData?.commitmentData && (
							<>
								<div className="line"></div>

								<h1>Commitment Details</h1>
								<p></p>

								<p className="title">Commitment ID</p>
								<p className="right-data">
									{detailData.commitment_id}
								</p>

								<p className="title">IoT Developer Name</p>
								<p className="right-data">
									{detailData.iot_developer_name}
								</p>

								<p className="title">IoT Device Name</p>
								<p className="right-data">
									{detailData.iot_device_name}
								</p>

								<p className="title">Device Hardware Version</p>
								<p className="right-data">
									{detailData.device_hardware_version}
								</p>

								<p className="title">Device Firmware Version</p>
								<p className="right-data">
									{detailData.firmware_version}
								</p>
								<p className="title">Commitment Data</p>
								<p className="right-data commitment-data">
									<JsonDisplay
										jsonData={JSON.parse(
											detailData.commitmentData
										)}
									/>
								</p>
							</>
						)}
					</div>
				</>
			)}
			{loading == true && (
				<div className="loading-container">
					<Spinner type="rotate" />
				</div>
			)}
		</main>
	);
}
