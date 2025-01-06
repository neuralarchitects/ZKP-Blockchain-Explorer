import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // You can change the theme
import { useEffect, useState } from 'react';
import './style.css';

const JsonDisplay = ({ jsonData }) => {
	const [parsedJson, setParsedJson] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		try {
			const parsed =
				typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
			setParsedJson(JSON.stringify(parsed, null, 2)); // Pretty-print the JSON if valid
			setError(null); // Clear any previous errors
		} catch (e) {
			setParsedJson(null); // Clear the displayed JSON if parsing fails
			setError('Invalid JSON format');
		}
	}, [jsonData]); // Only run this effect when jsonData changes

	return (
		<>
			{error ? (
				<div className="json-display-container">{error}</div>
			) : (
				parsedJson && (
					<div className="syntax-highlighter">
						<SyntaxHighlighter language="json" style={atomDark}>
							{parsedJson}
						</SyntaxHighlighter>
					</div>
				)
			)}
		</>
	);
};

export default JsonDisplay;
