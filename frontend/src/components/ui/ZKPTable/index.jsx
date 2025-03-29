import React from "react";
import ResponsiveTable from "../Table";
import { formatDateTime } from "../../../utility/functions";
import "./style.scss";
import { useNavigate } from "react-router-dom";

function transformZkpToArray(zkps) {
  return zkps.map((zkp) => {
    const eventType = zkp.eventType || "";

    let isZKP = false;
    let isDevice = false;
    let isTransaction = false;
    let isCommitment = false;

    if (String(eventType) === "ZKPStored") {
      isZKP = true;
    } else if (
      String(eventType) === "DeviceCreated" ||
      String(eventType) === "DeviceRemoved"
    ) {
      isDevice = true;
    } else if (String(eventType) === "Transaction") {
      isTransaction = true;
    } else if (String(eventType) === "CommitmentStored") {
      isCommitment = true;
    }

    return [
      zkp.deviceType || "",
      zkp.deviceId || "",
      formatDateTime(new Date(zkp.timestamp * 1000)) || "",
      zkp.nodeId || "",
      zkp.transactionHash || "",
      [
        isZKP && !isDevice && "IoT Data & ZKP",
        /* isZKP && "ZKP", */
        /* (isTransaction || isZKP) && "Transaction Details", */
        !isZKP &&
          !isDevice &&
          !isTransaction &&
          !isCommitment &&
          "Service Details",
        !isZKP && isDevice && "Device Details",
        isZKP && "Verify Proof",
        /* isCommitment && "Commitment Data", */
      ].filter(Boolean),
    ];
  });
}

export default function ZkpTable({ data, ...props }) {
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
      {...props}
    />
  );
}
