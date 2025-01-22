import React, { useState, useEffect } from "react";
import AdvanceNavigation from "./AdvanceNavigation";
import LeaveManagement from "./LeaveManagement";
import ShiftManagement from "./ShiftManagement";
import PayslipView from "./PayslipView";
import ComplaintManagement from "./ComplaintManagement";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const EmployeeRequestFolder = () => {

    const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 
    const dispatchvalue = useDispatch()

    const [activeFolder, setActiveFolder] = useState("AdvanceRequest");
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
          case "AdvanceNavigation":
            return <AdvanceNavigation />;
         
          case "LeaveManagement":
            return <LeaveManagement />;
          case "ShiftManagement":
            return <ShiftManagement />;
          case "PayslipView":
            return <PayslipView/>;
       
          
          case "Complaint":
            return <ComplaintManagement/>;
          default:
            return null;
        }
      };

  return (
    <div className="folder-container">
    {/* <h2>Employee Request </h2> */}
    <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>
      
   {showMenu && subAccess.includes('U21-1') && (  
    <div onClick={() => handleFolderClick("LeaveManagement")}
              className="folder-box"> Leave Management</div>
    )}

    {showMenu && subAccess.includes('U21-2') && (
    <div onClick={() => handleFolderClick("AdvanceNavigation")}
              className="folder-box"> Advance Management</div>
     )}

    {showMenu && subAccess.includes('U21-3') && (

    <div onClick={() => handleFolderClick("ShiftManagement")}
              className="folder-box"> Shift Management</div>
     )}

 {showMenu && subAccess.includes('U21-4') && (

    <div onClick={() => handleFolderClick("PayslipView")}
              className="folder-box"> Pay Slip</div>
)}


 {showMenu && subAccess.includes('U21-5') && (

<div onClick={() => handleFolderClick("Complaint")}
          className="folder-box"> Complaint/Grievancer</div>
          
)}

</div>
    {renderFolderContent()}
  </div>
  )
}

export default EmployeeRequestFolder