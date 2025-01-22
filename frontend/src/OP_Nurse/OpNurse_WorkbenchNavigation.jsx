import React, { useState, useEffect, lazy, Suspense } from "react";
import "../DoctorWorkBench/Navigation.css";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import bgImg2 from "../Assets/bgImg2.jpg";
// import './TreatmentComponent.css'
import '../DoctorWorkBench/TreatmentComponent.css'
// import "../DoctorWorkBench/TreatmentComponent.css";
import axios from 'axios';
// import OpNurse_PastHistory from "./OpNurse_PastHistory.jsx";


const OpNurse_Vitals = lazy(() => import('./OpNurse_Vitals.jsx'));
const OpNurse_PastHistory = lazy(() => import('./OpNurse_PastHistory.jsx'));
const OpNurse_Allergy = lazy(() => import('./OpNurse_Allergy.jsx'));
const OpNurse_GeneralEvaluation = lazy(() => import('./OpNurse_GeneralEvaluation.jsx'));


// const Allergy = lazy(() => import('./Allergy.jsx'));
// const Neurology = lazy(() => import('./Neurology.jsx'));
// const IFCard = lazy(() => import('./IFCard.jsx'));
// const Gynecology = lazy(() => import('./Gynecology.jsx'));
// const OP_Sheet = lazy(() => import('./OP_Sheet.jsx'));
// const Prescription = lazy(() => import('./Prescription.js'));
// const NewProcedure = lazy(() => import('./NewProcedure.js'));
// const GeneralEvaluation = lazy(() => import('./GeneralEvaluation.jsx'));
// const LabTest = lazy(() => import('./LabTest.jsx'));
// const RadiologyTest = lazy(() => import('./RadiologyTest.jsx'));
// const Opthalmology = lazy(() => import('./Opthalmology.jsx'));
// const AncCard = lazy(() => import('./ANCCard.jsx'));

// const ReferaDoctor = lazy(() => import('./ReferaDoctor.jsx'));
// const FollowUp = lazy(() => import('./FollowUp.jsx'));
// const OtRequest = lazy(() => import('./OtRequest.jsx'));
// const OpIpconnect = lazy(() => import('./OpIpconnect.jsx'))


const OpNurse_WorkbenchNavigation = () => {
  const DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.DoctorWorkbenchNavigation);
  console.log(DoctorWorkbenchNavigation,'DoctorWorkbenchNavigation');
  const UserData = useSelector(state => state.userRecord?.UserData)
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [ActiveTab, setActiveTab] = useState('OpNurse_Vitals')
  const [isToggled, setIsToggled] = useState(false)

  const toggle = () => setIsToggled(!isToggled);
   
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    closeToggle();
  };

  const closeToggle = () => {
    setIsToggled(false);
  };

  useEffect(() => {
    console.log(DoctorWorkbenchNavigation);
    if (Object.keys(DoctorWorkbenchNavigation).length === 0) {
      navigate('/Home/TotalNursePatientList')
    }
  }, [DoctorWorkbenchNavigation])

  const [SpecialityData, setSpecialityData] = useState([])
  console.log(SpecialityData,'SpecialityData');
  

  useEffect(() => {
    axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
        .then((res) => {
            const ress = res.data
            setSpecialityData(ress)
        })
        .catch((err) => {
            console.log(err);
        })
}, [UrlLink])


  const [AllergyData, setAllergyData] = useState([])
  console.log(AllergyData,'AllergyData');
  



  useEffect(() => {
    axios.get(`${UrlLink}Workbench/Allergy_Details_Link`, {
        params: {
            RegistrationId: DoctorWorkbenchNavigation?.pk, 
        }
    })
    .then((res) => {
        setAllergyData(res.data);
    })
    .catch((err) => {
        console.log(err);
    });
}, [UrlLink, DoctorWorkbenchNavigation]);

const [condition,setCondition] = useState(false)


// useEffect(()=> {
//   console.log('1111111111');
//   const SpecData = SpecialityData?.find((p)=> p?.Speciality_Id === DoctorWorkbenchNavigation?.Specialization) 
  
//   console.log(SpecData,'SpecData');
  
