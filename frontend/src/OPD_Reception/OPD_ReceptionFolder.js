

import React, { useState, useEffect } from "react";
import OP_patients from "./OP_patients";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const OPD_ReceptionFolder = () => {
  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu);
  const dispatchvalue = useDispatch();

    const [activeFolder, setActiveFolder] = useState("OP_patients");
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
          case "OP_patients":
            return <OP_patients />;
          default:
            return null;
        }
      };
  return (
    <div className="folder-container">
      {/* <h2>Out Patients Reception</h2> */}
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

      {showMenu && subAccess.includes('D4-1') && (
        <div onClick={() => handleFolderClick("OP_patients")}
          className="folder-box"> OP Patients
          
          </div>

        
      )}
    </div>
      {renderFolderContent()}
    </div>
  )
}

export default OPD_ReceptionFolder