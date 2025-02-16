import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Paper from "@mui/material/Paper";
import "./style.scss";
import { Button, TableContainer } from "@mui/material";
import { BsDatabaseFill } from "react-icons/bs";
import { PiGearFineBold } from "react-icons/pi";
import { MdPermDeviceInformation } from "react-icons/md";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

const ResponsiveTable = ({
  morePadding = false,
  className = "",
  titles,
  data,
  onCellClick,
  onActionClick,
  actions = false,
  truncateLength = 20,
  truncateColumns = [],
  pagination = false,
  itemsPerPage = 10,
  conditionalOverrides = [],
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [columns, setColumns] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const actionIcons = {
    "IoT Data & ZKP": <BsDatabaseFill />,
    "Service Details": <PiGearFineBold />,
    "Device Details": <MdPermDeviceInformation />,
    "Verify Proof": <IoShieldCheckmarkSharp />,
  };

  const actionWidth = 100;
  const sideBarWidth = 300;

  const defaultColumnSizes = useMemo(() => {
    // Calculate the total number of columns, including the actions column if needed
    const columnCount = titles.length;
    console.log("columnCount:", columnCount);

    // Get the viewport width
    const viewportWidth = window.innerWidth - sideBarWidth - actionWidth;

    // Calculate the width for each column, including the actions column
    const columnSizes = titles.reduce(
      (acc, _, index) => ({
        ...acc,
        [index]: viewportWidth / columnCount,
      }),
      {}
    );

    // Add the actions column if it exists
    if (actions) {
      columnSizes[titles.length] = actionWidth; // Add the actions column
    }

    return columnSizes;
  }, [titles, actions]); // Ensure `actions` is in the dependency array

  useEffect(() => {
    let cols = titles.map((title, index) => ({
      header: title,
      accessorFn: (row) => row[index],
      id: index.toString(),
      size: defaultColumnSizes[index] || 150, // Default column size
      enableResizing: titles.length - 1 == index && !actions ? false : true,
    }));

    console.log("defaultColumnSizes:", defaultColumnSizes);

    if (actions) {
      cols.push({
        header: "Actions",
        id: "actions",
        size: defaultColumnSizes[4], // Default column size
        enableResizing: false,
        cell: ({ row }) => {
          const actionItems = row.original[row.original.length - 1];

          return (
            <div className="actions-cell">
              {actionItems?.map((item, index) => (
                <p
                  className="action-item"
                  onClick={() => {
                    console.log("row.original:", row.original);

                    handleDropdownClick(item, row.original);
                  }}
                >
                  {actionIcons[String(item)] ? actionIcons[String(item)] : item}
                </p>
              ))}
            </div>
          );
        },
      });
    }
    setColumns(cols);
  }, [activeRow]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility: {
        actions: actions,
      },
    },
    ...(pagination && {
      getPaginationRowModel: getPaginationRowModel(),
      initialState: { pagination: { pageSize: itemsPerPage } },
    }),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  const truncateText = (text) => {
    if (typeof text !== "string") return text;
    return text.length > truncateLength
      ? text.slice(0, truncateLength) + "..."
      : text;
  };

  const handleMenuOpen = (event, rowIndex) => {
    console.log("rowIndex setted:", rowIndex);
    setActiveRow(rowIndex);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setActiveRow(null);
    setMenuAnchor(null);
  };

  const handleDropdownClick = (action, items) => {
    if (onActionClick) {
      onActionClick(action, items, activeRow);
    }
    handleMenuClose();
  };

  const handleMouseDown = () => {
    setStartTime(Date.now());
  };

  const getClassName = (row, columnId) => {
    for (const override of conditionalOverrides) {
      const { rowExist, columnToApplyClass, className } = override;
      const existsInRow = row.original.some((item) => {
        if (typeof item === "string") return item === String(rowExist);
        if (typeof item === "object" && item?.type === "span")
          return item.props.children === String(rowExist);
        return false;
      });

      if (
        (existsInRow || rowExist === true) &&
        columnId === columnToApplyClass.toString()
      ) {
        return className;
      }
    }
    return "";
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
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();

    const handlePageChange = (page) => {
      table.setPageIndex(page - 1);
    };

    const pages = [];
    pages.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        disabled={1 === currentPage}
        className={`pagination ${1 === currentPage ? "active" : ""}`}
      >
        1
      </button>
    );

    if (currentPage > 3) {
      pages.push(
        <span key="ellipsis1" className="pagination pagination-ellipsis">
          ...
        </span>
      );
    }

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
          className={`pagination ${i === currentPage ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="ellipsis2" className="pagination pagination-ellipsis">
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
          className={`pagination ${totalPages === currentPage ? "active" : ""}`}
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

  return (
    <div className="responsive-table-container can-select">
      <TableContainer
        component={Paper}
        className={`responsive-table ${morePadding && "no-action"}`}
      >
        <div className="MuiTable-root">
          <div className="thead">
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="tr">
                {headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className="th table-header"
                    style={{
                      width: header.getSize(),
                      position: "relative",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.columnDef.enableResizing && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className="resizer"
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="tbody">
            {table.getRowModel().rows.map((row) => (
              <div key={row.id} className="tr">
                {row.getVisibleCells().map((cell) => {
                  const column = cell.column;
                  const cellValue = cell.getValue();
                  const shouldTruncate = truncateColumns.includes(
                    parseInt(column.id)
                  );

                  if (cellValue == undefined) {
                    return (
                      <div key={cell.id}>
                        {flexRender(column.columnDef.cell, cell.getContext())}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={cell.id}
                      className={`td ${getClassName(row, column.id)}`}
                      onMouseDown={handleMouseDown}
                      onMouseUp={() => {
                        const clickDuration = Date.now() - startTime;
                        if (clickDuration <= 200 && onCellClick) {
                          onCellClick(
                            row.index,
                            parseInt(column.id),
                            cellValue,
                            row.original
                          );
                        }
                      }}
                      style={{
                        width: column.getSize(),
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {shouldTruncate ? truncateText(cellValue) : cellValue}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </TableContainer>
      {pagination && renderPagination()}
    </div>
  );
};

export default ResponsiveTable;
