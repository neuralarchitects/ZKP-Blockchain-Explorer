import React, { useEffect, useState } from "react";
import "./style.scss";
import { useNavigate, useParams } from "react-router-dom";
import useFetchData from "../../services/api/useFetchData";
import TransactionIcon from "../../icons/transaction";
import CopyIcon from "../../icons/copy";
import {
	copyText,
	formatBigInt,
	formatUnixTimestamp,
	timeStamptimeAgo,
} from "../../utility/functions";
import { Toaster } from "react-hot-toast";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import { HiCheckCircle, HiOutlineClock } from "react-icons/hi";
import GradientCircle from "../../components/ui/GradientCircle";

export default function TransactionDetail() {
	const { fetchData, loading } = useFetchData();
	const [detailData, setDetailData] = useState({});
	const { id } = useParams();
	const decodedId = decodeURIComponent(id);
	const navigateTo = useNavigate();

	async function getTransactionDetail() {
		const res = await fetchData(`contract/search-data?search=${decodedId}`);
		if (res.data.length > 0) {
			setDetailData(res.data[0]);
		} else {
			setDetailData(false);
			navigateTo("/");
		}
	}

	useEffect(() => {
		getTransactionDetail();
	}, [decodedId]);

	/* 
    data_payload: '{"FV":2,"HV":1,"Root":true,"Temperature":29,"Humidity":33.7,"Button":"Pressed"}';
	deviceId: "QTA6NzY6NEU6NTc6RkQ6QjQ=";
	deviceType: "E_CARD";
	eventType: "ZKPStored";
	firmwareVersion: "2";
	from: "0x7A49B1E20b646d9c8C4080930F96AcbF5489D870";
	gasFee: 7502510000000000;
	hardwareVersion: "1";
	nodeId: "zkiot.tech";
	timestamp: 1727616579;
	to: "0xCFC00106081c541389D449183D4EEADF5d895D37";
	transactionHash: "05e4ebeac4e5b186cb590c542b2a95cbd1df2ce58539baebaf3ea8916470ea87";
	unixtime_payload: "1727616576";
	zkp_payload: "\"['0x1f8860197285a3ddfbc89f5a2aa2cbb4cd210ad28bf09cd5008bac5421f9561c', '0x19547b93d12bf7a3d010aee87a1062e38e27cb9afff12fe9042d626834a920c2'],[['0x03fffba13c24f0a7b739de0e926ae7f4f5c0d07faf3d7802d9fe537155de84a7', '0x22b4496c8d7ba69dff30aa79c50ca2325548f8927b8fa6548223da7dffbed375'],['0x0d5830c0da1666254bda8efdbb144bcdfead2806116146e40d69e231bb0d1e43', '0x0faf1409faac394c0ba73fddc3ab0dd8311d187713365caf89fdbc58a91c91b4']],['0x00edc9bcbeb8d724be20194c42df57da2cc98d1fad415db34ad617563feaf9c6', '0x0fad053f3d9c409eee48e98a3a4b55ac89e9f60994ec2ed7d32efb3d0fa55b70'],['0x2f54fa38f46e70bc2972399eab1561f328de7f3fd318df6c068b635ccd6ebc46']\"";
	_id: "66f9564315fca06102e48360"; 
    
    */

	return (
		<main className="transaction-detail-container">
			<h1>Transaction details</h1>
			<Toaster />
			{loading == false && detailData != false && (
				<>
					<div className="hash-holder">
						<TransactionIcon className={"icon"} />
						<p>{detailData.transactionHash}</p>
						<CopyIcon
							onClick={() =>
								copyText(
									detailData.transactionHash,
									"Transaction Hash"
								)
							}
							className={"icon copy"}
						/>
					</div>
					<div className="grid-container">
						<p className="title">Transaction hash</p>
						<div className="hash-holder">
							<p>{detailData.transactionHash}</p>
							<CopyIcon
								onClick={() =>
									copyText(
										detailData.transactionHash,
										"Transaction Hash"
									)
								}
								className={"icon copy"}
							/>
						</div>

						<p className="title">Status and method</p>

						<div className="badge-holder">
							<Badge
								Icon={HiCheckCircle}
								color={"#23543E"}
								text={"Success"}
							/>
						</div>

						<p className="title">Timestamp</p>
						<div className="timestamp-holder">
							<HiOutlineClock className="icon" />
							<p className="right-data">
								{timeStamptimeAgo(detailData.timestamp)}{" "}
								<span>|</span>{" "}
								{formatUnixTimestamp(detailData.timestamp)}{" "}
								<span>{`| Confirmed within <= 4 secs`}</span>
							</p>
						</div>

						<div className="line"></div>

						<p className="title">From</p>
						<div className="wallet-holder">
							<GradientCircle width={24} height={24} />
							<p
								onClick={() =>
									copyText(detailData.from, "Wallet")
								}
							>
								{detailData.from}
							</p>
							<CopyIcon
								onClick={() =>
									copyText(detailData.from, "Wallet")
								}
								className="icon"
							/>
						</div>

						<p className="title">To</p>
						<div className="wallet-holder">
							<GradientCircle width={24} height={24} />
							<p
								onClick={() =>
									copyText(detailData.to, "Wallet")
								}
							>
								{detailData.to}
							</p>
							<CopyIcon
								onClick={() =>
									copyText(detailData.to, "Wallet")
								}
								className="icon"
							/>
						</div>

						<div className="line"></div>

						<p className="title">Value</p>
						<p className="right-data">0 FDS</p>

						<p className="title">Transaction fee</p>
						<p className="right-data">
							{formatBigInt(detailData.gasFee)} FDS
						</p>
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
