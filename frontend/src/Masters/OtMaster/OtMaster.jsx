import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { Checkbox } from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

const OtMaster = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const dispatch = useDispatch();

  const [locationData, setLocationData] = useState([]);
  const [buildingName, setBuildingName] = useState([]);
  const [blockName, setBlockName] = useState([]);
  const [floorData, setFloorData] = useState([]);
  // const [wardData,setWardData] = useState([]);
  const [otMasterData, setOtMasterData] = useState([]);
  const [IsOtMasterData, setIsOtMasterData] = useState(false);
  const [specialityData, setSpecilitydata] = useState([]);
  const [speciality, setSpeciality] = useState([]);

  console.log(speciality);

  const [otMaster, setOtMaster] = useState({
    OtId: "",
    Location: "",
    Building: "",
    Block: "",
    TheatreName: "",
    ShortName: "",
    FloorName: "",
    WardName: "",
    Emergency: false,
    TheatreType: "",
    Speciality: "",
    Details: "",
    Remarks: "",
    Rent: "",
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
    axios
      .get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => setLocationData(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Masters/get_Floor_Data_by_Building_block_loc?Block=${otMaster.Block}`
      )
      .then((res) => setFloorData(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink, otMaster.Block]);

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Masters/get_building_Data_by_location?Location=${otMaster.Location}`
      )
      .then((res) => setBuildingName(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink, otMaster.Location]);

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Masters/get_block_Data_by_Building?Building=${otMaster.Building}`
      )
      .then((res) => setBlockName(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink, otMaster.Building]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/OtTheaterMaster_Detials_link`)
      .then((res) => {
        const ress = res.data;
        if (Array.isArray(ress)) {
          setOtMasterData(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, [UrlLink, IsOtMasterData]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then((res) => setSpecilitydata(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  // useEffect(() => {
  //     axios.get(`${UrlLink}Masters/get_Ward_Data_by_Building_block_Floor_loc?Floor=${otMaster.FloorName}`)
  //         .then((res) => setWardData(res.data))
  //         .catch((err) => console.log(err));
  // },[UrlLink,otMaster.FloorName]);

  const handleEditOtMasterStatus = (row) => {
    const data = {
      OtId: row.id,
      Statusedit: true,
    };
    axios
      .post(`${UrlLink}Masters/OtTheaterMaster_Detials_link`, data)
      .then((res) => {
        const response = res.data;
        const messageType = Object.keys(response)[0];
        const messageContent = Object.values(response)[0];
        dispatch({
          type: "toast",
          value: { message: messageContent, type: messageType },
        });
        setIsOtMasterData((prev) => !prev);
      })
      .catch((err) => console.log(err));
  };

  console.log(otMaster);
  const handleEditOtMaster = (row) => {
    // const { id, ...rest } = row;
    console.log(row);
    console.log(row.Location);
    console.log(row.BuildingName);
    console.log(row.BlockName);
    console.log(row.Speciality);
    setOtMaster((prev) => ({
      ...prev,
      OtId: row?.id,
      Location: row?.LocationId,
      Building: row?.BuidingId,
      Block: row?.BlockId,
      TheatreName: row?.TheatreName,
      ShortName: row?.ShortName,
      FloorName: row?.FloorId,
      Emergency: row?.Emergency,
      TheatreType: row?.TheatreType,
      Speciality: row?.Speciality,
      Details: row?.Details,
      Remarks: row?.Remarks,
      Rent: row?.Rent,
    }));

    setSpeciality(row?.SpecialityName);

    const data = {
      ...otMaster,
      Speciality: speciality,
    };

    console.log(data);

    axios
      .post(`${UrlLink}Masters/OtTheaterMaster_Detials_link`, data)
      .then((res) => {
        const response = res.data;
        const messageType = Object.keys(response)[0];
        const messageContent = Object.values(response)[0];
        dispatch({
          type: "toast",
          value: { message: messageContent, type: messageType },
        });
        setIsOtMasterData((prev) => !prev);
        setOtMaster({
          OtId: "",
          Location: "",
          Building: "",
          Block: "",
          TheatreName: "",
          ShortName: "",
          FloorName: "",
          WardName: "",
          Emergency: false,
          Speciality: "",
          SurgeryType: "",
          Details: "",
          Remarks: "",
          Rent: "",
        });
      })
      .catch((err) => console.log(err));
  };

  const handleOtMastersubmit = () => {
    if (!otMaster.Location || !otMaster.TheatreName) {
      dispatch({
        type: "toast",
        value: {
          message: "Please provide both Location and Theatre Name.",
          type: "warn",
        },
      });
      return;
    }

    const data = {
      ...otMaster,
      Speciality: speciality,
      created_by: userRecord?.username || "",
    };

    console.log(data, "data");

    axios
      .post(`${UrlLink}Masters/OtTheaterMaster_Detials_link`, data)
      .then((res) => {
        const response = res.data;
        const messageType = Object.keys(response)[0];
        const messageContent = Object.values(response)[0];
        dispatch({
          type: "toast",
          value: { message: messageContent, type: messageType },
        });
        setIsOtMasterData((prev) => !prev);
        setOtMaster({
          OtId: "",
          Location: "",
          Building: "",
          Block: "",
          TheatreName: "",
          ShortName: "",
          FloorName: "",
          WardName: "",
          Emergency: false,
          Speciality: "",
          TheatreType: "",
          Details: "",
          Remarks: "",
          Rent: "",
        });
      })
      .catch((err) => console.log(err));
  };

  const handleInputChange = (e) => {
    const { name, type, value, checked, options, multiple } = e.target;

    setOtMaster((prevState) => ({
      ...prevState,
      [name]: multiple
        ? Array.from(options)
            .filter((option) => option.selected)
            .map((option) => option.value)
        : type === "checkbox"
        ? checked
        : value,
    }));
    // setOtMaster(prevState => ({
    //     ...prevState,
    //     [name]: type === 'checkbox' ? checked : value,
    // }));
  };

  const handleSpecialityChange = (event) => {
    const selectedValue = event.target.value; 
    setSpeciality(selectedValue); 
  };

  const OtMasterColumns = [
    { key: "sno", name: "S.No", frozen: true },
    { key: "created_by", name: "Created By", frozen: true },
    { key: "TheatreName", name: "Theatre Name" },
    { key: "ShortName", name: "Short Name" },
    { key: "FloorName", name: "Floor Name" },
    //{ key: "Emergency", name: "Emergency" },
    { key: "SpecialityName", name: "Speciality" },
    { key: "TheatreType", name: "TheatreType" },
    { key: "Details", name: "Details" },
    { key: "Remarks", name: "Remarks" },
    { key: "BuildingName", name: "Building" },
    { key: "BlockName", name: "Block" },
    { key: "Rent", name: "Rent" },
    { key: "Location", name: "Location" },
    {
      key: "Status",
      name: "Status",
      renderCell: (params) => (
        <Button onClick={() => handleEditOtMasterStatus(params.row)}>
          {params.row.Status}
        </Button>
      ),
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button onClick={() => handleEditOtMaster(params.row)}>
          <EditIcon />
        </Button>
      ),
    },
  ];

  return (
    <div className="Main_container_app">
      <h4>
        Theatre Masters
        {/* <div style={{ float: 'right' }}>
                    OT Available
                    <span><FontAwesomeIcon icon={faCalendarDays} className="cal_icon" /></span>
                </div> */}
      </h4>
      <br />
      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label>
            Location<span>:</span>
          </label>
          {console.log(otMaster, "otMaster")}
          <select
            name="Location"
            value={otMaster.Location}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            {locationData.map((loc, index) => (
              <option key={index} value={loc.id}>
                {loc.locationName}
              </option>
            ))}
          </select>
        </div>
        <div className="RegisForm_1">
          <label>
            Building<span>:</span>
          </label>
          <select
            name="Building"
            value={otMaster.Building}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            {Array.isArray(buildingName) &&
              buildingName.map((building, index) => (
                <option key={index} value={building.id}>
                  {building.BuildingName}
                </option>
              ))}
          </select>
        </div>
        <div className="RegisForm_1">
          <label>
            Block<span>:</span>
          </label>
          <select
            name="Block"
            value={otMaster.Block}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            {Array.isArray(blockName) &&
              blockName.map((block, index) => (
                <option key={index} value={block.id}>
                  {block.BlockName}
                </option>
              ))}
          </select>
        </div>
        <div className="RegisForm_1">
          <label>
            Floor Name<span>:</span>
          </label>
          <select
            name="FloorName"
            value={otMaster.FloorName}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            {Array.isArray(floorData) &&
              floorData.map((floor, index) => (
                <option key={index} value={floor.id}>
                  {floor.FloorName}
                </option>
              ))}
          </select>
        </div>
        {/* <div className="RegisForm_1">
                    <label>Ward Name<span>:</span></label>
                    <select name="WardName" value={otMaster.WardName} onChange={handleInputChange} required>
                        <option value="">Select</option>
                        {Array.isArray(wardData) && wardData.map((ward, index) => (
                            <option key={index} value={ward.id}>{ward.WardName}</option>
                        ))}
                    </select>
                </div> */}
        {/* <div className="RegisForm_1">
                    <label>FloorName Name<span>:</span></label>
                    <input
                        type="text"
                        name="TheatreName"
                        placeholder="Enter Theatre Name"
                        value={otMaster.FloorName}
                        onChange={handleInputChange}
                        required
                    />
                </div> */}

        <div className="RegisForm_1">
          <label>
            Theatre Name<span>:</span>
          </label>
          <input
            type="text"
            name="TheatreName"
            placeholder="Enter Theatre Name"
            value={otMaster.TheatreName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Short Name<span>:</span>
          </label>
          <input
            type="text"
            name="ShortName"
            placeholder="Enter Short Name"
            value={otMaster.ShortName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Emergency<span>:</span>
          </label>
          <Checkbox
            name="Emergency"
            checked={otMaster.Emergency}
            onChange={handleInputChange}
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Theatre Type<span>:</span>
          </label>
          <select
            name="TheatreType"
            onChange={handleInputChange}
            value={otMaster.TheatreType}
            required
          >
            <option value="">Select</option>
            <option value="Major">Major</option>
            <option value="Minor">Minor</option>
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            Speciality<span>:</span>
          </label>
          <select
            name="Speciality"
            value={speciality}
            onChange={handleSpecialityChange}
            required
          >
            <option value="">Select</option>
            {Array.isArray(specialityData) &&
              specialityData.map((spec, index) => (
                <option key={index} value={`${spec.id}-${spec.SpecialityName}`}>
                  {spec.SpecialityName}
                </option>
              ))}
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            Rent/hr (Rs.)<span>:</span>
          </label>
          <input
            type="Number"
            name="Rent"
            placeholder="Enter Amount"
            value={otMaster.Rent}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Details<span>:</span>
          </label>
          <textarea
            name="Details"
            placeholder="Enter Details"
            value={otMaster.Details}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Remarks<span>:</span>
          </label>
          <textarea
            name="Remarks"
            placeholder="Enter Remarks"
            value={otMaster.Remarks}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="Main_container_Btn">
        <button onClick={handleOtMastersubmit}>
          {otMaster.OtId ? "Update" : "Save"}
        </button>
      </div>
      {otMasterData.length > 0 && (
        <ReactGrid columns={OtMasterColumns} RowData={otMasterData} />
      )}
    </div>
  );
};

export default OtMaster;
