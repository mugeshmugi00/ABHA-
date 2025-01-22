import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import axios from 'axios';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';


const IP_Doc_DAMA = () => {
    const dispatch = useDispatch();
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
    console.log(IP_DoctorWorkbenchNavigation,'IP_DoctorWorkbenchNavigation');

    const userRecord = useSelector((state) => state.userRecord?.UserData);

    const Reasons = 
    [
        "Brought Dead",
        "Higher Center For Further Investigation & Treatment",
        "Non Availability Of Consultant",
        "Non Availability Of ICU Bed",
        "Toxic Patients Or Relatives",
        "Drunk Patients",
        "Relatives Not Available(Unknown Patients)",
        "Transferred to COVID Center",
        "Absconded",
        "Dama Npn Affordable",
        "Dama Relatives Not Wish",
        "Dama Insurance Or Cashless"
        
    ];

    const DamaReasons = [
      "Absconded", "Dama Npn Affordable", "Dama Relatives Not Wish", "Dama Insurance Or Cashless", "Others"
    ];

  const transferReasons = [
    "Non Availability Of Consultant", "Non Availability Of ICU Bed", "Relatives Not Available(Unknown Patients)",
    "Brought Dead", "Higher Center For Further Investigation & Treatment", "Toxic Patients Or Relatives",
    "Drunk Patients", "Others"
  ];

    const [Dama, setDama] = useState({
        PatientExitType: "",
        Reasons: "",
        Date: "",
        Time: "",
        Remarks: "",
    });

    const [gridData, setGridData] = useState([])
    
    const [IsGetData, setIsGetData] = useState(false)
    console.log(gridData);

    const [IsViewMode, setIsViewMode] = useState(false)
  
    const DamaColumns = [
      { key: 'id', name: 'S.No', frozen: true },
      { key: 'PrimaryDoctorName', name: 'Doctor Name', frozen: true },
      { key: 'Date', name: 'Date', frozen: true },
      { key: 'Time', name: 'Time', frozen: true },
      { key: 'Type', name: 'Type' },
      { key: 'PatientExitType', name: 'Patient Exit Type' },
      { key: 'Reasons', name: 'Reasons' },
      { key: 'Remarks', name: 'Remarks' },
      {
          key: 'view', frozen: true, name: 'View',
          renderCell: (params) => (
              <IconButton onClick={() => handleView(params.row)}>
                  <VisibilityIcon />
              </IconButton>
          ),
      },
    ];

    const handleView = (data) => {
        setDama({
            PatientExitType: data.PatientExitType || '',
            Reasons: data.Reasons || '',
            Date: data.Date || '',
            Time: data.Time || '',
            Remarks: data.Remarks || '',
        });
        setIsViewMode(true);

    };

    const handleClear = () => {
        setDama({
            PatientExitType: "",
            Reasons: "",
            Date: "",
            Time: "",
            Remarks: "",
        });
        setIsViewMode(false);

    };

    
    useEffect(() => {

      const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
      const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

      if (RegistrationId) {
          axios.get(`${UrlLink}Ip_Workbench/IP_Dama_Details_Link`, {
              params: {
                RegistrationId: RegistrationId,
                DepartmentType: departmentType,
                  Type: 'Doctor'
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

  const filteredReasons = Dama.PatientExitType === 'Transfer' ? transferReasons : DamaReasons;

  const handleDamaChange = (e) => {
    const { name, value } = e.target;
    if (name === 'PatientExitType'){
      setDama(prev => ({ ...prev, [name]: value, Reasons:''}));

    } else {
        setDama(prev => ({ ...prev, [name]: value }));

    }
};


    const handleSubmit = () => {
       
      const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
      const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;

      if (!RegistrationId) {
          dispatch({ type: 'toast', value: { message: 'Registration ID is missing', type: 'error' } });
          return;
      }

      const senddata = {
          ...Dama,
          RegistrationId,
          DepartmentType, // Use the state directly for department type
          Createdby: userRecord?.username,
          Type: 'Doctor'
      };

      console.log(senddata, 'senddata');

      axios.post(`${UrlLink}Ip_Workbench/IP_Dama_Details_Link`, senddata)
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
      <div className="Main_container_app">
        <div className="form-section5">
          <div className="common_center_tag">
          </div>

          <div className="RegisFormcon_1">
            {[
              { label: "Patient Exit Type", id: "PatientExitType", type: "select" },
              { label: "Reasons", id: "Reasons", type: "select" },
              { label: "Date", id: "Date", type: "date" },
              { label: "Time", id: "Time", type: "time" },             
              { label: "Remarks", id: "Remarks", type: "textarea" },
            ].map((input) => (
              <div className="RegisForm_1" key={input.id}>
                <label htmlFor={input.id}>
                  {input.label} <span>:</span>
                </label>
                {input.type === "textarea" ? (
                  <textarea
                    id={input.id}
                    name={input.id}
                    onChange={handleDamaChange}
                    value={Dama[input.id]}
                    required
                    readOnly={IsViewMode}

                  />
                ) : input.type === "select" && input.id === "PatientExitType" ? (
                  <select
                      id={input.id}
                      name={input.id}
                      onChange={handleDamaChange}
                      value={Dama[input.id]}
                      readOnly={IsViewMode}
                      required
                  >
                      <option value="">Select</option>
                      <option value="Transfer">Transfer</option>
                      <option value="DAMA">DAMA</option>
                  </select>
                ) : input.type === "select" && input.id === "Reasons" ? (
                  <select
                      id={input.id}
                      name={input.id}
                      onChange={handleDamaChange}
                      value={Dama[input.id]}
                      readOnly={IsViewMode}
                      required
                  >
                      <option value="">Select Reasons</option>
                      {filteredReasons.map((reason, index) => (
                          <option key={index} value={reason}>
                              {reason}
                          </option>
                      ))}
                  </select>
                ):(
                  <input
                    type={input.type}
                    id={input.id}
                    name={input.id}
                    onChange={handleDamaChange}
                    value={Dama[input.id]}
                    required
                    readOnly={IsViewMode}

                  />
                )}
              </div>
            ))}

           
          </div>
        </div>

        <div className="Main_container_Btn">
                
            {IsViewMode && (
                <button onClick={handleClear}>Clear</button>
            )}
            {!IsViewMode && (
                <button onClick={handleSubmit}>Submit</button>
            )}
        </div>

        {gridData.length > 0 &&
            <ReactGrid columns={DamaColumns} RowData={gridData} />
        }

        <ToastAlert Message={toast.message} Type={toast.type} />

      </div>
    </>
  )
}

export default IP_Doc_DAMA