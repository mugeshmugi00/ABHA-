import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux'; 
import { useDispatch } from 'react-redux';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';

const OpIpconnect = () => {
  const DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.DoctorWorkbenchNavigation);
  console.log('DoctorWorkbenchNavigation', DoctorWorkbenchNavigation);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const dispatchvalue = useDispatch();
  const toast = useSelector(state => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
console.log('userRecord', userRecord);

    const [reason , setreason ] = useState('');
    const [IpNotes , setIpNotes ] = useState('');
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'reason') {
        setreason(value);
      } else if (name === 'IpNotes') {
        setIpNotes(value);
      }
    };
 
    const handleSubmit = () =>{
        console.log('reason',reason);
        const postdata = {
          Patient_id: DoctorWorkbenchNavigation?.PatientId,
          Registration_id : DoctorWorkbenchNavigation?.pk,
          Reason: reason,
          IpNotes: IpNotes,
          Created_by: userRecord?.username
        }
        axios.post(`${UrlLink}Workbench/insert_op_ip_convertion`, postdata)
        .then(response => {
          const resData = response.data;
          const mess = Object.values(resData)[0];
          const typp = Object.keys(resData)[0];
          // console.log('Patient Vital Details submitted successfully:', response.data);
          const tdata = {
              message: mess,
              type: typp,
          };

          dispatchvalue({ type: 'toast', value: tdata });
          setreason('')
          setIpNotes('')
      })
      .catch((err)=>{
          console.log(err);
        });
    }


    
  return (
    <>
    <div className="Main_container_app">
      <div className="appointment">
        <div className="treatcon_body_1 txtWidth">
          <label>
           Reason <span>:</span>
          </label>
          <textarea
            id='reason'
            name='reason'
            value={reason}
            onChange={handleChange}
          />
        </div>
        
        <div className="treatcon_body_1 txtWidth">
          <label>
          Ip Notes <span>:</span>
          </label>
          <textarea
            id='IpNotes'
            name='IpNotes'
            value={IpNotes}
            onChange={handleChange}
          />
        </div>
        
      </div>
      <div className="Main_container_Btn">
        
        
           <button onClick={handleSubmit}>Admit</button>
    
       </div>

      </div>
      
      <ToastAlert Message={toast.message} Type={toast.type} />

</>
  )
}

export default OpIpconnect;