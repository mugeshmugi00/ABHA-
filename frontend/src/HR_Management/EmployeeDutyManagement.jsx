import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Visibility from "@mui/icons-material/Visibility";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import "./EmployeeDutyManagement.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";

const EmployeeDutyManagement = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [SearchQuery, setSearchQuery] = useState("");
  const [week, setWeek] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [bulkAssign, setBulkAssign] = useState(false); // For bulk assignment mode
  const [selectedEmployees, setSelectedEmployees] = useState([]); // To track selected employees
  console.log(selectedEmployees);
  const [DutyData, setDutyData] = useState([]);
  const [ShiftData, setShiftData] = useState([]);
  const [completeShiftData, setCompleteShiftData] = useState([]);
  const [startdate, setstartdate] = useState("");
  const [enddate, setenddate] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openRow, setOpenRow] = useState(null); // Store the currently open row
  const [currentshifts, setcurrentshifts] = useState([]);
  const [OpenShiftDetailsModal, setOpenShiftDetailsModal] = useState(false);
  const [OpenShiftDetailsCompleteModal, setOpenShiftDetailsCompleteModal] =
    useState(false);
  const [OpenDepartmentShiftDetailsModal, setOpenDepartmentShiftDetailsModal] =
    useState(false);
  const [AssignedDeprtmentShifts, setAssignedDeprtmentShifts] = useState([]);

  const [shiftDetails, setShiftDetails] = useState({
    intime: "",
    outtime: "",
    Shiftstartdate: "",
    Shiftenddate: "",
    Status: "Active",
    shiftName: "",
    Shift_Id: "",
  });

  const handleBulkAssignToggle = (e) => {
    setBulkAssign(e.target.value === "yes");
    if (e.target.value === "no") {
      setSelectedEmployees([]); // Clear selection when bulk mode is disabled
    }
  };

  const toggleRow = (subDepartmentId) => {
    // Toggle only one row at a time
    setOpenRow((prevOpenRow) =>
      prevOpenRow === subDepartmentId ? null : subDepartmentId
    );
  };

  const [rolename, setRolename] = useState([]);
  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/Employee_Designation_Details`)
      .then((response) => {
        setRolename(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/Duty_Master`)
      .then((response) => {
        setDutyData(response.data);
      })
      .catch((err) => console.error(err));
  }, [UrlLink]);

  const handleviewDepartmentShifts = (row) => {
    console.log(row);
    setAssignedDeprtmentShifts(row?.DepartmentassignedShifts);
    setOpenDepartmentShiftDetailsModal(true);
  };

  const handlestatus = (params) => {
    console.log("PAramsStatus", params);
    const confirm = window.confirm("Are you sure to complete the Shift?");

    if (confirm) {
      let newstatus;

      // Determine the new Status based on the current Status
      if (params.Status === "Active") {
        newstatus = "Completed";
      } else if (params.Status === "Completed") {
        newstatus = "Active";
      } else if (params.Status === "WeekOff") {
        newstatus = "Weekoff (Completed)";
      } else if (params.Status === "Follow-up Duty") {
        newstatus = "Completed";
      }

      console.log(params.Sl_No);
      console.log(newstatus);
      const paramsdata = {
        Sl_No: params.Sl_No,
        newstatus: newstatus,
      };
      axios
        .post(`${UrlLink}HR_Management/update_Shift_Detail_Link`, paramsdata)
        .then((response) => {
          console.log(response);
          const reste = response.data;
          const typp = Object.keys(reste)[0];
          const mess = Object.values(reste)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatch({ type: "toast", value: tdata });
          handleShowShiftDetails(params.Employee, userRecord?.location);
          setOpenShiftDetailsModal(true);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const EmployeeListColumns = (
    employeeList,
    selectedEmployees,
    setSelectedEmployees
  ) => [
    ...(bulkAssign
      ? [
          {
            key: "select",
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  type="checkbox"
                  onChange={(event) => {
                    const isChecked = event.target.checked;
                    setSelectedEmployees(() => {
                      if (isChecked) {
                        return employeeList; // Select all employees
                      } else {
                        return []; // Deselect all employees
                      }
                    });
                  }}
                  checked={
                    selectedEmployees.length === employeeList.length &&
                    employeeList.length > 0
                  }
                />
              </div>
            ),
            width: 50,
            renderCell: (params) => {
              const { Employee_Id } = params.row;
              const isChecked = selectedEmployees.some(
                (emp) => emp.Employee_Id === Employee_Id
              );

              const handleCheckboxChange = (event) => {
                setSelectedEmployees((prev) => {
                  if (event.target.checked) {
                    return [...prev, params.row];
                  } else {
                    return prev.filter(
                      (emp) => emp.Employee_Id !== Employee_Id
                    );
                  }
                });
              };

              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                </div>
              );
            },
          },
        ]
      : []),
    { key: "id", name: "S.No" },
    { key: "Employee_Id", name: "Employee Id" },
    { key: "EmployeeName", name: "Employee Name" },
    { key: "PhoneNo", name: "Phone No" },
    { key: "Designation", name: "Designation" },
    { key: "Department", name: "Department" },
    {
      key: "Action",
      name: "Action",
      width: 180,
      renderCell: (params) => {
        // Get the current date in YYYY-MM-DD format
        const currentDate = format(new Date(), "yyyy-MM-dd");
        console.log("currentDate", currentDate);

        const isCurrentDateInRange =
          params.row.FromDate &&
          params.row.ToDate &&
          currentDate >= params.row.FromDate &&
          currentDate <= params.row.ToDate;

        const isCurrentDateInShiftRange =
          params.row.shift_start &&
          params.row.shift_end &&
          currentDate >= params.row.shift_start &&
          currentDate <= params.row.shift_end;

        const isCurrentDateAttendance =
          params.row.Date && currentDate >= params.row.Date;

        // Determine the transformedStatus based on the condition
        let transformedStatus = "";
        if (isCurrentDateInRange && params.row.Status === "Approved") {
          transformedStatus = "OnLeave";
        } else if (isCurrentDateInShiftRange && params.row.Statuss !== "") {
          transformedStatus = params.row.Statuss;
        } else if (
          isCurrentDateAttendance &&
          params.row.StatusAttendance !== ""
        ) {
          transformedStatus = params.row.StatusAttendance;
        }

        // Condition to hide icons and show Status (OnLeave or WeekOff)
        const shouldHideIcons =
          (isCurrentDateInRange ||
            isCurrentDateInShiftRange ||
            isCurrentDateAttendance) &&
          transformedStatus !== "";

        return (
          <div style={{ display: "flex" }}>
            {shouldHideIcons ? (
              <span>{transformedStatus}</span>
            ) : (
              <>
                <Button
                  className="cell_btn"
                  onClick={() => handleAssignShiftDate(params.row)}
                >
                  <EditIcon className="check_box_clrr_cancell" />
                </Button>
                <Button
                  className="cell_btn"
                  onClick={() =>
                    handleShowShiftDetails(
                      params.row.Employee_Id,
                      userRecord?.location
                    )
                  }
                >
                  <PublishedWithChangesIcon className="check_box_clrr_cancell" />
                </Button>
              </>
            )}
            <Button
              className="cell_btn"
              onClick={() => handleShowCompleteDetails(params.row)}
            >
              <Visibility className="check_box_clrr_cancell" />
            </Button>
          </div>
        );
      },
    },
  ];

  const ShiftDataColumn = [
    { key: "id", name: "S.No", frozen: true },
    { key: "Shiftstartdate", name: "Shiftstartdate", frozen: true },
    { key: "Shiftenddate", name: "Shiftenddate", frozen: true },
    { key: "ShiftName", name: "ShiftName" },
    { key: "Intime", name: "Intime" },
    { key: "Outtime", name: "Outtime" },
    { key: "ShiftTime", name: "ShiftTime", width: 100 },
    // { key: "Status", name: "Status" },
    {
      key: "Status",
      name: "Status",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          style={{
            border: "none",
            backgroundColor: "transparent",
            padding: "3px",
          }}
          onClick={() => handlestatus(params.row)}
        >
          {params.row.Status}
        </Button>
      ),
    },
  ];

  const DepartmentShiftDataColumn = [
    { key: "Employee_Shift_Id", name: "S.No", frozen: true },
    { key: "Employee_Name", name: "Employee Name", frozen: true },
    { key: "Shiftstartdate", name: "Shiftstartdate", frozen: true },
    { key: "Shiftenddate", name: "Shiftenddate", frozen: true },
    { key: "ShiftName", name: "ShiftName" },
    { key: "ShiftTime", name: "ShiftTime", width: 100 },
    {
      key: "Status",
      name: "Status",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          style={{
            border: "none",
            backgroundColor: "transparent",
            padding: "3px",
          }}
          onClick={() => handlestatus(params.row)}
        >
          {params.row.Status}
        </Button>
      ),
    },
  ];

  const handleCloseModal = () => {
    setOpenModal(false);
    setShiftDetails({
      intime: "",
      outtime: "",
      Shiftstartdate: "",
      Shiftenddate: "",
      Status: "Active",
      shiftName: "",
    });
  };

  const handleAssignBulkShifts = () => {
    setOpenModal(true);
    setcurrentshifts(selectedEmployees[0]?.Shifts);
  };

  const handleAssignShiftDate = (row) => {
    console.log("row", row);
    setcurrentshifts(row.Shifts);
    setOpenModal(true); // Open modal
    setSelectedRowData(row); // Set selected row data

    const { id, ShiftName, Shift_StartDate, Shiftenddate, Status } = row;

    // Find the matching shift in DutyData
    const selectedShift = DutyData.find((shift) => shift.id === id);

    setShiftDetails({
      shiftName: ShiftName || "", // Set shift name
      Shiftstartdate: Shift_StartDate || "", // Set start date
      Shiftenddate: Shiftenddate || "", // Set end date
      Status: Status || "Active", // Default Status if missing
      intime: selectedShift ? selectedShift.StartTime : "", // Fetch StartTime from matched shift
      outtime: selectedShift ? selectedShift.EndTime : "", // Fetch EndTime from matched shift
    });
  };

  const handleShowShiftDetails = useCallback(
    (employeeID, location) => {
      console.log(
        "Fetching shift details for Employee ID:",
        employeeID,
        "Location:",
        location
      );
      setOpenShiftDetailsModal(true);
      // Construct API URL
      const apiUrl = `${UrlLink}HR_Management/Employee_ShiftDetails_Link?employeeid=${employeeID}&location=${location}`;

      // Perform GET request to retrieve shift details
      axios
        .get(apiUrl)
        .then((response) => {
          console.log("Shift details response:", response.data);
          if (response.data) {
            setShiftData(response.data); // Update shift data state
          } else {
            setShiftData([]); // Handle empty response
          }
          setOpenShiftDetailsModal(true); // Open the modal
        })
        .catch((error) => {
          console.error("Error fetching shift details:", error);
        });
    },
    [UrlLink] // Dependencies for useCallback
  );
  const handleShowCompleteDetails = (params) => {
    console.log("completeshift", params.Employee_Id);
    const employeeID = params.Employee_Id;
    const location = userRecord?.location;
    setOpenShiftDetailsCompleteModal(true);
    if (params.Employee_Id && userRecord?.location) {
      const apiUrl = `${UrlLink}HR_Management/Employee_Complete_ShiftDetails_Link?employeeid=${employeeID}&location=${location}`;
      axios
        .get(apiUrl)
        .then((response) => {
          console.log("Shift complete details response:", response.data);
          if (response.data) {
            setCompleteShiftData(response.data); // Update shift data state
          } else {
            setCompleteShiftData([]); // Handle empty response
          }
          setOpenShiftDetailsCompleteModal(true); // Open the modal
        })
        .catch((error) => {
          console.error("Error fetching shift details:", error);
        });
    }
  };
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const getStartAndEndOfWeek = (year, week) => {
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay(); // Get the day of the week of Jan 1
    const startOfWeek = new Date(
      year,
      0,
      1 + (week - 1) * 7 - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    );

    // Add 6 days to get the end of the week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
      start: formatDate(startOfWeek),
      end: formatDate(endOfWeek),
    };
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    if (value) {
      setWeek(value);
      const [year, weekNumber] = value.split("-W");
      const { start, end } = getStartAndEndOfWeek(
        year,
        parseInt(weekNumber, 10)
      );

      console.log(`Start of week: ${start}`);
      console.log(`End of week: ${end}`);

      setstartdate(start);
      setenddate(end);
    }
  };

  const handleShiftNameChange = (e) => {
    const selectedShiftId = e.target.value; // Get the selected shift name
    console.log(selectedShiftId);
    console.log(currentshifts);
    const selectedShift = currentshifts.find(
      (shift) => shift.ShiftName === selectedShiftId
    ); // Ensure type matches
    console.log(selectedShift);
    if (selectedShift) {
      setShiftDetails((prevDetails) => ({
        ...prevDetails,
        shiftName: selectedShiftId,
        intime: selectedShift?.StartTime || "", // Default to empty string if undefined
        outtime: selectedShift?.EndTime || "", // Default to empty string if undefined
        Shift_Id: selectedShift?.ShiftId || "", // Default to empty string if undefined
      }));
    } else {
      // If no matching shift is found, reset the shift times to empty strings
      setShiftDetails((prevDetails) => ({
        ...prevDetails,
        shiftName: selectedShiftId,
        intime: "",
        outtime: "",
        Shift_Id: "",
      }));
    }
  };

  console.log(shiftDetails);
  const updateShiftDetails = (e) => {
    const { name, value } = e.target;
    setShiftDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleShiftSubmit = () => {
    if (bulkAssign) {
      if (shiftDetails.Shiftstartdate && shiftDetails.Shiftenddate) {
        const newdata = {
          ...shiftDetails,
          selectedEmployees,
          bulkAssign,
          Create_by: userRecord?.username || "",
          Location_Name: userRecord?.location || "",
          openRow,
          Status1: shiftDetails?.Status,
        };
        axios
          .post(`${UrlLink}HR_Management/Shift_Details_link`, newdata)
          .then((res) => {
            if (res.data.errors) {
              const errorMessages = res.data.errors
                .map((error) =>
                  Object.entries(error).map(
                    ([key, value]) => `${key}: ${value}`
                  )
                )
                .join("\n");
              dispatch({
                type: "toast",
                value: { message: errorMessages, type: "warn" },
              });
            } else {
              dispatch({
                type: "toast",
                value: {
                  message: "All shifts added successfully",
                  type: "success",
                },
              });
              resetFormState();
            }
          })
          .catch((err) => console.error(err));
      } else {
        dispatch({
          type: "toast",
          value: {
            message: "Please provide both Shiftstartdate and Shiftenddate.",
            type: "warn",
          },
        });
      }
    } else {
      if (shiftDetails.Shiftstartdate && shiftDetails.Shiftenddate) {
        const data = {
          ...shiftDetails,
          Create_by: userRecord?.username || "",
          Location_Name: userRecord?.location || "",
          Employee: selectedRowData?.Employee_Id || "",
          bulkAssign: false,
        };
        console.log(data);
        axios
          .post(`${UrlLink}HR_Management/Shift_Details_link`, data)
          .then((res) => {
            if (res.data.error) {
              dispatch({
                type: "toast",
                value: { message: res.data.error, type: "warn" },
              });
            } else {
              dispatch({
                type: "toast",
                value: { message: "Shift added successfully", type: "success" },
              });
              resetFormState();
            }
          })
          .catch((err) => console.error(err));
      } else {
        dispatch({
          type: "toast",
          value: {
            message: "Please provide both Shiftstartdate and Shiftenddate.",
            type: "warn",
          },
        });
      }
    }
  };

  const resetFormState = () => {
    setShiftDetails({
      intime: "",
      outtime: "",
      Shiftstartdate: "",
      Shiftenddate: "",
      Status: "Active",
      shiftName: "",
      Shift_Id: "",
    });
    // setcurrentshifts([]);
    setSelectedEmployees([]);
    setBulkAssign(false);
    setOpenModal(false);
    setRefresh((prev) => !prev);
  };

  const [searchOPParams, setsearchOPParams] = useState({
    query: "",
    designation: "",
  });

  const [Filterdata, setFilterdata] = useState([]);
  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchChangeStatus = (e) => {
    const { name, value } = e.target;
    setsearchOPParams({ ...searchOPParams, [name]: value });
  };

  console.log(Filterdata);

  useEffect(() => {
    if (SearchQuery !== "") {
      const lowerCaseQuery = SearchQuery.toLowerCase();

      const filteredData = PatientRegisterData.filter((row) => {
        const { Employee_Id, EmployeeName, PhoneNo, Designation } = row;
        return (
          (Employee_Id && Employee_Id.toLowerCase().includes(lowerCaseQuery)) ||
          (PhoneNo && PhoneNo.toLowerCase().includes(lowerCaseQuery)) ||
          (EmployeeName &&
            EmployeeName.toLowerCase().includes(lowerCaseQuery)) ||
          (Designation && Designation.toLowerCase().includes(lowerCaseQuery))
        );
      });

      setFilterdata(filteredData);
    } else {
      setFilterdata(PatientRegisterData);
    }
  }, [SearchQuery, PatientRegisterData]);

  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/Employee_DutyManagement_Details`, {
        params: searchOPParams,
      })
      .then((res) => {
        console.log(res);
        const ress = res.data;

        if (Array.isArray(ress)) {
          setPatientRegisterData(ress);
          setFilterdata(ress);
        } else {
          setPatientRegisterData([]);
          setFilterdata([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, searchOPParams, refresh]);

  const handleExportToExcel = () => {
    const paramsdata = {
      startdate: startdate,
      enddate: enddate,
      location: userRecord?.location,
    };
    axios

      .get(`${UrlLink}HR_Management/Shift_Details_Report`, {
        params: paramsdata,
      })

      .then((res) => {
        console.log(res);

        const { day_names, employee_shifts } = res.data;

        // Extract dates and day names for headers
        const dates = Object.keys(day_names);
        console.log("dates", dates);
        const headers = dates.map((date) => `${date} (${day_names[date]})`);
        console.log("headers", headers);

        // Prepare CSV columns
        const columns = ["SNo", "EmployeeID", "Staff", ...headers];

        // Prepare CSV rows
        let csvRows = [];
        let serialNo = 1;

        // Iterate over each employee and their shifts
        for (const [employeeId, shifts] of Object.entries(employee_shifts)) {
          // Initialize row with serial number, employee ID, and employee name
          const row = [serialNo++, employeeId];
          const shiftMap = {};
          let employeeName = "";

          // Populate the shiftMap with shift details and extract the employee name
          shifts.forEach((shift) => {
            shiftMap[shift.Date] = `${shift.ShiftName} (${shift.ShiftTime})`;
            employeeName = shift.EmployeeName; // EmployeeName should be the same for all shifts
          });

          // Add employee name to the row
          row.push(employeeName);

          // Add shift details to the row for each date header
          dates.forEach((date) => {
            row.push(shiftMap[date] || "");
          });

          csvRows.push(row);
        }

        // Create CSV content
        const header = columns.join(",");
        const csvContent = [
          "\ufeff" + header, // BOM + header row
          ...csvRows.map((row) => row.join(",")),
        ].join("\r\n");

        // Create Blob and save CSV file
        const blob = new Blob([csvContent], { type: "text/csv" });
        saveAs(blob, "WeeklyShiftDetails.csv");
        setWeek("");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleExportToPDF = () => {
    const paramsdata = {
      startdate: startdate,
      enddate: enddate,
      location: userRecord?.location,
    };
    axios

      .get(`${UrlLink}HR_Management/Shift_Details_Report`, {
        params: paramsdata,
      })

      .then((res) => {
        console.log(res);

        const { day_names, employee_shifts } = res.data;

        // Extract dates and day names for headers
        const dates = Object.keys(day_names);
        const headers = dates.map((date) => `${day_names[date]} (${date})`);

        // Prepare PDF columns
        const columns = ["SNo", "EmployeeID", "EmployeeName", ...headers];
        const rows = [];

        // Prepare PDF rows
        let serialNo = 1;

        // Convert employee_shifts object to an array and sort by EmployeeID
        const sortedEmployeeShifts = Object.entries(employee_shifts).sort(
          ([idA], [idB]) => idA.localeCompare(idB)
        );
        console.log(sortedEmployeeShifts);
        // Iterate over each employee and their shifts
        for (const [employeeId, shifts] of sortedEmployeeShifts) {
          const row = [serialNo++, employeeId];
          const shiftMap = {};
          let employeeName = "";
          // console.log(shifts)
          shifts.forEach((shift) => {
            shiftMap[
              shift.Date
            ] = `${shift.ShiftName}\n \n(${shift.ShiftTime})`;
            employeeName = shift.EmployeeName;
          });

          row.push(employeeName);
          console.log(shiftMap);
          dates.forEach((date) => {
            const shiftForDate = shiftMap[date] || "";
            row.push(shiftForDate);
          });

          rows.push(row);
        }

        // Create a PDF document with landscape orientation
        const doc = new jsPDF("l", "mm", "a4");

        // Set a fixed width for all columns
        const fixedColumnWidth = 30; // Adjust this value as needed

        // Define the maximum number of rows per page
        const maxRowsPerPage = 7;

        // Split the rows into chunks of maxRowsPerPage
        const chunks = [];
        for (let i = 0; i < rows.length; i += maxRowsPerPage) {
          chunks.push(rows.slice(i, i + maxRowsPerPage));
        }

        // Generate a table for each chunk of rows
        chunks.forEach((chunk, index) => {
          if (index > 0) {
            doc.addPage();
          }

          doc.autoTable({
            head: [columns],
            body: chunk,
            startY: 15,
            margin: { horizontal: 10 },
            theme: "striped",
            styles: {
              fontSize: 8, // Font size for table
              cellPadding: 4,
              minCellHeight: 10,
            },
            headStyles: {
              fillColor: [227, 189, 255], // Light blue color
              textColor: [0, 0, 0],
            },
            columnStyles: {
              0: { cellWidth: 15 }, // SNo
              1: { cellWidth: 28 }, // EmployeeID
              2: { cellWidth: 33 }, // EmployeeName
              // Apply the same width to all other columns
              ...columns.slice(3).reduce((acc, _, i) => {
                acc[i + 3] = { cellWidth: fixedColumnWidth };
                return acc;
              }, {}),
            },

            didDrawPage: function (data) {
              // Add title to each page
              doc.text(
                `Weekly Shift Details - ${startdate} To ${enddate}`,
                14,
                11
              );
            },
          });
        });
        setWeek("");

        // Save the PDF
        doc.save("WeeklyShiftDetails.pdf");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className="Main_container_app">
        <h3>Employee List</h3>

        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="input">
              Search by <span>:</span>
            </label>
            <input
              style={{
                width: "370px",
              }}
              type="text"
              name="employeeName"
              placeholder="Name or Id or PhoneNo or Designation"
              value={SearchQuery} // Use the correct state variable here
              onChange={handleSearchChange} // Call the handler on input change
              autoComplete="off"
            />
          </div>

          <div className="RegisForm_1">
            <label htmlFor="designation">
              Designation <span>:</span>
            </label>
            <select
              id="designation"
              name="designation"
              value={searchOPParams.designation}
              onChange={handleSearchChangeStatus}
              className="new-custom-input-phone wei32j"
              required
            >
              <option value="">Select</option>
              {Array.isArray(rolename) && rolename.length > 0 ? (
                rolename.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.Designation}
                  </option>
                ))
              ) : (
                <option disabled>No Option</option>
              )}
            </select>
          </div>
          <div className="inp_1">
            <label htmlFor="week">
              Select Week<span>:</span>
            </label>
            <input
              type="week"
              id="week"
              name="week"
              value={week}
              onChange={handleDateChange}
            />
          </div>
          <div className="Main_container_Btn">
            <div className="PrintExelPdf">
              <button onClick={handleExportToExcel}>Save Exel</button>
            </div>

            <div className="PrintExelPdf">
              <button onClick={handleExportToPDF}>Save pdf</button>
            </div>
          </div>
        </div>

        <div className="NewTest_Master_grid_M_head_M">
          <TableContainer className="NewTest_Master_grid_M">
            <Table className="dehduwhd_o8i">
              <TableHead>
                <TableRow>
                  <TableCell width={10} />
                  <TableCell width={50}>S.No</TableCell>
                  <TableCell width={400}>Department</TableCell>
                  <TableCell width={300}>Assigned Active Shifts</TableCell>
                  <TableCell width={150}>Employee Counts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(Filterdata) &&
                  Filterdata.map((row, index) => (
                    <React.Fragment key={index}>
                      <TableRow
                        style={{
                          backgroundColor:
                            index % 2 === 1
                              ? "var(--selectbackgroundcolor)"
                              : "white",
                        }}
                      >
                        <TableCell>
                          <span
                            aria-label="expand row"
                            onClick={() => toggleRow(row.Department_Id)}
                          >
                            {openRow === row.Department_Id ? (
                              <ArrowDropUpOutlinedIcon />
                            ) : (
                              <ArrowDropDownOutlinedIcon />
                            )}
                          </span>
                        </TableCell>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.Department_Name}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleviewDepartmentShifts(row)}
                          >
                            <Visibility />
                          </button>
                        </TableCell>
                        <TableCell>{row.Employee_Count}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={6}
                        >
                          <Collapse
                            in={openRow === row.Department_Id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ margin: 1 }}>
                              <div className="Main_container_app">
                                <div
                                  style={{
                                    width: "100%",
                                    display: "grid",
                                    placeItems: "center",
                                  }}
                                ></div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    fontFamily: "Nunito",
                                  }}
                                >
                                  <div style={{ width: "120px" }}>
                                    <label>
                                      Bulk Shift Assign
                                      <span
                                        style={{
                                          display: "flex",
                                          marginLeft: "15px",
                                        }}
                                      >
                                        :
                                      </span>
                                    </label>
                                  </div>
                                  <input
                                    type="radio"
                                    name={`bulkAssign-${row.Department_Id}`}
                                    value="yes"
                                    checked={bulkAssign}
                                    onChange={handleBulkAssignToggle}
                                  />
                                  Yes
                                  <input
                                    type="radio"
                                    name={`bulkAssign-${row.Department_Id}`}
                                    value="no"
                                    checked={!bulkAssign}
                                    onChange={handleBulkAssignToggle}
                                  />
                                  No
                                </div>
                                <ReactGrid
                                  columns={EmployeeListColumns(
                                    row.Employees,
                                    selectedEmployees,
                                    setSelectedEmployees
                                  )}
                                  RowData={row?.Employees}
                                />
                                {bulkAssign && (
                                  <button
                                    onClick={handleAssignBulkShifts}
                                    className="RegisterForm_1_btns"
                                  >
                                    Assign Shift
                                  </button>
                                )}
                              </div>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="NewList-export-buttons">
          <span>Row length </span>
          <span> : {Filterdata?.length}</span>
        </div>
        {/* <ReactGrid columns={EmployeeListColumns} RowData={Filterdata} /> */}

        {openModal && (
          <div className="loader" onClick={handleCloseModal}>
            <div className="cardModel" onClick={(e) => e.stopPropagation()}>
              <br />
              <div className="common_center_tag">
                <span>{selectedRowData?.Department_Name}</span>
                <span>Shift Assign To - {selectedRowData?.EmployeeName}</span>
              </div>

              <div className="RegisFormcon ">
                <div className="RegisForm_1 ">
                  <label>Shift Name:</label>
                  <select
                    type="text"
                    name="shiftName"
                    value={shiftDetails.shiftName}
                    onChange={handleShiftNameChange}
                  >
                    <option value="">Select</option>
                    {currentshifts.map((shift, index) => (
                      <option key={index} value={shift.id}>
                        {shift.ShiftName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {shiftDetails.shiftName && (
                <>
                  <div className="RegisFormcon ">
                    <div className="RegisForm_1 ">
                      <label>In Time:</label>
                      <input
                        type="time"
                        value={shiftDetails.intime}
                        onChange={updateShiftDetails}
                      />
                    </div>
                  </div>

                  <div className="RegisFormcon ">
                    <div className="RegisForm_1 ">
                      <label>Out Time:</label>
                      <input
                        type="time"
                        value={shiftDetails.outtime}
                        onChange={updateShiftDetails}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="RegisFormcon ">
                <div className="RegisForm_1 ">
                  <label>From Date:</label>
                  <input
                    type="date"
                    name="Shiftstartdate"
                    value={shiftDetails.Shiftstartdate}
                    onChange={updateShiftDetails}
                  />
                </div>
              </div>

              <div className="RegisFormcon ">
                <div className="RegisForm_1 ">
                  <label>To Date:</label>
                  <input
                    type="date"
                    name="Shiftenddate"
                    value={shiftDetails.Shiftenddate}
                    onChange={updateShiftDetails}
                  />
                </div>
              </div>

              <div className="RegisFormcon ">
                <div className="RegisForm_1 ">
                  <label>Status:</label>
                  <select
                    name="Status"
                    value={shiftDetails.Status}
                    onChange={updateShiftDetails}
                  >
                    <option value="Active">Active</option>
                    <option value="WeekOff">Week Off</option>
                    <option value="On leave">On leave</option>
                    <option value="Follow-up Duty">Follow-up Duty</option>
                  </select>
                </div>
              </div>

              <div className="Register_btn_con regster_btn_contsai">
                <button
                  className="RegisterForm_1_btns"
                  onClick={handleShiftSubmit}
                >
                  Submit
                </button>
                <button
                  className="RegisterForm_1_btns"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {OpenShiftDetailsModal && (
          <div
            className="loader"
            onClick={() => setOpenShiftDetailsModal(false)}
          >
            <div
              className="loader_register_roomshow"
              onClick={(e) => e.stopPropagation()}
            >
              <br />

              <div className="common_center_tag">
                <span>Shift Details</span>
              </div>
              <br />
              <br />
              <div>
                {ShiftData.length > 0 ? (
                  <ReactGrid columns={ShiftDataColumn} RowData={ShiftData} />
                ) : (
                  <div>No active shift details for the employee</div>
                )}
              </div>
            </div>
          </div>
        )}
        {OpenShiftDetailsCompleteModal && (
          <div
            className="loader"
            onClick={() => setOpenShiftDetailsCompleteModal(false)}
          >
            <div
              className="loader_register_roomshow"
              onClick={(e) => e.stopPropagation()}
            >
              <br />

              <div className="common_center_tag">
                <span> Complete Shift Details</span>
              </div>
              <br />
              <br />
              <div>
                {completeShiftData.length > 0 ? (
                  <ReactGrid
                    columns={ShiftDataColumn}
                    RowData={completeShiftData}
                  />
                ) : (
                  <div>No Complete shift details for the employee</div>
                )}
              </div>
            </div>
          </div>
        )}

        {OpenDepartmentShiftDetailsModal && (
          <div
            className="loader"
            onClick={() => setOpenDepartmentShiftDetailsModal(false)}
          >
            <div
              className="loader_register_roomshow"
              onClick={(e) => e.stopPropagation()}
            >
              <br />

              <div className="common_center_tag">
                <span>Shifts</span>
              </div>
              <br />
              <br />
              <div>
                {AssignedDeprtmentShifts.length > 0 ? (
                  <ReactGrid
                    columns={DepartmentShiftDataColumn}
                    RowData={AssignedDeprtmentShifts}
                  />
                ) : (
                  <div>No active shift details for the Department</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default EmployeeDutyManagement;
