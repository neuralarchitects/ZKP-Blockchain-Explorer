import React from "react";
import ResponsiveTable from "../Table";
import { formatDateTime } from "../../../utility/functions";
import "./style.scss";
import { useNavigate } from "react-router-dom";

function transformCommitmentToArray(commitments) {
  return commitments.map((commitment) => {
    const eventType = commitment.eventType || "";

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
      commitment.iot_device_name,
      commitment.iot_manufacturer_name || "",
      commitment.commitmentID || "",
      formatDateTime(new Date(commitment.timestamp * 1000)) || "",
      commitment.nodeId || "",
      commitment.transactionHash || "",
      [
        isZKP && !isDevice && "IoT Data & ZKP",
        /* isZKP && "ZKP",
        (isTransaction || isZKP) && "Transaction Details", */
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

export default function CommitmentTable({ data, ...props }) {
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
      {...props}
    />
  );
}
