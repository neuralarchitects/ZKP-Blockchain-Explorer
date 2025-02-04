import React from "react";
import ResponsiveTable from "../Table";
import { formatDateTime } from "../../../utility/functions";
import "./style.scss";
import { useNavigate } from "react-router-dom";

function transformCommitmentToArray(commitments) {
  return commitments.map((commitment) => [
    commitment.iot_device_name,
    commitment.iot_manufacturer_name || "",
    commitment.commitmentID || "",
    formatDateTime(new Date(commitment.timestamp * 1000)) || "",
    commitment.nodeId || "",
    commitment.transactionHash || "",
  ]);
}

export default function CommitmentTable({ data }) {
  const navigateTo = useNavigate();

  function handleCellClick(row, col, item, fullRowData) {
    if (col === 5 /* && fullRowData[4].props.children === 'Transaction' */) {
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
          columnToApplyClass: 5,
          className: "transaction-hash-label",
        },
      ]}
      onCellClick={handleCellClick}
      titles={[
        "Device Name",
        "Developer Name",
        "Commitment Id",
        "Creation Date",
        "Node Id",
        "Transaction Id",
      ]}
      pagination={false}
      data={[...transformCommitmentToArray(data)]}
      itemsPerPage={10}
    />
  );
}
