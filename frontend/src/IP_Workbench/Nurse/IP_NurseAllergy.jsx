import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
// import { format } from "date-fns";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import axios from 'axios';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';


const IP_NurseAllergy = () => {
    const dispatch = useDispatch();
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
    console.log(IP_DoctorWorkbenchNavigation,'IP_DoctorWorkbenchNavigation');

    const userRecord = useSelector((state) => state.userRecord?.UserData);

    
    const formatLabel = (label) => {

        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (str) => str.toUpperCase());
        } else {
            return label;
        }
    };
     const [Allergy, setAllergy] = useState({
        AllergyType: "",
        Allergent: "",
        Reaction: "",
        Remarks: "",
    })

    const [gridData, setGridData] = useState([])
    const [IsViewMode, setIsViewMode] = useState(false)
    const [IsGetData, setIsGetData] = useState(false)


    const AllergyColumns = [
        { key: 'id',name: 'S.No',frozen: true},
        // { key: 'VisitId', name: 'VisitId',frozen: true },
        // { key: 'PrimaryDoctorId', name: 'Doctor Id',frozen: true },
        { key: 'PrimaryDoctorName', name: 'Doctor Name',frozen: true },
        {key: 'Date',name: 'Date',frozen: true},
        {key: 'Time',name: 'Time',frozen: true},
        {key: 'AllergyType',name: 'AllergyType'},
        {key: 'Allergent',name: 'Allergent'},
        {key: 'Reaction',name: 'Reaction'},
        {key: 'Remarks',name: 'Remarks'},
       
        {
            key: 'view',
            frozen: true,
            name: 'View',
            renderCell: (params) => (
              <IconButton onClick={() => handleView(params.row)}>
                <VisibilityIcon />
              </IconButton>
            ),
          },
        
    ]

    const handleView = (data) => {
        setAllergy({
            AllergyType: data.AllergyType || '',
            Allergent: data.Allergent || '',
            Reaction: data.Reaction || '',
            Remarks: data.Remarks || '',
        });
        setIsViewMode(true);
    };


    const handleClear = () => {
        setAllergy({
            AllergyType: '',
            Allergent: '',
            Reaction: '',
            Remarks: '',
            
        });
        setIsViewMode(false);
    };


    useEffect(() => {

        const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
        const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;
    
        if (RegistrationId) {
            axios.get(`${UrlLink}Ip_Workbench/IP_Allergy_Details_Link`, {
                params: {
                    RegistrationId: RegistrationId,
                    DepartmentType: departmentType
                }
            })
            .then((res) => {
                setGridData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }, [UrlLink, IP_DoctorWorkbenchNavigation,IsGetData]);
    
       
    const HandleOnChange = (e) => {
        const { name, value } = e.target;
        
        setAllergy((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };


    const handleAllergySubmit = () => {

        const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
        const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;

        if (!RegistrationId) {
          dispatch({ type: 'toast', value: { message: 'Registration ID is missing', type: 'error' } });
          return;
      }
        console.log(IP_DoctorWorkbenchNavigation?.RegistrationId);
        
        const senddata={
            ...Allergy,
            RegistrationId,
            DepartmentType,
            Createdby:userRecord?.username,
            
            
        }

        console.log(senddata,'senddata');
        
        axios.post(`${UrlLink}Ip_Workbench/IP_Allergy_Details_Link`, senddata)
        .then((res) => {
            const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
            dispatch({ type: 'toast', value: { message, type } });
            setIsGetData(prev => !prev);
            handleClear();
            })
        .catch((err) => console.log(err));
        
    }
    






  return (
    <>
        <div className="RegisFormcon_1" >

            
        {
            Object.keys(Allergy).map((p, index) =>
            (
                <div className='RegisForm_1' key={p}>
                <label htmlFor={`${p}_${index}`}>
                    {formatLabel(p)} <span>:</span>
                </label>
                {p === 'AllergyType' ? (
                    <select
                        id={`${p}_${index}`}
                        name={p}
                        value={Allergy[p]}
                        onChange={HandleOnChange}
                        readOnly={IsViewMode}
                        disabled = {IsViewMode}

                    >
                        <option value=''>Select</option>
                        <option value='Food'>Food</option>
                        <option value='Medition'>Medition</option>
                        <option value='Others'>Others</option>
                        
                    </select>
                ) : p === 'Remarks' ? (
                    <textarea
                        id={`${p}_${index}`}
                        name={p}
                        value={Allergy[p]}
                        onChange={HandleOnChange}
                        readOnly={IsViewMode}

                    />
                ) : (
                    <input
                        id={`${p}_${index}`}
                        autoComplete='off'
                        type='text'
                        name={p}
                        value={Allergy[p]}
                        onChange={HandleOnChange}
                        readOnly={IsViewMode}

                    />
                )}
                </div>
            
            ))
        }
        </div>
        
        <div className="Main_container_Btn">

            {IsViewMode && (
                <button onClick={handleClear}>Clear</button>
            )}
            {!IsViewMode && (
                <button onClick={handleAllergySubmit}>Submit</button>
            )}
        </div>

        {gridData.length >= 0 &&
            <ReactGrid columns={AllergyColumns} RowData={gridData} />
        }

        <ToastAlert Message={toast.message} Type={toast.type} />

    </>
  )
}

export default IP_NurseAllergy;