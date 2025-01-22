import React, { useState, useEffect } from "react";
import HospitalDetials from "./HospitalMaster/HospitalDetials";
import DutyRousterMaster from "./HRMasters/DutyRousterMaster";
import ConsentFormsMaster from "./ConsentForms/ConsentFormsMaster";
import RoomMaster from "./RoomMaster/RoomMaster";
import ReferalRoute from "./ReferalRouteMaster/ReferalRoute";
import DoctorList from "./DoctorMaster/DoctorList";
import BasicMaster from "./BasicMaster/BasicMaster";
import OtMaster from "./OtMaster/OtMaster";
import AnaesthesiaMaster from "./OtMaster/AnaesthesiaMaster";
import UserRegisterList from "./UserRegisterMaster/UserRegisterList";
import InsClientDonationList from "./InsuranceClientMaster/InsClientDonationList";
import ServiceProcedureMasterList from "./ServiceProcedureMaster/ServiceProcedureMasterList";
import LabMaster from "./LabMaster/LabMaster";
import SurgeryMaster from "./SurgeryMaster/SurgeryMaster";
import FrequencyMaster from "./RoomMaster/FrequencyMaster";
import Apprenewal from "./BasicMaster/Apprenewal";
import LocationMaster from "./LocationMaster/LocationMaster";
import TherapyMaster from "./TherapyMaster/TherapyMaster";
import RadiologyMaster from "./RadiologyMaster/RadiologyMaster";
// import RatecardMaster from "./RatecardMaster/RatecardMaster";
import ICDCodeMaster from "./ICD10code/ICDCodeMaster";
import RatecardMaster from "./RateCard/Ratecard";
import NurseStationMaser from "./NurseStationMaser";

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LabMasterNavigation from "./LabMaster/LabMasterNavigation";
import Servicecategory from "./ServiceProcedureMaster/Servicecategory";
import ServiceSubCategory from "./ServiceSubCategory/ServiceSubCategory";
import PackageMaster from "./PackageMaster/PackageMaster";
const MasterFolder = () => {

    const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 
    const dispatchvalue = useDispatch()

  const [activeFolder, setActiveFolder] = useState("HospitalClinicMaster");
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
      case "HospitalClinicMaster":
        return <HospitalDetials />;
      case "DutyRousterMaster":
        return <DutyRousterMaster />;
      case "ConsentFormsMaster":
        return <ConsentFormsMaster />;
      case "RoomMaster":
        return <RoomMaster />;
      case "Referal_Route":
        return <ReferalRoute />;
      case "DoctorList":
        return <DoctorList />;
      case "Basic_Master":
        return <BasicMaster />;
      case "OtMaster":
        return <OtMaster />;
      case "AnaesthesiaMaster":
        return <AnaesthesiaMaster />;
      case "UserRegisterList":
        return <UserRegisterList />;
      case "InsClientDonationList":
        return <InsClientDonationList />;
      case "Radiology_Master":
        return <RadiologyMaster />;
      case "ServiceProcedureMasterList":
        return <ServiceProcedureMasterList />;

      case 'Servicecategory':
        return <Servicecategory />;
      case 'ServiceSubCategory':
        return <ServiceSubCategory />;
      case "Lab_Master":
        return <LabMasterNavigation />;
      case "Surgery_Master":
        return <SurgeryMaster />;
      case "FrequencyMaster":
        return <FrequencyMaster />;
      case "apprenewal":
        return <Apprenewal />;
      case "LocationMaster":
        return <LocationMaster />;
      case "TherapyMaster":
        return <TherapyMaster />;
      case "RatecardMaster":
        return <RatecardMaster />;
      case "RatecardMaster1":
        return <RatecardMaster />;
      case "ICDCodeMaster":
        return <ICDCodeMaster />;
      case 'NurseStationMaser':
        return <NurseStationMaser />;
      case 'PackageMaster':
          return <PackageMaster />;
      
      default: return null;
    }
  };
  return (
    <div className="folder-container">
      {/* <h2>Masters</h2> */}

      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

       {showMenu && subAccess.includes('J10-1') && (
          <div
            onClick={() => handleFolderClick("HospitalClinicMaster")}
            className="folder-box"
          >
            Hospital / Clinic Master
          </div>
        )}

        {/* {subAccess.includes('J10-2') && (


          <div
            onClick={() => handleFolderClick("DutyRousterMaster")}
            className="folder-box"
          >
            Duty Rouster Master
          </div>
        )} */}

       {showMenu && subAccess.includes('J10-3') && (


          <div
            onClick={() => handleFolderClick("ConsentFormsMaster")}
            className="folder-box"
          >
            Consent Forms Master
          </div>
        )}

       {showMenu && subAccess.includes('J10-4') && (

          <div
            onClick={() => handleFolderClick("RoomMaster")}
            className="folder-box"
          >
            Room Master
          </div>
        )}

       {showMenu && subAccess.includes('J10-5') && (

          <div
            onClick={() => handleFolderClick("Referal_Route")}
            className="folder-box"
          >
            Referal Route
          </div>
        )}

       {showMenu && subAccess.includes('J10-6') && (

          <div
            onClick={() => handleFolderClick("DoctorList")}
            className="folder-box"
          >
            Doctor Master
          </div>
        )}

       {showMenu && subAccess.includes('J10-7') && (

          <div
            onClick={() => handleFolderClick("Basic_Master")}
            className="folder-box"
          >
            Basic Master
          </div>
        )}

       {showMenu && subAccess.includes('J10-8') && (

          <div
            onClick={() => handleFolderClick("OtMaster")}
            className="folder-box"
          >
            Operation Theatre Master
          </div>
        )}

       {showMenu && subAccess.includes('J10-9') && (

          <div
            onClick={() => handleFolderClick("AnaesthesiaMaster")}
            className="folder-box"
          >
            Anaesthesia Master
          </div>
        )}

       {showMenu && subAccess.includes('J10-10') && (

          <div
            onClick={() => handleFolderClick("UserRegisterList")}
            className="folder-box"
          >
            User Register List
          </div>
        )}

       {showMenu && subAccess.includes('J10-11') && (

          <div
            onClick={() => handleFolderClick("InsClientDonationList")}
            className="folder-box"
          >
            Insurence/ Client/ Donation List
          </div>
        )}

       {showMenu && subAccess.includes('J10-12') && (

          <div
            onClick={() => handleFolderClick("ServiceProcedureMasterList")}
            className="folder-box"
          >
            Service Therapy Master
          </div>
        )}




       {showMenu && subAccess.includes('J10-13') && (

          <div
            onClick={() => handleFolderClick("Servicecategory")}
            className="folder-box"
          >
            Servicecategory
          </div>
        )}


       {showMenu && subAccess.includes('J10-14') && (

          <div
            onClick={() => handleFolderClick("ServiceSubCategory")}
            className="folder-box"
          >
            ServiceSubCategory
          </div>
        )}

       {showMenu && subAccess.includes('J10-15') && (

          <div
            onClick={() => handleFolderClick("Radiology_Master")}
            className="folder-box"
          >
            Radiology Master
          </div>
        )}

       {showMenu && subAccess.includes('J10-16') && (

          <div
            onClick={() => handleFolderClick("Lab_Master")}
            className="folder-box"
          >
            Lab Master
          </div>
        )}

       {showMenu && subAccess.includes('J10-17') && (

          <div
            onClick={() => handleFolderClick("Surgery_Master")}
            className="folder-box"
          >
            Surgery Master
          </div>
        )}

       {showMenu && subAccess.includes('J10-18') && (

          <div
            onClick={() => handleFolderClick("FrequencyMaster")}
            className="folder-box"
          >
            Frequency Master
          </div>
        )}

       {showMenu && subAccess.includes('J10-19') && (

          <div
            onClick={() => handleFolderClick("apprenewal")}
            className="folder-box"
          >
            Software Renewal
          </div>
        )}

       {showMenu && subAccess.includes('J10-20') && (

          <div
            onClick={() => handleFolderClick("LocationMaster")}
            className="folder-box"
          >
            Location Master
          </div>
        )}

       {showMenu && subAccess.includes('J10-21') && (

          <div
            onClick={() => handleFolderClick("TherapyMaster")}
            className="folder-box"
          >
            Therapy Master
          </div>
        )}

       {showMenu && subAccess.includes('J10-22') && (

          <div
            onClick={() => handleFolderClick("RatecardMaster1")}
            className="folder-box"
          >
            Ratecard Master
          </div>
        )}

       {showMenu && subAccess.includes('J10-23') && (

          <div
            onClick={() => handleFolderClick("ICDCodeMaster")}
            className="folder-box"
          >
            ICDCode Master
          </div>
        )}
       {showMenu && subAccess.includes("J10-24") && (
          <div
            onClick={() => handleFolderClick("NurseStationMaser")}
            className="folder-box"
          >
            NurseStation Maser
          </div>
        )}

       {showMenu && subAccess.includes("J10-25") && (
          <div
            onClick={() => handleFolderClick("PackageMaster")}
            className="folder-box"
          >
            PackageMaster 
          </div>
        )}
        



      </div>



      {renderFolderContent()}
    </div>


  )
};

export default MasterFolder;