//   const Speciality = UserData?.Specialization && DoctorWorkbenchNavigation?.Specialization === SpecData?.Speciality_Id
//   console.log('222222222222',Speciality);
  
//   if (Speciality) {
//     const PatientSpeciality = DoctorWorkbenchNavigation?.Specialization === SpecData?.Speciality_Id
//     console.log(PatientSpeciality,'PatientSpeciality');

//     if (SpecData?.SpecialityName === 'NEUROLOGY'){
//       setCondition(true)
//       console.log('NEUROLOGY',condition);

//     }
//     else if (SpecData?.SpecialityName === 'CARDIOLOGY') {

//       setCondition(true)
//       console.log('CARDIOLOGY',condition);

//     }
//     else if (SpecData?.SpecialityName === 'GYNECOLOGY') {

//       setCondition(true)
//       console.log('GYNECOLOGY',condition);

//     }
//     else if (SpecData?.SpecialityName === 'OPTHALMOLOGY') {
//       console.log('OPTHALMOLOGY',condition);

//       setCondition(true)
//     }
//     else if (SpecData?.SpecialityName === 'ONCOLOGY') {
//       console.log('ONCOLOGY',condition);

//       setCondition(true)
//     }
    
//   }
// },[UserData,DoctorWorkbenchNavigation,SpecialityData])



// useEffect(() => {
//   console.log('1111111111');
  
//   // Find the relevant specialization data
//   const SpecData = SpecialityData?.find(
//     (p) => p?.Speciality_Id === DoctorWorkbenchNavigation?.Specialization
//   );

//   console.log(SpecData, 'SpecData');

//   if (!SpecData) {
//     console.error('SpecData not found');
//     return;
//   }

//   // Check if the user's specialization matches
//   const Speciality =
//     UserData?.Specialization &&
//     DoctorWorkbenchNavigation?.Specialization === SpecData?.Speciality_Id;

//   console.log('222222222222', Speciality);

//   if (Speciality) {
//     const validSpecialities = [
//       'NEUROLOGY',
//       'CARDIOLOGY',
//       'GYNECOLOGY',
//       'OPTHALMOLOGY',
//       'ONCOLOGY',
//     ];

//     // Check if the specialization is valid
//     if (validSpecialities.includes(SpecData?.SpecialityName)) {
//       setCondition(true);
//       console.log(SpecData?.SpecialityName, 'Speciality set to true');
//       console.log(condition,'condition');
      
//     } else {
//       setCondition(false);
//     }
//   }
// }, [UserData, DoctorWorkbenchNavigation, SpecialityData]);






// useEffect(() => {
//   console.log('1111111111');

//   if (!SpecialityData || !DoctorWorkbenchNavigation?.Specialization) {
//     console.error("Missing SpecialityData or DoctorWorkbenchNavigation.Specialization");
//     return;
//   }

//   const SpecData = SpecialityData.find(
//     (p) => p?.Speciality_Id === DoctorWorkbenchNavigation?.Specialization
//   );

//   console.log(SpecData, 'SpecData');

//   if (!SpecData) {
//     console.error("No matching SpecData found");
//     return;
//   }

//   const Speciality =
//     UserData?.Specialization &&
//     DoctorWorkbenchNavigation?.Specialization === SpecData?.Speciality_Id;

//   console.log('222222222222', Speciality);

//   if (Speciality) {
//     const validSpecialities = [
//       'NEUROLOGY',
//       'CARDIOLOGY',
//       'GYNECOLOGY',
//       'OPTHALMOLOGY',
//       'ONCOLOGY',
//     ];

//     if (validSpecialities.includes(SpecData?.SpecialityName)) {
//       setCondition(true);
//       console.log(condition,'validSpecialities');
      
//     } else {
//       setCondition(false);
//     }
//   }
// }, [UserData, DoctorWorkbenchNavigation, SpecialityData]);






const [specialityName, setSpecialityName] = useState(null);

