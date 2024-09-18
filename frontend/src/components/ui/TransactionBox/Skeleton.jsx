import React from "react";
import "./style.scss";
import AnimatedComponent from "../Animated/Component";
import { iphoneAnimation } from "../../../utility/framer-transitions";
import { Skeleton } from "@mui/material";

export default function TransactionBoxSkeleton() {
	return (
		<AnimatedComponent
			animation={iphoneAnimation(0.5)}
			className="transaction-box-container"
		>
			<div className="left-data">
				<div className="badge">
					<Skeleton
						sx={{ bgcolor: "grey.800" }}
						variant="rounded"
						animation={"pulse"}
						width={"50%"}
					/>
					<Skeleton
						sx={{ bgcolor: "grey.800" }}
						variant="rounded"
						animation={"pulse"}
						width={"50%"}
					/>
				</div>

				<Skeleton
					sx={{ bgcolor: "grey.800" }}
					variant="rounded"
					animation={"pulse"}
					className="transaction-hash"
				/>
			</div>

			<Skeleton
				sx={{ bgcolor: "grey.800" }}
				variant="rounded"
				animation={"pulse"}
				className="transaction-time"
			/>

			<div className="transaction-wallets">
				<div className="wallet">
					<Skeleton
						sx={{ bgcolor: "grey.800" }}
						variant="rounded"
						animation={"pulse"}
						className="icon"
					/>
					<Skeleton
						sx={{ bgcolor: "grey.800" }}
						variant="circular"
						animation={"pulse"}
						width={24}
						height={24}
					/>

					<Skeleton
						sx={{ bgcolor: "grey.800" }}
						variant="rounded"
						animation={"pulse"}
						width={"25%"}
					/>
					<Skeleton
						sx={{ bgcolor: "grey.800" }}
						variant="rounded"
						animation={"pulse"}
						className="icon copy"
					/>
				</div>
				<div className="wallet">
					<Skeleton
						sx={{ bgcolor: "grey.800" }}
						variant="rounded"
						animation={"pulse"}
						className="icon start"
					/>
					<Skeleton
						sx={{ bgcolor: "grey.800" }}
						variant="rounded"
						animation={"pulse"}
						width={"25%"}
					/>

					<Skeleton
						sx={{ bgcolor: "grey.800" }}
						variant="rounded"
						animation={"pulse"}
						className="icon copy"
					/>
				</div>
			</div>

			<div className="button-container">
				<Skeleton
					sx={{ bgcolor: "grey.800" }}
					variant="rounded"
					animation={"pulse"}
					className="button skeleton"
				/>
				<Skeleton
					sx={{ bgcolor: "grey.800" }}
					variant="rounded"
					animation={"pulse"}
					className="button skeleton"
				/>
				<Skeleton
					sx={{ bgcolor: "grey.800" }}
					variant="rounded"
					animation={"pulse"}
					className="button skeleton"
				/>
			</div>

			<div className="transaction-value">
				<div className="holder">
					<Skeleton
						sx={{ bgcolor: "grey.800" }}
						variant="rounded"
						animation={"pulse"}
						width={"100%"}
					/>
					<Skeleton
						sx={{ bgcolor: "grey.800" }}
						variant="rounded"
						animation={"pulse"}
						width={"100%"}
					/>
					<Skeleton
						sx={{ bgcolor: "grey.800" }}
						variant="rounded"
						animation={"pulse"}
						width={"100%"}
					/>
					<Skeleton
						sx={{ bgcolor: "grey.800" }}
						variant="rounded"
						animation={"pulse"}
						width={"100%"}
					/>
				</div>
			</div>
		</AnimatedComponent>
	);
}
