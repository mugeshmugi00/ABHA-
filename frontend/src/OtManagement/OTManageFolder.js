import React, { useState, useEffect } from "react";

import TheatreBooking from "./TheatreBooking";
import OtQuelist from "./OtQuelist";
import OtDoctorQueueList from "./OtDoctor/OtDoctorQueueList";
import OtDoctorNavigation from "./OtDoctor/OtDoctorNavigation";
import OtAnaesthesiaNavigation from "./OTAnaesthesia/OtAnaesthesiaNavigation";
import OtNurseeNavigation from "./OtNurse/OtNurseeNavigation";
import New_theater_booking from "./New_theater_booking";
import SurgicalTeam from "./SurgicalTeam";

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import OtMaster from "../Masters/OtMaster/OtMaster";
import OtCharges from "./OtCharges";



const OTManageFolder = () => {

    const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 

  const dispatchvalue = useDispatch()

  const [activeFolder, setActiveFolder] = useState("NewOTBook");
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
      case "NewOTBook":
        return <New_theater_booking />;
      case "OT_Queue_List":
        return <OtQuelist />;
      case "SurgicalTeam":
        return <SurgicalTeam />;
      case "Doctor_OueueList":
        return <OtDoctorQueueList />;
      case "OT_Doctor":
        return <OtDoctorNavigation />;
      case "OT_Anaesthesia":
        return <OtAnaesthesiaNavigation />;
      case "OT_Nurse":
        return <OtNurseeNavigation />;
      case "OtMaster":
        return <OtMaster />
      case "OtCharges":
        return <OtCharges/>;

      default:
        return null;
    }
  };

  return (
    <div className="folder-container">
      {/* <h2>OT Management</h2> */}

      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

       {showMenu && subAccess.includes('J10-8') && (

          <div
            onClick={() => handleFolderClick("OtMaster")}
            className="folder-box"
          >
            Operation Theatre Master
          </div>
        )}

       {showMenu && subAccess.includes('N14-1') && (
          <div onClick={() => handleFolderClick("NewOTBook")}
            className="folder-box"> New Theatre Book</div>
        )}

       {showMenu && subAccess.includes('N14-3') && (

          <div onClick={() => handleFolderClick("OT_Queue_List")}
            className="folder-box"> OT QueList</div>
        )}
       {showMenu && subAccess.includes('N14-2') && (

          <div onClick={() => handleFolderClick("SurgicalTeam")}
            className="folder-box"> Surgical Team</div>
        )}
       {showMenu && subAccess.includes('N14-4') && (

          <div onClick={() => handleFolderClick("Doctor_OueueList")}
            className="folder-box"> Doctor QueList</div>
        )}
       {showMenu && subAccess.includes('N14-5') && (

          <div onClick={() => handleFolderClick("OT_Doctor")}
            className="folder-box"> OT Doctor</div>
        )}

       {showMenu && subAccess.includes('N14-6') && (

          <div onClick={() => handleFolderClick("OT_Anaesthesia")}
            className="folder-box"> OT Anaesthesia</div>
        )}
       {showMenu && subAccess.includes('N14-7') && (

          <div onClick={() => handleFolderClick("OT_Nurse")}
            className="folder-box"> OT Nurse</div>
        )}
       {showMenu && subAccess.includes("N14-8") && (
          <div
            onClick={() => handleFolderClick("OtCharges")}
            className="folder-box"
          >
            OT Charges
          </div>
        )}








      </div>

      {renderFolderContent()}
    </div>
  );
};

export default OTManageFolder;
