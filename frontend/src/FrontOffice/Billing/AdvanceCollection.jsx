import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import {
  differenceInYears,
  format,
  startOfYear,
  subYears,
  isBefore,
} from "date-fns";
import Clinic_Logo from "../../Assets/logo.png";

import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoBedOutline } from "react-icons/io5";
import Button from "@mui/material/Button";
import { FaTrash } from "react-icons/fa";
import profile from "../../Assets/profileimg.jpeg";
import "../../App.css";
import { handleKeyDownText } from "../../OtherComponent/OtherFunctions";
import { handleKeyDownPhoneNo } from "../../OtherComponent/OtherFunctions";
// handleKeyDownTextRegistration
import { handleKeyDownTextRegistration } from "../../OtherComponent/OtherFunctions";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import { useReactToPrint } from "react-to-print";
import { NumberToWords } from "../../OtherComponent/OtherFunctions";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";

const AdvanceCollection = () => {
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const PatientDetails = useSelector(state=> state.Frontoffice?.PatientDetails)

  const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );

  const toast = useSelector((state) => state.userRecord?.toast);
  const [errors, setErrors] = useState({});

  const OP_BillingData = useSelector(
    (state) => state.Frontoffice?.OPBillingData
  );
  console.log("Oppppppp", OP_BillingData);

  const IP_BillingData = useSelector(
    (state) => state.Frontoffice?.IPBillingData
  );
  console.log("IIppppppp", IP_BillingData);

  // useEffect(()=>{
  //   if(OP_BillingData !==)
  // },[UrlLink])

  const componentRef = useRef();
  const currentDate = new Date();
  const Formdate = format(currentDate, "yyyy-MM-dd");


  // For Lab 
  const [franchaisename, setFranchaisename] = useState("Basic");
  const [franchaise, setfranchaises] = useState([]);
  const [franchaisecolumnname, setfranchaisecolumnname] = useState("Basic")
  const [Department, setDepartment] = useState([])
  const [overallRateCard, setoverallRateCard] = useState([])
  const [testType, setTestType] = useState("Individual");

  const [formData, setFormData] = useState({
    SubDepartment_Code: "",
    SubDepartment_Name: "",
    testType: testType,
  });
  const [Billing_date, setBilling_date] = useState(new Date());
  


  const handleInputChange1234 = (e) => {
    const { name, value } = e.target;
    let SubDepartment_Code;


    if (name === "SubDepartment_Name") {
      const selectedDepartment = Department?.find(
        (item) => item.SubDepartment_Name === value
      );
      SubDepartment_Code = selectedDepartment?.SubDepartment_Code;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      SubDepartment_Code: SubDepartment_Code || prevData.SubDepartment_Code,
    }));
  };



  const handleRateCardLims = (e) => {
    setFranchaisename(e.target.value)
    const selectfranchaise = franchaise.find(
      (row) => row.displayNames === e.target.value
    );
    if (selectfranchaise) {
      setfranchaisecolumnname(selectfranchaise.columname);
    }
  };


  useEffect(() => {
    console.log(OP_BillingData?.ServiceProcedureForm);

    if (OP_BillingData?.ServiceProcedureForm === 'Lab') {
      axios
        .get(`${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=RateCardMaster`)
        .then((response) => {
          console.log(response);
          setfranchaises(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      axios
        .get(`${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=LabSubDepartment`)
        .then((response) => {
          console.log(response);
          setDepartment(response.data);
        })
        .catch((error) => {
          console.error("Error fetching SubDepartment data:", error);
        });

      // Fetch updated rate card amounts only when ratecard changes
      if (franchaisecolumnname !== "Basic") {
        axios
          .get(`${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=RateCardMasterList&ratecard=${franchaisecolumnname}`)
          .then((response) => {
            const responseData = response.data;

            const updatedSelectDatalist = SelectDatalist.map((item) => {
              if (item.type === "individual") {
                const matchedTest = responseData.find((data) => data.Test_Code_id === item.Test_Code);
                return matchedTest
                  ? {
                    ...item, Amount: matchedTest.Schemecost, Charges: matchedTest.Schemecost,
                    NetAmount: matchedTest?.Schemecost
                  }
                  : item;
              } else if (item.type === "group") {
                const matchedGroup = responseData.find((data) => data.Group_Code_id === item.Group_Code);
                return matchedGroup
                  ? {
                    ...item, Amount: matchedGroup.Schemecost, Charges: matchedGroup.Schemecost,
                    NetAmount: matchedGroup?.Schemecost
                  }
                  : item;
              }
              return item;
            });

            console.log("Updated SelectDatalist:", updatedSelectDatalist);
            setSelectDatalist(updatedSelectDatalist); // Update state properly
          })
          .catch((error) => {
            console.error("Error fetching RateCardMasterList:", error);
          });
      } else {
        setSelectDatalist(OP_BillingData?.ItemDetails)
      }
    }
  }, [UrlLink, franchaisecolumnname]); // Include franchaisecolumnname in the dependency array




  const [ClinicDetials, setClinicDetials] = useState({
    ClinicLogo: null,
    ClinicName: "",
    ClinicGST: "",
    ClinicAddress: "",
    ClinicCity: "",
    ClinicState: "",
    ClinicCode: "",
    ClinicMobileNo: "",
    ClinicLandLineNo: "",
    ClinicMailID: "",
  });

  const [SelectedPatient_list, setSelectedPatient_list] = useState({
    PatientId: "",
    PatientName: "",
    PhoneNumber: "",
    PatientCategory: "General",
    PatientCategoryType: "",
    InsuranceName: "",
    Gender: "",
    Age:"",
    City: "",
    State: "",
    PatientAddress: "",
    Pincode: "",
    VisitId: "",
  });

  const [RadiologyNames, setRadiologyNames] = useState([]);
  const [RadioNames, setRadioNames] = useState([]);
  const [PostInvoice, setPostInvoice] = useState(null);
  const [BillingData, setBillingData] = useState({
    InvoiceNo: "",
    InvoiceDate: Formdate,
    DoctorName: "",
    DoctorId: "",
  });
  const [SelectDatalist, setSelectDatalist] = useState([]);
  const [Reimbursable, setReimbursable] = useState(false);
  const [SelectDatalist1, setSelectDatalist1] = useState([]);
  const [initialState, setinitialState] = useState({
    totalItems: 0,
    totalTaxable: 0,
    totalAmount: 0,
    totalDiscount: 0,
    totalGstamount: 0,
    totalUnits: 0,
    totalNetAmount: 0,
    PaidAmount: 0,
    BalanceAmount: 0,
    Roundoff: 0,
    ReimbursableAmount: 0,
    totalAmountt: 0,
  });
  const [billAmount, setBillAmount] = useState([]);
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const [isPrintSummary, setisPrintSummary] = useState(false);
  const [Doctorsnames, setDoctorsnames] = useState([]);
  const [Patient_list, setPatient_list] = useState([]);
  const [selectedOption, setSelectedOption] = useState("IPDServices");
  const [Uptateitem, setUptateitem] = useState(false);
  const [SelectItemState, setSelectItemState] = useState({
    ServiceType: "",
    Servicecode: "",
    SelectItemName: "",
    Rate: "",
    Charges: "",
    Amount: "",
    DiscountType: "",
    Discount: "",
    GST: "",
    Total: "",
    GSTamount: "",
    Quantity: "",
    DiscountAmount: "",
  });
  const [NetAmount_CDmethod, setNetAmount_CDmethod] = useState({
    Method: "",
    Amount: "",
  });
  const [formAmount, setFormAmount] = useState({
    Billpay_method: "",
    CardType: "",
    ChequeNo: "",
    BankName: "",
    paidamount: "",
    Additionalamount: "",
    transactionFee: "",
  });

  const [ServiceData, setServiceData] = useState([]);
  const [LabData, setLabData] = useState([]);

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  const [totalPaidAmount, settotalPaidAmount] = useState(0);
  const [isEdit, setIsEdit] = useState(null);

  const [FilterbyPatientId, setFilterbyPatientId] = useState([]);

  // const [patientsearchoption, setpatientsearchoption] = useState("PatientID");
  const [patientsearch, setpatientsearch] = useState({
    Search: "",
  });
  const [AppointmentRegisType, setAppointmentRegisType] = useState(Object.keys(OP_BillingData).length !== 0 ? "OP" : "IP");
  const [SmartCard, setSmartCard] = useState({
    SmartCardNo: "",
  });
  const [isClient, setisClient] = useState({
    isClient: "No",
    CoPaymentType: "Percentage",
    CoPaymentTypeinp: "",
    CoPaymentLogic: "PreAuth",
    CoPaymentdeducted: "PreAuth",
    PreAuthType: "Percentage",
    PreAuthTypeinp: "",
    PreAuthAmount: "",
    PreAuthApprovalNo: "",
    PolicyNo: "",
    PolicyStartDate: "",
    PolicyEndDate: "",
  });

  const [AdvanceAmount, setAdvanceAmount] = useState({
    isAdvance: 'No',
    AdvanceAmount: '',
  })
  const [AdvanceAmountGet, setAdvanceAmountGet] = useState([])
  const [AdvanceTotal, setAdvanceTotal] = useState([])
  const [AdvanceRegistrationId, setAdvanceRegistrationId] = useState([])
  const [RemainingCredit, setRemainingCredit] = useState([])
  console.log('Advancetotallll', AdvanceTotal);
  console.log('RemainingCredittt', RemainingCredit);

  const [register, setregister] = useState({
    isregister: "No",
    registerAmount: "",
  });
  const [ServiceProcedureForm, setServiceProcedureForm] =
    useState("Consultation");
  const [ServiceProcedureData, setServiceProcedureData] = useState([]);
  const [ServiceProcedureDataGet, setServiceProcedureDataGet] = useState([]);
  const [Consultation, setConsultation] = useState({
    PhysicianType: "",
    Physician: "",
    Service: "",
    Procedure: "",
    DrugName: "",
    LabTest: "",
    RadiologyDept: "",
    RadiologyTest: "",
    SubTestName: "",
    Rate: "",
    Quantity: "",
    Charges: "",
    Amount: "",
    DiscountType: "",
    Discount: "",
    GST: "",
    GSTamount: "",
    Total: "",
    DiscountAmount: "",
  });
  const [PhysicianData, setPhysicianData] = useState([]);
  const [SpecializationData, setSpecializationData] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [DoctorRateData, setDoctorRateData] = useState([]);
  const [ReferralDoctorData, setReferralDoctorData] = useState([]);
  const [EmployeeData, setEmployeeData] = useState([]);
  const [DoctorIdData, setDoctorIdData] = useState([]);
  const [FlaggData, setFlaggData] = useState([]);
  const [ReligionData, setReligionData] = useState([]);
  const [AllDoctorData, setAllDoctorData] = useState([]);
  const [InsuranceData, setInsuranceData] = useState([]);
  const [ClientData, setClientData] = useState([]);
  const [DonationData, setDonationData] = useState([]);

  const [printoption, setprintoption] = useState("PrintDetailed");
  const [RegisterData, setRegisterData] = useState({
    PatientId: "",
    ABHA: "",
    PatientName: "",
    AgeGender: "",
    PhoneNo: "",
    PatientCategory: "",
    Address: "",
  });
  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          specializationResponse,
          referralDoctorResponse,
          EmployeeResponse,
          DoctorResponse,
          FlaggData,
          ReligionData,
          AllDoctorData,
          Insurancedata,
          ClientData,
          DonationData,
        ] = await Promise.all([
          axios.get(`${UrlLink}Masters/Speciality_Detials_link`),
          axios.get(`${UrlLink}Masters/get_referral_doctor_Name_Detials`),
          axios.get(`${UrlLink}Frontoffice/get_Employee_by_PatientCategory`),
          axios.get(`${UrlLink}Frontoffice/get_DoctorId_by_PatientCategory`),
          axios.get(`${UrlLink}Masters/Flagg_color_Detials_link`),
          axios.get(`${UrlLink}Masters/Relegion_Master_link`),
          axios.get(`${UrlLink}Masters/get_All_doctor_Name_Detials`),
          axios.get(`${UrlLink}Masters/get_insurance_data_registration`),
          axios.get(`${UrlLink}Masters/get_client_data_registration`),
          axios.get(`${UrlLink}Masters/get_donation_data_registration`),
        ]);

        console.log("spppeeecccc", specializationResponse);

        setSpecializationData(
          Array.isArray(specializationResponse.data)
            ? specializationResponse.data
            : []
        );
        setReferralDoctorData(
          Array.isArray(referralDoctorResponse.data)
            ? referralDoctorResponse.data
            : []
        );
        setEmployeeData(
          Array.isArray(EmployeeResponse.data) ? EmployeeResponse.data : []
        );
        setDoctorIdData(
          Array.isArray(DoctorResponse.data) ? DoctorResponse.data : []
        );
        setFlaggData(Array.isArray(FlaggData.data) ? FlaggData.data : []);
        setReligionData(
          Array.isArray(ReligionData.data) ? ReligionData.data : []
        );
        setAllDoctorData(
          Array.isArray(AllDoctorData.data) ? AllDoctorData.data : []
        );
        setInsuranceData(
          Array.isArray(Insurancedata.data) ? Insurancedata.data : []
        );
        setClientData(Array.isArray(ClientData.data) ? ClientData.data : []);
        setDonationData(
          Array.isArray(DonationData.data) ? DonationData.data : []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [UrlLink]);

  useEffect(() => {
    const fetchdat = async () => {
      try {
        const response = await axios.get(
          `${UrlLink}Masters/get_Doctor_by_Speciality_Detials?Speciality=${Consultation.PhysicianType}`
        );

        setDoctorData(response.data);
        console.log(response.data, "daaaaaaa");
      } catch (error) {
        setDoctorData([]);
        console.error("Error fetching referral doctors:", error);
      }
    };
    if (Consultation.PhysicianType) {
      fetchdat();
    }
  }, [UrlLink, Consultation.PhysicianType]);

  useEffect(() => {
    if (Consultation.PhysicianType !== "" && Consultation.Physician !== "") {
      axios
        .get(
          `${UrlLink}Masters/doctor_Ratecard_details_view_by_doctor_id?DoctorId=${Consultation?.Physician}`
        )
        .then((response) => {
          console.log("Docraateeee", response.data);
          setDoctorRateData(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, Consultation.PhysicianType, Consultation.Physician]);

  useEffect(() => {
    if (Object.keys(Registeredit).length === 0) {
      const postdata = {
        PatientId: RegisterData.PatientId,
        PhoneNo: RegisterData.PhoneNo,
        FirstName: RegisterData.FirstName,
        DoctorId: RegisterData.DoctorName,
      };
      console.log("PosttttDDDD", postdata);

      axios
        .get(`${UrlLink}Frontoffice/Filter_IP_Patient_by_Multiple_Criteria`, {
          params: postdata,
        })
        .then((res) => {
          const data = res.data;
          console.log("1222222", data);

          setFilterbyPatientId(data);
          // axios
          //   .get(`${UrlLink}Frontoffice/get_patient_visit_details`, {
          //     params: postdata,
          //   })
          //   .then((res) => {
          //     const visit = res.data?.VisitPurpose;
          //     console.log("Vissssss", res.data);

          //     setRegisterData((prev) => ({
          //       ...prev,
          //       VisitPurpose: visit,
          //     }));
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, AppointmentRegisType]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Radiology_Names_link`, {
        headers: {
          Apikey: UserData.api_key,
          Apipassword: UserData.api_password,
          Sessionid: UserData.session_id,
        },
      })
      .then((response) => {
        console.log("111111111", response?.data);
        setRadiologyNames(response?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    if (Consultation.RadiologyDept !== "") {
      axios
        .get(`${UrlLink}Masters/Radiology_Department_TestNames`, {
          params: {
            id: Consultation.RadiologyDept, // Pass the selected ID as a parameter
          },
        })
        .then((response) => {
          console.log("RadioNames", response?.data);
          setRadioNames(response?.data); // Update the state with fetched test data
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, Consultation.RadiologyDept]);

  // const handlePhysicianTypeChange = (e) => {
  //   setConsultation((prev) => ({
  //     ...prev,
  //     PhysicianType: e.target.value,
  //   }));

  //   axios
  //     .get(`${UrlLink}Ip_Workbench/IP_InchargeAndRefer_Details_Link`, {
  //       params: {
  //         Type: e.target.value,
  //         RegistrationId: IP_DoctorWorkbenchNavigation?.RegistrationId,
  //       },
  //     })
  //     .then((response) => {
  //       const res = response.data;
  //       console.log("resssss", res);
  //       setPhysicianData(res);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Masters/get_service_procedure_for_ip?MasterType=${ServiceProcedureForm === "GeneralBillingItem"
          ? "Service"
          : ServiceProcedureForm
        }`
      )
      .then((res) => {
        setServiceProcedureData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ServiceProcedureForm, UrlLink]);

  useEffect(() => {
    let totalUnits = 0;
    let totalAmount = 0;
    let totalDiscount = 0;
    let totalGstamount = 0;
    let totalNetAmount = 0;
    let totalItems = 0;

    let reimbursebleTotals = {
      totalUnits: 0,
      totalAmount: 0,
      totalDiscount: 0,
      totalGstamount: 0,
      totalNetAmount: 0,
    };

    let nonReimbursebleTotals = {
      totalUnits: 0,
      totalAmount: 0,
      totalDiscount: 0,
      totalGstamount: 0,
      totalNetAmount: 0,
    };

    // Calculate totals from SelectDatalist
    SelectDatalist.forEach((item) => {
      const isReimburseble = item.isReimbursable === "Yes";

      totalItems += 1;

      // Update reimburseble or non-reimburseble totals
      if (isReimburseble) {
        reimbursebleTotals.totalUnits += +item.Quantity || 0;
        reimbursebleTotals.totalAmount += parseFloat(item.Charges) || 0;
        reimbursebleTotals.totalDiscount += parseFloat(item.Discount) || 0;
        reimbursebleTotals.totalGstamount += parseFloat(item.GST) || 0;
        reimbursebleTotals.totalNetAmount += parseFloat(item.NetAmount) || 0;
      } else {
        nonReimbursebleTotals.totalUnits += +item.Quantity || 0;
        nonReimbursebleTotals.totalAmount += parseFloat(item.Charges) || 0;
        nonReimbursebleTotals.totalDiscount += parseFloat(item.Discount) || 0;
        nonReimbursebleTotals.totalGstamount += parseFloat(item.GST) || 0;
        nonReimbursebleTotals.totalNetAmount += parseFloat(item.NetAmount) || 0;
      }
    });

    console.log("Reimburseble Totals:", reimbursebleTotals);
    console.log("Non-Reimburseble Totals:", nonReimbursebleTotals);

    const roundedNetAmount = Math.round(
      nonReimbursebleTotals.totalNetAmount
    ).toFixed(2);
    const roundOffAmount = (
      roundedNetAmount - nonReimbursebleTotals.totalNetAmount
    ).toFixed(2);

    let updatedDiscount = nonReimbursebleTotals.totalDiscount;
    let updatedDiscount1 = "";
    let reimbursableamount = reimbursebleTotals.totalNetAmount;

    // Check if NetAmount_CDmethod is valid and calculate the discount
    if (NetAmount_CDmethod.Amount !== "" && NetAmount_CDmethod.Method !== "") {
      if (NetAmount_CDmethod.Method === "Percentage") {
        updatedDiscount1 =
          (nonReimbursebleTotals.totalAmount * NetAmount_CDmethod.Amount) /
          100 +
          nonReimbursebleTotals.totalDiscount;
      } else if (NetAmount_CDmethod.Method === "Cash") {
        updatedDiscount1 =
          parseFloat(NetAmount_CDmethod.Amount) +
          nonReimbursebleTotals.totalDiscount;

        console.log("Updated Discount:", updatedDiscount1);
      }

      const totalTaxableAmount =
        nonReimbursebleTotals.totalNetAmount -
        parseFloat(NetAmount_CDmethod.Amount);
      const updatedGst =
        (totalTaxableAmount * nonReimbursebleTotals.totalGstamount) /
        nonReimbursebleTotals.totalAmount || 0;

      const roundedTotalAmount = Math.round(totalTaxableAmount).toFixed(2);
      const roundOffForNewAmount = (
        roundedTotalAmount - totalTaxableAmount
      ).toFixed(2);

      setinitialState((prevState) => ({
        ...prevState,
        totalDiscount:
          NetAmount_CDmethod.Amount === ""
            ? updatedDiscount.toFixed(2)
            : updatedDiscount1,
        totalTaxable: totalTaxableAmount.toFixed(2),
        totalGstamount: updatedGst.toFixed(2),
        totalAmount: roundedTotalAmount,
        totalNetAmount: roundedTotalAmount,
        totalAmountt: roundedTotalAmount,
        PaidAmount: (0).toFixed(2),
        BalanceAmount: roundedTotalAmount,
        Roundoff: roundOffForNewAmount,
        ReimbursableAmount: reimbursableamount,
      }));
    } else {
      // If there's no NetAmount_CDmethod, just set totals as usual
      setinitialState({
        totalItems: totalItems,
        totalUnits: nonReimbursebleTotals.totalUnits,
        totalDiscount: updatedDiscount.toFixed(2),
        totalGstamount: nonReimbursebleTotals.totalGstamount.toFixed(2),
        totalAmount: roundedNetAmount,
        totalNetAmount: roundedNetAmount,
        totalAmountt: roundedNetAmount,
        totalTaxable: nonReimbursebleTotals.totalAmount.toFixed(2),
        PaidAmount: (0).toFixed(2),
        BalanceAmount: roundedNetAmount,
        Roundoff: roundOffAmount,
        ReimbursableAmount: reimbursableamount,
      });
    }
  }, [NetAmount_CDmethod, SelectDatalist]);

  useEffect(() => {
    const totalPaidAmount = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce((total, ele) => +total + +ele.paidamount, 0);
    settotalPaidAmount(totalPaidAmount);

    const totalPaidAddAmount = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce(
        (total, ele) => +total + +ele.paidamount + (+ele.Additionalamount || 0),
        0
      );

    const totalAdditionalAmount = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce((total, ele) => +total + +ele.Additionalamount, 0);

    const totalTransactionFee = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce((total, ele) => +total + +ele.transactionFee || 0, 0); // Use `|| 0` to handle empty or undefined values.
    // Calculate the total transaction fee (as an absolute amount, not percentage)
    const totalTransactionAmount = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce(
        (total, ele) =>
          total +
          ((+ele.paidamount + +ele.Additionalamount) *
            (+ele.transactionFee || 0)) /
          100, // Apply transaction fee proportionally
        0
      );

    const totalAmmm = totalPaidAddAmount + totalTransactionAmount;

    console.log("totalPaidAddAmount", totalPaidAddAmount);
    console.log("totalAdditionalAmount", totalAdditionalAmount);
    console.log("totalTransactionFee", totalTransactionFee);
    console.log("totalAmmm", totalAmmm);

    settotalPaidAmount(totalPaidAmount);
    setinitialState((prev) => ({
      ...prev,
      totalAmountt: totalAmmm.toFixed(2),
      BalanceAmount: (
        parseFloat(Math.round(prev.totalNetAmount)) -
        parseFloat(totalPaidAmount)
      ).toFixed(2),
      PaidAmount: totalPaidAmount.toFixed(2),
      Additionalamount: totalAdditionalAmount.toFixed(2),
      transactionfee: `${totalTransactionFee}%`,
    }));
  }, [billAmount, billAmount.length, isEdit]);

  const HandlesearchPatient = (value) => {
    const exist = FilterbyPatientId.find((f) => f.PatientId === value);
    if (!exist) {
      const tdata = {
        message: "Please enter a valid Patient Id",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      axios
        .get(
          `${UrlLink}Frontoffice/get_IP_Patient_Details_by_patientId?PatientId=${value}`
        )
        .then((res) => {
          const { PatientProfile, PatientId, ABHA, AliasName, PatientName, PhoneNo, Address, AgeGender, PatientCategory, RegistrationId, ...resss } = res.data;
          console.log("paaatttttttttt", res.data);

          setRegisterData((prev) => ({
            ...prev,
            PatientId: PatientId || "",
            ABHA: '64-9456-6541-8451',
            PatientName: PatientName || "",
            AgeGender: AgeGender || "",
            PhoneNo: PhoneNo || "",
            PatientCategory: PatientCategory || "",
            Address: Address || "",
          }));
          setSelectedPatient_list((prev)=>({
            ...prev,
            PatientId: PatientId || "",
            ABHA: '64-9456-6541-8451',
            PatientName: PatientName || "",
            Gender: resss.Gender || "",
            Age: resss.Age || "",
            AgeGender: AgeGender || "",
            PhoneNumber: PhoneNo || "",
            PatientCategory: PatientCategory || "",
            Address: Address || "",
          }))
          setSmartCard((prev) => ({
            ...prev,
            SmartCardNo: PatientId || "",
          }));
          setAdvanceRegistrationId((prev) => ({
            ...prev,
            RegistrationId: RegistrationId || "",
          }))
        })
        .catch((err) => console.log(err));
    }
  };

  const HandleSearchchange = (e) => {
    const { name, value } = e.target;
    setpatientsearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const HandleAdvance = () => {
    if (RegisterData.PatientId !== "") {
      if (Object.keys(IP_BillingData).length !== 0) {
        setAdvanceAmount((prev) => ({
          ...prev,
          isAdvance: 'Yes',
        }))
      }
      else {
        setAdvanceAmount((prev) => ({
          ...prev,
          isAdvance: prev?.isAdvance === 'No' ? 'Yes' : "No",
        }))
      }
    }
    else {
      const tdata = {
        message: "Please enter valid PatientId details.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  }

  useEffect(() => {
    axios.get(`${UrlLink}Frontoffice/IP_AdvanceAmount_collection?RegistrationId=${AdvanceRegistrationId.RegistrationId}`)
      .then((ress) => {
        const res = ress?.data
        console.log('advvvvv', res);
        setAdvanceAmountGet(res?.AdvanceDetails)
        setAdvanceTotal(res?.TotalAdvanceAmount)
        setRemainingCredit(res?.RemainingCredit)
      })
      .catch(e => console.log(e))
  }, [UrlLink, AdvanceAmount.isAdvance, AdvanceRegistrationId])

  const Advancecolumns = [
    {
      key: 'AdvanceAmount',
      name: 'Amount',
    },
    {
      key: 'Date',
      name: 'Date',
    },
    {
      key: 'Time',
      name: 'Time',
    },
    {
      key: 'ReceivedBy',
      name: 'Recieved By',
    },
  ]

  const handleAdvanceSubmit = () => {
    if (AdvanceAmount.AdvanceAmount !== '') {
      const postdata = {
        RegistrationId: AdvanceRegistrationId.RegistrationId,
        Created_by: UserData?.username,
        ...AdvanceAmount,
      }
      console.log('Advancesend', postdata);

      axios.post(`${UrlLink}Frontoffice/IP_AdvanceAmount_collection`, postdata)
        .then((resp) => {
          const res = resp.data
          console.log(res);
          let typp = Object.keys(res)[0]; // Get response type (success, error)
          let mess = Object.values(res)[0]; // Get response message
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });
          setAdvanceAmount({
            isAdvance: 'No',
            AdvanceAmount: '',
          })
        })
        .catch(e => console.log(e)
        )
    }
  }

  const HandleClientCheck = (e) => {
    if (RegisterData.PatientId !== "" && RegisterData.InsuranceName !== "") {
      if (
        RegisterData.PatientCategory === "Insurance" ||
        RegisterData.PatientCategory === "Client"
      ) {
        setisClient((prevState) => ({
          ...prevState,
          isClient: prevState.isClient === "No" ? "Yes" : "No",
          CoPaymentType: "Percentage",
          CoPaymentTypeinp: "",
          CoPaymentLogic: "PreAuth",
          CoPaymentdeducted: "PreAuth",
          PreAuthType: "Percentage",
          PreAuthTypeinp: "",
          PreAuthAmount: "",
          PreAuthApprovalNo: "",
          PolicyNo: "",
          PolicyStartDate: "",
          PolicyEndDate: "",
        }));
      } else {
        const tdata = {
          message: "Please Select the Client/Insurance/TPA Patient Category",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
        setisClient((prev) => ({
          ...prev,
          isClient: "No",
        }));
      }
    } else {
      const tdata = {
        message: "Please enter valid PatientId details.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };
  const HandleOnClient = (e) => {
    const { name, value } = e.target;

    // Check if the input field is for CoPaymentTypeinp or PreAuthTypeinp
    if (name === "CoPaymentTypeinp" || name === "PreAuthTypeinp") {
      setisClient((prevState) => ({
        ...prevState,
        [name]: value, // Update the respective input field state
      }));
    } else {
      setisClient((prevState) => ({
        ...prevState,
        [name]: value, // Update other fields
      }));
    }
  };
  const handledispatch = () => {
    const tdata = {
      message: "Please enter search details.",
      type: "error",
    };
    dispatchvalue({ type: "toast", value: tdata });
  };

  const HandleOnchange = async (e) => {
    const { name, value, pattern } = e.target;

    const formattedValue = [
      "FirstName",
      "MiddleName",
      "SurName",
      "Occupation",
      "NextToKinName",
      "FamilyHeadName",
      "Street",
      "Area",
      "City",
      "State",
      "Country",
    ].includes(name)
      ? `${value.charAt(0).toUpperCase()}${value.slice(1)}`
      : value;

    // Check length for specific fields
    if (
      [
        "InsuranceName",
        "ClientName",
        "FirstName",
        "MiddleName",
        "SurName",
        "Occupation",
        "NextToKinName",
        "FamilyHeadName",
        "Street",
        "Area",
        "City",
        "State",
        "Country",
        "UniqueIdNo",
      ].includes(name) &&
      value.length > 30
    ) {
      const tdata = {
        message: `${name} should not exceed 30 characters.`,
        type: "warn", // Ensure 'warn' is a valid type for your toast system
      };
      dispatchvalue({ type: "toast", value: tdata });
      return; // Exit early to prevent state update
    }

    if (name === "PatientId") {
      setRegisterData((prev) => ({
        ...prev,
        IsConsciousness: "Yes",
        [name]: value,
        PhoneNo: "",
        Title: "",
        FirstName: "",
        MiddleName: "",
        SurName: "",
        Gender: "",
        DOB: "",
        Age: "",
        Email: "",
        BloodGroup: "",
        Occupation: "",
        Religion: "",
        Nationality: "",
        UniqueIdType: "",
        UniqueIdNo: "",
        CaseSheetNo: "",

        VisitPurpose: "",

        Complaint: "",
        PatientType: "General",
        PatientCategory: "General",

        DoorNo: "",
        Street: "",
        Area: "",
        City: "",
        State: "",
        Country: "",
        Pincode: "",
      }));
    } else if (name === "PhoneNo" || name === "RelativePhoneNo") {
      if (formattedValue.includes("|")) {
        const convert = formattedValue.split(" | ");
        console.log(convert);

        if (convert.length <= 10) {
          setRegisterData((prev) => ({
            ...prev,
            [name]: convert[2].trim(),
            PatientId: convert[0].trim(),
            FirstName: convert[1].trim(),
          }));
        }
      } else {
        if (formattedValue.length <= 10) {
          setRegisterData((prev) => ({
            ...prev,
            [name]: formattedValue,
          }));
        }
      }
    } else if (name === "FirstName") {
      if (formattedValue.includes("|")) {
        const convert = formattedValue.split(" | ");

        setRegisterData((prev) => ({
          ...prev,
          [name]: convert[1].trim(),
          PatientId: convert[0].trim(),
          PhoneNo: convert[2].trim(),
        }));
      } else {
        setRegisterData((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      }
    } else if (name === "Title") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
        Gender: ["Miss", "Ms", "Mrs"].includes(value)
          ? "Female"
          : ["Mr", "Master", "Baby"].includes(value)
            ? "Male"
            : "TransGender",
      }));
    } else if (name === "DOB") {
      const currentdate = new Date();
      // Calculate the minimum allowed date (100 years before current date)
      const minAllowedDate = subYears(currentdate, 100);
      const selectedDate = new Date(value);

      if (
        isBefore(minAllowedDate, selectedDate) &&
        isBefore(selectedDate, currentdate)
      ) {
        const age = differenceInYears(currentdate, selectedDate);

        setRegisterData((prevFormData) => ({
          ...prevFormData,
          [name]: formattedValue,
          Age: age,
        }));
      } else {
        setRegisterData((prevFormData) => ({
          ...prevFormData,
          [name]: formattedValue,
          Age: "",
        }));
      }
    } else if (name === "Age") {
      if (formattedValue) {
        if (!isNaN(formattedValue) && formattedValue.length <= 3) {
          // Get the current date
          const currentDate = new Date();

          // Calculate the year to subtract
          const targetYear = subYears(currentDate, formattedValue);

          // Create a date for January 1st of the target year
          const dob = startOfYear(targetYear);

          // Format the DOB
          const formattedDOB = format(dob, "yyyy-MM-dd");
          setRegisterData((prev) => ({
            ...prev,
            [name]: formattedValue,
            DOB: format(formattedDOB, "yyyy-MM-dd"),
          }));
        }
      } else {
        setRegisterData((prev) => ({
          ...prev,
          [name]: formattedValue,
          DOB: "",
        }));
      }
    } else if (name === "ReferredBy") {
      try {
        const response = await axios.get(
          `${UrlLink}Masters/get_route_details?DoctorId=${value}`
        );
        const route = response.data;

        if (route) {
          setRegisterData((prevState) => ({
            ...prevState,
            [name]: formattedValue,
            RouteNo: route.RouteNo,
            RouteName: route.RouteName,
            TehsilName: route.TehsilName,
            VillageName: route.VillageName,
          }));
        } else {
          setRegisterData((prevState) => ({
            ...prevState,
            [name]: formattedValue,
            RouteNo: "",
            RouteName: "",
            TehsilName: "",
            VillageName: "",
          }));
        }
      } catch (error) {
        console.error("Error fetching route details:", error);
        setRegisterData((prevState) => ({
          ...prevState,
          [name]: formattedValue,
          RouteNo: "",
          RouteName: "",
          TehsilName: "",
          VillageName: "",
        }));
      }
    } else if (name === "Specialization") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
        DoctorName: "",
      }));
    } else if (name === "DoctorName") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

      // Filter for the selected doctor based on the doctor_id
      const doctor_list = DoctorData.find(
        (doc) => doc.doctor_id === formattedValue
      );

      // Check if the doctor was found
      if (doctor_list) {
        const doctor_schedule = doctor_list.schedule?.[0]; // Access the first schedule in the doctor's schedule list
        console.log("RequestedSchedule", doctor_schedule);

        if (doctor_schedule?.working === "yes") {
          const currentTime = new Date();

          // Single Shift
          if (doctor_schedule?.shift === "Single") {
            const startTime = doctor_schedule.starting_time;
            const endTime = doctor_schedule.ending_time;

            // Convert schedule times to Date objects
            const startTimeDate = new Date(`1970-01-01T${startTime}Z`);
            const endTimeDate = new Date(`1970-01-01T${endTime}Z`);

            // Check if the current time is within the available time
            if (currentTime >= startTimeDate && currentTime <= endTimeDate) {
              const tdata = {
                message: `The Doctor is currently Available`,
                type: "success",
              };
              dispatchvalue({ type: "toast", value: tdata });
            } else {
              const tdata = {
                message: `The Doctor is not Available at this time, Available from ${startTime} to ${endTime}`,
                type: "warn",
              };
              dispatchvalue({ type: "toast", value: tdata });
            }
          }

          // Double Shift
          else if (doctor_schedule?.shift === "Double") {
            const startTime_f = doctor_schedule.starting_time_f;
            const endTime_f = doctor_schedule.ending_time_f;
            const startTime_a = doctor_schedule.starting_time_a;
            const endTime_a = doctor_schedule.ending_time_a;

            // Convert schedule times to Date objects
            const startTimeDate_f = new Date(`1970-01-01T${startTime_f}Z`);
            const endTimeDate_f = new Date(`1970-01-01T${endTime_f}Z`);
            const startTimeDate_a = new Date(`1970-01-01T${startTime_a}Z`);
            const endTimeDate_a = new Date(`1970-01-01T${endTime_a}Z`);

            // Check if the current time falls within either shift (forenoon or afternoon)
            if (
              (currentTime >= startTimeDate_f &&
                currentTime <= endTimeDate_f) ||
              (currentTime >= startTimeDate_a && currentTime <= endTimeDate_a)
            ) {
              const tdata = {
                message: `The Doctor is currently Available`,
                type: "success",
              };
              dispatchvalue({ type: "toast", value: tdata });
            } else {
              const tdata = {
                message: `The Doctor is not Available at this time, Available in FN: ${startTime_f} to ${endTime_f} or AN: ${startTime_a} to ${endTime_a}`,
                type: "warn",
              };
              dispatchvalue({ type: "toast", value: tdata });
            }
          }
        }
      } else {
        const tdata = {
          message: "Doctor not found",
          type: "error",
        };
        dispatchvalue({ type: "toast", value: tdata });
      }
    } else if (name === "UniqueIdNo") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

      axios
        .get(
          `${UrlLink}Frontoffice/get_unique_id_no_validation?UniqueIdNo=${formattedValue}`
        )
        .then((reponse) => {
          let data = reponse.data;
          console.log("ressss", data);
          if (data && data.error) {
            // Show a toast if the unique ID already exists
            const tdata = {
              message: data.error,
              type: "warn", // Assuming you want to show a warning toast
            };
            dispatchvalue({ type: "toast", value: tdata });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (name === "Pincode") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

      axios
        .get(
          `${UrlLink}Frontoffice/get_location_by_pincode?pincode=${formattedValue}`
        )
        .then((reponse) => {
          let data = reponse.data;
          console.log("ressss", data);
          if (formattedValue.length > 5) {
            const { country, state, city } = data;
            setRegisterData((prev) => ({
              ...prev,
              Country: country,
              State: state,
              City: city,
            }));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }
    const validateField = (value, pattern) => {
      if (!value) {
        return "Required";
      }
      if (pattern && !new RegExp(pattern).test(value)) {
        return "Invalid";
      } else {
        return "Valid";
      }
    };

    const error = validateField(value, pattern);
    console.log(error, "error");

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const HandleSmartCard = () => { };

  const handleRegister = () => { };

  const HandlePrintOption = () => { };

  const handleRegisterChange = (event, isInputChange = false) => {
    if (!isInputChange) {
      // Handle checkbox toggle
      if (patientsearch !== "" && RegisterData.PatientId !== "") {
        setregister((prev) => ({
          ...prev,
          isregister: prev.isregister === "No" ? "Yes" : "No",
        }));

        if (register.isregister === "No") {
          // Add registration row if it doesn't exist
          const alreadyExists = SelectDatalist.some(
            (item) => item.SelectItemName === "Registration"
          );

          if (!alreadyExists) {
            const listdata = {
              ServiceType: AppointmentRegisType,
              SelectItemName: "Registration",
              Rate: 300 || "",
              Quantity: 1 || "",
              Charges: 300 || "",
              Amount: 300 || "",
              DiscountType: "-",
              Discount: "-",
              GST_per: "-",
              GST: "-",
              NetAmount: 300 || "",
            };
            setSelectDatalist((prev) => [
              ...prev,
              { S_No: prev.length + 1, ...listdata },
            ]);
          }
        }
      } else {
        // Handle validation error
        const tdata = {
          message: "Please enter valid PatientId details.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      }
    } else {
      // Handle input field change
      const { value } = event.target;
      setregister((prev) => ({
        ...prev,
        registerAmount: value,
      }));

      // Update the existing "Registration" row if present
      setSelectDatalist((prev) =>
        prev.map((item) =>
          item.SelectItemName === "Registration"
            ? {
              ...item,
              Rate: value || "0",
              Charges: value || "0",
              Amount: value || "0",
              NetAmount: value || "0",
            }
            : item
        )
      );
    }
  };

  const gridRef = useRef(null);

  const cleardata = () => {
    setRegisterData({
      PatientId: "",
      Title: "",
      FirstName: "",
      MiddleName: "",
      SurName: "",
      Gender: "",
      DOB: "",
      Age: "",
      Email: "",
      PhoneNo: "",
      BloodGroup: "",
      Occupation: "",
      Religion: "",
      Nationality: "",
      UniqueIdType: "",
      UniqueIdNo: "",
      CaseSheetNo: "",

      VisitPurpose: "",

      Complaint: "",
      PatientType: "General",
      PatientCategory: "General",

      DoorNo: "",
      Street: "",
      Area: "",
      City: "",
      State: "",
      Country: "",
      Pincode: "",
    });
    setpatientsearch({
      Search: "",
    });
    setisClient({
      isClient: "No",
      CoPaymentType: "Percentage",
      CoPaymentTypeinp: "",
      CoPaymentLogic: "PreAuth",
      CoPaymentdeducted: "PreAuth",
      PreAuthType: "Percentage",
      PreAuthTypeinp: "",
      PreAuthAmount: "",
      PreAuthApprovalNo: "",
      PolicyNo: "",
      PolicyStartDate: "",
      PolicyEndDate: "",
    });
    setSmartCard({
      SmartCardNo: "",
    });
    setConsultation({
      PhysicianType: "",
      Physician: "",
      Service: "",
      Procedure: "",
      DrugName: "",
      LabTest: "",
      RadiologyDept: "",
      RadiologyTest: "",
      SubTestName: "",
      Rate: "",
      Quantity: "",
      Charges: "",
      Amount: "",
      DiscountType: "",
      Discount: "",
      GST: "",
      GSTamount: "",
      Total: "",
      DiscountAmount: "",
    });
    setServiceProcedureForm("Consultation");
    setErrors({});
  };

  const clearservices = () => {
    setConsultation({
      PhysicianType: "",
      Physician: "",
      Service: "",
      Procedure: "",
      DrugName: "",
      LabTest: "",
      RadiologyDept: "",
      RadiologyTest: "",
      Rate: "",
      Quantity: "",
      Charges: "",
      Amount: "",
      DiscountType: "",
      Discount: "",
      GST: "",
      GSTamount: "",
      Total: "",
      DiscountAmount: "",
    });
  };

  const handleChangeBillingData = (e) => {
    const { name, value } = e.target;
    console.log("value", value);

    const finddata = Doctorsnames.find((ele) => ele.ShortName === value);

    if (finddata) {
      setBillingData((prev) => ({
        ...prev,
        [name]: value,
        DoctorId: finddata.Doctor_ID,
      }));
    } else {
      setBillingData((prev) => ({
        ...prev,
        [name]: value,
        DoctorId: "",
      }));
    }
  };

  useEffect(() => {
    if (patientsearch !== "" && ServiceProcedureForm !== "") {
      axios
        .get(`${UrlLink}Masters/Lab_Test_Name_link`)
        .then((response) => {
          const res = response?.data;
          console.log("ressssss", res);
          setLabData(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [UrlLink, ServiceProcedureForm, Consultation.LabTest]);

  // useEffect(() => {
  //   if (RegisterData.PatientId !== "" && ServiceProcedureForm !== "") {
  //     axios
  //       .get(`${UrlLink}Masters/Lab_Test_Name_link`)
  //       .then((response) => {
  //         const res = response?.data;
  //         console.log("ressssss", res);
  //         setLabData(res);
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //   }
  // }, [UrlLink]);

  useEffect(() => {
    setServiceData([]);
    if (RegisterData.PatientCategory !== "" && ServiceProcedureForm !== "") {
      if (["Insurance", "Client"].includes(RegisterData.PatientCategory)) {
        axios
          .get(`${UrlLink}Frontoffice/get_merged_service_data_bill`, {
            params: {
              PatientCategory: RegisterData.PatientCategory,
              ServiceProcedureForm,
              location: UserData?.location,
            },
          })
          .then((res) => {
            const data = res?.data;
            console.log("serrrrrrr", data);
            setServiceData(data || []);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (
        !["Insurance", "Client"].includes(RegisterData.PatientCategory) &&
        patientsearch.Search !== ""
      ) {
        axios
          .get(`${UrlLink}Frontoffice/get_merged_service_data_bill`, {
            params: {
              PatientCategory: RegisterData.PatientCategory,
              ServiceProcedureForm,
              location: UserData?.location,
            },
          })
          .then((res) => {
            const data = res?.data;
            console.log("serrrrrrr", data);
            setServiceData(data || []);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [
    ServiceProcedureForm,
    UserData?.location,
    ServiceProcedureForm,
    Consultation.Procedure,
    Consultation.Service,
  ]);

  useEffect(() => {
    if (
      Consultation.Service !== "" &&
      ServiceProcedureForm === "GeneralBillingItem" &&
      ServiceData?.length !== 0
    ) {
      const finddata = ServiceData?.find(
        (ele) => ele.Service_Id === +Consultation?.Service
      );

      if (finddata && Object.keys(finddata).length !== 0) {
        setConsultation((prev) => ({
          ...prev,
          Amount: finddata.charge,
          GST: finddata?.GstValue === "Nill" ? 0 : finddata?.GstValue,
          Rate: finddata.charge,
        }));
      }
    } else if (
      Consultation.Procedure !== "" &&
      ServiceProcedureForm === "Procedure" &&
      ServiceData?.length !== 0
    ) {
      const finddata = ServiceData?.find(
        (ele) => ele.Service_Id === +Consultation.Procedure
      );

      if (finddata && Object.keys(finddata).length !== 0) {
        setConsultation((prev) => ({
          ...prev,
          Amount: finddata.charge,
          GST: finddata?.GstValue === "Nill" ? 0 : finddata?.GstValue,
          Rate: finddata.charge,
        }));
      }
    } else if (
      patientsearch.Search !== "" &&
      Consultation.PhysicianType !== "" &&
      Consultation.Physician !== "" &&
      ServiceProcedureForm === "Consultation" &&
      DoctorRateData?.length !== 0
    ) {
      console.log("gotttttttinnnn");

      console.log("DoctorRateData:", DoctorRateData);
      console.log("Ratecard Details:", DoctorRateData.Ratecarddetials);
      console.log(
        "RegisterData.PatientCategory:",
        RegisterData.PatientCategory
      );

      const finddata = DoctorRateData?.Ratecarddetials?.find(
        (ele) => ele?.RatecardType === RegisterData?.PatientCategory
      );
      console.log("finddataaaaaa", finddata);
      if (finddata && Object.keys(finddata).length !== 0) {
        setConsultation((prev) => ({
          ...prev,
          Amount: Number(finddata.consultation_curr_fee) || 0, // Ensure charge is a valid number
          GST:
            finddata?.GstValue === "Nill" ? 0 : Number(finddata?.GstValue) || 0, // Convert GST to a number
          Rate: Number(finddata?.consultation_curr_fee) || 0, // Convert Amount to a number
        }));
      }
    } else if (
      patientsearch.Search !== "" &&
      Consultation.LabTest !== "" &&
      ServiceProcedureForm === "Lab" &&
      LabData?.length !== 0
    ) {
      const finddata = LabData?.find(
        (ele) => ele?.TestCode === Consultation?.LabTest
      );
      console.log("finddataaa", finddata);

      if (finddata && Object.keys(finddata).length !== 0) {
        setConsultation((prev) => ({
          ...prev,
          Amount: Number(finddata.charge) || 0, // Ensure charge is a valid number
          GST:
            finddata?.GstValue === "Nill" ? 0 : Number(finddata?.GstValue) || 0, // Convert GST to a number
          Rate: Number(finddata?.Amount) || 0, // Convert Amount to a number
        }));
      }
    } else if (
      patientsearch.Search !== "" &&
      Consultation.RadiologyTest !== "" &&
      ServiceProcedureForm === "Radiology" &&
      RadioNames?.length !== 0
    ) {
      const finddata = RadioNames?.find(
        (ele) => ele?.id === Consultation?.RadiologyTest
      );
      console.log("finddataaa", finddata);

      if (finddata && Object.keys(finddata).length !== 0) {
        setConsultation((prev) => ({
          ...prev,
          Amount: Number(finddata.charge) || 0, // Ensure charge is a valid number
          GST:
            finddata?.GstValue === "Nill" ? 0 : Number(finddata?.GstValue) || 0, // Convert GST to a number
          Rate: Number(finddata?.Amount) || 0, // Convert Amount to a number
        }));
      }
    }
  }, [
    patientsearch.Search,
    Consultation.Service,
    Consultation.Procedure,
    Consultation.LabTest,
    DoctorRateData,
    Consultation.PhysicianType,
    Consultation.Physician,
    Consultation.RadiologyTest,
    ServiceProcedureData,
    ServiceProcedureForm,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the consultation state
    setConsultation((prev) => {
      // List of fields that need to reset others
      const resetFields = [
        "PhysicianType",
        "Physician",
        "Service",
        "Procedure",
        "DrugName",
        "LabTest",
        "RadiologyDept",
        "RadiologyTest",
      ];

      // If one of the reset fields changes, clear the remaining fields
      if (resetFields.includes(name)) {
        return {
          ...prev,
          [name]: value,
          Physician: name === "Physician" ? value : "",
          Service: name === "Service" ? value : "",
          Procedure: name === "Procedure" ? value : "",
          DrugName: name === "DrugName" ? value : "",
          LabTest: name === "LabTest" ? value : "",
          // RadiologyDept: name === "RadiologyDept" ? value : "",
          RadiologyTest: name === "RadiologyTest" ? value : "",
          SubTestName: name === "SubTestName" ? value : "",
          Rate: "",
          Quantity: "",
          Charges: "",
          Amount: "",
          DiscountType: "",
          Discount: "",
          GST: "",
          GSTamount: "",
          Total: "",
          DiscountAmount: "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
    // // If PhysicianType changes, trigger the API call
    // if (name === "PhysicianType") {
    //   axios
    //     .get(`${UrlLink}Ip_Workbench/IP_InchargeAndRefer_Details_Link`, {
    //       params: {
    //         Type: value,
    //         RegistrationId: IP_DoctorWorkbenchNavigation?.RegistrationId,
    //       },
    //     })
    //     .then((response) => {
    //       const res = response.data;
    //       console.log("Physician data", res);
    //       setPhysicianData(res);
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //     });
    // }

    // Handle Discount and GST calculation based on the Discount Type
    if (name === "Discount" && Consultation.DiscountType === "Cash") {
      if (+Consultation.Charges <= +value) {
        alert("Discount is larger than Total Amount");
      } else {
        const selectAmount =
          +Consultation.Rate * +Consultation.Quantity - +value;
        const gstAmount = (+selectAmount * +Consultation.GST) / 100;
        const totalAmount = +selectAmount + +gstAmount;

        setConsultation((prev) => ({
          ...prev,
          [name]: value,
          Amount: selectAmount.toFixed(2),
          Total: totalAmount.toFixed(2),
          DiscountAmount: value,
          GSTamount: gstAmount.toFixed(2) || "",
        }));
      }
    } else if (
      name === "Discount" &&
      Consultation.DiscountType === "Percentage"
    ) {
      if (+value >= 100) {
        alert("Discount percentage cannot be greater than 99");
      } else {
        const discountValue =
          (+Consultation.Rate * +Consultation.Quantity * +value) / 100;
        const selectAmount =
          +Consultation.Rate * +Consultation.Quantity - discountValue;
        const gstAmount = (+selectAmount * +Consultation.GST) / 100;
        const totalAmount = +selectAmount + +gstAmount;

        setConsultation((prev) => ({
          ...prev,
          [name]: value,
          Amount: selectAmount.toFixed(2),
          Total: totalAmount.toFixed(2),
          DiscountAmount: discountValue.toFixed(2),
          GSTamount: gstAmount.toFixed(2) || "",
        }));
      }
    }

    // When DiscountType changes, reset Discount and recalculate Amount and Total
    else if (name === "DiscountType") {
      const calculatedAmount = +Consultation.Rate * +Consultation.Quantity;
      const gstAmount = (+calculatedAmount * +Consultation.GST) / 100;
      const totalAmount = +calculatedAmount + +gstAmount;

      setConsultation((prev) => ({
        ...prev,
        [name]: value,
        Discount: "",
        DiscountAmount: "",
        Amount: calculatedAmount.toFixed(2),
        Total: totalAmount.toFixed(2),
        GSTamount: gstAmount.toFixed(2) || "",
      }));
    }

    // When Quantity changes, update Charges, Amount, GST, and Total
    else if (name === "Quantity") {
      const calculatedCharges = +Consultation.Rate * +value;
      const gstAmount = (+calculatedCharges * +Consultation.GST) / 100;
      const totalAmount = +calculatedCharges + +gstAmount;

      setConsultation((prev) => ({
        ...prev,
        [name]: value,
        Charges: calculatedCharges.toFixed(2),
        Amount: calculatedCharges.toFixed(2),
        Total: totalAmount.toFixed(2),
        GSTamount: gstAmount.toFixed(2) || "",
        DiscountType: "",
        Discount: "",
      }));
    }

    // When GST changes, update the calculation based on discount and GST
    else if (name === "GST") {
      // Calculate the charges after applying the discount (if any)
      let discountedAmount = +Consultation.Rate * +Consultation.Quantity;

      if (Consultation.DiscountType === "Cash" && Consultation.Discount) {
        discountedAmount = discountedAmount - +Consultation.Discount;
      } else if (
        Consultation.DiscountType === "Percentage" &&
        Consultation.Discount
      ) {
        const discountValue = (discountedAmount * +Consultation.Discount) / 100;
        discountedAmount = discountedAmount - discountValue;
      }

      // Calculate the GST based on the discounted amount
      const gstAmount = (+discountedAmount * +value) / 100;
      const totalAmount = +discountedAmount + +gstAmount;

      setConsultation((prev) => ({
        ...prev,
        [name]: value, // Set the new GST percentage
        GSTamount: gstAmount.toFixed(2), // Set the GST amount
        Total: totalAmount.toFixed(2), // Set the total amount including GST
      }));
    }

    // General field update for all other fields
    else {
      setConsultation((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleReimbursableChange = (event, index) => {
    const updatedList = SelectDatalist.map((item, i) =>
      i === index
        ? { ...item, isReimbursable: event.target.checked ? "Yes" : "No" }
        : item
    );

    // Check if any item in the updated list has isReimbursable as "Yes"
    const anyReimbursable = updatedList.some(
      (item) => item.isReimbursable === "Yes"
    );

    // Update states
    setSelectDatalist(updatedList); // Update state with the modified data
    setReimbursable(anyReimbursable); // Set true if any checkbox is "Yes", otherwise false

    console.log("Updated List:", updatedList);
    console.log("Is any item reimbursable?", anyReimbursable);
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;

    setSelectedOption("IPDServices");

    if (name === "PatientId") {
      const Getdata = Patient_list.find((ele) => ele.PatientId === value);

      if (Getdata) {
        setSelectedPatient_list((prev) => ({
          ...prev,
          PatientId: Getdata?.PatientId,
          PatientName: Getdata?.FirstName,
          PhoneNumber: Getdata?.PhoneNo,
          Gender: Getdata.Gender,
          City: Getdata.City,
          State: Getdata.State,
          PatientAddress: Getdata?.Area,
          Pincode: Getdata.Pincode,
        }));
      } else {
        setSelectedPatient_list((prev) => ({
          ...prev,
          [name]: value,
          PatientName: "",
          PhoneNumber: "",
          PatientCategory: "General",
          InsuranceName: "",
          Gender: "",
          City: "",
          State: "",
          PatientAddress: "",
          Pincode: "",
          VisitId: "",
        }));
      }
    }
    if (name === "PatientName") {
      const Getdata = Patient_list.find((ele) => ele.FirstName === value);

      if (Getdata) {
        setSelectedPatient_list((prev) => ({
          ...prev,
          PatientId: Getdata?.PatientId,
          PatientName: Getdata?.FirstName,
          PhoneNumber: Getdata?.PhoneNo,
          Gender: Getdata.Gender,
          City: Getdata.City,
          State: Getdata.State,
          PatientAddress: Getdata?.Area,
          Pincode: Getdata.Pincode,
        }));
      } else {
        setSelectedPatient_list((prev) => ({
          ...prev,
          [name]: value,
          PatientId: "",
          PhoneNumber: "",
          PatientCategory: "General",
          InsuranceName: "",
          Gender: "",
          City: "",
          State: "",
          PatientAddress: "",
          Pincode: "",
          VisitId: "",
        }));
      }
    } else if (name === "PhoneNumber") {
      const Getdata = Patient_list.find((ele) => ele.PhoneNo === value);

      if (Getdata) {
        setSelectedPatient_list((prev) => ({
          ...prev,
          PatientId: Getdata?.PatientId,
          PatientName: Getdata?.FirstName,
          PhoneNumber: Getdata?.PhoneNo,
          Gender: Getdata.Gender,
          City: Getdata.City,
          State: Getdata.State,
          PatientAddress: Getdata?.Area,
          Pincode: Getdata.Pincode,
        }));
      } else {
        setSelectedPatient_list((prev) => ({
          ...prev,
          [name]: value,
          PatientId: "",
          PatientName: "",
          PatientCategory: "General",
          InsuranceName: "",
          Gender: "",
          City: "",
          State: "",
          PatientAddress: "",
          Pincode: "",
          VisitId: "",
        }));
      }
    }
    if (name === "PatientCategory") {
      setSelectedPatient_list((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setSelectedPatient_list((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const Additemstobillfun = () => {
    if (AdvanceAmount.AdvanceAmount !== 0) {
      // Create a new item with ServiceType and the available Consultation data
      const listdata = {
        ServiceType: 'AdvanceAmount',
        SelectItemName: "Advance Amount",
        Rate: Consultation.Rate || "",
        Quantity: 1 || "",
        Charges: parseFloat(Consultation.Charges) || "",
        Amount: parseFloat(AdvanceAmount.AdvanceAmount) || "",
        DiscountType: Consultation.DiscountType || "",
        Discount: Consultation.Discount || "",
        GST_per: Consultation.GST || "",
        GST: Consultation.GSTamount || "",
        NetAmount: parseFloat(AdvanceAmount.AdvanceAmount) || "",
        isReimbursable: "No",
      };

      console.log("Adding item:", listdata); // Log the data being added

      // Update SelectDatalist with the new item
      setSelectDatalist((prev) => [
        ...prev,
        { S_No: prev.length + 1, ...listdata },
      ]);
    } else {
      // Alert the user to fill in the missing required fields
      alert(`Please fill the required field: Advance Amount`);
    }
  };

  const Updateitems = () => {

    if (AdvanceAmount.AdvanceAmount !== 0) {
      // Check if the same ServiceType and correct item name already exist in SelectDatalist
      const Checktest = SelectDatalist.some(
        (ele) =>
          ele.SelectItemName === 'Advance Amount' &&
          ele.S_No !== SelectItemState.S_No
      );

      if (Checktest) {
        alert(`Advance Amount already exists`);
      } else {
        // Prepare the updated item object with ServiceType and other details
        const updatedItem = {
          ServiceType: 'AdvanceAmount',
          SelectItemName: 'Advance Amount',
          Rate: SelectItemState.Rate || "",
          Quantity: SelectItemState.Quantity || "",
          Charges: SelectItemState.Charges || "",
          Amount: SelectItemState.Amount || "",
          DiscountType: SelectItemState.DiscountType || "",
          Discount: SelectItemState.Discount || "",
          GST_per: SelectItemState.GST || "",
          GST: SelectItemState.GSTamount || "",
          NetAmount: SelectItemState.Total || "",
        };

        // Update the SelectDatalist by mapping through and replacing the relevant item
        setSelectDatalist((prev) =>
          prev.map((item) =>
            item.S_No === Consultation.S_No ? { ...item, ...updatedItem } : item
          )
        );

        // Clear the form and set the update state to false
        cleardata();
        setUptateitem(false);
      }
    } else {
      alert(`Please fill the required fields: Advance Amount}`);
    }
  };

  // const Editbillingitem = (itmes) => {
  //   setUptateitem(true);
  //   setBillAmount([]);
  //   setSelectedOption(itmes.ServiceType);

  //   // Dynamically set the consultation fields based on the service type
  //   switch (itmes.ServiceType) {
  //     case "Consultation":
  //       setConsultation({
  //         PhysicianType: itmes.PhysicianType || "",
  //         Physician: itmes.SelectItemName || "", // Physician maps to SelectItemName
  //         Rate: itmes.Rate || "",
  //         Charges: itmes.Charges || "",
  //         Amount: itmes.Amount || "",
  //         DiscountType: itmes.DiscountType || "",
  //         Discount: itmes.Discount || "",
  //         GST: itmes.GST || "",
  //         Total: itmes.NetAmount || "",
  //         GSTamount: itmes.GSTamount || "",
  //         Quantity: itmes.Quantity || "",
  //         DiscountAmount: itmes.DiscountAmount || "",
  //         S_No: itmes.S_No || "", // Store the S_No for updating the correct row
  //       });
  //       break;

  //     case "Lab":
  //       setConsultation({
  //         LabTest: itmes.SelectItemName || "", // LabTest maps to SelectItemName
  //         Rate: itmes.Rate || "",
  //         Charges: itmes.Charges || "",
  //         Amount: itmes.Amount || "",
  //         DiscountType: itmes.DiscountType || "",
  //         Discount: itmes.Discount || "",
  //         GST: itmes.GST || "",
  //         Total: itmes.Total || "",
  //         GSTamount: itmes.GSTamount || "",
  //         Quantity: itmes.Quantity || "",
  //         DiscountAmount: itmes.DiscountAmount || "",
  //         S_No: itmes.S_No || "",
  //       });
  //       break;

  //     case "Radiology":
  //       setConsultation({
  //         RadiologyDept: itmes.RadiologyDept || "", // Add RadiologyDept if it's part of the row
  //         RadiologyTest: itmes.SelectItemName || "", // RadiologyTest maps to SelectItemName
  //         Rate: itmes.Rate || "",
  //         Charges: itmes.Charges || "",
  //         Amount: itmes.Amount || "",
  //         DiscountType: itmes.DiscountType || "",
  //         Discount: itmes.Discount || "",
  //         GST: itmes.GST || "",
  //         Total: itmes.Total || "",
  //         GSTamount: itmes.GSTamount || "",
  //         Quantity: itmes.Quantity || "",
  //         DiscountAmount: itmes.DiscountAmount || "",
  //         S_No: itmes.S_No || "",
  //       });
  //       break;

  //     case "GeneralBillingItem":
  //       setConsultation({
  //         Service: itmes.SelectItemName || "", // Service maps to SelectItemName
  //         Rate: itmes.Rate || "",
  //         Charges: itmes.Charges || "",
  //         Amount: itmes.Amount || "",
  //         DiscountType: itmes.DiscountType || "",
  //         Discount: itmes.Discount || "",
  //         GST: itmes.GST_per || "",
  //         Total: itmes.NetAmount || "",
  //         GSTamount: itmes.GSTamount || "",
  //         Quantity: itmes.Quantity || "",
  //         DiscountAmount: itmes.DiscountAmount || "",
  //         S_No: itmes.S_No || "",
  //       });
  //       break;

  //     case "Procedure":
  //       setConsultation({
  //         Procedure: itmes.SelectItemName || "", // Procedure maps to SelectItemName
  //         Rate: itmes.Rate || "",
  //         Charges: itmes.Charges || "",
  //         Amount: itmes.Amount || "",
  //         DiscountType: itmes.DiscountType || "",
  //         Discount: itmes.Discount || "",
  //         GST: itmes.GST || "",
  //         Total: itmes.Total || "",
  //         GSTamount: itmes.GSTamount || "",
  //         Quantity: itmes.Quantity || "",
  //         DiscountAmount: itmes.DiscountAmount || "",
  //         S_No: itmes.S_No || "",
  //       });
  //       break;

  //     case "Drug":
  //       setConsultation({
  //         DrugName: itmes.SelectItemName || "", // DrugName maps to SelectItemName
  //         Rate: itmes.Rate || "",
  //         Charges: itmes.Charges || "",
  //         Amount: itmes.Amount || "",
  //         DiscountType: itmes.DiscountType || "",
  //         Discount: itmes.Discount || "",
  //         GST: itmes.GST || "",
  //         Total: itmes.Total || "",
  //         GSTamount: itmes.GSTamount || "",
  //         Quantity: itmes.Quantity || "",
  //         DiscountAmount: itmes.DiscountAmount || "",
  //         S_No: itmes.S_No || "",
  //       });
  //       break;

  //     default:
  //       setConsultation({
  //         SelectItemName: itmes.SelectItemName || "", // Default case for any other ServiceType
  //         Rate: itmes.Rate || "",
  //         Charges: itmes.Charges || "",
  //         Amount: itmes.Amount || "",
  //         DiscountType: itmes.DiscountType || "",
  //         Discount: itmes.Discount || "",
  //         GST: itmes.GST || "",
  //         Total: itmes.Total || "",
  //         GSTamount: itmes.GSTamount || "",
  //         Quantity: itmes.Quantity || "",
  //         DiscountAmount: itmes.DiscountAmount || "",
  //         S_No: itmes.S_No || "",
  //       });
  //       break;
  //   }
  // };

  const deletebillingitem = (row) => {
    const S_No = row.S_No;

    let Temp_delarr = SelectDatalist.filter((ele) => ele.S_No !== S_No);
    setSelectDatalist(
      Temp_delarr.map((item, index) => ({ ...item, S_No: index + 1 }))
    );
  };

  useEffect(() => {
    if (
      Object.keys(IP_BillingData).length !== 0 &&
      SelectDatalist.length === 0
    ) {
      // First axios call to fetch IP Billing Service List
      axios
        .get(`${UrlLink}Frontoffice/IP_Billing_Service_List`, {
          params: {
            QueueList_ID: IP_BillingData?.Registration_Id,
          },
        })
        .then((res) => {
          let GetIPBillingdata = res.data.Billing_data;
          let GetIPBillingdataService = res.data.Billing_data_list;

          console.log("GetIPBillingdata", GetIPBillingdata);
          console.log("GetIPBillingdataService", GetIPBillingdataService);

          if (Object.values(GetIPBillingdata).length > 5) {
            // Setting Doctor and Patient details
            setBillingData((prev) => ({
              ...prev,
              DoctorName: GetIPBillingdata.Doctor_ShortName || "",
              DoctorId: GetIPBillingdata.Doctor_ID || "",
            }));
            setpatientsearch((prev) => ({
              ...prev,
              Search: IP_BillingData.PatientId,
            }));
            setSmartCard((prev) => ({
              ...prev,
              SmartCardNo: IP_BillingData.PatientId,
            }));

            setRegisterData((prev) => ({
              ...prev,
              ABHA: '64-9456-6541-8451',
              PatientName: IP_BillingData.Patient_Name || "",
              AgeGender: IP_BillingData.AgeGender || "",
              PhoneNo: IP_BillingData.PhoneNo || "",
              PatientCategory: IP_BillingData.PatientCategory || "",
              Address: IP_BillingData.Address || "",
              PatientId: IP_BillingData.PatientId || "",
            }));
            setAppointmentRegisType(IP_BillingData.VisitType);

            setSelectedPatient_list((prev) => ({
              ...prev,
              PatientId: GetIPBillingdata.PatientId,
              PatientName: GetIPBillingdata.Patient_Name,
              PhoneNumber: GetIPBillingdata.PhoneNo,
              PatientCategory: GetIPBillingdata.PatientCategory,
              Gender: GetIPBillingdata.Gender,
              City: GetIPBillingdata.City,
              State: GetIPBillingdata.State,
              PatientAddress: GetIPBillingdata.Area,
              Pincode: GetIPBillingdata.Pincode,
              RegisterId: GetIPBillingdata.Registration_Id,
              QueueList_ID: GetIPBillingdata.id,
              VisitId: GetIPBillingdata.VisitId,
            }));
            // Map over GetIPBillingdataService to get service data
            let mappedServiceData = GetIPBillingdataService.map(
              (service, index) => {
                return {
                  S_No: index + 1, // Add serial number based on index
                  ServiceType: service.Service_Type,
                  SelectItemName: service.Service_Name,
                  Charges: parseFloat(service.Charge),
                  Amount: parseFloat(service.Amount),
                  DiscountType: "",
                  Discount: "",
                  GST_per: service.GST_per,
                  GST: service.GST_Charge,
                  Status: service.Status,
                  NetAmount: parseFloat(service.NetAmount),
                  Quantity: parseFloat(service.Quantity),
                  isReimbursable: "No",
                };
              }
            );

            // Only add Adddata if the necessary fields are not empty
            let Adddata = {
              ServiceType: GetIPBillingdata.Billing_Type,
              SelectItemName: GetIPBillingdata.ServiceName,
              Rate: GetIPBillingdata.Service_Fee,
              Charges: GetIPBillingdata.Service_Fee,
              Amount: GetIPBillingdata.Service_Fee,
              DiscountType: "",
              Discount: "",
              GST_per: "",
              Total: GetIPBillingdata.Service_Fee,
              GST: "",
              Quantity: 1,
              Status: GetIPBillingdata.Status,
              DiscountAmount: "",
              isReimbursable: "No",
            };

            // Conditionally add Adddata only if ServiceName and Service_Fee are present
            if (
              Adddata.SelectItemName &&
              Adddata.ServiceType &&
              Adddata.Service_Fee
            ) {
              mappedServiceData = [Adddata, ...mappedServiceData];
            }

            // Set the updated service data to SelectDatalist
            setSelectDatalist(mappedServiceData);
            // Second axios call to fetch additional room billing data
            axios
              .get(`${UrlLink}Frontoffice/IP_Billing_Service_List`, {
                params: {
                  QueueList_ID: IP_BillingData.Registration_Id,
                },
              })
              .then((response) => {
                let RoomBillingData = response.data.Room_data;
                console.log("RoomBillingData", RoomBillingData);

                // Ensure RoomBillingData exists
                if (RoomBillingData) {
                  // Extract CumulativeTotalAmount and CumulativeDaysHours from RoomBillingData
                  let cumulativeTotalAmount =
                    RoomBillingData.CumulativeTotalAmount;
                  let cumulativeDaysHours = RoomBillingData.CumulativeDaysHours;

                  // If data is present, map it into mappedAdditionalServiceData
                  let mappedAdditionalServiceData = {
                    S_No: mappedServiceData.length + 1, // Continue serial number
                    ServiceType: "Room",
                    SelectItemName: "BedCharge",
                    Charges: cumulativeTotalAmount, // Assign the CumulativeTotalAmount
                    Amount: cumulativeTotalAmount, // Assign the CumulativeTotalAmount again for Amount
                    DiscountType: "",
                    Discount: "",
                    GST_per: "Nill",
                    GST: "Nill",
                    Status: "UnPaid",
                    NetAmount: cumulativeTotalAmount, // Assign the CumulativeTotalAmount again for NetAmount
                    Quantity: cumulativeDaysHours, // Assign the CumulativeDaysHours for Quantity
                    isReimbursable: "No",
                  };

                  // Log the mapped data to verify
                  console.log("RRR", mappedAdditionalServiceData);

                  // Append the additional data to the existing SelectDatalist
                  setSelectDatalist((prev) => [
                    ...prev,
                    mappedAdditionalServiceData, // Spread the additional array of data
                  ]);
                } else {
                  console.error("No RoomBillingData found in response");
                }
              })
              .catch((e) => {
                console.log(e);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } 
  }, [UrlLink, IP_BillingData.Registration_Id, IP_BillingData, OP_BillingData]);

  // useEffect to aggregate data whenever SelectDatalist changes
  useEffect(() => {
    const aggregatedData = SelectDatalist.reduce((acc, curr) => {
      const existing = acc.find(
        (item) => item.ServiceType === curr.ServiceType
      );
      if (existing) {
        existing.Charges += curr.Charges;
        existing.Quantity += curr.Quantity;
        existing.Amount += curr.Amount;
        existing.NetAmount += curr.NetAmount;
      } else {
        acc.push({ ...curr });
      }
      return acc;
    }, []);
    console.log("agggg", aggregatedData);

    // Set aggregated data to SelectDatalist1
    setSelectDatalist1(aggregatedData);
  }, [SelectDatalist]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const total_netamount = Math.round(initialState.totalNetAmount).toFixed(2);

    if (+totalPaidAmount !== +total_netamount) {
      if (name === "Billpay_method") {
        setFormAmount((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      } else if (name === "paidamount") {
        if (billAmount.length > 0) {
          const amttt = parseFloat(total_netamount) - totalPaidAmount;
          if (+amttt >= +value) {
            setFormAmount((prevState) => ({
              ...prevState,
              [name]: value,
            }));
          } else {
            alert(`enter the Correct value blow the Net Amount ${amttt}`);
            setFormAmount((prevState) => ({
              ...prevState,
              [name]: "",
            }));
          }
        } else {
          if (+total_netamount >= +value) {
            setFormAmount((prevState) => ({
              ...prevState,
              [name]: value,
            }));
          } else {
            alert(
              `enter the Correct value blow the Net Amount ${total_netamount}`
            );
            setFormAmount((prevState) => ({
              ...prevState,
              [name]: "",
            }));
          }
        }
      } else {
        setFormAmount((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      alert("No Balance Amount");
    }
  };

  const handleAdd = () => {
    let req = [];
    if (formAmount.Billpay_method === "Card") {
      req = ["Billpay_method", "CardType", "paidamount"];
    } else if (formAmount.Billpay_method === "Cheque") {
      req = ["Billpay_method", "ChequeNo", "BankName", "paidamount"];
    } else if (formAmount.Billpay_method === "OnlinePayment") {
      req = ["Billpay_method", "paidamount"];
    } else {
      req = ["Billpay_method", "paidamount"];
    }
    const missing = req.filter((row) => !formAmount[row]);
    if (missing.length === 0) {
      const exist = billAmount.find(
        (p) => p.Billpay_method === formAmount.Billpay_method
      );
      if (!exist) {
        setBillAmount((prev) => [...prev, formAmount]);
        setFormAmount({
          Billpay_method: "",
          CardType: "",
          ChequeNo: "",
          BankName: "",
          paidamount: "",
          Additionalamount: "",
          transactionFee: "",
        });
      } else {
        alert("The Payment Method already exist");
      }
    } else {
      alert(`enter the required fields : ${missing.join(",")}`);
    }
  };

  const handleUpdate = () => {
    let req = [];
    if (formAmount.Billpay_method === "Card") {
      req = ["Billpay_method", "CardType", "paidamount"];
    } else if (formAmount.Billpay_method === "Cheque") {
      req = ["Billpay_method", "ChequeNo", "BankName", "paidamount"];
    } else if (formAmount.Billpay_method === "OnlinePayment") {
      req = ["Billpay_method", "paidamount"];
    } else {
      req = ["Billpay_method", "paidamount"];
    }
    const missing = req.filter((row) => !formAmount[row]);
    if (missing.length === 0) {
      const data = [...billAmount];
      data[isEdit] = formAmount;

      setBillAmount(data);
      setFormAmount({
        Billpay_method: "",
        CardType: "",
        ChequeNo: "",
        BankName: "",
        paidamount: "",
        Additionalamount: "",
        transactionFee: "",
      });
      setIsEdit(null);
    } else {
      alert(`enter the required fields : ${missing.join(",")}`);
    }
  };

  const handleEdit = (index) => {
    console.log(index, "---");

    const item = billAmount[index];

    if (item.Billpay_method === "Advance") {
      let Remove = billAmount.filter((ele) => ele.Billpay_method !== "Advance");
      setBillAmount(Remove);
    } else {
      setIsEdit(index);
      const item = billAmount[index];
      setFormAmount({
        ...item,
      });
    }
  };

  // Automatically update ServiceProcedureForm when AppointmentRegisType changes
  useEffect(() => {
    if (AppointmentRegisType === "Laboratory") {
      setServiceProcedureForm("Lab");
    } else if (AppointmentRegisType === "Pharmacy") {
      setServiceProcedureForm("Pharmacy");
    } else if (AppointmentRegisType === "Radiology") {
      setServiceProcedureForm("Radiology");
    }
  }, [UrlLink, AppointmentRegisType]);

  // Automatically update ServiceProcedureForm when AppointmentRegisType changes
  useEffect(() => {
    if (
      RegisterData.PatientCategory === "Insurance" ||
      RegisterData.PatientCategory === "Client"
    ) {
      axios
        .get(
          `${UrlLink}Frontoffice/get_client_insurance_details?PatientId=${patientsearch.Search}`
        )
        .then((response) => {
          const res = response.data;
          console.log("ccccllliii", res);
          // Destructure the response data
          const {
            isClient,
            CoPaymentType,
            CoPaymentTypeinp,
            CoPaymentLogic,
            CoPaymentdeducted,
            PreAuthType,
            PreAuthTypeinp,
            PreAuthAmount,
            PreAuthApprovalNo,
            PolicyNo,
            PolicyStartDate,
            PolicyEndDate,
          } = res;

          // Update the state for isClient
          setisClient((prev) => ({
            ...prev,
            isClient: isClient,
            CoPaymentType,
            CoPaymentTypeinp,
            CoPaymentLogic,
            CoPaymentdeducted,
            PreAuthType,
            PreAuthTypeinp,
            PreAuthAmount,
            PreAuthApprovalNo,
            PolicyNo,
            PolicyStartDate,
            PolicyEndDate,
          }));
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setisClient((prev) => ({
        ...prev,
        isClient: "No",
        CoPaymentType: "Percentage",
        CoPaymentTypeinp: "",
        CoPaymentLogic: "PreAuth",
        CoPaymentdeducted: "PreAuth",
        PreAuthType: "Percentage",
        PreAuthTypeinp: "",
        PreAuthAmount: "",
        PreAuthApprovalNo: "",
        PolicyNo: "",
        PolicyStartDate: "",
        PolicyEndDate: "",
      }));
    }
  }, [UrlLink, patientsearch.Search, RegisterData.PatientCategory]);

  const handleServiceProcedureChange = (e, p) => {
    if (patientsearch.Search !== "" && RegisterData.PatientId !== "") {
      setServiceProcedureForm(p);
      // Reset Consultation data
      setConsultation({
        PhysicianType: "",
        Physician: "",
        Service: "",
        Procedure: "",
        DrugName: "",
        LabTest: "",
        RadiologyDept: "",
        RadiologyTest: "",
        SubTestName: "",
        Rate: "",
        Quantity: "",
        Charges: "",
        Amount: "",
        DiscountType: "",
        Discount: "",
        GST: "",
        GSTamount: "",
        Total: "",
        DiscountAmount: "",
      });
    } else {
      const tdata = {
        message: "Please enter a valid Patient Id",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  const handlesubmitpatient = () => {
    let requiredfields1 = [
      "Title",
      "FirstName",
      "MiddleName",
      "SurName",
      "Gender",
      "DOB",
      "Age",
      "Email",
      "PhoneNo",
      "BloodGroup",
      "Occupation",
      "Religion",
      "Nationality",
      "UniqueIdType",
      "UniqueIdNo",
      "CaseSheetNo",
      "DoorNo",
      "Street",
      "Area",
      "City",
      "State",
      "Country",
      "Pincode",
    ];

    const existing = requiredfields1.filter((field) => !RegisterData[field]);
    if (existing.length !== 0) {
      alert(`Please fill the required fields ${existing.join(",")}`);
    } else {
      const postdata = {
        RegisterData,
        Created_by: UserData?.username,
      };
      console.log("PatientData", postdata);

      axios
        .post(`${UrlLink}Frontoffice/Patient_details_register`, postdata)
        .then((response) => {
          const res = response.data;
          let typp = Object.keys(res)[0]; // Get response type (success, error)
          let mess = Object.values(res)[0]; // Get response message
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });
          cleardata();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const handlesubmitclient = () => {
    let requiredfields1 = [
      "CoPaymentTypeinp",
      "PreAuthTypeinp",
      "PreAuthAmount",
      "PreAuthApprovalNo",
      "PolicyNo",
      "PolicyStartDate",
      "PolicyEndDate",
    ];

    const existing = requiredfields1.filter((field) => !isClient[field]);
    if (existing.length !== 0) {
      alert(`Please fill the required fields ${existing.join(",")}`);
    } else {
      const postdata = {
        isClient: isClient.isClient, // isClient status
        CoPaymentType: isClient.CoPaymentType, // Ensure CoPaymentType is passed
        CoPaymentTypeinp: isClient.CoPaymentTypeinp,
        CoPaymentLogic: isClient.CoPaymentLogic,
        CoPaymentdeducted: isClient.CoPaymentdeducted,
        PreAuthType: isClient.PreAuthType, // Ensure PreAuthType is passed
        PreAuthTypeinp: isClient.PreAuthTypeinp,
        PreAuthAmount: isClient.PreAuthAmount,
        PreAuthApprovalNo: isClient.PreAuthApprovalNo,
        PolicyNo: isClient.PolicyNo,
        PolicyStartDate: isClient.PolicyStartDate,
        PolicyEndDate: isClient.PolicyEndDate,
        PatientId: patientsearch.Search, // Assuming patientsearch contains PatientId
        Created_by: UserData?.username,
        Location: UserData?.location,
      };

      console.log("cliiiiieeeee", postdata);
      axios
        .post(`${UrlLink}Frontoffice/get_client_insurance_details`, postdata)
        .then((response) => {
          console.log("submitdata", response.data);
          setisClient({
            CoPaymentType: "Percentage",
            CoPaymentTypeinp: "",
            CoPaymentLogic: "PreAuth",
            CoPaymentdeducted: "PreAuth",
            PreAuthType: "Percentage",
            PreAuthTypeinp: "",
            PreAuthAmount: "",
            PreAuthApprovalNo: "",
            PolicyNo: "",
            PolicyStartDate: "",
            PolicyEndDate: "",
          });

          let typp = Object.keys(response.data)[0]; // Get response type (success, error)
          let mess = Object.values(response.data)[0]; // Get response message
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    // Schedule the event for 12:00 AM
    const scheduleMidnightEvent = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // Schedule for the next day
        0, 0, 0, 0 // 12:00 AM
      );
      const timeUntilMidnight = midnight - now;

      // Schedule the first execution
      setTimeout(() => {
        handleSubmit(); // Call the function at midnight
        setInterval(handleSubmit, 24 * 60 * 60 * 1000); // Repeat every 24 hours
      }, timeUntilMidnight);
    };

    scheduleMidnightEvent();
  }, []);

  const handleSubmit = (
    isSummary = false,
    isReimb = false,
    isNon_Reimb = false
  ) => {
    let requiredfields1 = [
      "PatientId",
      "PatientName",
      "PhoneNo",
      "AgeGender",
    ];
    let missingFields = requiredfields1.filter((field) => !RegisterData[field]);
    let errorMessages = [];

    // Check for missing required fields
    if (missingFields.length > 0) {
      errorMessages.push(
        `Please fill the required fields: ${missingFields.join(", ")}`
      );
    }

    // Check if Item Details are empty
    if (SelectDatalist.length === 0) {
      errorMessages.push("Please fill the Item Details.");
    }

    // Check if Payment Details are missing
    if (billAmount.length === 0 && initialState.ReimbursableAmount !== 0) {
      errorMessages.push("Please fill the Payment Details.");
    }
    if (initialState.BalanceAmount === 0){
      errorMessages.push("Please Collect the Total Amount");
    }

    else {
      console.log('Doctor Name is not needed');

    }


    // If there are any errors, show them all in one alert
    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n"));
      return; // Exit the function to avoid proceeding further
    }
    if (AdvanceAmount.AdvanceAmount !== '') {
      const postdata = {
        RegistrationId: AdvanceRegistrationId.RegistrationId,
        Created_by: UserData?.username,
        AdvanceAmount: initialState.totalNetAmount,
        Location: UserData?.location,
      }
      axios.post(`${UrlLink}Frontoffice/IP_AdvanceAmount_collection`, postdata)
        .then((resp) => {
          const res = resp.data
          console.log(res);
          let typp = Object.keys(res)[0]; // Get response type (success, error)
          let mess = Object.values(res)[0]; // Get response message
          const tdata = {
            message: mess,
            type: typp,
          };
          // setPostInvoice(res.data.InvoiceNo);
          setIsPrintButtonVisible(false);
          dispatchvalue({ type: "toast", value: tdata });
          setAdvanceAmount({
            isAdvance: 'No',
            AdvanceAmount: '',
          })
        })
        .catch(e => console.log(e)
        )
    }
  };

  // const SubmitSumalldata = () => {
  //   let requiredfields1 = [
  //     "PatientId",
  //     "FirstName",
  //     "PhoneNo",
  //     "Gender",
  //     "Pincode",
  //   ];

  //   const existing = requiredfields1.filter((field) => !RegisterData[field]);

  //   if (existing.length !== 0) {
  //     alert(`Please fill the required fields ${existing.join(",")}`);
  //   } else if (SelectDatalist.length === 0) {
  //     alert("Please fill the Item Details");
  //   } else if (billAmount.length === 0) {
  //     alert("Please fill the Payment Details");
  //   } else if (BillingData.DoctorName === "") {
  //     alert("Please fill the DoctorName Details");
  //   } else {
  //     let senddata = {
  //       billAmount: billAmount,
  //       SelectedPatient_list: SelectedPatient_list,
  //       NetAmount_CDmethod: NetAmount_CDmethod,
  //       SelectDatalist: SelectDatalist,
  //       BillingData: BillingData,
  //       initialState: initialState,
  //       Created_by: UserData?.username,
  //       Location: UserData?.location,
  //       selectedOption: selectedOption,
  //     };

  //     console.log("senddata", senddata);

  //     axios
  //       .post(`${UrlLink}Frontoffice/IPBilling_Link`, senddata)
  //       .then((res) => {
  //         console.log(res.data);
  //         setPostInvoice(res.data.InvoiceNo);
  //         setIsPrintButtonVisible(false);
  //         setisPrintSummary(true);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    //   pageStyle: `
    //   @page {
    //     size: auto;


    //     @bottom-center {
    //       content: 'Page ' counter(page) ' of ' counter(pages);
    //       text-align: center;
    //       font-size: 10.5px;
    //       font-family: Arial, sans-serif;
    //       font-style: italic;
    //       margin-bottom: 30mm !important;

    //     }
    //   }
    // `,

    onAfterPrint: async () => {
      // Additional action after printing, if needed
      navigate("/Home/AdvanceCollectionList")
    },

  });



  const ForPrintData = () => {
    return (
      <div ref={componentRef}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
          id="reactprintcontent"
        >
          <table
            className="print-table33"
          // style={{ flexGrow: 1, }}
          >
            <thead
              className="print_header"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                height: "150px",
              }}
            >
              <tr>
                <td colSpan="7" style={{ border: "none" }}>
                  <div className="New_billlling_invoice_head">
                    <div className="new_billing_logo_con">
                      <img src={Clinic_Logo} alt="Medical logo" />
                    </div>
                    <div className="new_billing_address_1">
                      <span>{ClinicDetials.ClinicName}</span>
                      <div>
                        <span>
                          {[ClinicDetials.ClinicAddress]
                            .filter((detail) => detail)
                            .join(", ")}
                        </span>
                        <span>
                          {[
                            ClinicDetials.ClinicCity,
                            ClinicDetials.ClinicState,
                            ClinicDetials.ClinicCode,
                          ]
                            .filter((detail) => detail)
                            .join(", ")}
                        </span>
                      </div>
                      <div>
                        {[
                          ClinicDetials.ClinicMobileNo,
                          ClinicDetials.ClinicLandLineNo,
                          ClinicDetials.ClinicMailID,
                        ]
                          .filter((detail) => detail)
                          .join(" , ")}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: "black",
                    fontSize: "20px",
                  }}
                >
                  Billing Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address">
                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient ID <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Age / Gender <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.Age} / {SelectedPatient_list.Gender}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          D.O.A <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.Age}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          D.O.S <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.Age}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Date <span>:</span>
                        </label>
                        <h4>{Billing_date.toLocaleDateString()}</h4>
                      </div>

                      {/* {SelectedPatient_list.PatientType === "BtoB" ? (
                        <div className="new_billing_div phrmy_newbilg">
                          <label>
                            GST Number <span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.GSTnumber}</h4>
                        </div>
                      ) : (
                        <div className="new_billing_div phrmy_newbilg">
                          <label>
                            Gender <span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.Gender}</h4>
                        </div>
                      )} */}

                    </div>

                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{AdvanceRegistrationId.RegistrationId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Bill No <span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Patient Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>

                      {/* <div className="new_billing_div phrmy_newbilg">
                        <label>
                          Date <span>:</span>
                        </label>
                        <h4>{BillingData.InvoiceDate}</h4>
                      </div> */}

                    </div>
                  </div>
                </td>



              </tr>

            </thead>

            <tbody>
              <tr>
                <td colSpan="7" className="prin_nnrmll_table">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Service Type</th>
                        <th>Unit / Graft</th>
                        <th>Amount</th>
                        <th>Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SelectDatalist.map((row, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{row.ServiceType}</td>
                          <td>{row.Quantity}</td>
                          <td>{row.Amount}</td>
                          <td>{row.NetAmount}</td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </td>
              </tr>



            </tbody>
            <tr>
              <td colSpan="7">
                <div className="new_billing_invoice_detials">
                  <div className="invoice_detials_total_1">
                    <div className="total_con_bill">
                      <div className="bill_body_new_phar">
                        <label>
                          Amount In Words <span>:</span>
                        </label>
                        <span>
                          {NumberToWords(+initialState.totalNetAmount)}
                        </span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Billed By <span>:</span>
                        </label>
                        <span>{UserData?.username}</span>
                      </div>
                    </div>



                    <div>
                      <div className="bill_body_new_phar">
                        <label>
                          Gross Amount <span>:</span>
                        </label>
                        <span>{initialState.totalAmount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          SGST <span>:</span>
                        </label>
                        <span>{initialState.totalGstamount / 2}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          CGST <span>:</span>
                        </label>
                        <span>{initialState.totalGstamount / 2}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Net Amount <span>:</span>
                        </label>
                        <span>{initialState.totalNetAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>


            <tfoot className="print_footerr">
              <tr className="jjxcdsjjej_"></tr>

              <tr className="ehdhe_9ikw">
                <td className="shshxhxs_secfooter">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p className="disclaimer23">
                      This page is created automatically without a signature.
                    </p>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>



        <div className="Register_btn_con added_Register_btn_con">
          <button
            className="RegisterForm_1_btns jwedu6_99"
            onClick={handlePrint2}
          >
            Print
          </button>
        </div>
      </div>
    );
  };


  return (
    <>
      {isPrintButtonVisible ? (
        <>
          <div className="Main_container_app">
            <h3>Billing</h3>
            {/* <div className="RegisterBillTypecon">
          <div className="RegisterBillType">
            {["PatientID", "FirstName", "PhoneNumber"].map((p, ind) => (
              <div className="registerbillval" key={ind}>
                <input
                  type="radio"
                  id={p}
                  value={p}
                  name="PatientSearch"
                  checked={patientsearchoption === p}
                  onChange={(e) => {
                    setpatientsearchoption(e.target.value);
                    cleardata();
                  }}
                />
                <label htmlFor={p}>{p}</label>
              </div>
            ))}
          </div>
        </div> */}

            <div className="csdcedw_kl88">
              <div className="RegisBillSearchForm_1 RegisBillSearchForm_1_mmmm">
                <label>
                  Search <span>:</span>
                </label>
                <div className="Search_patient_icons">
                  <input
                    type="text"
                    onKeyDown={
                      patientsearch === "FirstName"
                        ? (e) => HandlesearchPatient(patientsearch.Search)
                        : null
                    }
                    list="Search_iddd"
                    autoComplete="off"
                    name="Search"
                    pattern={
                      patientsearch === "PhoneNumber" ? "\\d{10}" : "[A-Za-z]+"
                    }
                    className={
                      errors["Search"] === "Invalid"
                        ? "invalid"
                        : errors["Search"] === "Valid"
                          ? "valid"
                          : ""
                    }
                    value={patientsearch.Search}
                    onChange={HandleSearchchange}
                  />
                  <datalist id="Search_iddd">
                    {FilterbyPatientId.map((row, indx) => (
                      <option key={indx} value={row.PatientId}>
                        {`${row.PhoneNo} | ${row.FirstName} | ${row.UniqueIdNo}`}
                      </option>
                    ))}
                  </datalist>
                  {patientsearch.Search && (
                    <span
                      onClick={() => HandlesearchPatient(patientsearch.Search)}
                    >
                      <PersonSearchIcon />
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="RegisBillFormcon" ref={gridRef}>
              {RegisterData &&
                Object.keys(RegisterData).map((field, index) => (
                  <div
                    className="RegisBillForm_1 RegisBillForm_1_M "
                    key={index}
                  >
                    <label htmlFor={`${field}_${index}`}>
                      {field === "AgeGender"
                        ? "Age/Gender"
                        : formatLabel(field)}
                      <span>:</span>
                    </label>
                    {[
                      "PatientId",
                      "ABHA",
                      "PatientName",
                      "AgeGender",
                      "PhoneNo",
                      "PatientCategory",
                    ].includes(field) ? (
                      <input
                        id={`${field}_${index}`}
                        autoComplete="off"
                        type={field === "DOB" ? "date" : "text"}
                        name={field}
                        pattern={
                          field === "Email"
                            ? "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[cC][oO][mM]$"
                            : field === "PhoneNo"
                              ? "\\d{10}"
                              : ["CaseSheetNo", "UniqueIdNo"].includes(field)
                                ? "[A-Za-z0-9]+"
                                : field === "Age"
                                  ? "\\d{1,3}"
                                  : field === "DOB"
                                    ? ""
                                    : field === "Pincode"
                                      ? "\\d{6}"
                                      : "[A-Za-z]+"
                        }
                        className={
                          errors[field] === "Invalid"
                            ? "invalid"
                            : errors[field] === "Valid"
                              ? "valid"
                              : ""
                        }
                        required
                        value={RegisterData[field]}
                        onKeyDown={
                          [
                            "MiddleName",
                            "SurName",
                            "Occupation",
                            "NextToKinName",
                            "FamilyHeadName",
                            "Street",
                            "Area",
                            "City",
                            "State",
                            "Complaint",
                            "Country",
                          ].includes(field)
                            ? handleKeyDownTextRegistration
                            : field === "PhoneNo"
                              ? handleKeyDownPhoneNo
                              : null
                        }
                        onChange={HandleOnchange}
                      />
                    ) : (field === 'Address' && (
                      <textarea
                        name="Address"
                        value={RegisterData[field]}
                      />
                    ))}
                  </div>
                ))}
            </div>

            <h3>Services</h3>

            <div className="new-patient-registration-form">
              <div className="RegisBillFormcon">
                <div className="Service_bill">
                  {/* Additional Fields */}
                  <div className="RegisBillForm_1">
                    <label htmlFor="Amount">
                      Advance Amount<span>:</span>
                    </label>
                    <input
                      type="number"
                      name="Amount"
                      value={AdvanceAmount.AdvanceAmount}
                      onChange={(e) => {
                        setAdvanceAmount((prev) => ({
                          ...prev,
                          AdvanceAmount: e.target.value,
                        }))
                      }}
                    />
                  </div>
                  <button
                    className="RegisterForm_1_btns added_RegisterForm_1_btns"
                    onClick={Uptateitem ? Updateitems : Additemstobillfun}
                  >
                    {Uptateitem ? "Update" : "Add"}
                  </button>
                </div>
              </div>
              {
                AdvanceAmountGet.length !== 0 && (
                  <ReactGrid columns={Advancecolumns} RowData={AdvanceAmountGet} />
                )
              }
            </div>

            <div className="new-patient-registration-form">
              <div className="Selected-table-container444 DEWSDXWED">
                <table className="selected-medicine-table222 EDWEDE">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Service Type</th>
                      <th>Service Name</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                      <th>Net Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SelectDatalist.map((row, index) => {
                      return (
                        <tr key={index}>
                          <td>{row.S_No}</td>
                          <td>{row.ServiceType}</td>
                          <td>{row.SelectItemName}</td>
                          <td>{row.Quantity || "-"}</td>
                          <td>{row.Amount || "-"}</td>
                          <td>{row.NetAmount || "-"}</td>
                          <td>
                            <button
                              className="delnamebtn"
                              onClick={() => {
                                deletebillingitem(row);
                              }}
                            >
                              <DeleteIcon />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="">
                <br />

                <div className="summary-container addded_sumry_contre">
                  <div
                    className="RegisFormcon"
                    style={{ justifyContent: "center" }}
                  >
                    <div className="RegisBillSearchForm_1">
                      <label htmlFor="">
                        Total Discount<span>:</span>
                      </label>
                      <select
                        name="CDMethod"
                        value={NetAmount_CDmethod.Method}
                        onChange={(e) => {
                          setNetAmount_CDmethod((prev) => ({
                            ...prev,
                            Method: e.target.value,
                            Amount: "",
                          }));
                          setBillAmount([]);
                          setFormAmount({
                            Billpay_method: "",
                            CardType: "",
                            ChequeNo: "",
                            BankName: "",
                            paidamount: "",
                            Additionalamount: "",
                            transactionFee: "",
                          });
                        }}
                        disabled={SelectDatalist.length === 0}
                      >
                        <option value="">Select</option>
                        <option value="Cash">Cash</option>
                        <option value="Percentage">Percentage</option>
                      </select>
                    </div>
                    <div className="cah-d-wth RegisBillSearchForm_1">
                      <label htmlFor="">
                        Discount Value<span>:</span>
                      </label>
                      <input
                        type="number"
                        onKeyDown={blockInvalidChar}
                        name="CashDiscount"
                        value={NetAmount_CDmethod.Amount}
                        onChange={(e) => {
                          if (NetAmount_CDmethod.Method !== "") {
                            setNetAmount_CDmethod((prev) => ({
                              ...prev,
                              Amount: e.target.value,
                            }));
                            setBillAmount([]);
                            setFormAmount({
                              Billpay_method: "",
                              CardType: "",
                              ChequeNo: "",
                              BankName: "",
                              paidamount: "",
                              Additionalamount: "",
                              transactionFee: "",
                            });
                          } else {
                            alert("Please Choose an Discount Method");
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="summary-container addded_sumry_contre">
                  <div className="WDWDWD_OO">
                    <div className="edcwjkediu87_mmmm">
                      <div>
                        <div
                          className="EWDWDWDWDCC_0"
                          style={{
                            justifyContent: "center",
                            marginTop: "5px",
                          }}
                        >
                          <div className="clm-itm-stl">
                            <label>
                              Payment Method <span>:</span>
                            </label>
                            <select
                              name="Billpay_method"
                              value={formAmount.Billpay_method}
                              onChange={handleChange}
                            >
                              <option value="">Select</option>
                              <option value="Cash">Cash</option>
                              <option value="Card">Card</option>
                              <option value="OnlinePayment">
                                Online Payment
                              </option>
                              <option value="Cheque">Cheque</option>
                            </select>
                          </div>
                          {formAmount.Billpay_method === "Card" && (
                            <>
                              <div className="clm-itm-stl">
                                <label>
                                  Card Type <span>:</span>
                                </label>
                                <select
                                  name="CardType"
                                  value={formAmount.CardType}
                                  onChange={handleChange}
                                >
                                  <option value="">Select</option>
                                  {["Debit", "Credit"].map((p, indx) => (
                                    <option key={indx} value={p}>
                                      {p}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </>
                          )}
                          {formAmount.Billpay_method === "Cheque" && (
                            <>
                              <div className="clm-itm-stl">
                                <label>
                                  Cheque No <span>:</span>
                                </label>
                                <input
                                  type="number"
                                  onKeyDown={blockInvalidChar}
                                  name="ChequeNo"
                                  value={formAmount.ChequeNo}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="clm-itm-stl">
                                <label>
                                  Bank Name <span>:</span>
                                </label>
                                <input
                                  type="text"
                                  name="BankName"
                                  value={formAmount.BankName}
                                  onChange={handleChange}
                                />
                              </div>
                            </>
                          )}
                          {formAmount.Billpay_method === "Card" && (
                            <>
                              <div className="clm-itm-stl">
                                <label>
                                  Transaction Fee <span>:</span>
                                </label>
                                <input
                                  type="number"
                                  name="transactionFee"
                                  value={formAmount.transactionFee || ""}
                                  onChange={handleChange}
                                  onKeyDown={blockInvalidChar}
                                />
                              </div>
                            </>
                          )}
                          {formAmount.Billpay_method === "OnlinePayment" && (
                            <></>
                          )}
                          <div className="clm-itm-stl">
                            <label>
                              Cash Amount <span>:</span>
                            </label>
                            <input
                              onKeyDown={blockInvalidChar}
                              type="number"
                              name="paidamount"
                              value={formAmount.paidamount}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="clm-itm-stl">
                            <label>
                              AdditionalAmount <span>:</span>
                            </label>
                            <input
                              onKeyDown={blockInvalidChar}
                              type="number"
                              name="Additionalamount"
                              value={formAmount.Additionalamount}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="Register_btn_con added_Register_btn_con">
                          <button
                            className="RegisterForm_1_btns added_RegisterForm_1_btns"
                            onClick={isEdit !== null ? handleUpdate : handleAdd}
                          >
                            {isEdit !== null ? "Update" : "Add"}
                          </button>
                        </div>

                        <div className="edwqw_c2">
                          <label>Amount in Words : </label>
                          <span
                            style={{
                              color: "#808080b5",
                              padding: "0px 0px 0px 5px",
                            }}
                          >
                            {NumberToWords(+initialState.totalNetAmount)}{" "}
                          </span>
                        </div>
                        <br />
                        {AppointmentRegisType === 'IP' && <div className="clm-itm-stl">
                          <label>
                            Remaining Credit <span>:</span>
                          </label>
                          <input
                            style={RemainingCredit < 50000 ? { backgroundColor: "Red" } : {}} value={RemainingCredit} readOnly
                          />
                        </div>}
                        <br />
                      </div>
                    </div>

                    <div className="EWDWDWDWDCC_0 wdwdxsxwsw3ed">
                      <div className="clm-itm-stl">
                        <label>Items:</label>
                        <input value={initialState.totalItems} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Unit:</label>
                        <input value={initialState.totalUnits} readOnly />
                      </div>

                      <div className="clm-itm-stl">
                        <label>Taxable Amount:</label>
                        <input value={initialState.totalTaxable} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>GST Amount :</label>
                        <input value={initialState.totalGstamount} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Cash Discount :</label>
                        <input value={initialState.totalDiscount} readOnly />
                      </div>

                      <div className="clm-itm-stl">
                        <label>Total Amount:</label>
                        <input value={initialState.totalAmount} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Item Amount :</label>
                        <input
                          style={{ backgroundColor: "yellow" }}
                          value={initialState.totalNetAmount}
                          readOnly
                        />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Round Off :</label>
                        <input value={initialState.Roundoff} readOnly />
                      </div>

                      <div className="clm-itm-stl">
                        <label>Paid Net Amount :</label>
                        <input
                          style={{ backgroundColor: "yellow" }}
                          value={initialState.totalAmountt}
                          readOnly
                        />
                      </div>
                      {Reimbursable && (
                        <div className="clm-itm-stl">
                          {console.log("innnnnnn", initialState)}
                          <label>Re-imbursable Amount :</label>
                          <input
                            style={{ backgroundColor: "yellow" }}
                            value={initialState.ReimbursableAmount}
                            readOnly
                          />
                        </div>
                      )}
                      <div className="clm-itm-stl">
                        <label>Paid Amount :</label>
                        <input value={initialState.PaidAmount} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Balance Amount :</label>
                        <input value={initialState.BalanceAmount} readOnly />
                      </div>
                    </div>
                  </div>

                  <br />
                  <div>
                    {billAmount.length !== 0 && (
                      <div className="Selected-table-container444 DEWSDXWED">
                        <table className="selected-medicine-table222 EDWEDE">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Payment Type</th>
                              <th>Card Type</th>

                              <th>Cheque No</th>
                              <th>Bank Name</th>

                              <th>Amount</th>
                              <th>Additional Amount</th>
                              <th>Transaction Fee</th>
                              <th>Action </th>
                            </tr>
                          </thead>
                          <tbody>
                            {billAmount.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.Billpay_method}</td>
                                <td>{row.CardType || "-"}</td>
                                <td>{row.ChequeNo || "-"}</td>
                                <td>{row.BankName || "-"}</td>
                                <td>{row.paidamount}</td>
                                <td>{row.Additionalamount}</td>
                                <td>{row.transactionFee}</td>
                                <td>
                                  <button onClick={() => handleEdit(index)}>
                                    <EditNoteIcon />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {isPrintButtonVisible && (
                  <div className="Register_btn_con added_Register_btn_con">
                    <select
                      className="print_option_bill"
                      name="printoption"
                      value={printoption}
                      onChange={(e) => setprintoption(e.target.value)} // Update state with selected value
                    >
                      {[
                        "PrintDetailed",
                      ].map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option> // Correctly return option elements
                      ))}
                    </select>
                    {printoption === "PrintDetailed" ? (
                      <button
                        className="RegisterForm_1_btns added_RegisterForm_1_btns"
                        onClick={() => handleSubmit()}
                      >
                        Print
                      </button>
                    ) : printoption === "PrintSummary" ? (
                      <button
                        className="RegisterForm_1_btns added_RegisterForm_1_btns"
                        onClick={() => handleSubmit(true)}
                      >
                        Print
                      </button>
                    ) : printoption === "PrintReimbuseable" ? (
                      <button
                        className="RegisterForm_1_btns added_RegisterForm_1_btns"
                        onClick={() => handleSubmit(false, true)} // Pass a second parameter for "PrintReimbuseable"
                      >
                        Print
                      </button>
                    ) : (
                      <button
                        className="RegisterForm_1_btns added_RegisterForm_1_btns"
                        onClick={() => handleSubmit(false, false, true)} // Pass a second parameter for "PrintReimbuseable"
                      >
                        Print
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <ToastAlert Message={toast.message} Type={toast.type} />
          </div>
        </>
      ) : (
        <ForPrintData />
      )}
    </>
  );
};

export default AdvanceCollection;
