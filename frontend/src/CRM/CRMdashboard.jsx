import React, { useState, useEffect } from "react";
import Opfollowup from './Opfollowup';
import IPfollowup from "./IPfollowup";
import Discharge from "./Discharge";
import Therapy from "./Therapy";
import Labque from "./Labque";
import Radiologyque from "./Radiologyque";
import { useDispatch, useSelector } from 'react-redux'


const CRMdashboard = () => {

  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu); 
  const dispatchvalue = useDispatch()


   const [activeFolder, setActiveFolder] = useState("Opfollowup");
      const [showFolders, setShowFolders] = useState(false);

      
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
              case "Opfollowup":
                return <Opfollowup />;
              case "IPfollowup":
                return <IPfollowup/>;
              case "Discharge":
                return <Discharge />;
              case "Therapy":
                return <Therapy />;
              case "Labque":
                return <Labque/>;
                case "Radiologyque":
                  return <Radiologyque/>;
              default:
                return null;
            }
          };

          
  return (
    <div className="folder-container">
    {/* <h2>CRM </h2> */}
    <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>
      
    {showMenu &&( <div onClick={() => handleFolderClick("Opfollowup")}
              className="folder-box">Followup</div>
  )}
    {showMenu &&( <div onClick={() => handleFolderClick("IPfollowup")}
              className="folder-box"> Pending Documents</div>
)}
   {showMenu &&(  <div onClick={() => handleFolderClick("Discharge")}
              className="folder-box"> Discharged PatientQuelist</div>
  )}
   {showMenu &&(  <div onClick={() => handleFolderClick("Therapy")}
              className="folder-box"> Therapy PatientQuelist</div>
  )}
   {showMenu &&(  <div onClick={() => handleFolderClick("Labque")}
              className="folder-box">Lab PatientQuelist</div>
     )}
      {showMenu && (     <div onClick={() => handleFolderClick("Radiologyque")}
              className="folder-box">Radiology PatientQuelist</div>
            )}
              </div>
  

    {renderFolderContent()}
  </div>
  )
}

export default CRMdashboard