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

function transformTransactionsData(data) {
  return data.map((item) => {
    if (!item.timestamp || typeof item.timestamp == "string") {
      item.timestamp = item.transactionTime;
    }
    const date = new Date(item.timestamp * 1000);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

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
      formattedDate,
      formattedTime,
      nodeId,
      idField,
      eventType,
      isZKP,
      isDevice,
      actions: [
        isZKP && !isDevice && "IoT Data",
        isZKP && "ZKP",
        (isTransaction || isZKP) && "Transaction Details",
        !isZKP &&
          !isDevice &&
          !isTransaction &&
          !isCommitment &&
          "Service Details",
        !isZKP && isDevice && "Device Details",
        isZKP && "Verify Proof",
        isCommitment && "Commitment Data",
      ].filter(Boolean),
    };
  });
}

function findItemByTransactionHash(data, transactionHash) {
  // Filter all items with the matching transactionHash
  const matchingItems = data.filter(
    (item) => item.transactionHash === transactionHash
  );

  // Check if any of them have zkp_payload and prioritize it
  const withZkpPayload = matchingItems.find((item) => item.zkp_payload);

  // Return the one with zkp_payload if it exists, otherwise return the first matching item
  return withZkpPayload || matchingItems[0];
}

function findItemByTransactionHashFromArray(data, transactionHash) {
  return data.find((item) => item[0] === transactionHash);
}

const eventTypeLabels = {
  ZKPStored: "ZKP Stored",
  DeviceCreated: "Device Shared",
  DeviceRemoved: "Device Unshared",
  ServiceCreated: "Service Shared",
  ServiceRemoved: "Service Unshared",
  CommitmentStored: "Commitment Stored",
};

