import React, { useState, useEffect, lazy, Suspense } from "react";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

import PatientRegistrationSummary from "./PatientRegistrationSummary";
import ReferalDoctorReport from "./ReferalDoctorReport";
import RegistrationByReferralReport from "./ReferalPatientReport";
import TotalPatientReportList from "./TotalPatientReportList";


const PatientReports = () => {

    const [ActiveTab, setActiveTab] = useState('EmergencyRegistration')
    const [isToggled, setIsToggled] = useState(false)
    const toggle = () => setIsToggled(!isToggled);


    const handleTabChange = (tab) => {
        setActiveTab(tab);
        closeToggle();
    };

    const closeToggle = () => {
        setIsToggled(false);
        };
        


  return (

    <>
    <div className="Main_container_app">
       <div className="">

        <div className="new-patient-registration-form">
            <div className="new-navigation">
                <h2>
                    <button style={{ color: ActiveTab === "PatientRegistrationSummary" ? 'white' : '' }} onClick={() => handleTabChange("PatientRegistrationSummary")}>
                    Patient Registration Summary
                    </button>
                    |
                    <button style={{ color: ActiveTab === "ReferalDoctorReport" ? 'white' : '' }} onClick={() => handleTabChange("ReferalDoctorReport")}>
                    Referal Doctor Report
                    </button>
                    |
                    <button style={{ color: ActiveTab === "RegistrationByReferralReport" ? 'white' : '' }} onClick={() => handleTabChange("RegistrationByReferralReport")}>
                    Registration By ReferralReport
                    </button>
                    |
                    <button style={{ color: ActiveTab === "TotalPatientReportList" ? 'white' : '' }} onClick={() => handleTabChange("TotalPatientReportList")}>
                    Total Patient ReportList
                    </button>

                </h2>
            </div>

            <div className="new-kit ">
                <button className="new-tog" onClick={toggle}>
                    {isToggled ? <ToggleOffIcon /> : <ToggleOnIcon />}
                </button>

                <div>
                {isToggled && (
                  <div className="new-navigation-toggle">
                    <h2>
                    <button style={{ color: ActiveTab === "PatientRegistrationSummary" ? 'white' : '' }} onClick={() => handleTabChange("PatientRegistrationSummary")}>
                    Patient Registration Summary
                    </button>
                    |
                    <button style={{ color: ActiveTab === "ReferalDoctorReport" ? 'white' : '' }} onClick={() => handleTabChange("ReferalDoctorReport")}>
                    Referal Doctor Report
                    </button>
                    |
                    <button style={{ color: ActiveTab === "RegistrationByReferralReport" ? 'white' : '' }} onClick={() => handleTabChange("RegistrationByReferralReport")}>
                    Registration By ReferralReport
                    </button>
                    |
                    <button style={{ color: ActiveTab === "TotalPatientReportList" ? 'white' : '' }} onClick={() => handleTabChange("TotalPatientReportList")}>
                    Total Patient ReportList
                    </button>
                    
                    </h2>
                  </div>
                )}
              </div>
            </div>


            
            

        </div>

        </div>



        <Suspense fallback={<div>Loading...</div>}>
            {ActiveTab === "PatientRegistrationSummary" && <PatientRegistrationSummary />}
            {ActiveTab === "ReferalDoctorReport" && <ReferalDoctorReport />}
            {ActiveTab === "RegistrationByReferralReport" && <RegistrationByReferralReport />}
            {ActiveTab === "TotalPatientReportList" && <TotalPatientReportList />}
        </Suspense>

    </div>

    
    
    </>
    
  )
}

export default PatientReports;