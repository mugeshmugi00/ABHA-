import React, { useState, useEffect } from "react";
import FinanceMasterList from "./FinanceMasterList";
import VouchersList from "./VouchersList";
import DayBook from "./DayBook";
import CashBook from "./CashBook";
import TrialBalance from "./TrialBalance";
import ProfitandLoss from "./ProfitandLoss";
import BalanceSheet from './BalanceSheet';

import { useDispatch, useSelector } from 'react-redux'


function Financefolder() {
  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu); 
  const dispatchvalue = useDispatch()
  
  const [activeFolder, setActiveFolder] = useState("FinanceMasterList");
  const [showFolders, setShowFolders] = useState(false); // State to control folder display animation

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
      case "FinanceMasterList":
        return <FinanceMasterList />;
      case "VouchersList":
        return <VouchersList />;
      case "DayBook":
        return <DayBook />;
      case "CashBook":
        return <CashBook />;
      case "TrialBalance":
        return <TrialBalance />;
      case "ProfitandLoss":
        return <ProfitandLoss />;
      case "BalanceSheet":
        return <BalanceSheet />;
      
      default:
        return null;
    }
  };

  return (
    <div className="folder-container">
    
    {/* <h2>Finance</h2> */}
      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
       {showMenu && (  <div
          onClick={() => handleFolderClick("FinanceMasterList")}
          className="folder-box"
        >
          Finance Master List
        </div>
       )}
         {showMenu && ( 
        <div
          onClick={() => handleFolderClick("VouchersList")}
          className="folder-box"
        >
         Vouchers
        </div>
         )}
       
       {showMenu && (   <div
          onClick={() => handleFolderClick("DayBook")}
          className="folder-box"
        >
         Day Book
        </div>
       )}

        {showMenu && (   <div
          onClick={() => handleFolderClick("CashBook")}
          className="folder-box"
        >
         Cash Book
        </div>
        )}

{showMenu && (    <div
          onClick={() => handleFolderClick("TrialBalance")}
          className="folder-box"
        >
         Trial Balance
        </div>
)}

{showMenu && (     <div
          onClick={() => handleFolderClick("ProfitandLoss")}
          className="folder-box"
        >
         Profit and Loss
        </div>
)}

{showMenu && (     <div
          onClick={() => handleFolderClick("BalanceSheet")}
          className="folder-box"
        >
         Balance Sheet
        </div>
)}

      </div>

      <br />

      {renderFolderContent()}
    </div>
  );
}

export default Financefolder;