useEffect(() => {
  console.log("1111111111");
  const SpecData = SpecialityData?.find(
    (p) => p?.Speciality_Id === DoctorWorkbenchNavigation?.Specialization
  );

  console.log(SpecData, "SpecData");

  const Speciality =
    UserData?.Specialization &&
    DoctorWorkbenchNavigation?.Specialization === SpecData?.Speciality_Id;

  console.log("222222222222", Speciality);

  if (Speciality) {
    setSpecialityName(SpecData?.SpecialityName); // Set the SpecialityName dynamically
  } else {
    setSpecialityName(null); // Reset if no match
  }
}, [UserData, DoctorWorkbenchNavigation, SpecialityData]);

  return (

    <>
      <div className="Main_container_app">
        <div className="new-patient-registration-form">
       
          <div className="dctr_info_up_head">
            <div className="RegisFormcon ">
              <div className="dctr_info_up_head22">

                <img src={bgImg2} alt="Default Patient Photo" />

                <label>Profile</label>
              </div>
            </div>

            <div className="RegisFormcon_1">
              <div className="RegisForm_1 ">
                <label htmlFor="PatientID">
                  Patient ID <span>:</span>
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientID">
                  {DoctorWorkbenchNavigation?.PatientId}
                </span>
              </div>
              <div className="RegisForm_1 ">
                <label htmlFor="PatientName">
                  Patient Name <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientName">
                  {DoctorWorkbenchNavigation?.PatientName}

                </span>
              </div>

              <div className="RegisForm_1 ">
                <label htmlFor="OpNo">
                  OP No <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientName">
                  {DoctorWorkbenchNavigation?.OpNo}
                </span>
              </div>
              <div className="RegisForm_1 ">
                <label htmlFor="PrimaryDoctor">
                  Primary Doctor <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientName">
                  {DoctorWorkbenchNavigation?.PrimaryDoctor}
                </span>
              </div>

              <div className="RegisForm_1">
                <label htmlFor="AgeGender">
                  Age / Gender<span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" id="AgeGender">
                  {DoctorWorkbenchNavigation?.Age} /{" "}
                  {DoctorWorkbenchNavigation?.Gender}
                </span>
              </div>
              <div className="RegisForm_1">
                <label htmlFor="Client">
                  Client<span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" id="Client">
                  {DoctorWorkbenchNavigation?.Client}
                </span>
              </div>
              <div className="RegisForm_1 ">
                <label htmlFor="BloodGroup">
                  Blood Group <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="BloodGroup">
                  {DoctorWorkbenchNavigation?.BloodGroup}
                </span>
              </div>
              <div className="RegisForm_1 ">
                <label htmlFor="Gender">
                Allergy <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="Gender">
                  {AllergyData?.map((allergy) => allergy.Allergent).join(", ")}
                </span>
              </div>
            </div>
          </div>


          <div className="new-patient-registration-form">
            <div className="new-navigation">
              <h2>
                <button style={{ color: ActiveTab === "OpNurse_Vitals" ? 'white' : '' }} onClick={() => handleTabChange("OpNurse_Vitals")}>
                  Vitals
                </button>

                |
                <button style={{ color: ActiveTab === "OpNurse_PastHistory" ? 'white' : '' }} onClick={() => handleTabChange("OpNurse_PastHistory")}>
                  Past History
                </button>

                |
                
                <button style={{ color: ActiveTab === "OpNurse_Allergy" ? 'white' : '' }} onClick={() => handleTabChange("OpNurse_Allergy")}>
                Allergy
                </button>
                |
                <button style={{ color: ActiveTab === "OpNurse_GeneralEvaluation" ? 'white' : '' }} onClick={() => handleTabChange("OpNurse_GeneralEvaluation")}>
                  GeneralEvaluation
                </button>
                
                

                {/* <button style={{ color: ActiveTab === "Prescription" ? 'white' : '' }} onClick={() => handleTabChange("Prescription")}>
                  Prescription
                </button>
                | */}


                {/* <button style={{ color: ActiveTab === "Refer_Doctor" ? 'white' : '' }} onClick={() => handleTabChange("Refer_Doctor")}>
                  Refer Doctor
                </button>
                |
                <button style={{ color: ActiveTab === "OP_IP_Connect" ? 'white' : '' }} onClick={() => handleTabChange("OP_IP_Connect")}>
                  OP-IP
                </button>
                |
                <button style={{ color: ActiveTab === "FollowUp" ? 'white' : '' }} onClick={() => handleTabChange("FollowUp")}>
                FollowUp
                </button>
                |
                <button style={{ color: ActiveTab === "OtRequest" ? 'white' : '' }} onClick={() => handleTabChange("OtRequest")}>
                OtRequest
                </button> */}
                
                {/* {specialityName === "OPTHALMOLOGY" && (
                  <>
                  <button style={{ color: ActiveTab === "Opthalmology" ? 'white' : '' }} onClick={() => handleTabChange("Opthalmology")}>
                  Opthalmology
                  </button>
                  |
                  </>
                )}

                {specialityName === "NEUROLOGY" && (
                  <>
                  <button style={{ color: ActiveTab === "Neurology" ? 'white' : '' }} onClick={() => handleTabChange("Neurology")}>
                  Neurology Form
                  </button>
                  |
                  <button style={{ color: ActiveTab === "OP_Sheet" ? 'white' : '' }} onClick={() => handleTabChange("OP_Sheet")}>
                  Neuro Surgery
                  </button>
                  |

                  </>
                )}

                {specialityName === "GYNECOLOGY" && (
                <>
                <button style={{ color: ActiveTab === "IFCard" ? 'white' : '' }} onClick={() => handleTabChange("IFCard")}>
                  IFCard
                </button>
                |
                <button style={{ color: ActiveTab === "Gynecology" ? 'white' : '' }} onClick={() => handleTabChange("Gynecology")}>
                Gynecology
                </button>
                |
                <button style={{ color: ActiveTab === "AncCard" ? 'white' : '' }} onClick={() => handleTabChange("AncCard")}>
                  ANCCard
                </button>
                |
                </>
              )} */}


                {/* <div className="Lab_dropdown">
                  <button style={{ color: ActiveTab === "Lab_Test" || ActiveTab === "Radiology_Test" ? 'white' : '' }} className="Lab_button">Diagnostics</button>
                  <div className="Lab_dropdown_content">
                    <button style={{ color: ActiveTab === "Lab_Test" ? 'white' : '' }} onClick={() => handleTabChange("Lab_Test")}>
                      Lab
                    </button>
                    <button style={{ color: ActiveTab === "Radiology_Test" ? 'white' : '' }} onClick={() => handleTabChange("Radiology_Test")}>
                      Radiology
                    </button>
                  </div>
                </div> */}
                
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
                      <button style={{ color: ActiveTab === "OpNurse_Vitals" ? 'white' : '' }} onClick={() => handleTabChange("OpNurse_Vitals")}>
                        Vitals
                      </button>
                      |
                      <button style={{ color: ActiveTab === "OpNurse_PastHistory" ? 'white' : '' }} onClick={() => handleTabChange("OpNurse_PastHistory")}>
                        Past History
                      </button>
                      |
                      <button style={{ color: ActiveTab === "OpNurse_Allergy" ? 'white' : '' }} onClick={() => handleTabChange("OpNurse_Allergy")}>
                      Allergy
                      </button>
                      |
                      <button style={{ color: ActiveTab === "OpNurse_GeneralEvaluation" ? 'white' : '' }} onClick={() => handleTabChange("OpNurse_GeneralEvaluation")}>
                        GeneralEvaluation
                      </button>
                      
                      

                      {/* <button style={{ color: ActiveTab === "Prescription" ? 'white' : '' }} onClick={() => handleTabChange("Prescription")}>
                        Prescription
                      </button>
                      | */}

                      {/* <button style={{ color: ActiveTab === "Refer_Doctor" ? 'white' : '' }} onClick={() => handleTabChange("Refer_Doctor")}>
                        Refer Doctor
                      </button>
                      |
                      <button style={{ color: ActiveTab === "OP_IP_Connect" ? 'white' : '' }} onClick={() => handleTabChange("OP_IP_Connect")}>
                        OP-IP
                      </button>
                      |
                      <button style={{ color: ActiveTab === "FollowUp" ? 'white' : '' }} onClick={() => handleTabChange("FollowUp")}>
                      FollowUp
                      </button>
                      |
                      <button style={{ color: ActiveTab === "OtRequest" ? 'white' : '' }} onClick={() => handleTabChange("OtRequest")}>
                      OtRequest
                      </button> */}
                      
                      {/* {specialityName === "OPTHALMOLOGY" && (
                        <>
                        <button style={{ color: ActiveTab === "Opthalmology" ? 'white' : '' }} onClick={() => handleTabChange("Opthalmology")}>
                        Opthalmology
                        </button>
                        |
                        </>
                      )}
                      
                      
                      {specialityName === "NEUROLOGY" && (
                        <>
                        <button style={{ color: ActiveTab === "Neurology" ? 'white' : '' }} onClick={() => handleTabChange("Neurology")}>
                        Neurology Form
                        </button>
                        |
                        <button style={{ color: ActiveTab === "OP_Sheet" ? 'white' : '' }} onClick={() => handleTabChange("OP_Sheet")}>
                        Neuro Surgery
                        </button>
                        |

                        </>
                      )}

                      {specialityName === "GYNECOLOGY" && (
                        <>
                        <button style={{ color: ActiveTab === "IFCard" ? 'white' : '' }} onClick={() => handleTabChange("IFCard")}>
                          IFCard
                        </button>
                        |
                        <button style={{ color: ActiveTab === "Gynecology" ? 'white' : '' }} onClick={() => handleTabChange("Gynecology")}>
                        Gynecology
                        </button>
                        |
                        <button style={{ color: ActiveTab === "AncCard" ? 'white' : '' }} onClick={() => handleTabChange("AncCard")}>
                          ANCCard
                        </button>
                        |
                        </>
                      )} */}
                      
                      

                      {/* <div className="Lab_dropdown">
                        <button style={{ color: ActiveTab === "Lab_Test" || ActiveTab === "Radiology_Test" ? 'white' : '' }} className="Lab_button">Diagnostics</button>
                        <div className="Lab_dropdown_content">
                          <button style={{ color: ActiveTab === "Lab_Test" ? 'white' : '' }} onClick={() => handleTabChange("Lab_Test")}>
                            Lab
                          </button>
                          <button style={{ color: ActiveTab === "Radiology_Test" ? 'white' : '' }} onClick={() => handleTabChange("Radiology_Test")}>
                            Radiology
                          </button>
                        </div>
                      </div> */}
                      
                    </h2>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
        <Suspense fallback={<div>Loading...</div>}>

          {ActiveTab === "OpNurse_Vitals" && <OpNurse_Vitals />}
          {ActiveTab === "OpNurse_PastHistory" && <OpNurse_PastHistory />}

          {ActiveTab === "OpNurse_Allergy" && <OpNurse_Allergy />}
          {ActiveTab === "OpNurse_GeneralEvaluation" && <OpNurse_GeneralEvaluation />}
          {/* {ActiveTab === "Prescription" && <Prescription />} */}
          {/* {ActiveTab === "NewProcedure" && <NewProcedure />} */}




          {/* {ActiveTab === "Neurology" && <Neurology />}
          {ActiveTab === "IFCard" && <IFCard />}
          {ActiveTab === "Gynecology" && <Gynecology />}
          {ActiveTab === "AncCard" && <AncCard />}
          {ActiveTab === "OP_Sheet" && <OP_Sheet />}

          {ActiveTab === "GeneralEvaluation" && <GeneralEvaluation />}
          {ActiveTab === "Opthalmology" && <Opthalmology />}
          {ActiveTab === "Lab_Test" && <LabTest />}
          {ActiveTab === "Radiology_Test" && <RadiologyTest />} */}

          {/* {ActiveTab === "Refer_Doctor" && <ReferaDoctor />}
          {ActiveTab === "FollowUp" && <FollowUp />}
          {ActiveTab === "OtRequest" && <OtRequest />}
          {ActiveTab === "OP_IP_Connect" && <OpIpconnect />} */}



        </Suspense>




      </div >



    </>
  );
}

export default OpNurse_WorkbenchNavigation;

