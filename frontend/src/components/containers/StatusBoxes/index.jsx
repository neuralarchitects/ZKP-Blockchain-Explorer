import React from "react";
import "./style.scss";
import StatusBox from "../../ui/StatusBox";
import BoxIcon from "../../../icons/box";
import TransactionIcon from "../../../icons/transaction";
import { HiCheck, HiOutlineCash, HiOutlineViewGrid } from "react-icons/hi";
import { BiServer } from "react-icons/bi";

export default function StatusBoxes({
  totalOperations,
  serviceDeviceCount,
  zkpCount,
  blockChainCount,
  dailyTransactions,
  commitmentCount,
}) {
  return (
    <section className="status-container">
      <StatusBox
        color={"#FDE1AC"}
        loading={
          serviceDeviceCount === null || serviceDeviceCount === undefined
        }
        Icon={TransactionIcon}
        iconClass={"check-icon"}
        title={"Protocol Operations"}
        value={totalOperations}
      />
      <StatusBox
        color={"#f7d4fb"}
        loading={
          serviceDeviceCount === null || serviceDeviceCount === undefined
        }
        Icon={BiServer}
        title={"Services / Devices"}
        iconClass={"check-icon"}
        value={serviceDeviceCount}
      />
      <StatusBox
        color={"#BAE5F5"}
        loading={
          serviceDeviceCount === null || serviceDeviceCount === undefined
        }
        Icon={BoxIcon}
        iconClass={"check-icon"}
        title={"ZKPs"}
        value={zkpCount}
      />
      <StatusBox
        color={"#CCEFBF"}
        loading={
          serviceDeviceCount === null || serviceDeviceCount === undefined
        }
        Icon={HiCheck}
        iconClass={"check-icon"}
        title={"Device Commitments"}
        value={commitmentCount}
      />
      <StatusBox
        color={"#dedede"}
        loading={
          serviceDeviceCount === null || serviceDeviceCount === undefined
        }
        Icon={HiOutlineViewGrid}
        iconClass={"check-icon"}
        title={"Total Blocks"}
        value={blockChainCount}
      />
      <StatusBox
        color={"#aedede"}
        loading={
          serviceDeviceCount === null || serviceDeviceCount === undefined
        }
        Icon={HiOutlineCash}
        iconClass={"check-icon"}
        title={"Total Transactions"}
        value={dailyTransactions + 2000}
      />
    </section>
  );
}
