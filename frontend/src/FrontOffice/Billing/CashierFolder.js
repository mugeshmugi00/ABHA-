import React, { useState, useEffect } from "react";
import GeneralBillingList from "./GeneralBillingList";
import QuickBilling from "./Billing";
import OverAllQuickBilling from "./QuickBilling";
import IPBillingList from "../IPBilling/IPBillingList";
import CashierDashboard from "./CashierDashboard";
import IP_BillingDischargeQueslist from "../../IP_Workbench/Nurse/Discharge/IP_BillingDischargeQueslist";
import LabQueuelist from "./LabQueuelist";
import AdvanceCollection from "./AdvanceCollection";
import AdvanceCollectionList from "./AdvanceCollectionList";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function CashierFolder() {

    const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 

    const dispatchvalue = useDispatch()

  const [activeFolder, setActiveFolder] = useState("CashierDashboard");
  const [showFolders, setShowFolders] = useState(false); // State to control folder display animation

  const UserData = useSelector(state => state.userRecord?.UserData)

  const [subAccess, setSubAccess] = useState([])

  useEffect(() => {
    console.log(UserData, 'UserData')

    if (UserData) {

      const setAccess2 =
        (UserData.AccessTwo &&
          UserData.AccessTwo.split(',').map(item => item.trim())) ||
        []

      setSubAccess(setAccess2) // Update state for sub access
    }
  }, [UserData]) // Dependency array



  const handleFolderClick = (folderName) => {
    setActiveFolder(folderName); // Update the state to show the clicked folder's content
    dispatchvalue({ type: "showMenu", value: false }); // Close menu on folder click
  };



  // Trigger folder boxes animation when the component mounts
  // useEffect(() => {
  //   setShowFolders(true);
  // }, []);


  useEffect(() => {
    console.log(activeHrFolder, 'activeHrFolder');

    if (activeHrFolder !== "") {
      setActiveFolder(activeHrFolder)
      dispatchvalue({ type: 'HrFolder', value: '' })
    }
    setShowFolders(true);
  }, [activeHrFolder]);
  

  // Render the content dynamically based on the active folder
  const renderFolderContent = () => {
    switch (activeFolder) {
      case "CashierDashboard":
        return <CashierDashboard />;
      case "GeneralBillingList":
        return <GeneralBillingList />;

      case "OverAllQuickBilling":
        return <OverAllQuickBilling />;

      case "IPBilling":
        return <IPBillingList />;
      case "IP_BillingDischargeQueslist":
        return <IP_BillingDischargeQueslist />;
      case "LabQueuelist":
        return <LabQueuelist />;
      case "AdvanceCollection":
        return <AdvanceCollectionList />;

      default:
        return null;
    }
  };

  return (
    <div className="folder-container">
      {/* <h2>Cashier</h2> */}
      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
       {showMenu && subAccess.includes('H8-1') && (
          <div
            onClick={() => handleFolderClick("CashierDashboard")}
            className="folder-box"
          >
            Cashier Dashboard
          </div>
        )}

       {showMenu && subAccess.includes('H8-2') && (
          <div
            onClick={() => handleFolderClick("GeneralBillingList")}
            className="folder-box"
          >
            OP Billing
          </div>
        )}

       {showMenu && subAccess.includes('H8-3') && (
          <div
            onClick={() => handleFolderClick("OverAllQuickBilling")}
            className="folder-box"
          >
            Quick Billing
          </div>
        )}

       {showMenu && subAccess.includes('H8-4') && (
          <div
            onClick={() => handleFolderClick("IPBilling")}
            className="folder-box"
          >
            IP Billing
          </div>
        )}
       {showMenu && subAccess.includes('H8-5') && (
          <div
            onClick={() => handleFolderClick("IP_BillingDischargeQueslist")}
            className="folder-box"
          >
            IP Billing Discharge Queslist
          </div>
        )}
       {showMenu && subAccess.includes('H8-6') && (
          <div
            onClick={() => handleFolderClick("LabQueuelist")}
            className="folder-box"
          >
            Lab Billing list
          </div>
        )}
       {showMenu && subAccess.includes('H8-7') && (
          <div
            onClick={() => handleFolderClick("AdvanceCollection")}
            className="folder-box"
          >
            Advance Collection
          </div>
        )}

      </div>

      <br />

      {renderFolderContent()}
    </div>
  );
}

export default CashierFolder;
