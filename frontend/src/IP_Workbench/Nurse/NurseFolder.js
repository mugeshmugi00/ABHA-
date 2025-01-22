import React, { useState, useEffect } from "react";
import BirthRegisterList from "./BirthRegisterList";
import DeathRegister from "./DeathRegister";
import TotalNursePatientList from "../../Nurse/TotalNursePatientList";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const NurseFolder = () => {

    const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 

  const dispatchvalue = useDispatch();
  

  const [activeFolder, setActiveFolder] = useState("PatientQuelist");
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
          
    
         
    
          case "PatientQuelist":
            return <TotalNursePatientList />;
          case "BirthRegisterList":
            return <BirthRegisterList />;
          case "DeathRegisterList":
            return <DeathRegister />;
          default:
            return null;
        }
      };
  return (
    <div className="folder-container">
      {/* <h2>Nurse</h2> */}

      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
         {showMenu && subAccess.includes('E5-1') && (
        <div
          onClick={() => handleFolderClick("PatientQuelist")}
          className="folder-box"
        >
          Patient Quelist
        </div>
        )}

         {showMenu && subAccess.includes('E5-2') && (
        <div
          onClick={() => handleFolderClick("BirthRegisterList")}
          className="folder-box"
        >
          Birth Register List
        </div>
        )}

         {showMenu && subAccess.includes('E5-3') && (
        <div
          onClick={() => handleFolderClick("DeathRegisterList")}
          className="folder-box"
        >
          Death Register List
        </div>
        )}
        </div>

        {renderFolderContent()}
      </div>
  )
}

export default NurseFolder