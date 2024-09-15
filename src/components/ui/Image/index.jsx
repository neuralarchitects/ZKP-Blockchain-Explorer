import React, { useState } from "react";
import "./style.scss";
import { Skeleton } from "@mui/material";

const ImageLoader = ({ src, alt, className = "" }) => {
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

export default ImageLoader;