export default function TransactionsTable({ transactions, ...props }) {
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
      setDeviceImage(getDeviceUrlByType(res.data, String(deviceType)));
    } catch (error) {
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
      theProof = JSON.parse(theData?.zkp_payload);
    } catch (error) {
      theProof = theData?.zkp_payload;
    }

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
    setTransformedData(transformTransactionsData(transactions));
    console.log("transactions:", transactions);
  }, [transactions]);

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

  const handleActionClick = async (action, items) => {
    let tempData = {
      ...findItemByTransactionHash(transformedData, items[0]),
    };

    try {
      if (tempData.zkp_payload) {
        tempData.zkp_payload = JSON.parse(tempData.zkp_payload);
      }
    } catch (error) {
      console.error(error);
    }

    try {
      tempData = {
        ...tempData,
        data_payload: {
          ...JSON.parse(tempData.data_payload),
        },
      };
    } catch (error) {
      console.error(error);
    }

    setModalData(tempData);

    console.log("transactions2", transactions);
    console.log("action", action);
    console.log("items", items);
    console.log("ghol:", tempData);

    setIsZKP(tempData.isZKP);
    setIsDevice(tempData.isDevice);

    if (action === "ZKP") {
      setIsZkpModalOpen(true);
    } else if (action === "Verify Proof") {
      try {
        const { commitment_id } = JSON.parse(tempData.zkp_payload);
        getCommitmentData(commitment_id);
      } catch (error) {}
      handleVerifyButton(tempData);
      setProofModal(true);
      await getDeviceImagesFromNode(tempData?.nodeId, tempData?.deviceType);
    } else if (action == "Transaction Details" || action == "Commitment Data") {
      const encodedHash = encodeURIComponent(items[0]);
      navigateTo(`/tx/${encodedHash}`);
    } else {
      await getDeviceImagesFromNode(tempData?.nodeId, tempData?.deviceType);
      try {
        const { commitment_id } = JSON.parse(tempData.zkp_payload);
        const comitData = await getCommitmentData(commitment_id);
        tempData = {
          ...tempData,
          data_payload: {
            ...tempData.data_payload,
            HV: comitData.device_hardware_version,
            FV: comitData.firmware_version,
          },
        };
        setModalData(tempData);
      } catch (error) {}
      setIsDataModalOpen(true);
    }
  };

  return (
    <>
      <ResponsiveTable
        {...props}
        titles={["Transaction Id", "Date", "Time", "Server Name", "Event Type"]}
        pagination={false}
        conditionalOverrides={[
          {
            rowExist: true,
            columnToApplyClass: 0,
            className: "transaction-hash-label",
          },
          {
            rowExist: "ZKP Stored",
            columnToApplyClass: 4,
            className: "event-label zkp",
          },
          {
            rowExist: "Device Shared",
            columnToApplyClass: 4,
            className: "event-label device",
          },
          {
            rowExist: "Device Unshared",
            columnToApplyClass: 4,
            className: "event-label device",
          },
          {
            rowExist: "Service Shared",
            columnToApplyClass: 4,
            className: "event-label service",
          },
          {
            rowExist: "Service Unshared",
            columnToApplyClass: 4,
            className: "event-label service",
          },
          {
            rowExist: "Commitment Stored",
            columnToApplyClass: 4,
            className: "event-label commitment",
          },
          {
            rowExist: "Transaction",
            columnToApplyClass: 4,
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
            formattedTime,
            nodeId,
            eventType,
            actions,
          }) => [
            transactionHash,
            formattedDate,
            formattedTime,
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

      <EModal
        className="zkp-modal"
        isOpen={isZkpModalOpen}
        title="ZKP Payload"
        onClose={() => setIsZkpModalOpen(false)}
      >
        {(isZKP && (
          <JsonDisplay
            jsonData={(modalData?.zkp_payload && modalData?.zkp_payload) || ""}
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

        <LetterAnimation isFinished={hackerAnimation} text={proofResult} />
        <div className="iot-data">
          {modalData?.data_payload &&
            Object.entries(modalData?.data_payload)
              .sort(([keyA], [keyB]) => keyB.length - keyA.length)
              .map(([key, value]) => (
                <p key={key}>
                  {key.replace(/_/g, " ")}:{" "}
                  <span>{key === "Root" ? String(value) : value}</span>
                </p>
              ))}
        </div>
        <GenerateJsonData
          isZkp={true}
          parsedData={commitmentData}
          loading={commitmentLoading}
        />
      </EModal>

      <EModal
        className={`data-modal ${!isZKP && "big"}`}
        isOpen={isDataModalOpen}
        title={`${
          isZKP == false
            ? `${isDevice ? "Device Details" : "Service Details"}`
            : "IoT Data and ZKP"
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
              {modalData?.data_payload &&
                Object.entries(modalData?.data_payload)
                  .sort(([keyA], [keyB]) => keyB.length - keyA.length)
                  .map(([key, value]) => (
                    <p key={key}>
                      {key.replace(/_/g, " ")}:{" "}
                      <span>{key === "Root" ? String(value) : value}</span>
                    </p>
                  ))}
              <GenerateJsonData
                parsedData={commitmentData}
                loading={commitmentLoading}
              />
              {isZKP && (
                <JsonDisplay
                  jsonData={
                    (modalData?.zkp_payload && modalData?.zkp_payload) || ""
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
              src={
                (modalData?.imageURL && modalData?.imageURL) ||
                "/img/default-service.jpg"
              }
              className="img"
            />

            <div className="holder service">
              <p>
                IoT Server Id: <span>{modalData?.nodeId}</span>
              </p>
              <p>
                Event Type: <span>{modalData?.eventType}</span>
              </p>
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
                Execution Price: <span>{modalData?.executionPrice}</span>
              </p>
              <p>
                Installation Price: <span>{modalData?.installationPrice}</span>
              </p>
            </div>
          </div>
        )}

        {isZKP == false && isDevice == true && (
          <div className="main-data">
            <ImageLoader src={deviceImage} className="img device" />
            <div className="holder service">
              <p>
                IoT Server Id: <span>{modalData?.nodeId}</span>
              </p>
              <p>
                Event Type: <span>{modalData?.eventType}</span>
              </p>
              <p>
                Device Name:{" "}
                <span>{modalData?.serviceName || modalData?.name}</span>
              </p>
              <p>
                Device Id: <span>{modalData?.deviceId}</span>
              </p>
              <p>
                Device Type: <span>{modalData?.deviceType}</span>
              </p>
              <p>
                Owner Id: <span>{modalData?.ownerId}</span>
              </p>
            </div>
          </div>
        )}
      </EModal>
    </>
  );
}
