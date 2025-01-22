import React, { useState, useEffect } from "react";
import "./FolderBox.css"; // Import the CSS file
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


import AppointmentRequestList from "./AppointmentRequestList/AppointmentRequestList";
// import Newregistration from "./Registration/Newregistration";
import RegistrationList from "./RegistrationList/RegistrationList";
import GeneralBillingList from "./Billing/GeneralBillingList";
import Opdqueue from "./RegistrationList/Opdqueue";
import EmgRegistration from "./EmgRegistration/EmgRegistration";
import PatientList from "../PatientManagement/PatientList";
import Iprequestlist from "./RegistrationList/Iprequestlist";
import DoctorsScheduleCalander from "./SlotManagement/DoctorsScheduleCalander";
import FODashboard from "./FODashboard";
import PatientRegistrationSummary from "./Reports/PatientRegistrationSummary";
import ReferalDoctorReport from "./Reports/ReferalDoctorReport";
import RegistrationByReferralReport from "./Reports/ReferalPatientReport";
import TotalPatientReportList from "./Reports/TotalPatientReportList";
import SelfRegistration from "../Barcode/SelfRegistration";
import NewBasicRegistation from "./Registration/NewBasicRegistation";
import IPRegistration from "./Registration/IPRegistration";
import OPVisitEntry from "./Registration/OPVisitEntry";
import EmergencyRegistration from "./Registration/EmergencyRegistration";
import PatientRegistration from "./Registration/PatientRegistration";
import PatientFamilyDetails from "./Registration/PatientFamilyDetails";
import EmergencyPatientRoomRegistration from "./Registration/EmergencyPatientRoomRegistration";
import PatientReports from "./Reports/PatientReports";

