import React, { useEffect, useState } from "react";
import ResponsiveTable from "../Table";
import { useNavigate } from "react-router-dom";
import EModal from "../Modal";
import "./style.scss";
import ImageLoader from "../Image";
import useFetchData from "../../../services/api/useFetchData";
import LetterAnimation from "../Animated/HackerEffect";
import GenerateJsonData from "./GenerateJsonData";
import JsonDisplay from "../JsonDisplay";
import { formatDateTime } from "../../../utility/functions";
import { Buffer } from "buffer";
import ZkpTable from "../ZKPTable";
import CommitmentTable from "../CommitmentTable";
import {
  HiCheckCircle,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiXCircle,
} from "react-icons/hi";

function transformTransactionsData(data) {
  return data.map((item) => {
    if (!item.timestamp || typeof item.timestamp == "string") {
      item.timestamp = item.transactionTime;
    }
    const date = new Date(item.timestamp * 1000);

    const transactionHash = item.transactionHash || "";
    const nodeId = item.nodeId || "";
    const idField = item.deviceId || item.serviceId || "";
    const eventType = item.eventType || "";

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

    return {
      ...item,
      transactionHash,
      formattedDate: formatDateTime(date),
      nodeId,
      idField,
      eventType,
      isZKP,
      isDevice,
      actions: [
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
    };
  });
}

function findItemByTransactionHash(data, transactionHash) {
  // Filter all items with the matching transactionHash
  const matchingItems = data.filter(
    (item) => item.transactionHash === transactionHash
  );

  // Check if any of them have zkpPayload and prioritize it
  const withZkpPayload = matchingItems.find((item) => item.zkpPayload);

  // Return the one with zkpPayload if it exists, otherwise return the first matching item
  return withZkpPayload || matchingItems[0];
}

function findItemByTransactionHashFromArray(data, transactionHash) {
  return data.find((item) => item[0] === transactionHash);
}

const eventTypeLabels = {
  ZKPStored: "ZKP Stored",
  DeviceCreated: "Device Shared",
  DeviceRemoved: "Device Unshared",
  ServiceCreated: "Service Published",
  ServiceRemoved: "Service Unpublished",
  CommitmentStored: "Commitment Stored",
};

export default function TransactionsTable({
  transactions,
  zkpTransaction = false,
  commitmentTransaction = false,
  ...props
}) {
  const navigateTo = useNavigate();
  const [commitmentLoading, setCommitmentLoading] = useState(false);
  const [commitmentData, setCommitmentData] = useState();
  const [isZkpModalOpen, setIsZkpModalOpen] = useState(false);
  const [proofModal, setProofModal] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isZKP, setIsZKP] = useState(false);
  const [isDevice, setIsDevice] = useState(false);
  const [deviceImage, setDeviceImage] = useState("");
  const [transformedData, setTransformedData] = useState(
    transformTransactionsData(transactions)
  );
  const [refreshTable, setRefreshTable] = useState(0);
  const [hackerAnimation, setHackerAnimation] = useState(false);
  const [proofResult, setProofResult] = useState("abcdefghijklmn");
  const { fetchData } = useFetchData();

  function getDeviceUrlByType(devices, type) {
    const device = devices.find((device) => {
      const regex = new RegExp(`^${type.replace(/[-_]/g, "[-_]")}$`, "i"); // Create a regex to match both - and _
      return regex.test(device.type); // Test the type against the regex
    });
    return device ? device.url : null; // Return the URL if found, otherwise null
  }

  async function getCommitmentData(commitment_id) {
    setCommitmentLoading(true);
    const res = await fetchData(
      `contract/get-commitment-data?commitmentId=${commitment_id}`
    );
    setCommitmentLoading(false);
    setCommitmentData(res.data[0]);
    return res.data[0];
  }

  async function getDeviceImagesFromNode(nodeId, deviceType) {
    let nodeApiUrl = "";
    if (nodeId == "developer.fidesinnova.io") {
      nodeApiUrl = `https://${nodeId}/app/v1/devices`;
    } else {
      nodeApiUrl = `https://panel.${nodeId}/app/v1/devices`;
    }
    try {
      const res = await fetchData(nodeApiUrl, {
        method: "GET",
      });
      console.log("res.data:", res.data);

      setDeviceImage(getDeviceUrlByType(res.data, String(deviceType)));
    } catch (error) {
      setDeviceImage("/img/default-device.png");
      console.error(error);
    }
  }

  async function verifyProofWithTimer(theProof) {
    const timerPromise = new Promise((resolve) => setTimeout(resolve, 2000));

    const fetchPromise = fetchData(`contract/verify-proof`, {
      method: "POST",
      body: {
        proof: theProof,
      },
    }).catch((error) => {
      console.error("API call failed:", error);

      return null; // Return null or appropriate value if API call fails
    });

    // Wait for the timer to finish (3 seconds)
    await timerPromise;

    // Wait for the API call to finish (even if it fails)
    const apiResult = await fetchPromise;

    if (apiResult && apiResult.data === true) {
      return apiResult;
    } else {
      throw new Error("Proof verification failed");
    }
  }

  async function handleVerifyButton(theData) {
    setProofModal(true);
    let theProof = "";
    try {
      theProof = JSON.parse(theData?.zkpPayload);
    } catch (error) {
      theProof = theData?.zkpPayload;
    }

    console.log("The Proof:", theProof);

    try {
      const result = await verifyProofWithTimer(theProof);
      setHackerAnimation(true);
      if (result.data === true) {
        setProofResult("Proof is Verified");
      } else {
        setProofResult("Proof is Not Verified");
      }
    } catch (error) {
      setHackerAnimation(true);
      setProofResult("Proof is Not Verified");
    }
  }

  useEffect(() => {
    return () => {
      setHackerAnimation(false);
    };
  }, [proofModal]);

  function handleCellClick(row, col, item, fullRowData) {
    if (col === 0 /* && fullRowData[4].props.children === 'Transaction' */) {
      const encodedHash = encodeURIComponent(item);
      navigateTo(`/tx/${encodedHash}`);
    }
  }

  function isValidHexOrBase64(str) {
    // Regular expression for a 64-character hexadecimal string
    const hex64Regex = /^[0-9a-fA-F]{64}$/;

    // Regular expression for a Base64-encoded string
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

    // Check if the string matches either of the patterns
    return hex64Regex.test(str) || base64Regex.test(str);
  }

  useEffect(() => {
    setTransformedData(transformTransactionsData(transactions));
    setRefreshTable((prev) => prev + 1);
    //console.log("Transactions updated:", transactions);
  }, [transactions]);

  async function handleActionClick(action, items) {
    let itemHash = "";

    //console.log("transactions", transactions);
    //console.log("action, items:", action, items);

    if (isValidHexOrBase64(items[0])) {
      itemHash = items[0];
    } else if (isValidHexOrBase64(items[4])) {
      itemHash = items[4];
    } else if (isValidHexOrBase64(items[5])) {
      itemHash = items[5];
    }

    console.log("transactions:", transactions);
    console.log("itemHash:", itemHash);
    //console.log("transformedData:", transformedData);

    let tempData = {
      ...findItemByTransactionHash(
        transformTransactionsData(transactions),
        itemHash
      ),
    };

    try {
      if (tempData.zkpPayload) {
        tempData.zkpPayload = JSON.parse(tempData.zkpPayload);
      }
    } catch (error) {
      console.error(error);
    }

    try {
      tempData = {
        ...tempData,
        dataPayload: {
          ...JSON.parse(tempData.dataPayload),
        },
      };
    } catch (error) {
      console.error(error);
    }

    setModalData(tempData);

    setIsZKP(tempData.isZKP);
    setIsDevice(tempData.isDevice);

    if (action === "ZKP") {
      setIsZkpModalOpen(true);
    } else if (action === "Verify Proof") {
      try {
        const { commitment_id } = JSON.parse(tempData.zkpPayload);
        getCommitmentData(commitment_id);
      } catch (error) {}
      handleVerifyButton(tempData);
      setProofModal(true);
      await getDeviceImagesFromNode(tempData?.nodeId, tempData?.deviceType);
    } else if (action == "Transaction Details" || action == "Commitment Data") {
      const encodedHash = encodeURIComponent(itemHash);
      navigateTo(`/tx/${encodedHash}`);
    } else {
      console.log("tempData:", tempData);

      await getDeviceImagesFromNode(tempData?.nodeId, tempData?.deviceType);
      try {
        const { commitment_id } = JSON.parse(tempData.zkpPayload);
        const comitData = await getCommitmentData(commitment_id);
        tempData = {
          ...tempData,
          dataPayload: {
            ...tempData.dataPayload,
            HV: comitData.device_hardware_version,
            FV: comitData.firmware_version,
          },
        };
        setModalData(tempData);
      } catch (error) {}
      setIsDataModalOpen(true);
    }
  }

  /* const handleActionClick = async (action, items) => {
    
  }; */

  return (
    <>
      {zkpTransaction && (
        <ZkpTable
          data={transactions}
          onActionClick={handleActionClick}
          actions={true}
          key={`ZKPTable-${refreshTable}`}
        />
      )}
      {commitmentTransaction && (
        <CommitmentTable
          data={transactions}
          key={`CommitmentTable-${refreshTable}`}
        />
      )}
      {!commitmentTransaction && !zkpTransaction && (
        <ResponsiveTable
          key={`ResponsiveTable-${refreshTable}`}
          titles={[
            "Transaction Id",
            "Transaction Date",
            "Node Id",
            "Event Type",
          ]}
          pagination={false}
          conditionalOverrides={[
            {
              rowExist: true,
              columnToApplyClass: 0,
              className: "transaction-hash-label",
            },
            {
              rowExist: "ZKP Stored",
              columnToApplyClass: 3,
              className: "event-label zkp",
            },
            {
              rowExist: "Device Shared",
              columnToApplyClass: 3,
              className: "event-label device",
            },
            {
              rowExist: "Device Unshared",
              columnToApplyClass: 3,
              className: "event-label device",
            },
            {
              rowExist: "Service Published",
              columnToApplyClass: 3,
              className: "event-label service",
            },
            {
              rowExist: "Service Unpublished",
              columnToApplyClass: 3,
              className: "event-label service",
            },
            {
              rowExist: "Commitment Stored",
              columnToApplyClass: 3,
              className: "event-label commitment",
            },
            {
              rowExist: "Transaction",
              columnToApplyClass: 3,
              className: "event-label transaction",
            },
          ]}
          onActionClick={handleActionClick}
          actions={true}
          onCellClick={handleCellClick}
          data={transformedData.map(
            ({
              transactionHash,
              formattedDate,
              nodeId,
              eventType,
              actions,
            }) => [
              transactionHash,
              formattedDate,
              nodeId,
              <span>
                {eventTypeLabels[eventType]
                  ? eventTypeLabels[eventType]
                  : eventType}
              </span>,
              actions,
            ]
          )}
        />
      )}

      <EModal
        className="zkp-modal"
        isOpen={isZkpModalOpen}
        title="ZKP Payload"
        onClose={() => setIsZkpModalOpen(false)}
      >
        {(isZKP && (
          <JsonDisplay
            jsonData={(modalData?.zkpPayload && modalData?.zkpPayload) || ""}
          />
        )) || (
          <h2 className="no-zkp">
            The received data does not contain any ZKP.
          </h2>
        )}
      </EModal>

      <EModal
        className="proof-modal"
        isOpen={proofModal}
        closable={hackerAnimation}
        title="Proof Verifier"
        onClose={() => {
          setProofModal(false);
          setCommitmentData(undefined);
        }}
      >
        <ImageLoader src={deviceImage} className="img device" />

        <div className="proof-header">
          <LetterAnimation isFinished={hackerAnimation} text={proofResult} />
          {hackerAnimation && (
            <>
              {proofResult == "Proof is Verified" ? (
                <HiOutlineCheckCircle className="header-icon check" />
              ) : (
                <HiOutlineXCircle className="header-icon x" />
              )}
            </>
          )}
        </div>

        <div className="iot-data">
          {modalData?.dataPayload &&
            Object.entries(modalData?.dataPayload)
              .sort(([keyA], [keyB]) => keyB.length - keyA.length)
              .map(([key, value]) => (
                <p key={key}>
                  {key.replace(/_/g, " ")}:{" "}
                  <span>{key === "Root" ? String(value) : value}</span>
                </p>
              ))}
          <p>
            Submission Timestamp:{" "}
            <span>{formatDateTime(new Date(modalData?.timestamp * 1000))}</span>
          </p>
        </div>
        <GenerateJsonData
          isZkp={true}
          parsedData={commitmentData}
          loading={commitmentLoading}
        />
      </EModal>

      <EModal
        className={`data-modal can-select ${!isZKP && "big"}`}
        isOpen={isDataModalOpen}
        title={`${
          isZKP == false
            ? `${isDevice == true ? "Device Details" : "Service Details"}`
            : "IoT Data & ZKP"
        }`}
        onClose={() => {
          setIsDataModalOpen(false);
          setCommitmentData(undefined);
        }}
      >
        {isZKP && (
          <section className="main-data">
            <div className="holder">
              <ImageLoader src={deviceImage} className="img device" />

              {/* <p>
                Mac:{" "}
                <span>
                  {modalData?.deviceId
                    ? Buffer.from(modalData.deviceId, "base64").toString("utf8")
                    : "Not Found"}
                </span>
              </p> */}
              {/* <p>
                Type: <span>{modalData?.deviceType}</span>
              </p> */}
              {modalData?.dataPayload &&
                Object.entries(modalData?.dataPayload)
                  .sort(([keyA], [keyB]) => keyB.length - keyA.length)
                  .map(([key, value]) => (
                    <p key={key}>
                      {key.replace(/_/g, " ")}:{" "}
                      <span>{key === "Root" ? String(value) : value}</span>
                    </p>
                  ))}

              <p>
                Submission Timestamp:{" "}
                <span>
                  {formatDateTime(new Date(modalData?.timestamp * 1000))}
                </span>
              </p>
              <GenerateJsonData
                parsedData={commitmentData}
                loading={commitmentLoading}
              />
              <br />
              <h1>Zero-Knowledge Proof Payload:</h1>
              {isZKP && (
                <JsonDisplay
                  jsonData={
                    (modalData?.zkpPayload && modalData?.zkpPayload) || ""
                  }
                />
              )}
            </div>
          </section>
        )}

        {isZKP == false && isDevice == false && (
          <div className="main-data">
            <ImageLoader
              width={200}
              height={100}
              defaultImage="/img/default-service.jpg"
              src={modalData?.imageURL}
              className="img"
            />

            <div className="holder service">
              <p>
                Service Name: <span>{modalData?.name}</span>
              </p>
              <p>
                Service Id: <span>{modalData?.serviceId}</span>
              </p>
              <p>
                Service Type: <span>{modalData?.serviceType}</span>
              </p>
              <p>
                Description: <span>{modalData?.description}</span>
              </p>
              <p>
                Execution Price: <span>{modalData?.executionPrice} FDS</span>
              </p>
              <p>
                Installation Price:{" "}
                <span>{modalData?.installationPrice} FDS</span>
              </p>
              <p>
                IoT Server Id: <span>{modalData?.nodeId}</span>
              </p>
              <p>
                Event Type: <span>{modalData?.eventType}</span>
              </p>
              <p>
                Transaction Date:{" "}
                <span>
                  {formatDateTime(new Date(modalData?.timestamp * 1000))}
                </span>
              </p>
            </div>
          </div>
        )}

        {isZKP == false && isDevice == true && (
          <div className="main-data">
            <ImageLoader
              defaultImage="/img/default-device.png"
              src={deviceImage}
              className="img device"
            />
            <div className="holder service">
              <p>
                Event Type: <span>{modalData?.eventType}</span>
              </p>
              <p>
                Node Id: <span>{modalData?.nodeId}</span>
              </p>
              {/* <p>
                Device Name:{" "}
                <span>{modalData?.serviceName || modalData?.name}</span>
              </p> */}
              <p>
                Device Id: <span>{modalData?.deviceId}</span>
              </p>
              <p>
                Device Id Type: <span>{modalData?.deviceIdType}</span>
              </p>
              <p>
                Device Type: <span>{modalData?.deviceType}</span>
              </p>
              <p>
                Device Model: <span>{modalData?.deviceModel}</span>
              </p>
              <p>
                Manufacturer: <span>{modalData?.manufacturer}</span>
              </p>
              {/* <p>
                Device Owner: <span>{modalData?.ownerId}</span>
              </p> */}
              <p>
                Transaction Timestamp:{" "}
                <span>
                  {modalData?.timestamp}
                  {/* {formatDateTime(new Date(modalData?.timestamp * 1000))} */}
                </span>
              </p>
            </div>
          </div>
        )}
      </EModal>
    </>
  );
}
