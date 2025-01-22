import React, { useState, useEffect } from "react";
import InsuranceDashboard from "./InsuranceDashboard";

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ClientDashboard from "./ClientDashboard";

const InsuranseFolder = () => {

    const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 
    const dispatchvalue = useDispatch()
    
  const [activeFolder, setActiveFolder] = useState("InsuranceDashboard");
  const [showFolders, setShowFolders] = useState(false);

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
      case "InsuranceDashboard":
        return <InsuranceDashboard />;
      case "ClientDashboard":
        return <ClientDashboard />;
      default:
        return null;
    }
  };
  return (
    <div className="folder-container">
      {/* <h2>Insurance</h2> */}
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>
       {showMenu && subAccess.includes('Q17-1') && (
          <div onClick={() => handleFolderClick("InsuranceDashboard")}
            className="folder-box"> Insurance Dashboard</div>
        )}
        {showMenu && subAccess.includes('Q17-2') && (
          <div onClick={() => handleFolderClick("ClientDashboard")}
            className="folder-box"> Client Dashboard</div>
        )}






      </div>

      {renderFolderContent()}
    </div>
  )
}

export default InsuranseFolder