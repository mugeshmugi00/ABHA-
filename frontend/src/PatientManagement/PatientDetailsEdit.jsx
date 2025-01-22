import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector ,useDispatch} from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { format } from 'date-fns';
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useNavigate } from 'react-router-dom';
import {differenceInYears,startOfYear,subYears,isBefore} from "date-fns";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert'





const PatientDetailsEdit = () => {
    
    const dispatchvalue = useDispatch();
    
    const PatientListId = useSelector((state) => state.Frontoffice?.PatientListId);
    const navigate = useNavigate();

    console.log(PatientListId,'111111111111');
    
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    console.log(userRecord,'userRecord');
    const [BloodGroupData, setBloodGroupData] = useState([]);
    const [ReligionData, setReligionData] = useState([]);
    const [errors, setErrors] = useState({});
    const [FlaggData, setFlaggData] = useState([]);
    const [InsuranceData, setInsuranceData] = useState([]);
    const [ClientData, setClientData] = useState([]);
    const [DonationData, setDonationData] = useState([]);
    const [EmployeeData, setEmployeeData] = useState([]);
    console.log(FlaggData,'FlaggDataaaaaaaaaaa');
    const [TitleNameData, setTitleNameData] = useState([]);

    const [DoctorIdData, setDoctorIdData] = useState([]);

    



    const [PatientEdit, setPatientEdit] = useState({
        PatientId: "",
        PhoneNo: "",
        Title: "",
        FirstName: "",
        MiddleName: "",
        SurName: "",
        Gender: "",
        MaritalStatus: "",
        SpouseName: "",
        FatherName: "",
        AliasName: "",
        DOB: "",
        Age: "",
        Email: "",
        BloodGroup: "",
        Occupation: "",
        Religion: "",
        Nationality: "",
        UniqueIdType: "",
        UniqueIdNo: "",
        
        PatientType: "",
        // PatientCategory: "",
        // InsuranceName: "",
        // InsuranceType: "",
        // ClientName: "",
        // ClientType: "Self",
        // ClientEmployeeId: "",
        // ClientEmployeeDesignation: "",
        // ClientEmployeeRelation: "",
        // EmployeeId: "",
        // EmployeeRelation: "",
        // DoctorId: "",
        // DoctorRelation: "",
        // DonationType: "",

        Flagging: "",
        
        DoorNo: "",
        Street: "",
        Area: "",
        City: "",
        District: "",
        State: "",
        Country: "",
        Pincode: "",
        ABHA: "",



        
    });

    const relationships = [
        "Spouse",
        "Father",
        "Mother",
        "Brother",
        "Sister",
        "Father-in-law",
        "Mother-in-law",
        "Grandfather",
        "Grandmother",
        "Son",
        "Daughter",
        "Grandson",
        "Granddaughter",
        "Son-in-law",
        "Daughter-in-law",
        "Uncle",
        "Aunt",
        "Nephew",
        "Niece",
        "Cousin",
        "Step-father",
        "Step-mother",
        "Step-son",
        "Step-daughter",
      ];


    useEffect(() => {
        console.log(PatientListId, 'PatientListId after navigation');
    }, [PatientListId]);
    

    useEffect(() => {
        const PatientId = PatientListId?.PatientId;
    
        if (PatientId) {
            axios.get(`${UrlLink}Frontoffice/Patient_Master_List`, {
                params: { PatientId }
            })
            .then((res) => {
                const data = res.data; // Assume the response data contains the patient details
                console.log(data, 'dataaaa');

                const OP =  data?.OP_details?.[0] ;
                console.log(OP,'aaaaaaaaaa');
                const IP =  data?.IP_details?.[0] ;
                console.log(IP,'bbbbbbbbb');
                const Casuality =  data?.Casuality_details?.[0] ;
                console.log(Casuality,'ccccccccc');
                const Diagnosis =  data?.Diagnosis_details?.[0] ;
                console.log(Diagnosis,'dddddddd');
                const Laboratory =  data?.Laboratory_details?.[0] ;
                console.log(Laboratory,'eeeeeeeee');

                
                if (data) {
                    
                   
                    
                    setPatientEdit((prev) => ({
                        ...prev, // Spread previous state
                       
                        PatientId: data.PatientId || '', // Update PatientId
                        PhoneNo: data.PhoneNo || '', // Update PhoneNo
                        Title: data.Title || '',
                        FirstName: data.FirstName || '',
                        MiddleName: data.MiddleName || '',
                        SurName: data.SurName || '',
                        Gender: data.Gender || '',
                        MaritalStatus: data.MaritalStatus || '',
                        SpouseName: data.SpouseName || '',
                        FatherName: data.FatherName || '',
                        AliasName: data.AliasName || '',
                        DOB: data.DOB || '',
                        Age: data.Age || '',
                        Email: data.Email || '',
                        BloodGroup: data.BloodGroup || '',
                        Occupation: data.Occupation || '',
                        Religion: data.Religion || '',
                        Nationality: data.Nationality || '',
                        UniqueIdType: data.UniqueIdType || '',
                        UniqueIdNo: data.UniqueIdNo || '',
                        DoorNo: data.DoorNo || '',
                        Street: data.Street || '',
                        Area: data.Area || '',
                        City: data.City || '',
                        District: data.District || '',
                        State: data.State || '',
                        Country: data.Country || '',
                        Pincode: data.Pincode || '',
                        PatientType: data.PatientType || '',
                        Flagging: data.Flagging || '',
                        ABHA: data.ABHA || '',

                       
                        
                        // PatientType: OP?.PatientType || IP?.PatientType || Casuality?.PatientType || Diagnosis?.PatientType || Laboratory?.PatientType|| "",
                        // PatientCategory: OP?.PatientCategory || IP?.PatientCategory || Casuality?.PatientCategory || Diagnosis?.PatientCategory || Laboratory?.PatientCategory ||  "",
                        // InsuranceName: OP?.InsuranceName || IP?.InsuranceName || Casuality?.InsuranceName || Diagnosis?.InsuranceName || Laboratory?.InsuranceName ||  "",
                        // InsuranceType: OP?.InsuranceType || IP?.InsuranceType || Casuality?.InsuranceType || Diagnosis?.InsuranceType || Laboratory?.InsuranceType ||  "",
                        // ClientName: OP?.ClientName || IP?.ClientName || Casuality?.ClientName || Diagnosis?.ClientName || Laboratory?.ClientName ||  "",
                        // ClientType: OP?.ClientType || IP?.ClientType || Casuality?.ClientType || Diagnosis?.ClientType || Laboratory?.ClientType ||  "",
                        // ClientEmployeeId: OP?.ClientEmployeeId || IP?.ClientEmployeeId || Casuality?.ClientEmployeeId || Diagnosis?.ClientEmployeeId || Laboratory?.ClientEmployeeId ||  "",
                        // ClientEmployeeDesignation: OP?.ClientEmployeeDesignation || IP?.ClientEmployeeDesignation || Casuality?.ClientEmployeeDesignation || Diagnosis?.ClientEmployeeDesignation || Laboratory?.ClientEmployeeDesignation ||  "",
                        // ClientEmployeeRelation: OP?.ClientEmployeeRelation || IP?.ClientEmployeeRelation || Casuality?.ClientEmployeeRelation || Diagnosis?.ClientEmployeeRelation || Laboratory?.ClientEmployeeRelation ||  "",
                        // EmployeeId: OP?.EmployeeId || IP?.EmployeeId || Casuality?.EmployeeId || Diagnosis?.EmployeeId || Laboratory?.EmployeeId ||  "",
                        // EmployeeRelation: OP?.EmployeeRelation || IP?.EmployeeRelation || Casuality?.EmployeeRelation || Diagnosis?.EmployeeRelation || Laboratory?.EmployeeRelation ||  "",
                        // DoctorId: OP?.DoctorId || IP?.DoctorId || Casuality?.DoctorId || Diagnosis?.DoctorId || Laboratory?.DoctorId ||  "",
                        // DoctorRelation: OP?.DoctorRelation || IP?.DoctorRelation || Casuality?.DoctorRelation || Diagnosis?.DoctorRelation || Laboratory?.DoctorRelation ||  "",
                        // DonationType: OP?.DonationType || IP?.DonationType || Casuality?.DonationType || Diagnosis?.DonationType || Laboratory?.DonationType ||  "",
                        // Flagging:OP?.Flagging || IP?.Flagging || Casuality?.Flagging || Diagnosis?.Flagging || Laboratory?.Flagging || "",
               
                        
                    }));
                }
            })
            .catch((err) => {
                console.error('Error fetching patient data:', err);
            });
        }
    }, [PatientListId, UrlLink]);
    
    

    // useEffect(() => {
    //     const PatientId = PatientListId?.PatientId;

    //     if (PatientId) {
    //         axios.get(`${UrlLink}/Frontoffice/Patient_Master_List`, {
    //             params: { PatientId }
    //         })
    //         .then((res) => {
    //             const data = res.data;
    //             if (data) {
    //                 setPatientEdit(prev => ({
    //                     ...prev,
    //                     ...data // Directly spread the data object to set the state
    //                 }));
    //             }
    //         })
    //         .catch((err) => {
    //             console.error('Error fetching patient data:', err);
    //         });
    //     }
    // }, [PatientListId, UrlLink]);



    useEffect(() => {
        axios.get(`${UrlLink}Frontoffice/get_DoctorId_by_PatientCategory`)
        .then((res) => {
            const data = res.data;
            if (Array.isArray(data)) {
                setDoctorIdData(data);
            } else {
                setDoctorIdData([]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, [UrlLink]);
    

    useEffect(() => {
        axios.get(`${UrlLink}Frontoffice/get_Employee_by_PatientCategory`)
        .then((res) => {
            const data = res.data;
            if (Array.isArray(data)) {
                setEmployeeData(data);
            } else {
                setEmployeeData([]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, [UrlLink]);
    
    useEffect(() => {
        axios.get(`${UrlLink}Masters/get_client_data_registration`)
        .then((res) => {
            const data = res.data;
            if (Array.isArray(data)) {
                setClientData(data);
            } else {
                setClientData([]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, [UrlLink]);
   
    useEffect(() => {
        axios.get(`${UrlLink}Masters/get_donation_data_registration`)
        .then((res) => {
            const data = res.data;
            if (Array.isArray(data)) {
                setDonationData(data);
            } else {
                setDonationData([]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, [UrlLink]);


    useEffect(() => {
        axios.get(`${UrlLink}Masters/get_insurance_data_registration`)
        .then((res) => {
            const data = res.data;
            if (Array.isArray(data)) {
                setInsuranceData(data);
            } else {
                setInsuranceData([]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, [UrlLink]);


    useEffect(() => {
        axios.get(`${UrlLink}Masters/BloodGroup_Master_link`)
        .then((res) => {
            const data = res.data;
            if (Array.isArray(data)) {
                setBloodGroupData(data);
            } else {
                setBloodGroupData([]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, [UrlLink]);
    
    useEffect(() => {
        axios.get(`${UrlLink}Masters/Flagg_color_Detials_by_specialtype`)
        .then((res) => {
            const data = res.data;
            if (Array.isArray(data)) {
                setFlaggData(data);
            } else {
                setFlaggData([]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, [UrlLink]);

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Relegion_Master_link`)
        .then((res) => {
            const data = res.data;
            if (Array.isArray(data)) {
                setReligionData(data);
            } else {
                setReligionData([]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, [UrlLink]);

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Title_Master_link`)
        .then((res) => {
            const data = res.data;
            if (Array.isArray(data)) {
                setTitleNameData(data);
            } else {
                setTitleNameData([]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, [UrlLink]);

    const handleInputChange = (e) => {
        const { name, value, pattern } = e.target;
        let formattedValue = value;
    
        // Capitalize first letter for specific fields
        if ([
            "FirstName", "MiddleName", "SurName", "AliasName", 
            "Occupation", "Street", "Area", "City", "District", 
            "State", "Country"
        ].includes(name)) {
            formattedValue = `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
        }
    
        // Check character length for certain fields
        if (["FirstName", "MiddleName", "AliasName", "SurName", 
             "Occupation", "Street", "Area", "City", "District", 
             "State", "Country", "UniqueIdNo"].includes(name) && value.length > 30) {
            dispatchvalue({ type: "toast", value: { message: `${name} should not exceed 30 characters.`, type: "warn" } });
            return; // Exit early
        }
    
        // Handle PhoneNo
        if (name === "PhoneNo") {
            if (formattedValue.includes("|")) {
                const [patientId, firstName, phoneNo] = formattedValue.split(" | ");
                if (phoneNo?.trim().length <= 10) {
                    setPatientEdit((prev) => ({
                        ...prev,
                        [name]: phoneNo.trim(),
                        PatientId: patientId.trim(),
                        FirstName: firstName.trim(),
                    }));
                }
            } else if (formattedValue.length <= 10) {
                setPatientEdit((prev) => ({
                    ...prev,
                    [name]: formattedValue,
                }));
            }
        }
    
        // Handle FirstName with pipe logic
        else if (name === "FirstName") {
            if (formattedValue.includes("|")) {
                const [patientId, firstName, phoneNo] = formattedValue.split(" | ");
                setPatientEdit((prev) => ({
                    ...prev,
                    [name]: firstName.trim(),
                    PatientId: patientId.trim(),
                    PhoneNo: phoneNo.trim(),
                }));
            } else {
                setPatientEdit((prev) => ({
                    ...prev,
                    [name]: formattedValue,
                }));
            }
        }
    
        // Handle Title changes for gender
        else if (name === "Title") {
            setPatientEdit((prev) => ({
                ...prev,
                [name]: formattedValue,
                Gender: ["Miss", "Ms", "Mrs"].includes(value) ? "Female"
                       : ["Mr", "Master"].includes(value) ? "Male"
                       : ["TransGender", "Baby", "Dr"].includes(value) ? "Transgender"
                       : prev.Gender, // fallback to existing value
            }));
        }
    
        // Handle DOB validation and Age calculation
        else if (name === "DOB") {
            const currentDate = new Date();
            const minAllowedDate = subYears(currentDate, 100);
            const selectedDate = new Date(value);
    
            if (isBefore(minAllowedDate, selectedDate) && isBefore(selectedDate, currentDate)) {
                const age = differenceInYears(currentDate, selectedDate);
                setPatientEdit((prev) => ({
                    ...prev,
                    [name]: formattedValue,
                    Age: age,
                }));
            } else {
                setPatientEdit((prev) => ({
                    ...prev,
                    [name]: formattedValue,
                    Age: "",
                }));
            }
        }
    
        // Handle Age change and calculate DOB
        else if (name === "Age") {
            if (formattedValue && !isNaN(formattedValue) && formattedValue.length <= 3) {
                const currentDate = new Date();
                const targetYear = subYears(currentDate, formattedValue);
                const dob = startOfYear(targetYear);
                const formattedDOB = format(dob, "yyyy-MM-dd");
    
                setPatientEdit((prev) => ({
                    ...prev,
                    [name]: formattedValue,
                    DOB: formattedDOB,
                }));
            } else {
                setPatientEdit((prev) => ({
                    ...prev,
                    [name]: formattedValue,
                    DOB: "",
                }));
            }
        }
    
        // Handle Unique ID validation
        else if (name === "UniqueIdNo") {
            setPatientEdit((prev) => ({
                ...prev,
                [name]: formattedValue,
            }));
    
            axios.get(`${UrlLink}Frontoffice/get_unique_id_no_validation?UniqueIdNo=${formattedValue}`)
                .then((response) => {
                    if (response.data?.error) {
                        dispatchvalue({ type: 'toast', value: { message: response.data.error, type: 'warn' } });
                    }
                })
                .catch((err) => console.error(err));
        }
    
        // Default update for other fields
        else {
            setPatientEdit((prev) => ({
                ...prev,
                [name]: formattedValue,
            }));
        }

        if (name === "MaritalStatus") {
            setPatientEdit((prev) => ({
                ...prev,
                [name]: formattedValue,
                SpouseName: formattedValue === "Married" ? prev.SpouseName : "",
                FatherName: formattedValue === "Single" ? prev.FatherName : "",
            }));
            return; // Exit early to avoid the default set
        }

        // if (name === "PatientCategory") {
        //     setPatientEdit((prev) => ({
        //         ...prev,
        //         [name]:formattedValue,
        //         InsuranceName: formattedValue === "Insurance" ? prev.InsuranceName : "",

        //     }))
        // }

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

    
        // Field validation
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };
    
    const formatLabel = (label) => {
        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (str) => str.toUpperCase());
        }
        return label;
    };


    // useEffect(() => {
    //     let fdata = Object.keys(PatientEdit).filter(
    //         (p) => !["AliasName","SpouseName","FatherName"].includes(p)
    //     );

    //     if (PatientEdit.Title === "Mrs" && PatientEdit.Gender === "Female") {
    //         const categoryIndex = fdata.indexOf("Gender");
    //         fdata.splice(categoryIndex + 1, 0, "AliasName");
    //     }

    //     if (PatientEdit.MaritalStatus === "Married" || PatientEdit.MaritalStatus === "Widowed") {
    //         const categoryIndex = fdata.indexOf("MaritalStatus");
    //         fdata.splice(categoryIndex + 1, 0, "SpouseName");
    //       }
      
    //     if (PatientEdit.MaritalStatus === "Single" || PatientEdit.MaritalStatus === "Divorced") {
    //     const categoryIndex = fdata.indexOf("MaritalStatus");
    //     fdata.splice(categoryIndex + 1, 0, "FatherName");
    //     }

    //     if (PatientEdit.PatientCategory === "Insurance") {
    //         const categoryIndex = fdata.indexOf("PatientCategory");
    //         fdata.splice(categoryIndex + 1, 0, "InsuranceName", "InsuranceType");
    //       }

    // }, [PatientEdit] )




    const handleClear = () => {
        setPatientEdit({
            PatientId: "",
            PhoneNo: "",
            Title: "",
            FirstName: "",
            MiddleName: "",
            SurName: "",
            Gender: "",
            MaritalStatus: "",
            SpouseName: "",
            FatherName: "",
            AliasName: "",
            DOB: "",
            Age: "",
            Email: "",
            BloodGroup: "",
            Occupation: "",
            Religion: "",
            Nationality: "",
            UniqueIdType: "",
            UniqueIdNo: "",
            
            PatientType: "",
            PatientCategory: "",
            InsuranceName: "",
            InsuranceType: "",
            ClientName: "",
            ClientType: "Self",
            ClientEmployeeId: "",
            ClientEmployeeDesignation: "",
            ClientEmployeeRelation: "",
            EmployeeId: "",
            EmployeeRelation: "",
            DoctorId: "",
            DoctorRelation: "",
            DonationType: "",
            
            DoorNo: "",
            Street: "",
            Area: "",
            City: "",
            District: "",
            State: "",
            Country: "",
            Pincode: "",
            ABHA: "",
        });
    };
    

    const handleSubmit = () => {
        const data = {
            ...PatientEdit,
            created_by: userRecord?.username || ''
        };

        console.log(data,'data');
        

        axios.post(`${UrlLink}Frontoffice/Patient_BasicDetails_Update`, data)
            .then(res => {
                const resData = res.data;
                console.log(resData,'resData');
                
                const message = Object.values(resData)[0];
                const type = Object.keys(resData)[0];
                const tdata = {
                    message: message,
                    type: type,
                };
                console.log(tdata,'tdata');
                

                handleClear();
                navigate('/Home/PatientList');
                dispatchvalue({ type: 'toast', value: tdata });


            })
            .catch(err => console.log(err));
    };

    const handleClose = () => {
        navigate('/Home/PatientList');
    }
    
    return (
        <>
          
          <div className="RegisFormcon_1">
            <div className="common_center_tag">
                <span>Patient Details Update</span>
            </div>


            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="RegisFormcon">
                    {Object.keys(PatientEdit).filter((p) => !['CreatedBy', 'Location'].includes(p)).map((field, indx) => (
                        (field !== 'SpouseName' || ["Married", "Widowed"].includes(PatientEdit.MaritalStatus)) &&
                        (field !== 'FatherName' || ["Single", "Divorced"].includes(PatientEdit.MaritalStatus)) &&
                        (field !== 'AliasName' || ["Mrs"].includes(PatientEdit.Title)) &&
                        (field !== 'InsuranceName' && field !== 'InsuranceType'  || ["Insurance"].includes(PatientEdit.PatientCategory)) &&
                        (field !== 'ClientName' && field !== 'ClientType' && field !== 'ClientEmployeeId' && field !== 'ClientEmployeeDesignation' || ["Client"].includes(PatientEdit.PatientCategory)) &&
                        (field !== 'ClientEmployeeRelation' || ["Relative"].includes(PatientEdit.ClientType)) &&
                        (field !== 'DonationType' || ["Donation"].includes(PatientEdit.PatientCategory)) &&
                        
                        ((field === 'EmployeeId' && ["Employee", "EmployeeRelation"].includes(PatientEdit.PatientCategory)) || 
                        (field === 'EmployeeRelation' && ["EmployeeRelation"].includes(PatientEdit.PatientCategory)) || 
                        (field !== 'EmployeeId' && field !== 'EmployeeRelation'))&&
                        
                        ((field === 'DoctorId' && ["Doctor", "DoctorRelation"].includes(PatientEdit.PatientCategory)) || 
                        (field === 'DoctorRelation' && ["DoctorRelation"].includes(PatientEdit.PatientCategory)) || 
                        (field !== 'DoctorId' && field !== 'DoctorRelation'))&&
                                            
                        <div className="RegisForm_1" key={indx}>
                            <label>{formatLabel(field)}<span>:</span> </label>
                            {field === 'DoctorRelation' || field === 'EmployeeRelation' || field === 'ClientEmployeeRelation' || field === 'DoctorId' || field === 'DoctorRelation' || field === 'EmployeeRelation' || field === 'EmployeeId' || field === 'DonationType' || field ==='ClientName' || field ==='InsuranceType' || field === 'InsuranceName' || field === 'Flagging' ||field === 'PatientCategory' || field === 'PatientType' || field === 'Gender' || field === 'UniqueIdType' || field === 'Nationality' || field === 'MaritalStatus' || field === 'GenderOfFetus' || field === 'BloodGroup' || field === 'Religion' || field === 'Title' || field === 'Cast' ? (
                                <select
                                    name={field}
                                    value={PatientEdit[field]}
                                    onChange={handleInputChange}
                                >
                                    <option value=''>Select</option>
                                    {field === 'Gender' && ["Male", "Female", "TransGender"].map((option, indx) => (
                                        <option value={option} key={indx}>{option}</option>
                                    ))}
                                    {field === 'MaritalStatus' && ["Single","Married", "Divorced","Widowed"].map((option, indx) => (
                                        <option value={option} key={indx}>{option}</option>
                                    ))}
                                    {field === 'Nationality' && ["Indian", "International"].map((option, indx) => (
                                        <option value={option} key={indx}>{option}</option>
                                    ))}
                                    {field === 'PatientType' && ["General", "VIP", "Govt"].map((option, indx) => (
                                        <option value={option} key={indx}>{option}</option>
                                    ))}

                                    {[
                                    "ClientEmployeeRelation",
                                    "EmployeeRelation",
                                    "DoctorRelation",
                                    ].includes(field) &&
                                    relationships?.map((row, indx) => (
                                        <option key={indx} value={row}>
                                        {row}
                                        </option>
                                    ))}

                                    {["DoctorId"].includes(field) &&
                                    DoctorIdData?.filter(
                                        (p) => p.id !== PatientEdit.DoctorName
                                    ).map((row, indx) => (
                                        <option key={indx} value={row.id}>
                                        {row.ShortName}
                                        </option>
                                    ))}

                                    {["EmployeeId"].includes(field) &&
                                    EmployeeData?.map((row, indx) => (
                                        <option key={indx} value={row.id}>
                                        {row.Name}
                                        </option>
                                    ))}

                                    {field === "DonationType" &&
                                    DonationData?.map((row, indx) => (
                                        <option
                                        key={indx}
                                        value={row.id}
                                        >{`${row?.Type} - ${row?.Name}`}</option>
                                    ))}
                                    {field === "ClientName" &&
                                    ClientData?.map((row, indx) => (
                                        <option key={indx} value={row.id}>
                                        {row.Name}
                                        </option>
                                    ))}
                                    {field === "InsuranceName" &&
                                    InsuranceData?.map((row, indx) => (
                                        <option key={indx} value={row.id}>
                                        {row?.Type === "MAIN"
                                            ? `${row?.Name} - ${row?.Type}`
                                            : `${row?.Name} - ${row?.Type} - ${row?.TPA_Name}`}
                                        </option>
                                    ))}
                                    {field === "InsuranceType" &&
                                    ["Cashless", "Reimbursable"].map((row, indx) => (
                                        <option key={indx} value={row}>
                                        {row}
                                        </option>
                                    ))}
                                    {field === "PatientCategory" &&
                                        [
                                            "General",
                                            "Insurance",
                                            "Client",
                                            "Donation",
                                            "Employee",
                                            "EmployeeRelation",
                                            "Doctor",
                                            "DoctorRelation",
                                        ].map((row, indx) => (
                                            <option key={indx} value={row}>
                                            {row}
                                            </option>
                                        ))
                                    }

                                    {field === "Flagging" &&
                                    FlaggData?.filter((p) => p.Status === "Active").map(
                                        (row, indx) => (
                                        <option
                                            key={indx}
                                            value={row.id}
                                            style={{ backgroundColor: row.FlaggColor }}
                                        >
                                            {" "}
                                            {row.FlaggName}
                                        </option>
                                        )
                                    )}
                                    
                                    {field === "UniqueIdType" && (
                                        <>
                                            {PatientEdit.Nationality === "Indian" &&
                                            ["Aadhar", "VoterId", "SmartCard"].map(
                                                (row, indx) => (
                                                <option key={indx} value={row}>
                                                    {row}
                                                </option>
                                                )
                                            )}
                                            {PatientEdit.Nationality === "International" &&
                                            ["DrivingLicence", "Passport"].map((row, indx) => (
                                                <option key={indx} value={row}>
                                                {row}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                    {field === 'Title' &&
                                        TitleNameData?.map((row, indx) => (
                                            <option key={indx} value={row.id}>
                                            {row.Title}
                                            </option>
                                    ))}
                                    {field === 'BloodGroup' && BloodGroupData?.map((option, indx) => (
                                        <option value={option.id} key={indx}>{option.BloodGroup}</option>
                                    ))}
                                    {field === "Religion" &&
                                    ReligionData?.map((option, indx) => (
                                        <option key={indx} value={option.id}>
                                        {option.religion}
                                        </option>
                                    ))}
                                    
                                </select>
                            ) : field === 'ClientType' ? (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        width: "150px",
                                    }}
                                >
                                    <label style={{ width: "auto" }} htmlFor={`${field}_self`}>
                                        <input
                                            required
                                            id={`${field}_self`}
                                            type="radio"
                                            name={field}
                                            value="Self"
                                            style={{ width: "15px" }}
                                            checked={PatientEdit[field] === "Self" || PatientEdit[field] === undefined}
                                            onChange={(e) =>
                                                handleInputChange({ target: { name: field, value: "Self" } })
                                            }
                                        />
                                        Self
                                    </label>
                                    <label style={{ width: "auto" }} htmlFor={`${field}_relative`}>
                                        <input
                                            required
                                            id={`${field}_relative`}
                                            type="radio"
                                            name={field}
                                            value="Relative"
                                            style={{ width: "15px" }}
                                            checked={PatientEdit[field] === "Relative"}
                                            onChange={(e) =>
                                                handleInputChange({ target: { name: field, value: "Relative" } })
                                            }
                                        />
                                        Relative
                                    </label>
                                </div>
                            ) : ['AddressOfMotherAtTimeOfDelivery', 'PermanentAddress'].includes(field) ? (
                                <textarea
                                    name={field}
                                    value={PatientEdit[field]}
                                    onChange={handleInputChange}
                                    style={{ width: '300px'}}
                                    className='edjuwydrt56w ee33223'
                                />
                            ) : ['AgeAtTimeOfDelivery','AgeAtTimeOfMarriage', 'WeightOfFetus'].includes(field) ? (
                                <input
                                    type="number"
                                    name={field}
                                    value={PatientEdit[field]}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <input
                                    type={field === 'DOB' ? "date" : field === 'DeliveryTime' ? 'time' : 'text'}
                                    name={field}
                                    autoComplete="off"
                                    value={PatientEdit[field]}
                                    onChange={handleInputChange}
                                    readOnly={field === 'PatientId'}
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
                                          : "[A-Za-z]+"
                                      }
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="Main_container_Btn">
                <button onClick={handleSubmit}>
                    Update
                    
                </button>
                <button onClick={handleClose}>
                    Close
                    
                </button>
            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />


            

            {/* <ToastContainer /> */}
        </div>

        
        </>
    )
}

export default PatientDetailsEdit;