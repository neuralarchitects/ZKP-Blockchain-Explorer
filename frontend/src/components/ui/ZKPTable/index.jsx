import React from "react";
import ResponsiveTable from "../Table";
import { formatDateTime } from "../../../utility/functions";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import useFetchData from "../../../services/api/useFetchData";

function transformZkpToArray(zkps) {
  return zkps.map((zkp) => {
    const eventType = zkp.eventType || "";
    let theZKP = "";
    try {
      theZKP = JSON.parse(zkp?.zkpPayload);
    } catch (error) {
      console.log("Error while parsing zkp payload:", error);
    }
    try {
      theZKP = JSON.parse(theZKP);
    } catch (error) {
      console.log("Error while parsing zkp payload:", error);
    }

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
      theZKP?.commitmentId || "",
      zkp?.deviceId[zkp?.deviceId.length - 1] == "=" ? atob(zkp?.deviceId) : zkp?.deviceId,
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
  const { fetchData, loading } = useFetchData();

  async function handleCellClick(row, col, item, fullRowData) {
    if (col === 4 /* && fullRowData[4].props.children === 'Transaction' */) {
      const encodedHash = encodeURIComponent(item);
      navigateTo(`/tx/${encodedHash}`);
    } else if (col === 0) {
      if (loading) {
        console.log("Wait");
        return false;
      }
      const res = await fetchData(
        `contract/search-data?search=${encodeURIComponent(
          item
        )}&page=${1}&limit=${10}`
      );
      res.data.data.forEach((item) => {
        if (item.commitment && item.commitmentId) {
          navigateTo(`/tx/${item.transactionHash}`);
        }
      });
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
        {
          rowExist: true,
          columnToApplyClass: 0,
          className: "transaction-hash-label",
        },
      ]}
      actions={true}
      onCellClick={handleCellClick}
      titles={[
        "Commitment Id",
        "Device Id",
        "Submission Timestamp",
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
