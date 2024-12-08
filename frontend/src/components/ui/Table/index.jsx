import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import './style.scss';

const ResponsiveTable = ({
	titles,
	data,
	onCellClick,
	onActionClick,
	actions = false,
	truncateLength = 20,
	truncateColumns = [],
	pagination = false,
	itemsPerPage = 10,
}) => {
	const [menuAnchor, setMenuAnchor] = useState(null);
	const [activeRow, setActiveRow] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(data.length / itemsPerPage);

	const truncateText = (text) => {
		if (typeof text !== 'string') return text;
		return text.length > truncateLength
			? text.slice(0, truncateLength) + '...'
			: text;
	};

	const handleMenuOpen = (event, rowIndex) => {
		setMenuAnchor(event.currentTarget);
		setActiveRow(rowIndex);
	};

	const handleMenuClose = () => {
		setMenuAnchor(null);
		setActiveRow(null);
	};

	const handleDropdownClick = (action, items) => {
		if (onActionClick) {
			onActionClick(action, items, activeRow);
		}
		handleMenuClose();
	};

	const handlePageChange = (page) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const renderPagination = () => {
		const pages = [];

		// Always show the first and last pages
		pages.push(
			<button
				key={1}
				onClick={() => handlePageChange(1)}
				disabled={1 === currentPage}
				className={`pagination ${1 === currentPage ? 'active' : ''}`}
			>
				1
			</button>
		);

		if (currentPage > 3) {
			pages.push(
				<span
					key="ellipsis1"
					className="pagination pagination-ellipsis"
				>
					...
				</span>
			);
		}

		// Show the adjacent pages
		for (
			let i = Math.max(2, currentPage - 1);
			i <= Math.min(currentPage + 1, totalPages - 1);
			i++
		) {
			pages.push(
				<button
					key={i}
					onClick={() => handlePageChange(i)}
					disabled={i === currentPage}
					className={`pagination ${
						i === currentPage ? 'active' : ''
					}`}
				>
					{i}
				</button>
			);
		}

		if (currentPage < totalPages - 2) {
			pages.push(
				<span
					key="ellipsis2"
					className="pagination pagination-ellipsis"
				>
					...
				</span>
			);
		}

		if (totalPages > 1) {
			pages.push(
				<button
					key={totalPages}
					onClick={() => handlePageChange(totalPages)}
					disabled={totalPages === currentPage}
					className={`pagination ${
						totalPages === currentPage ? 'active' : ''
					}`}
				>
					{totalPages}
				</button>
			);
		}

		return (
			<div className="pagination-container">
				<button
					onClick={handlePrevious}
					disabled={currentPage === 1}
					className="pagination"
				>
					<HiArrowLeft />
				</button>
				{pages}
				<button
					onClick={handleNext}
					disabled={currentPage === totalPages}
					className="pagination"
				>
					<HiArrowRight />
				</button>
			</div>
		);
	};

	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

	const renderTableRows = (rows) =>
		rows.map((row, rowIndex) => {
			const visibleCells = actions ? row.slice(0, -1) : row;
			const actionItems = actions ? row[row.length - 1] : null;

			return (
				<TableRow key={rowIndex}>
					{visibleCells.map((cell, cellIndex) => (
						<TableCell
							key={cellIndex}
							onClick={() => {
								if (onCellClick) {
									onCellClick(rowIndex, cellIndex, cell);
								}
							}}
							className="table-cell"
						>
							{truncateColumns.includes(cellIndex)
								? truncateText(cell)
								: cell}
						</TableCell>
					))}
					{actions && (
						<TableCell>
							<IconButton
								onClick={(e) => handleMenuOpen(e, rowIndex)}
							>
								<MoreVertIcon />
							</IconButton>
							{activeRow === rowIndex && (
								<Menu
									anchorEl={menuAnchor}
									open={Boolean(menuAnchor)}
									onClose={handleMenuClose}
								>
									{(actionItems || []).map((item, index) => (
										<MenuItem
											key={index}
											className="action-item"
											onClick={() =>
												handleDropdownClick(item, row)
											}
											sx={{
												justifyContent: 'center', // Center the text horizontally
												textAlign: 'center',     // Align text inside the MenuItem
											  }}
										>
											{item}
										</MenuItem>
									))}
								</Menu>
							)}
						</TableCell>
					)}
				</TableRow>
			);
		});

	return (
		<div className="responsive-table-container">
			<TableContainer component={Paper} className="responsive-table">
				<Table>
					<TableHead>
						<TableRow>
							{titles.map((title, index) => (
								<TableCell key={index} className="table-header">
									{title}
								</TableCell>
							))}
							{actions && (
								<TableCell className="table-header">
									Actions
								</TableCell>
							)}
						</TableRow>
					</TableHead>
					<TableBody>{renderTableRows(paginatedData)}</TableBody>
				</Table>
			</TableContainer>
			{pagination && renderPagination()}
		</div>
	);
};

export default ResponsiveTable;
