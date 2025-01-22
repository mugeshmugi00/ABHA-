import React, { useState, useEffect } from "react";
import LeninMaster from "./LeninMaster";
import Lenin_DeptWise_MinMax from "./Lenin_DeptWise_MinMax";
import Lenin_Stock from "./Lenin_Stock";

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'



const LeninFolder = () => {

  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu); 
  const dispatchvalue = useDispatch()

  const [activeFolder, setActiveFolder] = useState("LeninMaster");
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
      case "LeninMaster":
        return <LeninMaster />;
      case "Lenin_DeptWise_MinMax":
        return <Lenin_DeptWise_MinMax />;
      case "Lenin_Stock":
        return <Lenin_Stock />;
        default:
            return null;
        }
      };
  return (
    <div className="folder-container">
          {/* <h2>Lenin</h2> */}
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>
      
     {showMenu && subAccess.includes('M13-1') && (
      <div  onClick={() => handleFolderClick("LeninMaster")}
              className="folder-box" >Lenin Master</div>
      )}
     {showMenu && subAccess.includes('M13-2') && (

      <div  onClick={() => handleFolderClick("Lenin_DeptWise_MinMax")}
              className="folder-box" >Lenin DeptWise MinMax</div>
      )}

     {showMenu && subAccess.includes('M13-3') && (

      <div  onClick={() => handleFolderClick("Lenin_Stock")}
              className="folder-box" >Lenin Stock</div>
      )}





      </div>

      {renderFolderContent()}
    </div>
  )
}

export default LeninFolder