import * as React from "react";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
// import "./PatientQueueList.css";
import "./OtQuelist.css"
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "var(--ProjectColor)",
          textAlign: "Center",
        },
        root: {
          "& .MuiDataGrid-root .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeaderTitleContainer":
          {
            textAlign: "center",
            display: "flex !important",
            justifyContent: "center !important",
          },
          "& .MuiDataGrid-window": {
            overflow: "hidden !important",
          },
        },
        cell: {
          borderTop: "0px !important",
          borderBottom: "1px solid  var(--ProjectColor) !important",
          display: "flex",
          justifyContent: "center",
        },
      },
    },
  },
});

const OtQuelist = () => {
  const dispatchvalue = useDispatch();
  const [PatientRegisterData, setPatientRegisterData] = useState("");
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [otData, setOtData] = useState([]);
  const [otData1, setOtData1] = useState([]);

  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [ApprovedDate, setApprovedDate] = useState("");
  const [Approvedtime, setApprovedtime] = useState("");
  // const [filteredRows,setFilteredRows]=useState([]);
  const [Doctors, setDoctors] = useState([]);
  const [selectedDoctor, setselectedDoctor] = useState("all");
  const [Location, setLocation] = useState([]);
  const [selectedLocation, setselectedLocation] = useState("all");
  const [Building, setBuilding] = useState([]);
  const [selectedBuilding, setselectedBuilding] = useState("all");
  const [Block, setBlock] = useState([]);
  const [selectedBlock, setselectedBlock] = useState("all");
  const [Floor, setFloor] = useState([]);
  const [selectedFloor, setselectedFloor] = useState("all");
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const showdown = rows.length;
  const [openModal, setOpenModal] = useState(false);
  const [PatientFirstName, setPatientFirstName] = useState("");
  const [PatientPhoneNo, setPatientPhoneNo] = useState("");
  const [columns, setcolumn] = useState([]);

  const OtQuelist = JSON.parse(localStorage.getItem("OtQuelist")) || [];

  console.log("Doctors", Doctors);

  React.useEffect(() => {
    fetchOtRequestData();
  }, []);

  const fetchOtRequestData = () => {
    axios
      .get("http://127.0.0.1:8000/ipregistration/get_Ot_Request")
      .then((response) => {
        const data = response.data;
        console.log("orrequestdata", data);

        setOtData([
          ...data.map((row, index) => ({
            id: index + 1,
            ...row,
          })),
        ]);
      })
      .catch((error) => {
        console.log("error fetching otrequest data:", error);
      });
  };

  const handleEditClick1 = (params) => {
    console.log(params);
    setOpenModal(true);
    setOtData1(params.row);
  };

  const handleSubmission = () => {
    const submissionData = {
      bookingid: otData1.Booking_Id,
      Approveddate: ApprovedDate,
      Approvedtime: Approvedtime,
    };
    console.log(submissionData);

    axios
      .post(
        "http://127.0.0.1:8000/ipregistration/update_Ot_Queuelist",
        submissionData
      )
      .then((response) => {
        console.log(response.data);
        setApprovedDate("");
        setApprovedtime("");
        setOpenModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleNavigateOTTheater = (params) => {
    dispatchvalue({ type: "submissionData", value: params.row });
    navigate("/Home/OT-Management");
  };

  const coloumnss = [
    { field: "id", headerName: "Ot Request Id", width: 100 },
    { field: "Booking_Id", headerName: "Booking Id", width: 100 },
    { field: "Patient_Name", headerName: "Patient_Name", width: 100 },
    { field: "Surgery_Name", headerName: "Surgery Name", width: 130 },
    { field: "Surgeon_Name", headerName: "Surgeon Name", width: 130 },
    { field: "Requested_Date", headerName: "Requested Date", width: 140 },
    { field: "Requested_Time", headerName: "Requested Time", width: 140 },
    { field: "Physician_Name", headerName: "Physician Name", width: 140 },
    { field: "Approved_Date", headerName: "Approved Date", width: 150 },
    { field: "Approve_Time", headerName: "Approve Time", width: 150 },
    {
      field: "Status",
      headerName: "Status",

      renderCell: (params) => (
        <>
          <div className="actionv">
            {/* <button>Checkin</button> */}
            <button onClick={() => handleColorChange(params.row.id, "#e3ff7e")}>
              Pending
            </button>
            <button
              onClick={() => handleColorChange(params.row.id, "#88e76cfd")}
            >
              Confirm
            </button>
          </div>
        </>
      ),
    },
    {
      field: "Action",
      headerName: "Action",

      // frozen: pagewidth > 700 ? true : false,
      renderCell: (params) => (
        <>
          <div className="actionv">
            {/* <button>Checkin</button> */}
            <button onClick={() => handleColorChange(params.row.id, "#f55e5e")}>
              Cancel
            </button>

            <button
              onClick={() => handleColorChange(params.row.id, "#c794dffd")}
            >
              Resheduled
            </button>
          </div>
        </>
      ),
    },
  ];

  const handlePageChange = (params) => {
    setPage(params.page);
  };

  const handleColorChange = (id, color) => {
    setPatientRegisterData((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, bgColour: color } : row))
    );
  };
  const totalPages = Math.ceil(rows.length / 10);

  return (
    <>
      <div className="appointment">
        <div className="h_head neww_1">
          <h3>Operation Theatre Queue List</h3>
          {/* <div className="action_color_block">
            <span style={{ backgroundColor: "#e3ff7e" }}>Checkin </span>
            <span style={{ backgroundColor: "#88e76cfd" }}>Checkout </span>

            <span style={{ backgroundColor: "#f55e5e" }}>Cancel</span>
            <span style={{ backgroundColor: "#c794dffd" }}>Reshedule</span>
          </div> */}

          <div className="doctor_select_1 selt-dctr-nse form-row-inline">
            {/* <label htmlFor="names">Doctor:</label>
            <select
              name="Doctor Name"
              onChange={(e) => setselectedDoctor(e.target.value)}
              value={selectedDoctor}
            >
              <option value="all">Select</option>
              {Doctors.map((p, index) => (
                <option key={index} value={p}>
                  {p}
                </option>
              ))}
            </select> */}
            <label htmlFor="location">Location:</label>
            <select
              name="Location"
              onChange={(e) => setselectedLocation(e.target.value)}
              value={selectedLocation}
            >
              <option value="all">Select</option>
              {Location.map((p, index) => (
                <option key={index} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <label htmlFor="building">Building:</label>
            <select
              name="Building"
              onChange={(e) => setselectedBuilding(e.target.value)}
              value={selectedBuilding}
            >
              <option value="all">Select</option>
              {Building.map((p, index) => (
                <option key={index} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <label htmlFor="block">Block:</label>
            <select
              name="Block"
              onChange={(e) => setselectedBlock(e.target.value)}
              value={selectedBlock}
            >
              <option value="all">Select</option>
              {Block.map((p, index) => (
                <option key={index} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <label htmlFor="floor">Floor:</label>
            <select
              name="Floor"
              onChange={(e) => setselectedFloor(e.target.value)}
              value={selectedFloor}
            >
              <option value="all">Select</option>
              {Floor.map((p, index) => (
                <option key={index} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="Main_container_app">
            <h4>OT Quelist <div style={{float:"right"}}>Doctor Available<FontAwesomeIcon icon={faCalendarDays} className="cal_icon" /></div></h4><br/>
          </div>
        </div>
        <form>
          <div className="con_1 ">
            <div className="action_color_block">
              <span style={{ backgroundColor: "#e3ff7e" }}>Booked </span>
              <span style={{ backgroundColor: "#88e76cfd" }}>Completed </span>

              <span style={{ backgroundColor: "#f55e5e" }}>Cancel</span>
              <span style={{ backgroundColor: "#c794dffd" }}>Reshedule</span>
            </div>

            <div className="inp_1">
              <label htmlFor="input">First Name :</label>
              <input
                type="text"
                id="FirstName"
                value={PatientFirstName}
                onChange={(e) => setPatientFirstName(e.target.value)}
                placeholder="Enter the First Name"
              />
            </div>
            <div className="inp_1">
              <label htmlFor="input">Phone No :</label>
              <input
                type="text"
                id="PhoneNo"
                value={PatientPhoneNo}
                onChange={(e) => setPatientPhoneNo(e.target.value)}
                placeholder="Enter the Phone No"
              />
            </div>
            <button className="btn_1" type="submit">
              <SearchIcon />
            </button>
          </div>
        </form>
        {/* <ThemeProvider theme={theme}>
          <div className=" grid_1">
            <DataGrid
              rows={rows.slice(page * pageSize, (page + 1) * pageSize)}
              columns={columns}
              pageSize={100}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              onPageChange={handlePageChange}
              hideFooterPagination
              hideFooterSelectedRowCount
              className=" data_grid"
            />
            {showdown > 0 && rows.length > 10 && (
              <div className="grid_foot">
                <button
                  onClick={() =>
                    setPage((prevPage) => Math.max(prevPage - 1, 0))
                  }
                  disabled={page === 0}
                >
                  Previous
                </button>
                Page {page + 1} of {totalPages}
                <button
                  onClick={() =>
                    setPage((prevPage) =>
                      Math.min(prevPage + 1, totalPages - 1)
                    )
                  }
                  disabled={page === totalPages - 1}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </ThemeProvider> */}
        <ThemeProvider theme={theme}>
          <div className="IP_grid_1">
            <DataGrid
              rows={otData.slice(page * pageSize, (page + 1) * pageSize)}
              pageSize={10}
              columns={coloumnss} // You need to define your dynamic columns here
              onPageChange={handlePageChange}
              hideFooterPagination
              hideFooterSelectedRowCount
              className="Ip_data_grid"
            />
            {showdown > 0 && otData.length > 10 && (
              <div className="IP_grid_foot">
                <button
                  onClick={() =>
                    setPage((prevPage) => Math.max(prevPage - 1, 0))
                  }
                  disabled={page === 0}
                >
                  Previous
                </button>
                Page {page + 1} of {totalPages}
                <button
                  onClick={() =>
                    setPage((prevPage) =>
                      Math.min(prevPage + 1, totalPages - 1)
                    )
                  }
                  disabled={page === totalPages - 1}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </ThemeProvider>

        {rows.length === 0 && (
          <div className="norecords">
            <span>No Records Found</span>
          </div>
        )}
      </div>
      {openModal && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="bookingid">
                  Booking ID<span>:</span>
                </label>
                <input
                  type="input"
                  name="bookingid"
                  value={otData1.Booking_Id}
                  readOnly
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="ApprovedDate">
                  Approved Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="Approveddate"
                  value={ApprovedDate}
                  onChange={(e) => {
                    setApprovedDate(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="Approvedtime">
                  Approved Time<span>:</span>
                </label>
                <input
                  type="time"
                  name="Approvedtime"
                  value={Approvedtime}
                  onChange={(e) => {
                    setApprovedtime(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="Register_btn_con regster_btn_contsai">
              <button
                className="RegisterForm_1_btns"
                onClick={handleSubmission}
              >
                Submit
              </button>
              <button
                className="RegisterForm_1_btns"
                onClick={() => setOpenModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OtQuelist;
