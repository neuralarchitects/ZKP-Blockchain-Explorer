import React, { useState } from "react";
import "./style.scss";
import { Skeleton } from "@mui/material";

const ImageLoader = ({ src, alt, className = "", height, width }) => {
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
					width={width ? width :"100px"}
					height={height ? height :"100px"}
					className={`${className}`}
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

export default ImageLoader;
