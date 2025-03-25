import React, { useEffect, useState } from "react";
import "./style.scss";
import ResponsiveTable from "../Table";
import ImageLoader from "../Image";
import { formatDateTime } from "../../../utility/functions";
import useFetchData from "../../../services/api/useFetchData";

function getDeviceUrlByType(nodes, type) {
  const regex = new RegExp(`^${type.replace(/[-_]/g, "[-_]")}$`, "i"); // Match both - and _

  // Iterate over each domain's device list
  for (const deviceList of Object.values(nodes)) {
    // Find a matching device within each list
    const device = deviceList.find((device) => regex.test(device.type));

    if (device) return device.url; // Return URL if found
  }

  return null; // Return null if no match is found
}

export default function DevicesTable({ data }) {
  const { fetchData } = useFetchData();
  const [nodeImages, setNodeImages] = useState({});

  function transformDevicesToArray(devices) {
    return devices.map((device) => {
      return [
        <figure className="image-holder">
          <ImageLoader
            src={getDeviceUrlByType(nodeImages, String(device.deviceType))}
          />
        </figure>,
        device.deviceType || "",
        device.deviceName || "",
        device.deviceEncryptedId || "",
        formatDateTime(device.insertDate) || "",
        device.nodeId || "",
        <div className="fw-hw-holder">
          <p>FW: {device.firmwareVersion || 0}</p>
          <p>HW: {device.hardwareVersion || 0}</p>
        </div>,
      ];
    });
  }

  async function getDeviceImagesFromNode(nodeId) {
    if (nodeImages[nodeId]) {
      return;
    }
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
      setNodeImages((prev) => ({ ...prev, [nodeId]: res.data }));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    Promise.all(
      data.map(async (item) => {
        await getDeviceImagesFromNode(item.nodeId);
      })
    );
  }, []);

  return (
    <ResponsiveTable
      titles={[
        "Device",
        "Type",
        "Name",
        "Device Id",
        "Installation Date",
        "Node Id",
        "Firmware/Hardware Version",
      ]}
      pagination={true}
      data={[...transformDevicesToArray(data)]}
      itemsPerPage={10}
    />
  );
}
