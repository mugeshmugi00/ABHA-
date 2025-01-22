import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from 'react-router-dom';
import Diversity1Icon from "@mui/icons-material/Diversity1";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
// import './Patient.css';
// import '../PatientManagement/Patient.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import LoupeIcon from "@mui/icons-material/Loupe";


const IP_Patient_Quelist = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const UserData = useSelector(state => state.userRecord?.UserData)
    const pagewidth = useSelector(state => state.userRecord?.pagewidth);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate();




    const [searchIPParams, setsearchIPParams] = useState({
        query: '',
        status: 'Admitted',
        type: 'IP',
        DoctorId: UserData?.Doctor,
        // SelectedWard : SelectedWard
    });

    const [IpPatientRegisterData, setIpPatientRegisterData] = useState([])
    console.log(IpPatientRegisterData,'IpPatientRegisterData');
        


    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                console.log(searchIPParams,'searchIPParams');
                

                // Fetch IP data or Casuality data based on the 'type' in searchIPParams
                if (searchIPParams.type === 'IP') {
                    response = await axios.get(`${UrlLink}Frontoffice/get_ip_Patient_registration_details_for_workbench`, { params: searchIPParams });
                } 
                // else if (searchIPParams.type === 'Casuality') {
                //     response = await axios.get(`${UrlLink}Frontoffice/get_patient_casuality_details`, { params: searchIPParams });
                // }

                const data = response.data;
                console.log(data,'dataaaaaaaaaaaa');
                

                // Check if the response is an array
                if (Array.isArray(data)) {
                    setIpPatientRegisterData(data);
                } else {
                    setIpPatientRegisterData([]);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [UrlLink, searchIPParams]); 


    const handleNavigateIpAdvanceCollection = () => {
        dispatchvalue({ type: "HrFolder", value: "AdvanceCollectionList" });
        dispatchvalue({ type: "PatientDetails", value: IpPatientRegisterData });
        navigate("/FrontOffice/Billing/CashierFolder");
    };


    const handleIPSearchChange = (e) => {
        const { name, value } = e.target;
    
        setsearchIPParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    

    const handlenewDocRegister = () => {
        navigate("/Home/AdvanceCollectionBilling");
      };



    const PatientIPRegisterColumns = [
        {
            key: "id",
            name: "S.No",
            frozen: pagewidth > 500 ? true : false
        },
       
        {
            key: "PatientId",
            name: "Patient Id",
            frozen: pagewidth > 500 ? true : false
        },
        {
            key: "PatientName",
            name: "Patient Name",
            width: 200,
            frozen: pagewidth > 500 ? true : false
        },
        {
            key: "Age",
            name: "Age",
        },
        {
            key: "Gender",
            name: "Gender",
        },

        

        {
            key: "PhoneNo",
            name: "PhoneNo",
        },
       
        {
            key: "Complaint",
            name: "Complaint",
        },
        
        {
            key: "DoctorName",
            name: "Doctor Name",
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => {
              console.log(params.row,'params.row');
              
              return (
                <>
                  <Button
                    className="cell_btn"
                    onClick={() => handleNavigateIpAdvanceCollection(params.row)} // Pass row data to handleNavigateOP
                  >
                    <ArrowForwardIcon className="check_box_clrr_cancell" />

                  </Button>
                  
                </>
              );
            },
          },
    ]

   
  return (
    <>
       <div className="Main_container_app">
            <div className='DivCenter_container'>Patients List </div>

            {/*------------- Patient Counts --------------------- */}
            
           

           
            <div className="search_div_bar">
                <div className=" search_div_bar_inp_1">
                    <label htmlFor="">Search by
                        <span>:</span>
                    </label>
                    <input
                        type="text"
                        name='query'
                        value={searchIPParams.query}
                        placeholder='Search here ... '
                        onChange={handleIPSearchChange}
                    />
                </div>

                <button
                    className="search_div_bar_btn_1"
                    onClick={handlenewDocRegister}
                    title="New Advance Billing"
                    >
                    <LoupeIcon />
                    </button>
               

            </div>


            {/* <ReactGrid columns={PatientIPRegisterColumns} RowData={IpPatientRegisterData} /> */}
        
            <ReactGrid
                columns={PatientIPRegisterColumns}
                RowData={IpPatientRegisterData }
            />


              



        </div>
    
    
    </>
  )
}

export default IP_Patient_Quelist;