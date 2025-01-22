import React, { useState, useEffect } from 'react';
import './SurgicalTeam.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const SurgicalTeam = (props) => {
  console.log(props.SpecializationData);

  const specializationData = useSelector((state) => state.SpecializationData);

  // Log the specialization data whenever it changes
  useEffect(() => {
    console.log("Specialization Data from Redux:", specializationData);
  }, [specializationData]);  // Dependency array ensures it logs when the data change
  // Local state for selected specialization

  const [selectedSpecialization, setSelectedSpecialization] = useState("");


  const handleChangeu = (e) => {
    setSelectedSpecialization(e.target.value);
  };


  const [specialization, setSpecialization] = useState('');
  //   const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [formData, setFormData] = useState({
    surgeon: '',
    assistantSurgeon: '',
    anaesthesiologist: '',
    scrubNurse: '',
    technician: '',
    circulatingNurse: '',
    others: '',
  });

  const [entries, setEntries] = useState({
    surgeon: [],
    assistantSurgeon: [],
    anaesthesiologist: [],
    scrubNurse: [],
    technician: [],
    circulatingNurse: [],
    others: [],
  });

  const [isConfirmed, setIsConfirmed] = useState(false); // To track whether the form is confirmed



  const handleInputChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleAdd = (role) => {
    if (formData[role]) {
      setEntries({
        ...entries,
        [role]: [...entries[role], formData[role]], // Add to the array
      });

      setFormData({
        ...formData,
        [role]: '',
      });
    }
  };

  const handleEdit = (role, index) => {
    const editingEntry = entries[role][index];

    setFormData({
      ...formData,
      [role]: editingEntry,
    });

    const updatedEntries = [...entries[role]];
    updatedEntries.splice(index, 1);

    setEntries({
      ...entries,
      [role]: updatedEntries,
    });
  };

  const handleDelete = (role, index) => {
    const updatedEntries = [...entries[role]];
    updatedEntries.splice(index, 1);

    setEntries({
      ...entries,
      [role]: updatedEntries,
    });
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    console.log('Final Data Confirmed:', entries);
  };

  const renderTable = () => {
    const roles = [
      'surgeon',
      'assistantSurgeon',
      'anaesthesiologist',
      'scrubNurse',
      'technician',
      'circulatingNurse',
      'others',
    ];

    return (
      <div className="Surgigal_v_table">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th>Role</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role}>
                <td>{role.charAt(0).toUpperCase() + role.slice(1)}</td>
                <td>
                  <input
                    type="text"
                    value={formData[role]}
                    onChange={(e) => handleInputChange(e, role)}
                  />
                </td>
                <td>
                  <button
                    className="add-btn"
                    onClick={() => handleAdd(role)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  const renderFinalList = () => {
    return (
      <div className="new-patient-registration-form">
        <h4>Final List:</h4>
        <div className="Selected-table-container">
          <table className="selected-medicine-table2">
            <thead>
              <tr>
                <th>Surgeon</th>
                <th>Assistant Surgeon</th>
                <th>Anaesthesiologist</th>
                <th>Scrub Nurse</th>
                <th>Technician</th>
                <th>Circulating Nurse</th>
                <th>Others</th>
              </tr>
            </thead>
            <tbody>
              {/* Use the length of the longest role list for the row count */}
              {[...Array(Math.max(
                entries.surgeon.length,
                entries.assistantSurgeon.length,
                entries.anaesthesiologist.length,
                entries.scrubNurse.length,
                entries.technician.length,
                entries.circulatingNurse.length,
                entries.others.length
              ))].map((_, index) => {
                // Ensure 'hasData' is declared here
                const hasData = (
                  entries.surgeon[index] ||
                  entries.assistantSurgeon[index] ||
                  entries.anaesthesiologist[index] ||
                  entries.scrubNurse[index] ||
                  entries.technician[index] ||
                  entries.circulatingNurse[index] ||
                  entries.others[index]
                );

                return (
                  <tr key={index}>
                    <td>
                      <div className="table-cell">
                        <span className="entry-text">{entries.surgeon[index] || ''}</span>
                        {entries.surgeon[index] && (
                          <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() => handleDelete('surgeon', index)}
                              className="delete-icon"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell">
                        <span className="entry-text">{entries.assistantSurgeon[index] || ''}</span>
                        {entries.assistantSurgeon[index] && (
                          <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() => handleDelete('assistantSurgeon', index)}
                              className="delete-icon"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell">
                        <span className="entry-text">{entries.anaesthesiologist[index] || ''}</span>
                        {entries.anaesthesiologist[index] && (
                          <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() => handleDelete('anaesthesiologist', index)}
                              className="delete-icon"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell">
                        <span className="entry-text">{entries.scrubNurse[index] || ''}</span>
                        {entries.scrubNurse[index] && (
                          <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() => handleDelete('scrubNurse', index)}
                              className="delete-icon"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell">
                        <span className="entry-text">{entries.technician[index] || ''}</span>
                        {entries.technician[index] && (
                          <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() => handleDelete('technician', index)}
                              className="delete-icon"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell">
                        <span className="entry-text">{entries.circulatingNurse[index] || ''}</span>
                        {entries.circulatingNurse[index] && (
                          <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() => handleDelete('circulatingNurse', index)}
                              className="delete-icon"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell">
                        <span className="entry-text">{entries.others[index] || ''}</span>
                        {entries.others[index] && (
                          <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() => handleDelete('others', index)}
                              className="delete-icon"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  const handleChange = (event) => {
    setSelectedSpecialization(event.target.value);
  };

  return (
    <div className="Main_container_app">
      <h4>
        Crew Set
        <div style={{ float: 'right' }}>Doctor Available <FontAwesomeIcon icon={faCalendarDays} className="cal_icon" /></div>
      </h4>
      <br />
      <div className="RegisForm_1">
        <label>Specialization<span>:</span></label>
        <select
          value={selectedSpecialization}
          onChange={handleChangeu}
        >
          <option value="">Select a specialization</option>
          {specializationData && specializationData.length > 0 && specializationData.map((specialization) => (
            <option key={specialization.id} value={specialization.id}>
              {specialization.SpecialityName}
            </option>
          ))}
        </select>
      </div>

      <div className='Surgical_team'>
        {/* Surgeon, Ass.Sergeon and Anaesthesiologist Section */}
        <div className="RegisForm_1">
          <label>Surgeon<span>:</span></label>
          <input
            type="text"
            value={formData.surgeon}
            onChange={(e) => handleInputChange(e, "surgeon")}
          />
          <span style={{ display: 'flex', alignItems: 'center ' }}><AddCircleIcon onClick={() => handleAdd("surgeon")} /></span>
        </div>

        <div className="RegisForm_1">
          <label>Assistant Surgeon<span>:</span></label>
          <input
            type="text"
            value={formData.assistantSurgeon}
            onChange={(e) => handleInputChange(e, "assistantSurgeon")}
          />
          <span style={{ display: 'flex', alignItems: 'center ' }}><AddCircleIcon onClick={() => handleAdd("assistantSurgeon")} /></span>
        </div>

        <div className="RegisForm_1">
          <label>Anaesthesiologist<span>:</span></label>
          <input
            type="text"
            value={formData.anaesthesiologist}
            onChange={(e) => handleInputChange(e, "anaesthesiologist")}
          />
          <span style={{ display: 'flex', alignItems: 'center ' }}><AddCircleIcon onClick={() => handleAdd("anaesthesiologist")} /></span>
        </div>

        {/* Nurse Team Section */}
        <div className="RegisForm_1">
          <label>Scrib Nurse<span>:</span></label>
          <input
            type="text"
            value={formData.scrubNurse}
            onChange={(e) => handleInputChange(e, "scrubNurse")}
          />
          <span style={{ display: 'flex', alignItems: 'center ' }}><AddCircleIcon onClick={() => handleAdd("scrubNurse")} /></span>
        </div>

        <div className="RegisForm_1">
          <label>Circulating Nurse<span>:</span></label>
          <input
            type="text"
            value={formData.circulatingNurse}
            onChange={(e) => handleInputChange(e, "circulatingNurse")}
          />
          <span style={{ display: 'flex', alignItems: 'center ' }}><AddCircleIcon onClick={() => handleAdd("circulatingNurse")} /></span>
        </div>

        {/* Technician Section */}
        <div className="RegisForm_1">
          <label>Technician<span>:</span></label>
          <input
            type="text"
            value={formData.technician}
            onChange={(e) => handleInputChange(e, "technician")}
          />
          <span style={{ display: 'flex', alignItems: 'center ' }}><AddCircleIcon onClick={() => handleAdd("technician")} /></span>
        </div>

        {/* Helper Section */}
        <div className="RegisForm_1">
          <label>Helper<span>:</span></label>
          <input
            type="text"
            value={formData.others}
            onChange={(e) => handleInputChange(e, "others")}
          />
          <span style={{ display: 'flex', alignItems: 'center ' }}><AddCircleIcon onClick={() => handleAdd("others")} /></span>
        </div>
      </div>

      {selectedSpecialization && renderTable()} {/* Render table only when specialization is selected */}

      {entries.surgeon.length > 0 && renderFinalList()} {/* Render final list table if data exists */}


      {/* Confirm Button */}
      {entries.surgeon.length > 0 && !isConfirmed && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleConfirm} className="confirm-btn">
            Submit
          </button>
        </div>
      )}
      {isConfirmed && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          <h4>Crew Set Completed!!</h4>
        </div>
      )}
    </div>
  );
};

export default SurgicalTeam;
