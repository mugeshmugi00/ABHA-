import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

const New_theater_booking = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reqDate: "",
    reqTime: "",
    bookingType: "",
    specialization: "",
    surgeryName: "",
    OTName: "",
    doctorName: "",
    bookingDate: "",
    bookingTime: "",
    duration: "",
    operationType: "",
    priority: "",
    patientId: "",
    patientName: "",
    age: "",
    gender: "",
    uhidNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.reqDate || !formData.reqTime || !formData.patientName) {
      alert("Please fill all required fields.");
      return;
    }

    const OtQuelist = JSON.parse(localStorage.getItem("OtQuelist")) || [];
    OtQuelist.push(formData);
    localStorage.setItem("OtQuelist", JSON.stringify(OtQuelist));

    navigate("/ot-queue-list");
  };

  return (
    <div className="Main_container_app">
      <h4>
        Theater Booking
        <div style={{ float: 'right' }}>
          OT Available
          <FontAwesomeIcon icon={faCalendarDays} className="cal_icon" />
        </div>
      </h4>
      <br />
      <div className="RegisFormcon">
        {/* Form fields */}
        {Object.keys(formData).map((field) => (
          <div className="RegisForm_1" key={field}>
            <label>
              {field.charAt(0).toUpperCase() + field.slice(1)}
              <span>:</span>
            </label>
            {field === 'gender' || field === 'bookingType' || field === 'priority' || field === 'operationType' ? (
              <select name={field} value={formData[field]} onChange={handleChange}>
                <option value="">Select</option>
                {field === 'gender' && (
                  <>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </>
                )}
                {field === 'bookingType' && (
                  <>
                    <option value="IP">IP</option>
                    <option value="OP">OP</option>
                    <option value="DayCare">Day Care</option>
                    <option value="Emergency">Emergency</option>
                    <option value="OutSide">OutSide</option>
                  </>
                )}
                {field === 'priority' && (
                  <>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </>
                )}
                {field === 'operationType' && (
                  <>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                    <option value="Complex">Complex</option>
                  </>
                )}
              </select>
            ) : (
              <input
                type={
                  field.includes('Date')
                    ? 'date'
                    : field.includes('Time')
                      ? 'time'
                      : field === 'duration' || field === 'age' || field === 'patientId'
                        ? 'number'
                        : 'text'
                }
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
      </div>
      <br />
      <div className="Main_container_Btn">
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default New_theater_booking;