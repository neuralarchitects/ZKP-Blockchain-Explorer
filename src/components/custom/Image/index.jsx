import React, { useState } from "react";
import "./style.css";
import { Skeleton } from "@mui/material";

const Image = ({ src, alt, className = "" }) => {
	const [loading, setLoading] = useState(true);

	const handleImageLoaded = () => {
		setLoading(false);
	};

	return (
		<>
			{loading && (
				<Skeleton
					sx={{ bgcolor: "grey.800" }}
					variant="rounded"
					animation={"pulse"}
					width={"50%"}
					height={"200px"}
				/>
			)}

			<img
				src={src}
				alt={alt}
				onLoad={handleImageLoaded}
				className={`${className} image ${loading ? "hidden" : ""}`}
			/>
		</>
	);
};

export default Image;
