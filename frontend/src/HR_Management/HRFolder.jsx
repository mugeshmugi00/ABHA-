import React, { useState, useEffect } from "react";
import EmployeeRegistration from "./EmployeeRegistration";
import EmployeeRegistrationList from "./EmployeeRegistrationList";
import DutyRoster from "./DutyRoster";
import EmployeeReport from "./EmployeeReport";
import JobRequirement from "./JobRequiremet";

import EmployeeSourceWiseList from "./EmployeeSourceWiseList";
import LeaveManagementNavigation from "./LeaveManagementNavigation";
import AdvanceManagementNavigation from "./AdvanceManagementNavigation";
import EmployeeDutyManagement from "./EmployeeDutyManagement";
import EmployeeAttendance from "./Attendance";
import PayRoll from "./PayRoll";
import ApraisalNavigation from "./ApraisalNavigation";
import ComplaintAction from "./ComplaintAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Circular from "./Circular";
import DutyRosterMasterList from "./DutyRosterMasterList";
import HrDashboard from "./HrDashboard";

const HRFolder = () => {
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 
    const dispatchvalue = useDispatch();

  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder);
  const [activeFolder, setActiveFolder] = useState("HrDashboard");
  const [showFolders, setShowFolders] = useState(false);
  // console.log(activeHrFolder,'activeHrFolder');

  const UserData = useSelector((state) => state.userRecord?.UserData);

  const [subAccess, setSubAccess] = useState([]);

  useEffect(() => {
    console.log(UserData, "UserData");

    if (UserData) {
      const setAccess2 =
        (UserData.AccessTwo &&
          UserData.AccessTwo.split(",").map((item) => item.trim())) ||
        [];

      setSubAccess(setAccess2); // Update state for sub access
    }
  }, [UserData]); // Dependency array

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
      case "HrDashboard":
        return <HrDashboard />;

      case "EmployeeRegistration":
        return <EmployeeRegistration />;
      case "EmployeeRegistrationList":
        return <EmployeeRegistrationList />;
      case "EmployeeSourceWiseList":
        return <EmployeeSourceWiseList />;
      case "Attendance":
        return <EmployeeAttendance />;
      case "DutyRosterMasterList":
        return <DutyRosterMasterList />;
      case "LeaveMangement":
        return <LeaveManagementNavigation />;
      case "EmployeeReport":
        return <EmployeeReport />;
      case "PayRoll":
        return <PayRoll />;
      case "JobRequirements":
        return <JobRequirement />;
      case "AdvanceManagementNavigation":
        return <AdvanceManagementNavigation />;
      case "ShiftManagement":
        return <EmployeeDutyManagement />;
      case "Performance":
        return <ApraisalNavigation />;
      case "ComplaintAction":
        return <ComplaintAction />;
      case "Circular":
        return <Circular />;
      default:
        return null;
    }
  };
  return (
    <div className="folder-container">
      {/* <h2>HR Management</h2> */}
      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
        {/* {subAccess.includes('S19-1') && (
          <div onClick={() => handleFolderClick("EmployeeRegistration")}
            className="folder-box"> Employee Registration</div>
        )} */}

{showMenu && subAccess.includes("S19-14") && (
  
          <div
            onClick={() => handleFolderClick("HrDashboard")}
            className="folder-box"
          >
            {" "}
            Hr Dashboard
          </div>
        )}



       {showMenu && subAccess.includes("S19-1") && (
          <div
            onClick={() => handleFolderClick("EmployeeRegistrationList")}
            className="folder-box"
          >
            {" "}
            Employee Registration{" "}
          </div>
        )}
       {showMenu && subAccess.includes("S19-2") && (
          <div
            onClick={() => handleFolderClick("DutyRosterMasterList")}
            className="folder-box"
          >
            {" "}
            Duty Master
          </div>
        )}

       {showMenu && subAccess.includes("S19-3") && (
          <div
            onClick={() => handleFolderClick("ShiftManagement")}
            className="folder-box"
          >
            {" "}
            Duty Rouster
          </div>
        )}

       {showMenu && subAccess.includes("S19-4") && (
          <div
            onClick={() => handleFolderClick("LeaveMangement")}
            className="folder-box"
          >
            {" "}
            Leave Mangement
          </div>
        )}

       {showMenu && subAccess.includes("S19-5") && (
          <div
            onClick={() => handleFolderClick("AdvanceManagementNavigation")}
            className="folder-box"
          >
            {" "}
            Advance Management
          </div>
        )}

       {showMenu && subAccess.includes("S19-6") && (
          <div
            onClick={() => handleFolderClick("Attendance")}
            className="folder-box"
          >
            {" "}
            Attendance Management
          </div>
        )}
       {showMenu && subAccess.includes("S19-7") && (
          <div
            onClick={() => handleFolderClick("PayRoll")}
            className="folder-box"
          >
            {" "}
            PayRoll
          </div>
        )}

       {showMenu && subAccess.includes("S19-8") && (
          <div
            onClick={() => handleFolderClick("EmployeeReport")}
            className="folder-box"
          >
            {" "}
            Employee Report
          </div>
        )}
       {showMenu && subAccess.includes("S19-9") && (
          <div
            onClick={() => handleFolderClick("JobRequirements")}
            className="folder-box"
          >
            {" "}
            Job Requirements
          </div>
        )}
       {showMenu && subAccess.includes("S19-10") && (
          <div
            onClick={() => handleFolderClick("EmployeeSourceWiseList")}
            className="folder-box"
          >
            {" "}
            Candidate List
          </div>
        )}

       {showMenu && subAccess.includes("S19-11") && (
          <div
            onClick={() => handleFolderClick("Performance")}
            className="folder-box"
          >
            {" "}
            Performance Management
          </div>
        )}
       {showMenu && subAccess.includes("S19-12") && (
          <div
            onClick={() => handleFolderClick("ComplaintAction")}
            className="folder-box"
          >
            Complaint/Grievance
          </div>
        )}
       {showMenu && subAccess.includes("S19-13") && (
          <div
            onClick={() => handleFolderClick("Circular")}
            className="folder-box"
          >
            Circular
          </div>
        )}
      </div>

      {renderFolderContent()}
    </div>
  );
};

export default HRFolder;