function FrontOfficeFolder() {
  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu); // Get showMenu from Redux

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












  const [activeFolder, setActiveFolder] = useState("Dashboard");
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
      case "Dashboard":
        return <FODashboard />;
      case "AppoinmentRequestList":
        return <AppointmentRequestList />;
      case "NewBasicRegistation":
        return <NewBasicRegistation />;
      case "OPVisitEntry":
        return <OPVisitEntry />;
      case "IPRegistration":
        return <IPRegistration />;
      case "EmergencyRegistration":
        return <EmergencyRegistration />;
      case "EmergencyPatientRoomRegistration":
        return <EmergencyPatientRoomRegistration />;
      case "PatientFamilyDetails":
        return <PatientFamilyDetails />
      case "PatientRegistration":
        return <PatientRegistration /> //Emergency Page
      case "PatientRegisterList":
        return <RegistrationList />;
      case "GeneralBilling":
        return <GeneralBillingList />;

      case "OPDQueueList":
        return <Opdqueue />;

      case "PatientManagement":
        return <PatientList />;
      case "IPRequestList":
        return <Iprequestlist />;
      case "DoctorScheduleCalendar":
        return <DoctorsScheduleCalander />;
      case "PatientRegistrationSummary":
        return <PatientRegistrationSummary />;
      case "PatientReports":
        return <PatientReports />;
      case "ReferalDoctorReport":
        return <ReferalDoctorReport />;
      case "RegistrationByReferralReport":
        return <RegistrationByReferralReport />;
      case "TotalPatientList":
        return <TotalPatientReportList />;
      case "SelfRegistration":
        return <SelfRegistration />


      // case "NewBasicRegistation":
      //   return <NewBasicRegistation />
      default:
        return null;
    }
  };

  return (
    <div className="folder-container">

      {/* <h2>Front Office</h2> */}
      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >

        {showMenu && subAccess.includes('A1-1') && (
          <div onClick={() => handleFolderClick("Dashboard")} className="folder-box">
            Dashboard
          </div>
        )}
        {showMenu && subAccess.includes('A1-2') && (
          <div onClick={() => handleFolderClick("AppoinmentRequestList")} className="folder-box">
            Appoinment Request List
          </div>
        )}


        {showMenu && subAccess.includes('A1-3') && (

          <div
            onClick={() => handleFolderClick("NewBasicRegistation")}
            className="folder-box"
          >
            Patient Register
          </div>
        )}
        {showMenu && subAccess.includes('A1-4') && (

          <div
            onClick={() => handleFolderClick("OPVisitEntry")}
            className="folder-box"
          >
            OP Visit Entry
          </div>
        )}
        {showMenu && subAccess.includes('A1-5') && (

          <div
            onClick={() => handleFolderClick("IPRegistration")}
            className="folder-box"
          >
            IP Registration
          </div>
        )}


        {/* {showMenu && subAccess.includes('A1-6') && (

          <div
            onClick={() => handleFolderClick("EmergencyRegistration")}
            className="folder-box"
          >
            Emergency Registration
          </div>
        )} */}


        {showMenu && subAccess.includes('A1-7') && (
          <div
            onClick={() => handleFolderClick("PatientRegisterList")}
            className="folder-box"
          >
            Patient Register List
          </div>
        )}

        {showMenu && subAccess.includes('A1-8') && (
          <div
            onClick={() => handleFolderClick("GeneralBilling")}
            className="folder-box"
          >
            General Billing
          </div>
        )}

        {showMenu && subAccess.includes('A1-9') && (
          <div
            onClick={() => handleFolderClick("OPDQueueList")}
            className="folder-box"
          >
            OPD Queue List
          </div>
        )}

        {/* {showMenu && subAccess.includes('A1-10') && (
          <div
            onClick={() => handleFolderClick("EmgRegisteration")}
            className="folder-box"
          >
            Emg Registeration
          </div>
        )} */}

        {showMenu && subAccess.includes('A1-11') && (

          <div
            onClick={() => handleFolderClick("PatientManagement")}
            className="folder-box"
          >
            Patient Master
          </div>
        )}

        {showMenu && subAccess.includes('A1-12') && (

          <div
            onClick={() => handleFolderClick("IPRequestList")}
            className="folder-box"
          >
            OP-IP Request List
          </div>
        )}

        {showMenu && subAccess.includes('A1-13') && (

          <div
            onClick={() => handleFolderClick("DoctorScheduleCalendar")}
            className="folder-box"
          >
            Doctor Schedule Calendar
          </div>
        )}

        {showMenu && subAccess.includes('A1-14') && (


          <div
            onClick={() => handleFolderClick("PatientReports")}
            className="folder-box"
          >
            PatientReports
          </div>
        )}

          {/* {showMenu && subAccess.includes('A1-15') && (


          <div
            onClick={() => handleFolderClick("ReferalDoctorReport")}
            className="folder-box"
          >
            ReferalDoctorReport
          </div>
          )} */}

          {/* {showMenu && subAccess.includes('A1-16') && (


          <div
            onClick={() => handleFolderClick("RegistrationByReferralReport")}
            className="folder-box"
          >
            ReferalPatientReport
          </div>
          )} */}

          {/* {showMenu && subAccess.includes('A1-17') && (


          <div
            onClick={() => handleFolderClick("TotalPatientList")}
            className="folder-box"
          >
            TotalPatientList
          </div>
          )} */}





        {showMenu && subAccess.includes('A1-18') && (


          <div
            onClick={() => handleFolderClick("SelfRegistration")}
            className="folder-box"
          >
            Self Registration
          </div>
        )}

        {/* {showMenu && subAccess.includes('A1-19') && (


          <div
            onClick={() => handleFolderClick("PatientFamilyDetails")}
            className="folder-box"
          >
            Patient Family Details
          </div>
        )}
         */}
         
        {showMenu && subAccess.includes('A1-20') && (


          <div
            onClick={() => handleFolderClick("PatientRegistration")}
            className="folder-box"
          >
            Emergency
          </div>
        )}
      </div>


      {renderFolderContent()}
    </div>
  );
}

export default FrontOfficeFolder;
