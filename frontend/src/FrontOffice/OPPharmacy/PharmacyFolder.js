import React, { useState, useEffect } from "react";
import PharmacyBillingLIst from "./PharmacyBillingLIst";
import IPPharmacyBillingList from "../IpPharmacy/IPPharmacyBillingList";
import PharmacyWalkinQue from "./PharmacyWalkinQue";

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const PharmacyFolder = () => {

    const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 

    const [activeFolder, setActiveFolder] = useState("OPPharmachyBillingList");
    const [showFolders, setShowFolders] = useState(false);
  
  const dispatchvalue = useDispatch()

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

    const renderFolderContent = () => {
        switch (activeFolder) {
          case "OPPharmachyBillingList":
            return <PharmacyBillingLIst />;
          case "IPPharmacyBillingList":
            return <IPPharmacyBillingList />;
          case "PharmacyWalkinQue":
            return <PharmacyWalkinQue />;
          default:
            return null;
        }
      };
  return (
    <div className="folder-container">
      {/* <h2>Pharmacys</h2> */}
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>
        
       {showMenu && subAccess.includes('G7-1') && (
          <div onClick={() => handleFolderClick("OPPharmachyBillingList")}
            className="folder-box"> OP Pharmacy Billing
          </div>
        )}

       {showMenu && subAccess.includes('G7-2') && (

          <div onClick={() => handleFolderClick("IPPharmacyBillingList")}
            className="folder-box"> IP Pharmacy Billing
          </div>

        )}
       {showMenu && subAccess.includes('G7-3') && (

          <div onClick={() => handleFolderClick("PharmacyWalkinQue")}
            className="folder-box"> Pharmacy Walkin Que
          </div>

        )}







      </div>

      {renderFolderContent()}
    </div>
  )
}

export default PharmacyFolder