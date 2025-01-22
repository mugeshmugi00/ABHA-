import React, { useState, useEffect } from "react";
import TotalPatientList from "./TotalPatientList";
import '../FrontOffice/FolderBox.css';
import Doctordashboard from "./Doctordashboard";
import SpecialityWiseDoctorPatientList from "./SpecialityWiseDoctorPatientList";
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'



function DoctorFolder() {

    const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 
    
   const SidebarToggle = useSelector(state => state.userRecord?.SidebarToggle)
    const UrlLink = useSelector(state => state.userRecord?.UrlLink)
    const Usersessionid = useSelector(state => state.userRecord?.Usersessionid)
    const UserData = useSelector(state => state.userRecord?.UserData)
    const [openSubMenu, setOpenSubMenu] = useState(null)
    const navigate = useNavigate()
    const dispatchvalue = useDispatch()
  
    const [mainAccess, setMainAccess] = useState([])
    const [subAccess, setSubAccess] = useState([])
  
  
  useEffect(() => {
      if (!SidebarToggle) {
        setOpenSubMenu(null) // Close all submenus when sidebar collapses
      }
    }, [SidebarToggle])
  
  
    useEffect(() => {
      console.log(UserData, 'UserData')
  
      if (UserData) {
        // const setAccess1 =
        //   (UserData.AccessOne &&
        //     UserData.AccessOne.split(',').map(item => item.trim())) ||
        //   []
        const setAccess2 =
          (UserData.AccessTwo &&
            UserData.AccessTwo.split(',').map(item => item.trim())) ||
          []
  
        // setMainAccess(setAccess1) // Update state for main access
        setSubAccess(setAccess2) // Update state for sub access
      }
    }, [UserData]) // Dependency array
  
  
    
  
  
  const [activeFolder, setActiveFolder] = useState("Doctordashboard");
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
      case "Doctordashboard":
        return <Doctordashboard />;
      case "PatientQuelist":
        return <TotalPatientList />;
      case "SpecialityWiseDoctorPatientList":
        return <SpecialityWiseDoctorPatientList />;

      default:
        return null;
    }
  };

  return (
    <div className="folder-container">
      {/* <h2>Doctor</h2> */}
      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
         {showMenu && subAccess.includes('C3-1') && (
        <div
          onClick={() => handleFolderClick("Doctordashboard")}
          className="folder-box"
        >
          Doctor Dashboard
        </div>
        )}

       {showMenu && subAccess.includes('C3-2') && (
        <div
          onClick={() => handleFolderClick("PatientQuelist")}
          className="folder-box"
        >
          Patient Quelist
        </div>
      )}

       {showMenu && subAccess.includes('C3-3') && (

        <div
          onClick={() => handleFolderClick("SpecialityWiseDoctorPatientList")}
          className="folder-box"
        >
          SpecialityWise PatientList
        </div>
      )}
        
      </div>

      <br />

      {renderFolderContent()}
    </div>
  );
}

export default DoctorFolder;
