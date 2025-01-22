import React, { useCallback, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../src/App.css";
import axios from "axios";
import debounce from "lodash.debounce";
import NotFound from "./Homepage/404Page";
import LoginPage from "./Homepage/LoginPage/LoginPage";
import HomePage from "./Homepage/Homepage";
import HospitalDetials from "./Masters/HospitalMaster/HospitalDetials";
import RoomMaster from "./Masters/RoomMaster/RoomMaster";
import ReferalRoute from "./Masters/ReferalRouteMaster/ReferalRoute";
import DoctorMaster from "./Masters/DoctorMaster/DoctorMaster";
import DoctorList from "./Masters/DoctorMaster/DoctorList";
import BasicMaster from "./Masters/BasicMaster/BasicMaster";
import UserRegisterMaster from "./Masters/UserRegisterMaster/UserRegisterMaster";
import UserRegisterList from "./Masters/UserRegisterMaster/UserRegisterList";
import { useDispatch, useSelector } from "react-redux";


import DoctorRatecardList from "./Masters/DoctorMaster/DoctorRatecardList";
import EmgRegistration from "./FrontOffice/EmgRegistration/EmgRegistration";
import RegistrationList from "./FrontOffice/RegistrationList/RegistrationList";
import AppointmentRequestList from "./FrontOffice/AppointmentRequestList/AppointmentRequestList";
import RadiologyQueList from "./Radiology/RadiologyQueList";
import RadiologyReportEntry from "./Radiology/RadiologyReportEntry";
import Medicine_rack_Master from "./Masters/InventoryMaster/Medicine_rack_Master";
import Productmaster from "./Masters/InventoryMaster/Productmaster";
import Productcategory from "./Masters/InventoryMaster/Productcategory";
import ProductMasterList from "./Masters/InventoryMaster/ProductMasterList";
import MedicalStockInsertmaster from "./Masters/InventoryMaster/MedicalStockInsertmaster";
import SupplierMaster from "./Masters/InventoryMaster/SupplierMaster";
import SupplierMasterList from "./Masters/InventoryMaster/SupplierMasterList";
import TrayManagement from "./Masters/InventoryMaster/TrayManagement";
import TrayManagementList from "./Masters/InventoryMaster/TrayManagementList";

import GeneralBilling from "./FrontOffice/Billing/GeneralBilling";
import GeneralBillingList from "./FrontOffice/Billing/GeneralBillingList";
import QuickBilling from "./FrontOffice/Billing/Billing";
import OverAllQuickBilling from "./FrontOffice/Billing/QuickBilling";
import CRMdashboard from "./CRM/CRMdashboard";
import AssetDashboard from "./Asset_Management/AssetDashboard";
import AccountFolder from "./Accounts/AccountFolder";
import AdminReportFolder from "./Admin_Reports/AdminReportFolder";
import OPD_ReceptionFolder from "./OPD_Reception/OPD_ReceptionFolder";

// ---------------------------ICU

import Dama from "./IP/ICU_Management/ICU_Doctor/Dama";
import ICU_Mlc from "./IP/ICU_Management/ICU_Doctor/ICU_Mlc";
import ICU_Assesment from "./IP/ICU_Management/ICU_Doctor/ICU_Assesment";
import PreOperativeChecklistForm2 from "./IP/ICU_Management/ICU_Doctor/PreOperativeChecklistForm2";
import PreOperativeChecklistForm from "./IP/ICU_Management/ICU_Doctor/PreOperativeChecklistForm";
import PreOperativeIns from "./IP/ICU_Management/ICU_Doctor/PreOperativeIns";
import WardPreOpChkList from "./IP/ICU_Management/ICU_Doctor/WardPreOpChkList";

// ---------------------------Lenin

import LeninMaster from "./Lenin_Management/LeninMaster";
import Lenin_DeptWise_MinMax from "./Lenin_Management/Lenin_DeptWise_MinMax";
import Lenin_Stock from "./Lenin_Management/Lenin_Stock";
import ServiceProcedureMaster from "./Masters/ServiceProcedureMaster/ServiceProcedureMaster";
import ServiceProcedureRatecard from "./Masters/ServiceProcedureMaster/ServiceProcedureRatecard";
import DoctorWorkbenchNavigation from "./DoctorWorkBench/DoctorWorkbenchNavigation";

// lab and radiology
import LabTest from "./OP/LabTest";
import RadiologyTest from "./OP/RadiologyTest";
import RadiologyMaster from "./Masters/RadiologyMaster/RadiologyMaster";
import LabMaster from "./Masters/LabMaster/LabMaster";

import ICDCodeMaster from "./Masters/ICD10code/ICDCodeMaster";

import Mritechnician from "./Radiology/Mritechnician";
import Cttechnician from "./Radiology/Cttechnician";
import Ultrasound from "./Radiology/Ultrasound";
import XRayTechnician from "./Radiology/XRayTechnician";

import WorkbenchQuelist from "./DoctorWorkBench/WorkbenchQuelist";
import PrivacyPolicy from "./Homepage/Footer/PrivacyPolicy";
import TermsOfUse from "./Homepage/Footer/TermsOfUse";
// import Newregistration from "./FrontOffice/Registration/Newregistration";
import NewBasicRegistation from "./FrontOffice/Registration/NewBasicRegistation";
import OPVisitEntry from "./FrontOffice/Registration/OPVisitEntry";
import NewRoomAvail from "./Masters/RoomMaster/NewRoomAvail";

import LabQueuelist from "./FrontOffice/Billing/LabQueuelist";
import LabRequest from "./Lab/LabRequest";
import LabCompletedlist from "./Lab/LabCompletedlist";
import Labvalue from "./Lab/Labvalue";
import Iprequestlist from "./FrontOffice/RegistrationList/Iprequestlist";
// import RadiologyTest from "./OP/RadiologyTest";

import Mis_Navigation from "./MIS_Report/Mis_Navigation";
import DoctorCalender from "./Masters/DoctorMaster/DoctorCalender";
import InsClientDonationList from "./Masters/InsuranceClientMaster/InsClientDonationList";
import InsClientDonationMaster from "./Masters/InsuranceClientMaster/InsClientDonationMaster";
import ServiceProcedureMasterList from "./Masters/ServiceProcedureMaster/ServiceProcedureMasterList";

import IP_DoctorWorkbenchNavigation from "./IP_Workbench/Doctor/IP_DoctorWorkbenchNavigation";
import IP_WorkbenchQuelist from "./IP_Workbench/Doctor/IP_WorkbenchQuelist";
import IP_NurseQueslist from "./IP_Workbench/Nurse/IP_NurseQueslist";
import IP_BillingEntryQuelist from "./IP_Workbench/Nurse/IP_BillingEntryQueulist";
import IP_BillingEntry from "./IP_Workbench/Nurse/IP_BIllingEntry";
import IP_NurseWorkbenchNavigation from "./IP_Workbench/Nurse/IP_NurseWorkbenchNavigation";
import Opdqueue from "./FrontOffice/RegistrationList/Opdqueue";
import ConsentFormsMaster from "./Masters/ConsentForms/ConsentFormsMaster";
import IpHandoverQue from "./FrontOffice/RegistrationList/IpHandoverQue";
import IpHandoverWorkbench from "./FrontOffice/RegistrationList/IpHandoverWorkbench";
import DutyRousterMaster from "./Masters/HRMasters/DutyRousterMaster";
// import EmployeeRegister from './HR/EmployeeRegister';
import SurgeryMaster from "./Masters/SurgeryMaster/SurgeryMaster";
import MainDash from "./DashBoard/components/MainDash/MainDash";
import PharmacyBillingLIst from "./FrontOffice/OPPharmacy/PharmacyBillingLIst";
import PharmacyBilling from "./FrontOffice/OPPharmacy/PharmacyBilling";
import Walkinbilling from "./FrontOffice/OPPharmacy/Walkinbilling";
import IPPharmacyBillingList from "./FrontOffice/IpPharmacy/IPPharmacyBillingList";
import PharmacyWalkinQue from "./FrontOffice/OPPharmacy/PharmacyWalkinQue";
import IPBilling from "./FrontOffice/IPBilling/IPBilling";
import IPBillingList from "./FrontOffice/IPBilling/IPBillingList";
import AdvanceCollection from "./FrontOffice/Billing/AdvanceCollection";
import AdvanceCollectionList from "./FrontOffice/Billing/AdvanceCollectionList";

import FrequencyMaster from "./Masters/RoomMaster/FrequencyMaster";
import Apprenewal from "./Masters/BasicMaster/Apprenewal";
import IP_LabDischargeQueslist from "./IP_Workbench/Nurse/Discharge/IP_LabDischargeQueslist";
import IP_RadiologyDischargeQueslist from "./IP_Workbench/Nurse/Discharge/IP_RadiologyDischargeQueslist";
import IP_BillingDischargeQueslist from "./IP_Workbench/Nurse/Discharge/IP_BillingDischargeQueslist";
import CasualityDocQuelist from "./Casuality/Doctor/CasualityDocQuelist";
import CasualityNurseQuelist from "./Casuality/Nurse/CasualityNurseQuelist";

import LocationMaster from "./Masters/LocationMaster/LocationMaster";
import InventorySubMasters from "./Masters/InventoryMaster/InventorySubMasters";
import SupplierProductMap from "./Masters/InventoryMaster/SupplierProductMap";
import QuickGoodsRecieptNote from "./Inventory/GRN/QuickGoodsRecieptNote";
import IndentRaise from "./Inventory/Indent/Raise/IndentRaise";
import IndentRaiseList from "./Inventory/Indent/Raise/IndentRaiseList";
import IndentIssue from "./Inventory/Indent/Issue/IndentIssue";
import IndentIssueList from "./Inventory/Indent/Issue/IndentIssueList";
import IndentRecieve from "./Inventory/Indent/Recieve/IndentRecieve";
import IndentRecieveList from "./Inventory/Indent/Recieve/IndentRecieveList";
import OldGrnQueList from "./Inventory/GRN/OldGrnQueList";
import OldGrnRecieptPage from "./Inventory/GRN/OldGrnRecieptPage";
import SupplierPayList from "./Inventory/SupplierPay/SupplierPayList";
import SupplierPay from "./Inventory/SupplierPay/SupplierPay";
import SupplierPaidList from "./Inventory/SupplierPay/SupplierPaidList";
import SerialNoQuelist from "./Inventory/SerialNoForProduct/SerialNoQuelist";
import SerialNoAssignPage from "./Inventory/SerialNoForProduct/SerialNoAssignPage";
import StockList from "./Inventory/StockDetials/StockList";
import SerialNoReport from "./Inventory/SerialNoForProduct/SerialNoReport";
import ItemMinimumMaximum from "./Inventory/ItemMinimumMaximumQty/ItemMinimumMaximum";
import MinimumMaximumLocation from "./Inventory/ItemMinimumMaximumQty/MinimumMaximumLocation";
import PurchaseReturn from "./Inventory/PurchaseReturn/PurchaseReturn";
import PurchaseReturnList from "./Inventory/PurchaseReturn/PurchaseReturnList";

import OtRequest from "./OtManagement/OtRequest";
import OtQuelist from "./OtManagement/OtQuelist";
import OtConsentForm from "./OtManagement/OtConsentForm";
import OtDoctorQueueList from "./OtManagement/OtDoctor/OtDoctorQueueList";
import OtDoctorNavigation from "./OtManagement/OtDoctor/OtDoctorNavigation";
import OtDoctorPre from "./OtManagement/OtDoctor/OtDoctorPre";
import OtNursePre from "./OtManagement/OtNurse/OtNursePre";
import OtNurseQueList from "./OtManagement/OtNurse/OtNurseQueList";
import OtNurseeNavigation from "./OtManagement/OtNurse/OtNurseeNavigation";
import OtAnaesthesiaPre from "./OtManagement/OTAnaesthesia/OtAnaesthesiaPre";
import OtAnaesthesiaQueueList from "./OtManagement/OTAnaesthesia/OtAnaesthesiaQueueList";
import OtAnaesthesiaNavigation from "./OtManagement/OTAnaesthesia/OtAnaesthesiaNavigation";
import OTAanaesthesiaCapture from "./OtManagement/OTAnaesthesia/OTAnaesthesiaCapture";

// import BirthDeathRegisterList from './BirthDeathRegisters/BirthDeathRegisterList';
// import BirthDeathRegister from './BirthDeathRegisters/BirthDeathRegister';

import BirthRegister from "./IP_Workbench/Nurse/BirthRegister";
import DeathRegister from "./IP_Workbench/Nurse/DeathRegister";
import BirthRegisterList from "./IP_Workbench/Nurse/BirthRegisterList";
import DeathRegisterList from "./IP_Workbench/Nurse/DeathRegisterList";
import MlcRegisterForm from "./IP_Workbench/Nurse/MlcRegisterForm";

import PatientList from "./PatientManagement/PatientList";
import PatientDetailsEdit from "./PatientManagement/PatientDetailsEdit";
import GoodsReceiptNoteList from "./Inventory/GRN/GoodsReceiptNoteList";
import PurchaseOrder from "./Inventory/PurchaseOrder/PurchaseOrder";
import PurchaseOrderList from "./Inventory/PurchaseOrder/PurchaseOrderList";
import GoodsReceiptNote from "./Inventory/GRN/GoodsReceiptNote";

import TheatreBooking from "./OtManagement/TheatreBooking";
import OtMaster from "./Masters/OtMaster/OtMaster";
import AnaesthesiaMaster from "./Masters/OtMaster/AnaesthesiaMaster";
import RatecardMaster from './Masters/RatecardMaster/RatecardMaster';
import TotalPatientList from "./Doctor/TotalPatientList";
import TotalNursePatientList from "./Nurse/TotalNursePatientList";

import InsuranceDashboard from "./Insurance/InsuranceDashboard";
import InsuranceMainpage from "./Insurance/InsuranceMainpage";

import EmployeeRegister from "./HR_Management/EmployeeRegister";
import EmployeeList from "./HR_Management/EmployeeList";
import EmployeeAttendance from "./HR_Management/Attendance";
import PayRoll from "./HR_Management/PayRoll";
import EmployeeDutyManagement from './HR_Management/EmployeeDutyManagement';
import DutyRoster from "./HR_Management/DutyRoster";
import LeaveMangement from "./HR_Management/LeaveMangement";
import AdvaceManagement from "./HR_Management/AdvanceManagement";
import ApraisalNavigation from "./HR_Management/ApraisalNavigation";
import EmployeeReport from "./HR_Management/EmployeeReport";
import EmployeeRegistration from "./HR_Management/EmployeeRegistration";
import EmployeeRegistrationList from "./HR_Management/EmployeeRegistrationList";
import JobRequirement from "./HR_Management/JobRequiremet";

import Months from "./FrontOffice/AppointmentRequestList/Months";

import DoctorsScheduleCalander from "./FrontOffice/SlotManagement/DoctorsScheduleCalander";

import InventoryLocation from "./Masters/InventoryMaster/InventoryLocation";
import TherapyMaster from "./Masters/TherapyMaster/TherapyMaster";
import Therapyfolder from "./Therapist/Therapyfolder";

import ContextMenu from "./FrontOffice/DoctorDashboard/ContextMenu";
import DoctorDashboard from "./FrontOffice/DoctorDashboard/DoctorDashboard";

import OpNurse_WorkbenchNavigation from "./OP_Nurse/OpNurse_WorkbenchNavigation";
import OpNurse_Vitals from "./OP_Nurse/OpNurse_Vitals";
import OpNurse_PastHistory from "./OP_Nurse/OpNurse_PastHistory";
import OpNurse_Allergy from "./OP_Nurse/OpNurse_Allergy";
import OpNurse_GeneralEvaluation from "./OP_Nurse/OpNurse_GeneralEvaluation";


import RequestToHR from './HR_Management/RequestToHR';
import RequestToHrList from './HR_Management/RequestToHrList';
import ShortlistedResumelist from './HR_Management/ShortlistedResumelist';
import MailFromConsultancy from './HR_Management/MailFromConsultancy';
import ConsultancyTypeUpList from './HR_Management/ConsultancyTypeUpList';


import ShiftManagement from './EmployeeRequest/ShiftManagement';
import PaySlip from './EmployeeRequest/PaySlip';
import AdvanceNavigation from './EmployeeRequest/AdvanceNavigation';

import EmployeeCalendar from "./HR_Management/EmployeeCalendar";
import FrontOfficeFolder from "./FrontOffice/FrontOfficeFolder";
import DoctorFolder from "./Doctor/DoctorFolder";
import NewHeader from "./Homepage/Header/NewHeader";
import Footer from "./Homepage/Footer/Footer";
import WardManagementFolder from "./IP_Workbench/WardManagementFolder";
import CashierFolder from "./FrontOffice/Billing/CashierFolder";
import NurseFolder from "./IP_Workbench/Nurse/NurseFolder";
import MasterFolder from "./Masters/MasterFolder";
import InventoryFolder from "./Masters/InventoryMaster/InventoryFolder";
import LeninFolder from "./Lenin_Management/LeninFolder";

import OTManageFolder from "./OtManagement/OTManageFolder";
import LabFolder from "./LabMasters/LabFolder";
import RadiologyFolder from "./Radiology/RadiologyFolder";
import InsuranseFolder from "./Insurance/InsuranseFolder";
import HRFolder from "./HR_Management/HRFolder";
import DischargeFolder from "./IP_Workbench/Nurse/Discharge/DischargeFolder";
import DoctorDashboardFolder from "./FrontOffice/DoctorDashboard/DoctorDashboardFolder";
import PharmacyFolder from "./FrontOffice/OPPharmacy/PharmacyFolder";


import Financefolder from "./Finance/Financefolder";
import FinanceMasterList from './Finance/FinanceMasterList';
import FinanceGroupMaster from './Finance/FinanceGroupMaster';
import FinanceLedgerMaster from './Finance/FinanceLedgerMaster';
import VouchersList from "./Finance/VouchersList";
import ContraVoucher from './Finance/ContraVoucher'
import PaymentVoucher from "./Finance/PaymentVoucher";
import ReceiptVoucher from "./Finance/ReceiptVoucher";
import JournalVoucher from "./Finance/JournalVoucher";
import SalesVoucher from "./Finance/SalesVoucher";
import PurchaseVoucher from "./Finance/PurchaseVoucher";
import CreditNoteVoucher from "./Finance/CreditNoteVoucher";
import DebitNoteVoucher from "./Finance/DebitNoteVoucher";



import LeaveManagement from './EmployeeRequest/LeaveManagement';



import AdvanceManagementNavigation from './HR_Management/AdvanceManagementNavigation';
import LeaveManagementNavigation from './HR_Management/LeaveManagementNavigation';
import EmployeeRequestFolder from "./EmployeeRequest/EmployeeRequestFolder";
import Qrcodecontainer from "./Barcode/Qrcode";
import Ownregistration from "./FrontOffice/Registration/Ownregistration";
import FeedBack from "./Barcode/Feedback";
import { constructFrom } from "date-fns";
import Notificationsalert from "./Notification/Notificationsalert";
import TestMaster from "./LabMasters/TestMaster";
import ExternalLab from "./LabMasters/ExternalLab";
import ReferDocs from "./LabMasters/ReferDocs";
// import GroupMaster from "./LabMasters/GroupMaster";
import PayslipView from "./EmployeeRequest/PayslipView";
import SingleLedgerList from "./Finance/SingleLedgerList";
import PharmacyBillingNew from "./FrontOffice/OPPharmacy/PharmacyBillingNew";
import ResultEntryNavigation from "./Lab/ResultEntryNavigation";
import SampleCollection from "./Lab/SampleCollection";
import { BarcodePrint } from "./Lab/BarcodePrint";
import ComplaintAction from "./HR_Management/ComplaintAction";
import ComplaintManagement from "./EmployeeRequest/ComplaintManagement";
import PerformanceAppraisal from "./HR_Management/Performance";
import Circular from "./HR_Management/Circular";
import PatientProfile from "./PatientManagement/PatientProfile";
import ItemwisePurchaseOrder from "./Inventory/PurchaseOrder/ItemwisePurchaseOrder";
import ClientDashboard from "./Insurance/ClientDashboard";
import ClientMainpage from "./Insurance/ClientMainpage";
import SampleCollectionQueueList from "./Lab/SampleCollectionQueue";
import ResultEntryQueueList from "./Lab/ResultEntryQueueList";
import NurseStationStock from "./Inventory/StockDetials/NurseStationStock";

// // import AssetCategory from "./Asset_Management/components/AssetCategory";
// // import Layout from './components/Layout';
// // import Dashboard from './components/Dashboard';
// import DepartmentManagement from './Asset_Management/components/DepartmentManagement';
// import AssetCategoryMa from './Asset_Management/components/AssetCategoryMa';
// import AssetSubCategoryManagement from './Asset_Management/components/AssetSubCategoryManagement';
// import SupplierForm from './Asset_Management/components/SupplierForm';
// import UserControl from './Asset_Management/components/UserControl';
// import ServiceProviderMangement from './Asset_Management/components/ServiceProviderManagement';
// import ChecklistMasterEntry from './Asset_Management/components/ChecklistMasterEntry';
// import ChecklistManagement from './Asset_Management/components/ChecklistManagement';
// import AssetRegister from './Asset_Management/components/AssetRegister';
// import AssetList from './Asset_Management/components/AssetList';
// import Searchasset from './Asset_Management/components/Searchasset';
// //import AssetManagement from './Asset_Management/components/AssetManagement';
// //import AssetDocumentsManagement from './Asset_Management/components/AssetDocumentsManagement';
// import AssetDocumentsupload from './Asset_Management/components/AssetDocumnetsupload';
// import DocumentListByAsset from './Asset_Management/components/DocumentListByAsset';
// import AssetAMC from './Asset_Management/components/AssetAMC';
// import AMCNearExpiry from './Asset_Management/components/AMCNearExpiry';
// import AssetRelationship from './Asset_Management/components/AssetRelationship';



const App = () => {
  const inputsRef = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  // const isOtherpage = location.pathname === "/Home/Ownregistration"
  // const isfeedback = location.pathname === "/#/Feedbackform"

  // console.log(isfeedback, 'lddkkdkdk');
  // console.log(location.pathname, 'location.pathname');



  const [sessiontokenid, setSessionid] = useState(null);
  const [otherlog, setotherlog] = useState(false)

  const dispatchvalue = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);


  const getsessionid = useCallback(() => {
    const storedToken = localStorage.getItem("Chrrtoken");

    // Allow unrestricted access to Home/Registration Ownregistration
    if (location.pathname === "/Home/Ownregistration") {
      console.log("QR scan path detected, bypassing token check.");

      return; // Skip token validation
    }

    if (storedToken) {
      const decodedToken = (token) => {
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = atob(payloadBase64);
        return JSON.parse(decodedPayload);
      };
      const decodedTokenid = decodedToken(storedToken);
      setSessionid(decodedTokenid.session_id);
      console.log("decodedTokenData", decodedTokenid);
      dispatchvalue({ type: "Usersessionid", value: decodedTokenid });
    } else {
      if (location.pathname !== "/") {
        navigate("/"); // Redirect to login page if no token
      }
    }
  }, [navigate, location.pathname, dispatchvalue]);


  const getuserrecord = useCallback(() => {
    console.log(sessiontokenid);
    if (sessiontokenid) {
      console.log("jksjsjsjk");
      axios
        .get(`${UrlLink}Masters/get_data?sessionid=${sessiontokenid}`)
        .then((response) => {
          const data1 = response.data.data;

          // Assuming data1 is the token

          dispatchvalue({ type: "UserData", value: data1 });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          // Handle error here, maybe set an error state or show a message
        });
    } else {
      if (location.pathname !== "/") {
        navigate("/");
      }
    }
  }, [sessiontokenid, UrlLink, navigate, location.pathname, dispatchvalue]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Hospital_Detials_link`)
      .then((response) => {
        if (response.data) {
          const { hospitalName, hospitalLogo, HospitalId } = response.data;
          if (hospitalName && hospitalLogo && HospitalId) {
            const datass = {
              id: HospitalId,
              Cname: hospitalName,
              Clogo: `data:image/*;base64,${hospitalLogo}`,
            };
            dispatchvalue({ type: "ClinicDetails", value: datass });
          } else {
            console.log("Data is null or incomplete");
          }
        } else {
          console.log("Response data is null");
          const datass = {
            id: "",
            Cname: "",
            Clogo: null,
          };
          dispatchvalue({ type: "ClinicDetails", value: datass });
        }
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, [dispatchvalue, UrlLink]);

  useEffect(() => {
    const loc = location.pathname;

    if (loc === "/") {
      localStorage.clear();
    }

    getsessionid();

    if (loc === "/Home/Ownregistration") {
      console.log("Navigating to Registration page.");
      navigate("/Home/Ownregistration");

    }
    else if (loc === '/Feedbackform') {
      navigate("/Feedbackform");
    }
    else if (sessiontokenid) {
      getuserrecord();
    }
  }, [
    location.pathname,
    navigate,
    getsessionid,
    getuserrecord,
    sessiontokenid,
  ]);

  useEffect(() => {
    const inputs = inputsRef.current.querySelectorAll("input");
    inputs.forEach((input) => {
      // Disable autocomplete
      input.setAttribute("autocomplete", "off");

      // Prevent copying
      input.addEventListener("copy", (event) => {
        event.preventDefault();
      });

      // Prevent text selection
      input.addEventListener("selectstart", (event) => {
        event.preventDefault();
      });
    });

    // Clean up event listeners on component unmount
    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("copy", (event) => {
          event.preventDefault();
        });

        input.removeEventListener("selectstart", (event) => {
          event.preventDefault();
        });
      });
    };
  }, []);

  useEffect(() => {
    const handleResize = debounce(() => {
      if (inputsRef.current) {
        // Adjusting the grid ref without forceUpdate
        const width = inputsRef.current.offsetWidth;
        dispatchvalue({ type: "pagewidth", value: width });
      }
    }, 100);

    const currentGridRef = inputsRef.current;
    const resizeObserver = new ResizeObserver(handleResize);
    if (currentGridRef) {
      resizeObserver.observe(currentGridRef);
    }

    return () => {
      if (currentGridRef) {
        resizeObserver.unobserve(currentGridRef);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={inputsRef} className="app-container-newM">
      {(!isLoginPage) && <NewHeader />}

      <div className="content-container-newM">
        <Routes>
          <Route path="/Home/FrontOfficeFolder" element={<FrontOfficeFolder />} />
          <Route path="/Home/DoctorFolder" element={<DoctorFolder />} />
          <Route path="/Home/WardManagementFolder" element={<WardManagementFolder />} />
          <Route path="/Home/CashierFolder" element={<CashierFolder />} />
          <Route path="/Home/Nurse" element={<NurseFolder />} />
          <Route path="/Home/Master" element={<MasterFolder />} />

          <Route path="/Home/InventoryMaster" element={<InventoryFolder />} />
          <Route path="/Home/Lenin" element={<LeninFolder />} />
          <Route path="/Home/FrontOfficeFolder" element={<FrontOfficeFolder />} />
          <Route path="/Home/DoctorFolder" element={<DoctorFolder />} />
          <Route path="/Home/WardManagementFolder" element={<WardManagementFolder />} />

          <Route path="/Home/OTManagement" element={<OTManageFolder />} />
          <Route path="/Home/Lab" element={<LabFolder />} />
          <Route path="/Home/Radiology" element={<RadiologyFolder />} />
          <Route path="/Home/Insurance" element={<InsuranseFolder />} />
          <Route path="/Home/HR" element={<HRFolder />} />
          <Route path="/Home/DischargeRequest" element={<DischargeFolder />} />
          <Route path="/Home/DoctorDashboard" element={<DoctorDashboardFolder />} />
          <Route path="/Home/Pharmacy" element={<PharmacyFolder />} />
          <Route path="/Home/CRMdashboard" element={<CRMdashboard />} />
          <Route path="/Home/AssetDashboard" element={<AssetDashboard />} />
          <Route path="/Home/AccountFolder" element={<AccountFolder />} />
          <Route path="/Home/AdminReportFolder" element={<AdminReportFolder />} />
          <Route path="/Home/OPD_Reception" element={<OPD_ReceptionFolder />} />
          <Route path="/Home/EmployeeRequestFolder" element={<EmployeeRequestFolder />} />
          <Route path="/Home/Notification" element={<Notificationsalert />} />





          <Route path="/Home" element={<HomePage />} />
          <Route path="/Home/DashBoardDetails" element={<MainDash />} />

          <Route path="/Home/DoctorCalendar" element={<Months />} />

          {/********Doctor Dashboard******/}
          <Route path="/Home/ContextMenu" element={<ContextMenu />} />
          <Route path="/Home/DoctorDashboard" element={<DoctorDashboard />} />

          {/* ---------------masters------------ */}
          <Route
            path="/Home/Hospital_detials"
            element={<HospitalDetials />}
          />
          <Route path="/Home/Room_Master" element={<RoomMaster />} />
          <Route path="/Home/Room_Management" element={<NewRoomAvail />} />
          <Route
            path="/Home/ReferalRoute_Master"
            element={<ReferalRoute />}
          />
          <Route path="/Home/Doctor_Master" element={<DoctorMaster />} />
          <Route path="/Home/DoctorList" element={<DoctorList />} />
          <Route
            path="/Home/DoctorRatecardList"
            element={<DoctorRatecardList />}
          />
          <Route path="/Home/Doctor_Calender" element={<DoctorCalender />} />

          <Route path="/Home/Basic_Master" element={<BasicMaster />} />
          <Route path="/Home/TherapyMaster" element={<TherapyMaster />} />
          <Route path="/Home/Therapyfolder" element={<Therapyfolder />} />
          <Route
            path="/Home/UserRegisterMaster"
            element={<UserRegisterMaster />}
          />
          <Route
            path="/Home/UserRegisterList"
            element={<UserRegisterList />}
          />

          <Route
            path="/Home/InsClientDonationList"
            element={<InsClientDonationList />}
          />
          <Route
            path="/Home/InsClientDonationMaster"
            element={<InsClientDonationMaster />}
          />

          <Route
            path="/Home/ServiceProcedureMaster"
            element={<ServiceProcedureMaster />}
          />
          <Route
            path="/Home/ServiceProcedureRatecard"
            element={<ServiceProcedureRatecard />}
          />
          <Route
            path="/Home/ServiceProcedureMasterList"
            element={<ServiceProcedureMasterList />}
          />
          <Route path='/Home/RatecardMaster' element={<RatecardMaster />} />

          <Route
            path="/Home/Radiology_Master"
            element={<RadiologyMaster />}
          />
          <Route path="/Home/Lab_Master" element={<LabMaster />} />
          <Route path="/Home/ICDCodeMaster" element={<ICDCodeMaster />} />

          <Route path="/Home/LocationMaster" element={<LocationMaster />} />
          {/* inventory */}

          <Route
            path="/Home/InventoryLocation"
            element={<InventoryLocation />}
          />

          <Route
            path="/Home/InventorySubMasters"
            element={<InventorySubMasters />}
          />
          <Route
            path="/Home/SupplierProductMap"
            element={<SupplierProductMap />}
          />

          <Route
            path="/Home/QuickGoodsRecieptNote"
            element={<QuickGoodsRecieptNote />}
          />
          <Route
            path="/Home/GoodsReceiptNoteList"
            element={<GoodsReceiptNoteList />}
          />

          <Route
            path="/Home/Medicine_rack_Master"
            element={<Medicine_rack_Master />}
          />
          <Route path="/Home/Productmaster" element={<Productmaster />} />
          <Route path="/Home/Productcategory" element={<Productcategory />} />
          <Route
            path="/Home/ProductMasterList"
            element={<ProductMasterList />}
          />
          <Route
            path="/Home/MedicalStockInsertmaster"
            element={<MedicalStockInsertmaster />}
          />

          <Route path="/Home/SupplierMaster" element={<SupplierMaster />} />
          <Route
            path="/Home/SupplierMasterList"
            element={<SupplierMasterList />}
          />

          <Route path="/Home/TrayManagement" element={<TrayManagement />} />
          <Route
            path="/Home/TrayManagementList"
            element={<TrayManagementList />}
          />

          <Route path="/Home/PurchaseOrder" element={<PurchaseOrder />} />
          <Route
            path="/Home/PurchaseOrderList"
            element={<PurchaseOrderList />}
          />
          <Route
            path="/Home/ItemwisePurchaseOrder"
            element={<ItemwisePurchaseOrder />}
          />

          <Route
            path="/Home/GoodsReceiptNote"
            element={<GoodsReceiptNote />}
          />

          <Route
            path="/Home/GoodsReceiptNoteList"
            element={<GoodsReceiptNoteList />}
          />
          <Route path="/Home/IndentRaise" element={<IndentRaise />} />
          <Route path="/Home/IndentRaiseList" element={<IndentRaiseList />} />
          <Route path="/Home/IndentIssue" element={<IndentIssue />} />
          <Route path="/Home/IndentIssueList" element={<IndentIssueList />} />
          <Route path="/Home/IndentRecieve" element={<IndentRecieve />} />
          <Route
            path="/Home/IndentRecieveList"
            element={<IndentRecieveList />}
          />
          <Route path="/Home/OldGrnQueList" element={<OldGrnQueList />} />
          <Route
            path="/Home/OldGrnRecieptPage"
            element={<OldGrnRecieptPage />}
          />
          <Route path="/Home/SupplierPayList" element={<SupplierPayList />} />
          <Route path="/Home/SupplierPay" element={<SupplierPay />} />
          <Route
            path="/Home/SupplierPaidList"
            element={<SupplierPaidList />}
          />
          <Route path="/Home/SerialNoQuelist" element={<SerialNoQuelist />} />
          <Route
            path="/Home/SerialNoAssignPage"
            element={<SerialNoAssignPage />}
          />
          <Route path="/Home/StockList" element={<StockList />} />
          <Route path="/Home/NurseStationStock" element={<NurseStationStock />} />
          <Route path="/Home/SerialNoReport" element={<SerialNoReport />} />
          <Route
            path="/Home/ItemMinimumMaximum"
            element={<ItemMinimumMaximum />}
          />
          <Route
            path="/Home/MinimumMaximumLocation"
            element={<MinimumMaximumLocation />}
          />
          <Route path="/Home/PurchaseReturn" element={<PurchaseReturn />} />
          <Route
            path="/Home/PurchaseReturnList"
            element={<PurchaseReturnList />}
          />

          <Route path="/Home/Surgery_Master" element={<SurgeryMaster />} />
          <Route path="/Home/apprenewal" element={<Apprenewal />} />

          {/* ------------Master - Consent form master----------- */}

          <Route
            path="/Home/ConsentFormsMaster"
            element={<ConsentFormsMaster />}
          />

          {/* ---------------Duty rouster masters------------ */}
          <Route
            path="/Home/DutyRousterMaster"
            element={<DutyRousterMaster />}
          />
          <Route path="/Home/FrequencyMaster" element={<FrequencyMaster />} />

          {/* ------------FrontOffice----------- */}
          {/* ------------Registration----------- */}
          <Route path="/Home/Registration" element={<NewBasicRegistation />} />
          <Route path="/Home/OPVisitEntry" element={<OPVisitEntry />} />
          <Route path="/Home/EmgRegistration" element={<EmgRegistration />} />
          <Route
            path="/Home/RegistrationList"
            element={<RegistrationList />}
          />
          <Route
            path="/Home/AppointmentRequestList"
            element={<AppointmentRequestList />}
          />

          <Route path="/Home/Iprequestlist" element={<Iprequestlist />} />
          <Route path="/Home/IpHandoverQue" element={<IpHandoverQue />} />
          <Route
            path="/Home/IpHandoverWorkbench"
            element={<IpHandoverWorkbench />}
          />
          <Route path="/Home/Opdqueue" element={<Opdqueue />} />

          <Route path="/Home/GeneralBillingList" element={<GeneralBillingList />} />
          <Route path="/Home/GeneralBilling" element={<GeneralBilling />} />
          <Route path="/Home/QuickBilling" element={<QuickBilling />} />
          <Route path="/Home/OverAllQuickBilling" element={<OverAllQuickBilling />} />

          <Route
            path="/Home/OPPharmachyBillingList"
            element={<PharmacyBillingLIst />}
          />
          <Route path="/Home/OPPharmachyBilling" element={<PharmacyBilling />} />
          <Route path="/Home/PharmacyBillingNew" element={<PharmacyBillingNew />} />
          <Route
            path="/Home/OPPharmachyWalkinBilling"
            element={<Walkinbilling />}
          />
          <Route
            path="/Home/PharmacyWalkinQue"
            element={<PharmacyWalkinQue />}
          />

          <Route
            path="/Home/IPPharmacyBillingList"
            element={<IPPharmacyBillingList />}
          />
          <Route path="/Home/IPBilling" element={<IPBilling />} />
          <Route path="/Home/IPBillingList" element={<IPBillingList />} />
          <Route path="/Home/AdvanceCollectionBilling" element={<AdvanceCollection />} />
          <Route path="/Home/AdvanceCollectionList" element={<AdvanceCollectionList />} />
          

          {/*  schedule*/}

          <Route
            path="/Home/DoctorsScheduleCalander"
            element={<DoctorsScheduleCalander />}
          />

          {/* ------------Doctor Workbench----------- */}
          <Route
            path="/Home/WorkbenchQuelist"
            element={<WorkbenchQuelist />}
          />
          <Route
            path="/Home/DoctorWorkbenchNavigation"
            element={<DoctorWorkbenchNavigation />}
          />
          <Route path="/Home/LabTest" element={<LabTest />} />
          <Route path="/Home/RadiologyTest" element={<RadiologyTest />} />
          <Route path="/Home/ResultEntryNavigation" element={<ResultEntryNavigation />} />

          <Route path="/Home/SampleCollection" element={<SampleCollection />} />

          <Route path="/Home/BarcodePrint" element={<BarcodePrint />} />
          {/* ------------Op Nurse Workbench----------- */}

          <Route
            path="/Home/OpNurse_WorkbenchNavigation"
            element={<OpNurse_WorkbenchNavigation />}
          />
          <Route path="/Home/OpNurse_Vitals" element={<OpNurse_Vitals />} />
          <Route
            path="/Home/OpNurse_PastHistory"
            element={<OpNurse_PastHistory />}
          />
          <Route path="/Home/OpNurse_Allergy" element={<OpNurse_Allergy />} />
          <Route
            path="/Home/OpNurse_GeneralEvaluation"
            element={<OpNurse_GeneralEvaluation />}
          />

          {/* ------------ IP Doctor Workbench----------- */}

          <Route
            path="IP_WorkbenchQuelist"
            element={<IP_WorkbenchQuelist />}
          />
          <Route
            path="/Home/IP_DoctorWorkbenchNavigation"
            element={<IP_DoctorWorkbenchNavigation />}
          />
          <Route path="IP_NurseQueslist" element={<IP_NurseQueslist />} />
          <Route
            path="IP_BillingEntryQuelist"
            element={<IP_BillingEntryQuelist />}
          />
          <Route path="IP_BillingEntry" element={<IP_BillingEntry />} />
          <Route
            path="/Home/IP_NurseWorkbenchNavigation"
            element={<IP_NurseWorkbenchNavigation />}
          />

          {/* ------------ Casuality Doctor Workbench----------- */}

          <Route
            path="CasualityDocQuelist"
            element={<CasualityDocQuelist />}
          />
          <Route
            path="CasualityNurseQuelist"
            element={<CasualityNurseQuelist />}
          />

          {/* ------------ICU Management ----------- */}

          <Route path="/Home/ICU_Mlc" element={<ICU_Mlc />} />
          <Route path="/Home/ICU_Assesment" element={<ICU_Assesment />} />
          <Route
            path="/Home/PreOperativeChecklistForm2"
            element={<PreOperativeChecklistForm2 />}
          />
          <Route
            path="/Home/PreOperativeChecklistForm"
            element={<PreOperativeChecklistForm />}
          />
          <Route path="/Home/PreOperativeIns" element={<PreOperativeIns />} />
          <Route
            path="/Home/WardPreOpChkList"
            element={<WardPreOpChkList />}
          />
          <Route path="/Home/Dama" element={<Dama />} />

          {/* ------------Lenin Management ----------- */}

          <Route path="/Home/LeninMaster" element={<LeninMaster />} />
          <Route
            path="/Home/Lenin_DeptWise_MinMax"
            element={<Lenin_DeptWise_MinMax />}
          />
          <Route path="/Home/Lenin_Stock" element={<Lenin_Stock />} />

          {/* ------------Doctor Workbench----------- */}
          <Route
            path="/Home/WorkbenchQuelist"
            element={<WorkbenchQuelist />}
          />
          <Route
            path="/Home/DoctorWorkbenchNavigation"
            element={<DoctorWorkbenchNavigation />}
          />
          <Route path="/Home/LabTest" element={<LabTest />} />
          <Route path="/Home/RadiologyTest" element={<RadiologyTest />} />

          <Route path="/Home/TestMaster" element={<TestMaster />} />
          <Route path="/Home/ExternalLab" element={<ExternalLab />} />
          <Route path="/Home/Referdoctormaster" element={<ReferDocs />} />
          {/* <Route path="/Home/GroupMaster" element={<GroupMaster />}/> */}
          {/* <Route path="Doctor-Dashboard" element={<DoctorDashboard/>} /> */}

          {/* --------------------------lab------------------ */}
          {/* <Route path="/Home/LabQuelist" element={<LabQueuelist />} /> */}
          {/* <Route path="/Home/LabRequest" element={<LabRequest />} /> */}
          {/* <Route path="/Home/Labvalue" element={<Labvalue />} /> */}
          {/* <Route path="/Home/LabCompleted" element={<LabCompletedlist />} /> */}
          <Route path="/Home/SampleCollectionQueue" element={<SampleCollectionQueueList />} />
          <Route path="/Home/ResultEntryQueueList" element={<ResultEntryQueueList />} />
          {/* ------------ IP Discharge Request----------- */}

          <Route
            path="IP_LabDischargeQueslist"
            element={<IP_LabDischargeQueslist />}
          />
          <Route
            path="IP_RadiologyDischargeQueslist"
            element={<IP_RadiologyDischargeQueslist />}
          />
          <Route
            path="IP_BillingDischargeQueslist"
            element={<IP_BillingDischargeQueslist />}
          />

          {/* OT_Management */}
          {/* <Route path="OT_Room_Master" element={<OtRoomMaster />}/> */}
          <Route path="OtMaster" element={<OtMaster />} />
          <Route path="AnaesthesiaMaster" element={<AnaesthesiaMaster />} />

          <Route path="TheatreBooking" element={<TheatreBooking />} />
          <Route path="OT-Management" element={<OtRequest />} />
          <Route path="/Home/OT_Queue_List" element={<OtQuelist />} />

          <Route path="/Home/OT_Queue_List" element={<OtConsentForm />} />

          <Route
            path="/Home/Doctor_OueueList"
            element={<OtDoctorQueueList />}
          />
          <Route path="/Home/OT_Doctor" element={<OtDoctorNavigation />} />
          <Route path="/Home/OT_Queue_List" element={<OtDoctorPre />} />

          <Route path="/Home/OT_Queue_List" element={<OtNursePre />} />
          <Route path="/Home/Nurse_OueueList" element={<OtNurseQueList />} />
          <Route path="/Home/OT_Nurse" element={<OtNurseeNavigation />} />

          <Route path="/Home/OT_Queue_List" element={<OtAnaesthesiaPre />} />
          <Route
            path="/Home/Anaesthesia_OueueList"
            element={<OtAnaesthesiaQueueList />}
          />
          <Route
            path="/Home/OT_Anaesthesia"
            element={<OtAnaesthesiaNavigation />}
          />
          <Route
            path="/Home/OT_Queue_List"
            element={<OTAanaesthesiaCapture />}
          />

          <Route
            path="/Home/RadiologyQuelist"
            element={<RadiologyQueList />}
          />
          <Route
            path="/Home/RadiologyReportEntry"
            element={<RadiologyReportEntry />}
          />

          {/* --------------------------Radiology----------------- */}
          <Route
            path="/Home/RadiologyQuelist"
            element={<RadiologyQueList />}
          />
          <Route path="/Home/XRayTechnician" element={<XRayTechnician />} />
          <Route path="/Home/Mritechnician" element={<Mritechnician />} />
          <Route path="/Home/Cttechnician" element={<Cttechnician />} />
          <Route path="/Home/Ultrasound" element={<Ultrasound />} />
          <Route
            path="/Home/RadiologyReportEntry"
            element={<RadiologyReportEntry />}
          />
          {/* --------------------------MIS REPORT------------------ */}
          <Route path="/Home/Mis_Navigation" element={<Mis_Navigation />} />

          {/* --------------------------Birth Death Registration----------------- */}

          {/* <Route path="/Home/BirthDeathRegisterList" element={<BirthDeathRegisterList />} />
        <Route path="/Home/BirthDeathRegister" element={<BirthDeathRegister />} /> */}

          <Route path="/Home/BirthRegister" element={<BirthRegister />} />
          <Route path="/Home/DeathRegister" element={<DeathRegister />} />
          <Route
            path="/Home/BirthRegisterList"
            element={<BirthRegisterList />}
          />
          <Route
            path="/Home/DeathRegisterList"
            element={<DeathRegisterList />}
          />
          <Route path="/Home/MlcRegisterForm" element={<MlcRegisterForm />} />

          {/* --------------------------Patient management----------------- */}

          <Route path="/Home/PatientList" element={<PatientList />} />
          <Route
            path="/Home/PatientDetailsEdit"
            element={<PatientDetailsEdit />}
          />
          <Route
            path="/Home/PatientProfile"
            element={<PatientProfile />}
          />


          {/* --------------------------HR management----------------- */}
          <Route path="/Home/HREmployeeRegister" element={<EmployeeRegister />} />

          <Route path="/Home/JobRequirements" element={<JobRequirement />} />


          <Route path="/Home/EmployeeList" element={<EmployeeList />} />
          <Route path="/Home/EmployeeAttendance" element={<EmployeeAttendance />} />
          <Route path="/Home/PayRoll" element={<PayRoll />} />
          <Route path="/Home/DutyManagement" element={<EmployeeDutyManagement />} />
          <Route path="/Home/EmployeeCalendar" element={<EmployeeCalendar />} />
          <Route path="/Home/DutyRoster" element={<DutyRoster />} />
          <Route path="/Home/LeaveMangement" element={<LeaveManagementNavigation />} />
          <Route path="/Home/AdvanceManagementNavigation" element={<AdvanceManagementNavigation />} />
          <Route path="/Home/ApraisalNavigation" element={<ApraisalNavigation />} />
          <Route path="/Home/EmployeeReport" element={<EmployeeReport />} />

          <Route path="/Home/ConsultancyTypeUpList" element={<ConsultancyTypeUpList />} />
          <Route path="/Home/DutyRoster" element={<DutyRoster />} />
          <Route path="/Home/RequestToHR" element={<RequestToHR />} />
          <Route path="/Home/RequestToHrList" element={<RequestToHrList />} />
          <Route path="/Home/MailFromConsultancy" element={<MailFromConsultancy />} />
          <Route path="/Home/ShortlistedResumelist" element={<ShortlistedResumelist />} />

          <Route path="/Home/EmployeeRegistration" element={<EmployeeRegistration />} />
          <Route path="/Home/EmployeeRegistrationList" element={<EmployeeRegistrationList />} />
          <Route path="/Home/EmployeeDutyManagement" element={<EmployeeDutyManagement />} />
          <Route path="/Home/PerformanceAppraisal" element={<PerformanceAppraisal />} />
          <Route path="/Home/ComplaintAction" element={<ComplaintAction />} />
          <Route path="/Home/Circular" element={<Circular />} />

          {/* --------------------------Doctor----------------- */}

          {/* <Route path="/Home/TotalPatientList" element={<TotalPatientList />} /> */}

          {/* Insurance */}

          <Route
            path="/Home/ClientDashboard"
            element={<ClientDashboard />}
          />
            <Route
            path="/Home/ClientMainpage"
            element={<ClientMainpage />}
          />
          <Route
            path="/Home/InsuranceDashboard"
            element={<InsuranceDashboard />}
          />
          <Route
            path="/Home/InsuranceMainpage"
            element={<InsuranceMainpage />}
          />

          {/* --------------------------Doctor and Nurse----------------- */}

          <Route
            path="/Home/TotalPatientList"
            element={<TotalPatientList />}
          />
          <Route
            path="/Home/TotalNursePatientList"
            element={<TotalNursePatientList />}
          />

          {/* --------------Employee Request */}
          <Route path="/Home/LeaveManagement" element={<LeaveManagement />} />
          <Route path="/Home/AdvanceNavigation" element={<AdvanceNavigation />} />
          <Route path="/Home/ShiftManagement" element={<ShiftManagement />} />
          <Route path="/Home/PaySlip" element={<PaySlip />} />
          <Route path="/Home/PayslipView" element={<PayslipView />} />
          <Route path="/Home/ComplaintManagement" element={<ComplaintManagement />} />



          {/* --------------Finance--------------------------------- */}

          <Route path='/Home/Financefolder' element={<Financefolder />} />
          <Route path='/Home/FinanceMasterList' element={<FinanceMasterList />} />
          <Route path='/Home/FinanceGroupMaster' element={<FinanceGroupMaster />} />
          <Route path='/Home/FinanceLedgerMaster' element={<FinanceLedgerMaster />} />
          <Route path='/Home/VouchersList' element={<VouchersList />} />
          <Route path='/Home/ContraVoucher' element={<ContraVoucher />} />
          <Route path='/Home/PaymentVoucher' element={<PaymentVoucher />} />
          <Route path='/Home/ReceiptVoucher' element={<ReceiptVoucher />} />
          <Route path='/Home/JournalVoucher' element={<JournalVoucher />} />
          <Route path='/Home/SalesVoucher' element={<SalesVoucher />} />
          <Route path='/Home/PurchaseVoucher' element={<PurchaseVoucher />} />
          <Route path='/Home/CreditNoteVoucher' element={<CreditNoteVoucher />} />
          <Route path='/Home/DebitNoteVoucher' element={<DebitNoteVoucher />} />
          <Route path='/Home/SingleLedgerList' element={<SingleLedgerList />} />




          <Route path="/Home/QRgenerater" element={<Qrcodecontainer />} />
          <Route path="/Home/Ownregistration" element={<Ownregistration />} />
          <Route path="/Feedbackform" element={<FeedBack />} />

          {/*-------------------------Assest Management */}
          {/* <Route path="/departments" element={<DepartmentManagement />} />
          <Route path="/asset-categories" element={<AssetCategoryMa />} />
          <Route path="/asset-subcategories" element={<AssetSubCategoryManagement />} />
          <Route path="/suppliers" element={<SupplierForm />} />
          <Route path="/service-providers/management" element={<ServiceProviderMangement />} />
          <Route path="/checklist-master-entry" element={<ChecklistMasterEntry />} />
          <Route path="/checklist-management" element={<ChecklistManagement />} />
          <Route path="/assets" element={<AssetRegister />} />
          <Route path="/assets/list" element={<AssetList />} />
          <Route path="/searchasset" element={<Searchasset />} />
          
          {/* Correct the route path for Asset Documents Upload */}
          
          {/* <Route path="/asset-documents" element={<AssetDocumentsupload />} />
          {/* Correct the route path for Document List By Asset */}
          {/* <Route path="/documentlistbyasset" element={<DocumentListByAsset />} />
          <Route path="/asset-relationships" element={<AssetRelationship />} />
          <Route path="/asset-amc" element={<AssetAMC />} />
          <Route path="/asset/amc-near-expiry" element={<AMCNearExpiry />} />
          
          <Route path="/users" element={<UserControl />} /> */} 


          {/* New Path */}

          <Route path="*" element={<NotFound />} />




          <Route path="/" element={<LoginPage />} />
          {/* NotFound */}
          <Route path="*" element={<NotFound />} />

          <Route path="/Home/Privacy-Policy" element={<PrivacyPolicy />} />
          <Route path="/Home/Terms-of-Use" element={<TermsOfUse />} />
        </Routes>
      </div>

      {(!isLoginPage) && <Footer />}
    </div>
  );
};

export default App;
