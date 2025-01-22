import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const UserRegisterMaster = () => {
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const userRecord = useSelector(state => state.userRecord?.UserData);
  const toast = useSelector(state => state.userRecord?.toast);
  const UserListId = useSelector(state => state.userRecord?.UserListId);
  const Usercreatedocdata = useSelector(state => state.userRecord?.Usercreatedocdata);
  const UsercreateEmpdata = useSelector(state => state.userRecord?.UsercreateEmpdata);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log('UsercreateEmpdata---999', UsercreateEmpdata);


  const [UserRegister, setUserRegister] = useState({
    UserId: '',
    EmployeeType: '',
    DoctorId: '',
    EmployeeId: '',
    Title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    Email: '',
    PhoneNo: '',
    Gender: '',
    Qualification: '',
    UserName: '',
    Password: '',
    roleName: '',
  });

  const [UserRegistershow, setUserRegistershow] = useState([])
  const [RoleNameData, setRoleNameData] = useState([]);

  useEffect(() => {
    axios.get(`${UrlLink}Masters/UserControl_Role_link`)
      .then((res) => {
        const ress = res.data;
        setRoleNameData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserRegister((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };








  const [checkedItems, setCheckedItems] = useState([
    // {
    //   key: '1',
    //   value: 'A',
    //   label: 'ClinicMetrics',
    //   check: false,
    //   children: []
    // },
    {
      key: '1',
      value: 'A',
      label: 'FrontOffice',
      check: false,
      children: [
        { key: '1-1', value: 'A1-1', label: 'Dashboard', check: false },
        { key: '1-2', value: 'A1-2', label: 'AppoinmentRequestList', check: false },
        { key: '1-3', value: 'A1-3', label: 'Registration', check: false },
        { key: '1-4', value: 'A1-4', label: 'PatientRegisterList', check: false },
        { key: '1-5', value: 'A1-5', label: 'GeneralBilling', check: false },
        { key: '1-6', value: 'A1-6', label: 'OPDQueueList', check: false },
        { key: '1-7', value: 'A1-7', label: 'EmgRegisteration', check: false },
        { key: '1-7', value: 'A1-8', label: 'PatientManagement', check: false },
        { key: '1-7', value: 'A1-9', label: 'IPRequestList', check: false },
        { key: '1-7', value: 'A1-10', label: 'DoctorScheduleCalendar', check: false },
        { key: '1-7', value: 'A1-11', label: 'PatientRegistrationSummary', check: false },
        { key: '1-7', value: 'A1-12', label: 'ReferalDoctorReport', check: false },
        { key: '1-7', value: 'A1-13', label: 'RegistrationByReferralReport', check: false },
        { key: '1-7', value: 'A1-14', label: 'TotalPatientList', check: false },
        { key: '1-7', value: 'A1-15', label: 'NewBasicRegistation', check: false },
      ]
    },
    {
      key: '2',
      value: 'B',
      label: 'CRMdashboard',
      check: false,
      children: [
        // { key: '2-1', value: 'B1-1', label: 'Dashboard', check: false },

      ]
    },
    {
      key: '3',
      value: 'C',
      label: 'Doctor',
      check: false,
      children: [
        { key: '3-1', value: 'C3-1', label: 'Doctordashboard', check: false },
        { key: '3-2', value: 'C3-2', label: 'PatientQuelist', check: false },
        { key: '3-3', value: 'C3-3', label: 'SpecialityWiseDoctorPatientList', check: false },
        // { key: '3-2', value: 'C3-2', label: 'PatientQueueList', check: false }
      ]
    },
    {
      key: '4',
      value: 'D',
      label: 'OPDReception',
      check: false,
      children: [
        { key: '4-1', value: 'D4-1', label: 'OP_patients', check: false },
        // { key: '4-2', value: 'D4-2', label: 'BirthRegisterList', check: false },
        // { key: '4-3', value: 'D4-3', label: 'DeathRegisterList', check: false }
      ]
    },
    {
      key: '5',
      value: 'E',
      label: 'Nurse',
      check: false,
      children: [
        { key: '5-1', value: 'E5-1', label: 'PatientQuelist', check: false },
        { key: '5-2', value: 'E5-2', label: 'BirthRegisterList', check: false },
        { key: '5-3', value: 'E5-3', label: 'DeathRegisterList', check: false },
      ]
    },
    {
      key: '6',
      value: 'F',
      label: 'WardManagement',
      check: false,
      children: [
        { key: '6-1', value: 'F6-1', label: 'Warddashboard', check: false },
        { key: '6-2', value: 'F6-2', label: 'IPHandOverList', check: false },
        { key: '6-3', value: 'F6-3', label: 'RoomMangement', check: false },
        { key: '6-4', value: 'F6-4', label: 'IPQueList', check: false },
      ]
    },
    
    {
      key: '7',
      value: 'G',
      label: 'Pharmacy',
      check: false,
      children: [
        { key: '7-1', value: 'G7-1', label: 'OPPharmachyBillingList', check: false },
        { key: '7-2', value: 'G7-2', label: 'IPPharmacyBillingList', check: false },
        { key: '7-3', value: 'G7-3', label: 'PharmacyWalkinQue', check: false },
        
      ]
    },
    {
      key: '8',
      value: 'H',
      label: 'Cashier',
      check: false,
      children: [
        { key: '8-1', value: 'H8-1', label: 'CashierDashboard', check: false },
        { key: '8-2', value: 'H8-2', label: 'GeneralBillingList', check: false },
        { key: '8-3', value: 'H8-3', label: 'QuickBilling', check: false },
        { key: '8-4', value: 'H8-4', label: 'IPBilling', check: false },

      ]
    },
    // {
    //   key: '9',
    //   value: 'I',
    //   label: 'DischargeRequest',
    //   check: false,
    //   children: [
    //     { key: '9-1', value: 'I9-1', label: 'IP_LabDischargeQueslist', check: false },
    //     { key: '9-2', value: 'I9-2', label: 'IP_RadiologyDischargeQueslist', check: false },
    //     { key: '9-3', value: 'I9-3', label: 'IP_BillingDischargeQueslist', check: false },

    //   ]
    // },
    {
      key: '10',
      value: 'J',
      label: 'Masters',
      check: false,
      children: [
        { key: '10-1', value: 'J10-1', label: 'HospitalClinicMaster', check: false },
        { key: '10-2', value: 'J10-2', label: 'DutyRousterMaster', check: false },
        { key: '10-3', value: 'J10-3', label: 'ConsentFormsMaster', check: false },
        { key: '10-4', value: 'J10-4', label: 'RoomMaster', check: false },
        { key: '10-5', value: 'J10-5', label: 'Referal_Route', check: false },
        { key: '10-6', value: 'J10-6', label: 'DoctorList', check: false },
        { key: '10-7', value: 'J10-7', label: 'Basic_Master', check: false },
        { key: '10-8', value: 'J10-8', label: 'OtMaster', check: false },
        { key: '10-9', value: 'J10-9', label: 'AnaesthesiaMaster', check: false },
        { key: '10-10', value: 'J10-10', label: 'UserRegisterList', check: false },
        { key: '10-11', value: 'J10-11', label: 'InsClientDonationList', check: false },
        { key: '10-12', value: 'J10-12', label: 'ServiceProcedureMasterList', check: false },
        { key: '10-13', value: 'J10-13', label: 'Servicecategory', check: false },
        { key: '10-14', value: 'J10-14', label: 'ServiceSubCategory', check: false },
        { key: '10-15', value: 'J10-15', label: 'Radiology_Master', check: false },
        { key: '10-16', value: 'J10-16', label: 'Lab_Master', check: false },
        { key: '10-17', value: 'J10-17', label: 'Surgery_Master', check: false },
        { key: '10-18', value: 'J10-18', label: 'FrequencyMaster', check: false },
        { key: '10-19', value: 'J10-19', label: 'apprenewal', check: false },
        { key: '10-20', value: 'J10-20', label: 'LocationMaster', check: false },
        { key: '10-21', value: 'J10-21', label: 'TherapyMaster', check: false },
        { key: '10-22', value: 'J10-22', label: 'RatecardMaster', check: false },
        { key: '10-23', value: 'J10-23', label: 'ICDCodeMaster', check: false },
        { key: '10-24', value: 'J10-24', label: 'NurseStationMaser', check: false },

      ]
    },
    {
      key: '11',
      value: 'K',
      label: 'InventoryMasters',
      check: false,
      children: [
        { key: '11-1', value: 'K11-1', label: 'InventoryLocation', check: false },
        { key: '11-2', value: 'K11-2', label: 'Medicine_rack_Master', check: false },
        { key: '11-3', value: 'K11-3', label: 'Productcategory', check: false },
        { key: '11-4', value: 'K11-4', label: 'InventorySubMasters', check: false },
        { key: '11-5', value: 'K11-5', label: 'ProductMasterList', check: false },
        { key: '11-6', value: 'K11-6', label: 'MedicalStockInsertmaster', check: false },
        { key: '11-7', value: 'K11-7', label: 'TrayManagementList', check: false },
        { key: '11-8', value: 'K11-8', label: 'SupplierMasterList', check: false },
        { key: '11-9', value: 'K11-9', label: 'PurchaseOrderList', check: false },
        { key: '11-10', value: 'K11-10', label: 'ItemwisePurchaseOrder', check: false },
        { key: '11-11', value: 'K11-11', label: 'GoodsReceiptNoteList', check: false },
        { key: '11-12', value: 'K11-12', label: 'QuickGoodsRecieptNote', check: false },
        { key: '11-13', value: 'K11-13', label: 'SerialNoQuelist', check: false },
        { key: '11-14', value: 'K11-14', label: 'SerialNoReport', check: false },
        { key: '11-15', value: 'K11-15', label: 'ItemMinimumMaximum', check: false },
        { key: '11-16', value: 'K11-16', label: 'OldGrnQueList', check: false },
        { key: '11-17', value: 'K11-17', label: 'SupplierPayList', check: false },
        { key: '11-18', value: 'K11-18', label: 'SupplierPaidList', check: false },
        { key: '11-19', value: 'K11-19', label: 'IndentRaiseList', check: false },
        { key: '11-20', value: 'K11-20', label: 'IndentIssueList', check: false },
        { key: '11-21', value: 'K11-21', label: 'StockList', check: false },
        { key: '11-22', value: 'K11-22', label: 'PurchaseReturnList', check: false },
        { key: '11-23', value: 'K11-23', label: 'NurseStationStock', check: false }
 
      ]
    },
    {
      key: '12',
      value: 'L',
      label: 'AssetManagement',
      check: false,
      children: [
        // { key: '12-1', value: 'L12-1', label: 'Mis_Navigation', check: false }
      ]
    },
    {
      key: '13',
      value: 'M',
      label: 'Lenin',
      check: false,
      children: [
        { key: '13-1', value: 'M13-1', label: 'LeninMaster', check: false },
        { key: '13-2', value: 'M13-2', label: 'Lenin_DeptWise_MinMax', check: false },
        { key: '13-3', value: 'M13-3', label: 'Lenin_Stock', check: false }
      ]
    },
    {
      key: '14',
      value: 'N',
      label: 'OTManagement',
      check: false,
      children: [
        { key: '14-1', value: 'N14-1', label: 'NewOTBook', check: false },
        { key: '14-2', value: 'N14-2', label: 'SurgicalTeam', check: false },
        { key: '14-3', value: 'N14-3', label: 'OT_Queue_List', check: false },
        { key: '14-4', value: 'N14-4', label: 'Doctor_OueueList', check: false },
        { key: '14-5', value: 'N14-5', label: 'OT_Doctor', check: false },
        { key: '14-6', value: 'N14-6', label: 'OT_Anaesthesia', check: false },
        { key: '14-7', value: 'N14-7', label: 'OT_Nurse', check: false },
        // { key: '14-8', value: 'N14-8', label: 'OT_Nurse', check: false },
        // { key: '14-9', value: 'N14-9', label: 'OT_Biomedical', check: false }

      ]
    },
    {
      key: '15',
      value: 'O',
      label: 'Lab',
      check: false,
      children: [
        { key: '15-1', value: 'O15-1', label: 'NewMasterList', check: false },
        { key: '15-2', value: 'O15-2', label: 'TestMasterNavigation', check: false },
        { key: '15-3', value: 'O15-3', label: 'NewNavigationMasters', check: false },
        { key: '15-4', value: 'O15-4', label: 'ExternalLabMaster', check: false },
        { key: '15-5', value: 'O15-5', label: 'ReferDoctor', check: false },
        { key: '15-6', value: 'O15-6', label: 'RatecardLims', check: false },
        { key: '15-7', value: 'O15-7', label: 'GroupMaster', check: false },
        { key: '15-8', value: 'O15-8', label: 'IP_LabDischargeQueslist', check: false },
      ]
    },
    {
      key: '16',
      value: 'P',
      label: 'Radiology',
      check: false,
      children: [
        { key: '16-1', value: 'P16-1', label: 'RadiologyQuelist', check: false },
        { key: '16-2', value: 'P16-2', label: 'Mritechnician', check: false },
        { key: '16-3', value: 'P16-3', label: 'Cttechnician', check: false },
        { key: '16-4', value: 'P16-4', label: 'XRayTechnician', check: false },
        { key: '16-5', value: 'P16-5', label: 'IP_RadiologyDischargeQueslist', check: false },

      ]
    },
    {
      key: '17',
      value: 'Q',
      label: 'Insurance',
      check: false,
      children: [
        { key: '17-1', value: 'Q17-1', label: 'InsuranceDashboard', check: false },
        { key: '17-2', value: 'Q17-2', label: 'ClientDashboard', check: false },

      ]
    },
    {
      key: '18',
      value: 'R',
      label: 'Finance',
      check: false,
      children: [
        { key: '18-1', value: 'R18-1', label: 'FinanceMasterList', check: false },
        { key: '18-2', value: 'R18-2', label: 'VouchersList', check: false },

      ]
    },



    {
      key: '19',
      value: 'S',
      label: 'HR',
      check: false,
      children: [
        { key: '19-1', value: 'S19-1', label: 'EmployeeRegistrationList', check: false },
        { key: '19-2', value: 'S19-2', label: 'DutyRoster', check: false },
        { key: '19-3', value: 'S19-3', label: 'ShiftManagement', check: false },
        { key: '19-4', value: 'S19-4', label: 'LeaveMangement', check: false },
        { key: '19-5', value: 'S19-5', label: 'AdvanceManagementNavigation', check: false },
        { key: '19-6', value: 'S19-6', label: 'Attendance', check: false },
        { key: '19-7', value: 'S19-7', label: 'PayRoll', check: false },
        { key: '19-8', value: 'S19-8', label: 'EmployeeReport', check: false },
        { key: '19-9', value: 'S19-9', label: 'JobRequirements', check: false },
        { key: '19-10', value: 'S19-10', label: 'EmployeeSourceWiseList', check: false },
        { key: '19-11', value: 'S19-11', label: 'Performance', check: false },
        { key: '19-12', value: 'S19-12', label: 'ComplaintAction', check: false },
        { key: '19-13', value: 'S19-13', label: 'Circular', check: false },
        { key: '19-14', value: 'S19-14', label: 'HrDashboard', check: false },

      ]
    },


    {
      key: '20',
      value: 'T',
      label: 'AdminReport',
      check: false,
      children: [
        // { key: '20-1', value: 'T20-1', label: 'Leave Management', check: false },

      ]
    },
    {
      key: '21',
      value: 'U',
      label: 'EmployeeRequest',
      check: false,
      children: [
        { key: '21-1', value: 'U21-1', label: 'LeaveManagement', check: false },
        { key: '21-2', value: 'U21-2', label: 'AdvanceNavigation', check: false },
        { key: '21-3', value: 'U21-3', label: 'ShiftManagement', check: false },
        { key: '21-4', value: 'U21-4', label: 'PaySlip', check: false },
        { key: '21-5', value: 'U21-5', label: 'Complaint', check: false },


      ]
    },
  ]);
  const [Locations, setLocations] = useState([])
  const [LocationData, setLocationData] = useState([])
  const [ParentData, setParentData] = useState([])
  const [ChildData, setChildData] = useState([]);


  useEffect(() => {
    axios.get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => {
        const ress = res.data
        console.log(ress);
        setLocations(ress)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [UrlLink])


  useEffect(() => {
    if (UserListId && UserListId.UserId) {
      axios.get(`${UrlLink}Masters/Get_User_Detialsby_id?UserId=${UserListId.UserId}`)
        .then((res) => {
          const resss = res.data;
          console.log(resss, 'ressssssssssssssss');

          setUserRegister({
            UserId: resss?.id || '',
            EmployeeType: resss?.EmployeeType || '',
            DoctorId: resss?.DoctorId || '',
            EmployeeId: resss?.EmployeeId || '',
            Title: resss?.Title || '',
            firstName: resss?.firstName || '',
            middleName: resss?.middleName || '',
            lastName: resss?.lastName || '',
            Email: resss?.Email || '',
            PhoneNo: resss?.PhoneNo || '',
            Gender: resss?.Gender || '',
            Qualification: resss?.Qualification || '',
            UserName: resss.UserName || '',
            roleName: resss?.roleName || '',
          });
          const ParentData = resss?.Access?.split(',') || [];
          const ChildData = resss?.SubAccess?.split(',') || [];



          const locData = resss?.Locations || [];
          if (locData.length === 1 && locData[0].Location_Name === 'All') {
            setLocationData([...Locations])
          } else {
            const locationNames = locData.map(loc => loc.Location_Name);
            setLocationData([...locationNames]);
          }


          setCheckedItems((prev) => {
            return prev.map((item) => {
              if (item.children && item.children.length > 0) {
                const updatedChildren = item.children.map((child) => {
                  if (ChildData.includes(child.value)) {
                    return { ...child, check: true };
                  }
                  return child;
                });

                const someval = updatedChildren.some((child) => child.check) || ParentData.includes(item.value);
                console.log(item, '---', someval);
                return { ...item, check: someval, children: updatedChildren };
              } else {
                if (ParentData.includes(item.value)) {
                  return { ...item, check: true };
                }
              }
              return item;
            });
          });
          setChildData(ChildData);
          setParentData(ParentData);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (Usercreatedocdata && Usercreatedocdata?.DoctorId) {
      axios.get(`${UrlLink}Masters/get_User_Doctor_Detials?DoctorId=${Usercreatedocdata.DoctorId}`)
        .then(res => {
          const resData = res.data;
          console.log(resData, 'resDataDocccccccccc');
          console.log(Usercreatedocdata, 'Usercreatedocdata');

          setUserRegister((prev) => ({
            ...prev,
            DoctorId: resData?.id,
            EmployeeId: '',
            EmployeeType: Usercreatedocdata?.Type,
            Title: resData?.Title,
            firstName: resData?.firstName,
            middleName: resData?.middleName,
            lastName: resData?.lastName,
            Email: resData?.Email,
            PhoneNo: resData?.PhoneNo,
            Gender: resData?.Gender,
            Qualification: resData?.Qualification,

          }))
        })
        .catch(err => {
          console.log(err);
        })


    } else if (UsercreateEmpdata && UsercreateEmpdata?.EmployeeId) {
      axios.get(`${UrlLink}HR_Management/get_User_Employee_Details?EmployeeId=${UsercreateEmpdata.EmployeeId}`)
        .then(res => {
          const resData = res.data;
          console.log(resData, 'resData');
          console.log(UsercreateEmpdata, 'UsercreateEmpdata');

          setUserRegister((prev) => ({
            ...prev,
            EmployeeId: resData?.Employee_Id,
            DoctorId: '',
            EmployeeType: UsercreateEmpdata?.Type,
            Title: resData?.Title,
            firstName: resData?.FirstName,
            middleName: resData?.MiddleName,
            lastName: resData?.lastName,
            Email: resData?.Email,
            PhoneNo: resData?.Phone,
            Gender: resData?.Gender,
            Qualification: resData?.Qualification,

          }))
        })
        .catch(err => {
          console.log(err);
        })
    }
    else {
      navigate('/Home/UserRegisterList');
    }
  }, [UserListId, UrlLink, navigate, Locations, Usercreatedocdata, UsercreateEmpdata]);




  const handlelocationChange = (lname) => {

    setLocationData((prev) => {
      if (!prev.includes(lname)) {
        return [...prev, lname];
      } else {
        return [...prev.filter((value) => value !== lname)]
      }

    });

  }


  const handleParentChange = (index) => {
    setCheckedItems((prev) => {
      const updated = [...prev];
      updated[index].check = !updated[index].check;
      if (updated[index].children.length > 0) {
        updated[index].children.forEach((child) => {
          if (updated[index].check) {
            child.check = true;
            setChildData((prev) => [...prev, child.value]);
          } else {
            child.check = false;
            setChildData((prev) => prev.filter((value) => value !== child.value));
          }
        });
      }
      if (updated[index].check) {
        setParentData((prev) => [...prev, updated[index].value]);
      } else {
        setParentData((prev) => prev.filter((value) => value !== updated[index].value));
      }
      return updated;
    });
  };

  const handleChildChange = (parentIndex, childIndex) => {
    setCheckedItems((prev) => {
      const updated = [...prev];
      updated[parentIndex].children[childIndex].check = !updated[parentIndex].children[childIndex].check;
      if (updated[parentIndex].children[childIndex].check) {
        setChildData((prev) => [...prev, updated[parentIndex].children[childIndex].value]);
      } else {
        setChildData((prev) => prev.filter((value) => value !== updated[parentIndex].children[childIndex].value));
      }
      if (updated[parentIndex].children.some((child) => child.check)) {
        updated[parentIndex].check = true;
        setParentData((prev) => {
          if (!prev.includes(updated[parentIndex].value)) {
            return [...prev, updated[parentIndex].value];
          }
          return prev;
        });
      } else {
        updated[parentIndex].check = false;
        setParentData((prev) => prev.filter((value) => value !== updated[parentIndex].value));
      }
      return updated;
    });
  };


  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  const handleUserRegistersubmit = () => {

    if (Object.keys(UserRegister).filter(p => UserRegister.EmployeeType === 'DOCTOR' ? !['UserId', 'EmployeeId'].includes(p) : !['UserId', 'DoctorId'].includes(p)).filter(value => !UserRegister[value]).length !== 0 || (ChildData.length === 0 || ParentData.length === 0) || LocationData.length === 0) {
      dispatch({ type: 'toast', value: { message: 'Please provide all required fields.', type: 'warn' } });

      console.log('gggggg', Object.keys(UserRegister).filter(p => p !== 'UserId').filter(p => UserRegister.EmployeeType === 'DOCTOR' ? !['UserId', 'EmployeeId'].includes(p) : !['UserId', 'DoctorId'].includes(p)).filter(value => !UserRegister[value]));

    } else {
      let locadata = LocationData.join(',')

      const data = {
        ...UserRegister,
        created_by: userRecord?.username || '',
        ChildData: ChildData.join(','),
        ParentData: ParentData.join(','),
        Location: locadata,

      };
      axios.post(`${UrlLink}Masters/UserRegister_Detials_link`, data)
        .then((res) => {
          const resData = res.data;
          const mess = Object.values(resData)[0];
          const typp = Object.keys(resData)[0];
          const tdata = { message: mess, type: typp };
          dispatch({ type: 'toast', value: tdata });
          setUserRegister({
            UserId: '', EmployeeType: '', DoctorId: '',
            EmployeeId: '', UserName: '', firstName: '', middleName: '', lastName: '', Title: '', Email: '',
            Password: '', confirmPassword: '', roleName: '', PhoneNo: '', Gender: '',
            Qualification: ''
          });
          navigate('/Home/UserRegisterList')
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };



  useEffect(() => {
    let data = Object.keys(UserRegister).filter(p => !['UserId', 'DoctorId', 'EmployeeId'].includes(p))

    if (UserRegister.EmployeeType === 'DOCTOR') {
      const categoryIndex = data.indexOf('EmployeeType');
      data.splice(categoryIndex + 1, 0, 'DoctorId');
    }
    if (UserRegister.EmployeeType === 'EMPLOYEE') {
      const categoryIndex = data.indexOf('EmployeeType');
      data.splice(categoryIndex + 1, 0, 'EmployeeId');
    }
    setUserRegistershow(data)
  }, [UserRegister])



  return (
    <>
      <div className="Main_container_app">
        <h3>User Register</h3>
        <div className="common_center_tag">
          <span>User Register</span>
        </div>
        <div className="RegisFormcon_1">
          {UserRegistershow.map((field, index) => (
            <div className="RegisForm_1" key={index}>
              <label htmlFor={`${field}_${index}_${field}`}>
                {formatLabel(field)}
                <span>:</span>
              </label>
              {field === 'roleName' ? (
                <select
                  name={field}
                  id={`${field}_${index}_${field}`}
                  value={UserRegister[field] || ''}
                  onChange={handleInputChange}
                >
                  <option value="">select</option>
                  {RoleNameData.filter(p => p.Status === 'Active').map((p, indx) => (
                    <option value={p.Role} key={indx}>{p.Role}</option>
                  ))}
                </select>
              ) : (
                <input
                  // readOnly
                  id={`${field}_${index}_${field}`}
                  autoComplete='off'
                  readOnly={!['UserName', 'Password'].includes(field)}
                  pattern={
                    field === 'Email' ? "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" :
                      field === 'PhoneNo' ? "\\d{10}" :
                        field === 'Password' ? "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$" :
                          null
                  }
                  type={
                    field === 'Email' ? 'Email' :
                      field === 'PhoneNo' ? 'tel' :
                        // field === 'Password' ? 'password' :
                        'text'
                  }
                  title={
                    field === 'Email' ? "Format: example@example.com" :
                      field === 'PhoneNo' ? "Format: 10 digits only" :
                        field === 'Password' ? "Must contain 8 characters, one uppercase, one lowercase, one number and one special character" :
                          ''
                  }
                  name={field}
                  value={UserRegister[field] || ''}
                  onChange={handleInputChange}
                />
              )}
            </div>
          ))}
        </div>
        <div className="DivCenter_container">
          <h2>Location Access</h2>
        </div>
        <div className="displayuseraccess">
          {
            Locations.map((p, indx) => (
              <div className="displayuseraccess_child">
                <input
                  type="checkbox"
                  id={`${indx}_${p?.locationName}`}
                  checked={LocationData.includes(p?.locationName)}
                  onChange={() => handlelocationChange(p?.locationName)}
                />
                <label htmlFor={`${indx}_${p?.locationName}`} className='par_acc_lab'>{p?.locationName}</label>
              </div>
            ))
          }
        </div>
       
        <div>
          <h2 style={{ textAlign: "center", margin: "10px 0", color: "gray", 
            fontSize: "clamp(12px, 1.5vw, 24px)", }}>Access</h2>
          <div className="DivCenter_container">
            <div className="displayuseraccess">
              {checkedItems.map((item, indx) => (
                <div key={indx} className="displayuseraccess_child" style={{ marginBottom: "5px", }} >
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "5px", }} >
                    <input
                      type="checkbox"
                      id={item.key}
                      checked={item.check}
                      onChange={() => handleParentChange(indx)}
                    />
                    <label
                      htmlFor={item.key}
                      className="par_acc_lab"
                      style={{ marginLeft: "10px" }}
                    >
                      {item.label}
                    </label>
                  </div>

                  {item.check && (
                    <div style={{ display: "flex", flexWrap: "wrap", }} >
                      {item.children.map((child, ind1) => (
                        <div key={ind1} style={{ display: "flex", flex: "calc(33.33% - 25px)", }} >
                          <input
                            type="checkbox"
                            id={child.key}
                            checked={child.check}
                            onChange={() => handleChildChange(indx, ind1)}
                          />
                          <label
                            htmlFor={child.key}
                            className="chi_acc_lab"
                            style={{ marginLeft: "10px" }}
                          >
                            {child.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="Main_container_Btn">
          <button onClick={handleUserRegistersubmit}>{UserRegister?.UserId ? 'Update' : 'Submit'}</button>
        </div>
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default UserRegisterMaster;






















