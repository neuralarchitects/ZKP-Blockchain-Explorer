import { useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useFetchData = () => {
	const [loading, setLoading] = useState(false); // Loading state
	const [error, setError] = useState(null); // Error state

	// Function to fetch data with caching mechanism
	const fetchData = async (
		endpoint,
		{
			method = "GET",
			headers = {},
			body = null,
			params = {},
			cacheDuration = 0, // Cache duration in milliseconds (default: no cache)
		} = {}
	) => {
		setLoading(true);
		setError(null);

		// Construct URL with query params
		const url = new URL(`${API_BASE_URL}${endpoint}`);
		Object.keys(params).forEach((key) =>
			url.searchParams.append(key, params[key])
		);

		// Check if there's cached data and it's still valid
		const cacheKey = `${url.toString()}:${method}`; // Unique cache key based on URL and method
		const cachedData = localStorage.getItem(cacheKey);
		if (cachedData) {
			const { data, timestamp } = JSON.parse(cachedData);
			const isCacheValid =
				new Date().getTime() - timestamp < cacheDuration;

			// If cache is valid, return the cached data
			if (isCacheValid) {
				setLoading(false);
				return data;
			} else {
				// Cache has expired, remove it
				localStorage.removeItem(cacheKey);
			}
		}

		try {
			// Set default headers and merge with custom headers
			const config = {
				method,
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
			};

			// Add body if present and not a GET request
			if (body && method !== "GET") {
				config.body = JSON.stringify(body);
			}

			const response = await fetch(url, config);

			// Check if response is ok (status in the range 200-299)
			if (!response.ok) {
				const errorDetails = await response.json();
				throw new Error(
					`Error: ${response.status} - ${
						response.statusText
					}. Details: ${errorDetails.message || "No details"}`
				);
			}

			// If the response is successful, parse the JSON and return
			const data = await response.json();

			// Store the result in cache if cacheDuration is provided
			if (cacheDuration > 0) {
				localStorage.setItem(
					cacheKey,
					JSON.stringify({ data, timestamp: new Date().getTime() })
				);
			}

			return data;
		} catch (error) {
			setError(error.message); // Set error state
			throw error;
		} finally {
			setLoading(false); // End loading state
		}
	};

	return { fetchData, loading, error };
};

export default useFetchData;
