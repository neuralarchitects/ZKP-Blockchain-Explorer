import React from "react";
import ResponsiveTable from "../Table";
import { formatDateTime } from "../../../utility/functions";
import "./style.scss";
import { useNavigate } from "react-router-dom";

function transformZkpToArray(zkps) {
  return zkps.map((zkp) => [
    zkp.deviceType,
    zkp.deviceId || "",
    formatDateTime(new Date(zkp.timestamp * 1000)) || "",
    zkp.nodeId || "",
    zkp.transactionHash || "",
  ]);
}

export default function ZkpTable({ data }) {
  const navigateTo = useNavigate();

  function handleCellClick(row, col, item, fullRowData) {
    if (col === 4 /* && fullRowData[4].props.children === 'Transaction' */) {
      const encodedHash = encodeURIComponent(item);
      navigateTo(`/tx/${encodedHash}`);
    }
  }
  return (
    <ResponsiveTable
      morePadding={true}
      conditionalOverrides={[
        {
          rowExist: true,
          columnToApplyClass: 4,
          className: "transaction-hash-label",
        },
      ]}
      onCellClick={handleCellClick}
      titles={[
        "Device Type",
        "Device Id",
        "Submission Date",
        "Node Id",
        "Transaction Id",
      ]}
      pagination={false}
      data={[...transformZkpToArray(data)]}
      itemsPerPage={10}
    />
  );
}
