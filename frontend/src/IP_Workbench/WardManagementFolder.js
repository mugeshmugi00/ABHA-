import React, { useState, useEffect } from "react";
import NewRoomAvail from "../Masters/RoomMaster/NewRoomAvail";
import IP_WorkbenchQuelist from "./Doctor/IP_WorkbenchQuelist";
import IpHandoverQue from "../FrontOffice/RegistrationList/IpHandoverQue";
import Warddashboard from "./Warddashboard";

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


function WardManagementFolder() {
  const dispatchvalue = useDispatch()

    const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 

  const [activeFolder, setActiveFolder] = useState("Warddashboard");
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
      case "Warddashboard":
        return <Warddashboard />;
      case "IPHandOverList":
        return <IpHandoverQue />;

        case "RoomMangement":
            return <NewRoomAvail />;

            case "IPQueList":
                return <IP_WorkbenchQuelist />;

      default:
        return null;
    }
  };

  return (
    <div className="folder-container">
      {/* <h2>Ward Management</h2> */}
      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
         {showMenu && subAccess.includes('F6-1') && (
        <div
          onClick={() => handleFolderClick("Warddashboard")}
          className="folder-box"
        >
          Ward Dashboard
        </div>
        )}

         {showMenu && subAccess.includes('F6-2') && (

        <div
          onClick={() => handleFolderClick("IPHandOverList")}
          className="folder-box"
        >
          IP HandOver List
        </div>
        )}

         {showMenu && subAccess.includes('F6-3') && (

        <div
          onClick={() => handleFolderClick("RoomMangement")}
          className="folder-box"
        >
          Room Management
        </div>
        )}

         {showMenu && subAccess.includes('F6-4') && (


        <div
          onClick={() => handleFolderClick("IPQueList")}
          className="folder-box"
        >
          IP OueList
        </div>
        )}
        
      </div>

      <br />

      {renderFolderContent()}
    </div>
  );
}

export default WardManagementFolder;
