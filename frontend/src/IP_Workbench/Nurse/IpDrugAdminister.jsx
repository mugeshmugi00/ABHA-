import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import { ToastContainer } from "react-toastify";
import { format } from "date-fns";
import axios from "axios";
import Button from "@mui/material/Button";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

function CancelDrugDialog({
  open,
  onClose,
  onConfirm,
  cancelsenddata,
  setcancelsenddata,
}) {
  console.log(open, "ppiup");

  const handleConfirm = () => {
    // Call the onConfirm callback with the cancellation reason
    onConfirm(cancelsenddata);
    // Close the dialog
    onClose();
  };

  const handleClose = () => {
    setcancelsenddata(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Drug Stop Reason</DialogTitle>
      <DialogContent>
        <TextField
          label="Drug Stop Reason"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={cancelsenddata?.Reason}
          onChange={(e) =>
            setcancelsenddata((prev) => ({
              ...prev,
              Reason: e.target.value,
            }))
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

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
const IpDrugAdminister = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log("userRecord", userRecord);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );

  const [Remarks, setRemarks] = useState("");

  const [getdataa, setgetdataa] = useState(false);
  const [postdata, setpostdata] = useState([]);
  const [postdataSOS, setpostdataSOS] = useState(null);
  const [TabletShow, setTabletShow] = useState(null);
  const [TabletShowSOS, setTabletShowSOS] = useState(null);
  const [cancelsenddata, setcancelsenddata] = useState(null);
  const [OpenDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const showdown = TabletShow?.medicinedata.length || 0;
  const totalPages = Math.ceil(TabletShow?.medicinedata.length / 10);
  const [page1, setPage1] = useState(0);
  console.log("OpenDialog", OpenDialog, typeof OpenDialog);

  const showdown1 = TabletShowSOS?.length || 0;
  const totalPages1 = Math.ceil(TabletShowSOS?.length / 10);
  const handlePageChange = (params) => {
    setPage(params.page);
  };
  const handlePageChange1 = (params) => {
    setPage1(params.page);
  };
  const formatRailwayTime = (timeString) => {
    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(":");

    // Convert hours and minutes to numbers
    const hoursNum = parseInt(hours, 10);
    const minutesNum = parseInt(minutes, 10);

    // Convert to railway time (24-hour format)
    let formattedHours = hoursNum;
    let formattedMinutes = minutesNum;

    // Adjust hours and minutes if needed
    if (formattedHours < 10) {
      formattedHours = `0${formattedHours}`; // Add leading zero for single-digit hours
    }

    if (formattedMinutes < 10) {
      formattedMinutes = `0${formattedMinutes}`; // Add leading zero for single-digit minutes
    }

    // Return formatted time string
    return `${formattedHours}:${formattedMinutes}`;
  };


  useEffect(() => {
    if (IP_DoctorWorkbenchNavigation?.RegistrationId && UrlLink) {
      const dateecurrent = format(new Date(), "yyyy-MM-dd");
      axios
        .get(
          `${UrlLink}DrugAdminstrations/get_Drug_Administration_datas?Booking_Id=${IP_DoctorWorkbenchNavigation?.RegistrationId}&Date=${dateecurrent}`
        )
        .then((response) => {
          const data = response.data.Regular;

          console.log("data", data);
          // Function to convert time to AM/PM format
          // Function to convert time to AM/PM format
          const convertToAMPM = (time) => {
            const numTime = parseInt(time);
            return numTime >= 1 && numTime <= 11
              ? numTime + " AM"
              : numTime === 12
              ? "12 PM"
              : numTime === 0?
              '12 AM': numTime - 12 + " PM";
          };

          // Extract unique times from FrequencyTime arrays and convert them to AM/PM format
          const freqdata = [
            ...new Set(
              data?.flatMap((p) =>
                p.FrequencyIssued?.flatMap((r) => r.FrequencyIssued)
              )
            ),
          ]
            .map((time) => convertToAMPM(time))
            .sort((a, b) => {
              // Extract AM/PM and numerical value from time string
              const [aNum, aPeriod] = a.split(" ");
              const [bNum, bPeriod] = b.split(" ");

              // Compare periods (AM comes before PM)
              if (aPeriod !== bPeriod) {
                return aPeriod.localeCompare(bPeriod);
              }

              // If periods are the same, sort numerically
              return parseInt(aNum) - parseInt(bNum);
            });

          console.log("freqdata", freqdata);
          setTabletShowSOS(
            response.data.SOS?.map((p, indx) => ({ ...p, id: indx + 1 }))
          );
          console.log(response.data.SOS, "freqqq");
          setTabletShow({
            frequencyTime: freqdata,
            medicinedata: data.map((p, indx) => ({ ...p, id: indx + 1 })),
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [
    IP_DoctorWorkbenchNavigation,
    IP_DoctorWorkbenchNavigation?.Booking_Id,
    UrlLink,
    getdataa,
  ]);

  console.log("TabletShowSOS", TabletShowSOS);
  console.log("TabletShow", TabletShow);

  const handleInputChange = (e, sss, ddd) => {
    const tarval = e.target.checked;
    const ttt =
      ddd.split(" ")[1] === "PM" ? +ddd.split(" ")[0] + 12 : +ddd.split(" ")[0];
    const newrow = {
      ...sss,
      FrequencyIssued: ttt,
    };

    if (tarval) {
      setpostdata((prev) => [...prev, newrow]);
    } else {
      const existdata = postdata.filter((p) => {
        // Check if any key-value pair in p matches the corresponding key-value pair in newrow
        return Object.entries(newrow).some(([key, value]) => p[key] !== value);
      });

      setpostdata(existdata);
    }
    setpostdataSOS(null);
    console.log("newrow", newrow);
  };

  const handleSubmit = () => {
    if (postdata.length > 0 || postdataSOS) {
      const formattedTime = format(new Date(), "HH:mm:ss");
      const formattednewdate = format(new Date(), "yyyy-MM-dd");
      let postrewss;
      if (postdata.length > 0) {
        postrewss = postdata.map((p) => ({
          ...p,
          FrequencyIssued: p.FrequencyIssued,
          Remarks: Remarks,
          Completed_Date: formattednewdate,
          Completed_Time: formattedTime,
          Quantity: 1,
          Capturedby: userRecord?.username,
          Location: userRecord?.location,
          Booking_Id: IP_DoctorWorkbenchNavigation?.RegistrationId,
        }));
      } else {
        postrewss = [postdataSOS];
      }

      console.log("postrewss", postrewss);

      axios
        .post(
          `${UrlLink}DrugAdminstrations/insert_Drug_Administration_nurse_frequencywise_datas`,
          postrewss
        )
        .then((response) => {
          console.log(response);
          setTabletShow(null);
          setgetdataa(!getdataa);
          setRemarks("");
          setpostdataSOS(null);
          setpostdata([]);
          const checkboxes = document.querySelectorAll(".myCheckbox_Frequency");

          checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleissusesos = (prams) => {
    console.log(prams);
    const now = new Date();
    const formattedTime = format(now, "HH:mm:ss");
    const newdate = format(new Date(), "yyyy-MM-dd");
    setpostdataSOS({
      ...prams,
      Completed_Time: formattedTime,
      Completed_Date: newdate,
      Quantity: 1,
      Remarks: "",
      Capturedby: userRecord?.username,
      Location: userRecord?.location,
      Booking_Id: IP_DoctorWorkbenchNavigation?.Booking_Id,
    });
    // Select all checkbox inputs with the class name 'myCheckbox_Frequency'
    const checkboxes = document.querySelectorAll(".myCheckbox_Frequency");

    // Iterate over each checkbox and uncheck it
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    setpostdata([]);
  };
  const formatLabel = (label) => {
    // Check if the label contains both uppercase and lowercase letters, and doesn't contain numbers
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between lowercase and uppercase letters
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
    } else {
      return label;
    }
  };

  function getTextWidth(text) {
    // Create a dummy element to measure text width
    const dummyElement = document.createElement("span");
    dummyElement.textContent = text;
    dummyElement.style.visibility = "hidden";
    dummyElement.style.whiteSpace = "nowrap";
    document.body.appendChild(dummyElement);

    // Get the width of the text
    const width = dummyElement.offsetWidth;

    // Remove the dummy element
    document.body.removeChild(dummyElement);

    return width;
  }
  const handleCancelAppointment = () => {
    const requiredfields = [...Object.keys(cancelsenddata)];
    const existing = requiredfields.filter((field) => !cancelsenddata[field]);

    if (existing.length > 0) {
      alert(`Please fill the Required Fields for ${existing.join(",")}`);
    } else {
      const confirmation = window.confirm(
        "Are you sure you want to Stop the Drug ?."
      );
      console.log(confirmation);

      if (confirmation) {
        axios
          .post(
            `${UrlLink}ipregistration/cancel_drug_administration`,
            cancelsenddata
          )
          .then((response) => {
            console.log(response.data);
            setgetdataa(!getdataa);
          })
          .catch((error) => {
            console.log(error);
          });
        setOpenDialog(false);
        setcancelsenddata(null);
      } else {
        setOpenDialog(false);
        setcancelsenddata(null);
      }
    }
  };
  const handlestopDrug = (params) => {
    const senddata = {
      Booking_Id: IP_DoctorWorkbenchNavigation?.Booking_Id,
      Prescibtion_Id: params?.Prescibtion_Id,
      Reason: "",
      Stopped_date: format(new Date(), "yyyy-MM-dd"),
      Stopped_time: format(new Date(), "HH:mm:ss"),
      CapturedBy: userRecord?.username,
    };

    setcancelsenddata(senddata);
    setOpenDialog(true);
    console.log("---------", senddata);
  };
  const dynamicColumns = [
    {
      field: "id",
      headerName: "S_No",
      width: 40,
    },
    ...["Date", "Department", "DoctorName", "MedicineName", "Instruction"].map(
      (labelname, index) => {
        const formattedLabel = formatLabel(labelname);
        const labelWidth = getTextWidth(formattedLabel);

        return {
          field: labelname,
          headerName: formattedLabel,
          width: ["Instruction", "Date"].find((f) => f === labelname)
            ? labelWidth + 100
            : labelWidth + 30,
          valueGetter: (params) => {
            const value = params.row[labelname];
            return value ? value : "-";
          },
        };
      }
    ),
    {
      field: "Action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => handleissusesos(params.row)}
          >
            <EditIcon />
          </Button>
        </>
      ),
    },
  ];

  //   const dynamicColumns1 = () => {
  //     const dataaa = [
  //       "PrescribedDate",
  //       "CurrentDate",
  //       "Department",
  //       "DoctorName",
  //       "MedicineName",
  //       "FrequencyType",
  //       "Instruction",
  //       ...(Array.isArray(TabletShow?.frequencyTime) ? TabletShow.frequencyTime : []),
  //     ];

  //     return [
  //       {
  //         key: "id",
  //         name: "S_No",
  //       },
  //       ...dataaa.map((labelname, index) => {
  //         const formattedLabel = formatLabel(labelname);

  //         return {
  //           key: labelname,
  //           name: formattedLabel,
  //           renderCell: (params) => {
  //             const staticFields = [
  //               "PrescribedDate",
  //               "CurrentDate",
  //               "Department",
  //               "DoctorName",
  //               "MedicineName",
  //               "FrequencyType",
  //               "Instruction",
  //             ];

  //             const checkval = !staticFields.includes(labelname.split(" ")[0]);

  //             if (checkval) {
  //               const newwtime = labelname.split(" ");
  //               let ttt = 0;

  //               if (newwtime[1] === "PM") {
  //                 ttt = +newwtime[0] + 12;
  //               } else if (+newwtime[0] === 12 && newwtime[1] === "AM") {
  //                 ttt = 0;
  //               } else {
  //                 ttt = +newwtime[0];
  //               }

  //               const med = params.row;

  //               if (Array.isArray(med.FrequencyIssued)) {
  //                 // Find the issued frequency matching the current time (ttt)
  //                 const frequencyEntry = med.FrequencyIssued.find(
  //                   (f) => +f.FrequencyIssued === ttt
  //                 );

  //                 if (frequencyEntry) {
  //                   const { Status } = frequencyEntry;

  //                   switch (Status) {
  //                     case "Pending":
  //                       return (
  //                         <input
  //                           className="myCheckbox_Frequency"
  //                           type="checkbox"
  //                           onChange={(e) => handleInputChange(e, med, labelname)}
  //                         />
  //                       );
  //                     case "Issued":
  //                       return (
  //                         <span className="check_box_clrr">
  //                           <CheckCircleIcon className="check_box_clrr_1" />
  //                         </span>
  //                       );
  //                     case "Before":
  //                       return (
  //                         <span className="check_box_clrr">
  //                           <CheckCircleIcon className="check_box_clrr_2" />
  //                         </span>
  //                       );
  //                     case "Delay":
  //                       return (
  //                         <span className="check_box_clrr">
  //                           <CheckCircleIcon className="check_box_clrr_3" />
  //                         </span>
  //                       );
  //                     case "NotIssued":
  //                       return (
  //                         <span className="check_box_clrr">
  //                           <StopCircleIcon className="check_box_clrr_4" />
  //                         </span>
  //                       );
  //                     default:
  //                       return (
  //                         <span className="check_box_clrr">
  //                           <BlockIcon className="check_box_clrr_5" />
  //                         </span>
  //                       );
  //                   }
  //                 } else {
  //                   return "-"; // If no matching time slot found in FrequencyIssued
  //                 }
  //               } else {
  //                 return "-"; // If FrequencyIssued is not an array or doesn't exist
  //               }
  //             } else {
  //               return params.value; // For static fields, return the value directly
  //             }
  //           },
  //         };
  //       }),
  //       {
  //         key: "Action",
  //         name: "Action",
  //         renderCell: (params) => (
  //           <Button className="cell_btn" onClick={() => handlestopDrug(params.row)}>
  //             <CancelIcon className="check_box_clrr_cancell" />
  //           </Button>
  //         ),
  //       },
  //     ];
  //   };

  // const dynamicColumns1 = () => {
  //   const staticFields = [
  //     { key: "id", name: "S_No" },
  //     { key: "PrescribedDate", name: "Prescribed Date" },
  //     { key: "CurrentDate", name: "Current Date" },
  //     { key: "Department", name: "Department" },
  //     { key: "DoctorName", name: "Doctor Name" },
  //     { key: "MedicineName", name: "Medicine Name" },
  //     { key: "FrequencyType", name: "Frequency Type" },
  //     { key: "Instruction", name: "Instruction" },
  //   ];
  
  //   const dynamicFields = (
  //     Array.isArray(TabletShow?.frequencyTime) ? TabletShow.frequencyTime : []
  //   ).map((labelname) => {
  //     const formattedLabel = formatLabel(labelname);
  
  //     return {
  //       key: labelname,
  //       name: formattedLabel,
  //       renderCell: (params) => {
  //         const [time, period] = labelname.split(" ");
  //         let ttt = period === "PM" && time !== "12" ? +time + 12 : +time;
  
  //         const med = params.row;
  //         if (Array.isArray(med.FrequencyIssued)) {
  //           const frequencyEntry = med.FrequencyIssued.find(
  //             (f) => f.FrequencyIssued === ttt
  //           );
  
  //           if (frequencyEntry) {
  //             const { Status } = frequencyEntry;
  
  //             const statusColorMap = {
  //               Pending: "blue",
  //               Issued: "green",
  //               Before: "orange",
  //               Delay: "pink",
  //               NotIssued: "red",
  //             };
  
  //             return (
  //               <span>
  //                 {Status === "Pending" ? (
  //                   <input
  //                     className="myCheckbox_Frequency"
  //                     type="checkbox"
  //                     onChange={(e) => handleInputChange(e, med, labelname)}
  //                   />
  //                 ) : Status === "Issued" ? (
  //                   <CheckCircleIcon style={{ color: statusColorMap[Status] }} />
  //                 ) : Status === "Before" ? (
  //                   <CheckCircleIcon style={{ color: statusColorMap[Status] }} />
  //                 ) : Status === "Delay" ? (
  //                   <CheckCircleIcon style={{ color: statusColorMap[Status] }} />
  //                 ) : (
  //                   <StopCircleIcon style={{ color: statusColorMap[Status] }} />
  //                 )}
  //               </span>
  //             );
  //           } else {
  //             return "-";
  //           }
  //         } else {
  //           return "-";
  //         }
  //       },
  //     };
  //   });
  
  //   const actionField = {
  //     key: "Action",
  //     name: "Action",
  //     renderCell: (params) => (
  //       <Button className="cell_btn" onClick={() => handlestopDrug(params.row)}>
  //         <CancelIcon className="check_box_clrr_cancell" />
  //       </Button>
  //     ),
  //   };
  
  //   return [...staticFields, ...dynamicFields, actionField];
  // };

  const dynamicColumns1 = () => {
    const staticFields = [
      { key: "id", name: "S_No" },
      { key: "PrescribedDate", name: "Prescribed Date" },
      { key: "CurrentDate", name: "Current Date" },
      { key: "Department", name: "Department" },
      { key: "DoctorName", name: "Doctor Name" },
      { key: "MedicineName", name: "Medicine Name" },
      { key: "FrequencyType", name: "Frequency Type" },
      { key: "Instruction", name: "Instruction" },
    ];
  
    const dynamicFields = (Array.isArray(TabletShow?.frequencyTime) ? TabletShow.frequencyTime : []).map((labelname) => {
      const formattedLabel = formatLabel(labelname);
  
      return {
        key: labelname,
        name: formattedLabel,
        renderCell: (params) => {
          const [time, period] = labelname.split(" ");
          let ttt = 0;
  
          // Time conversion logic for AM/PM
          if (period === "PM" && time !== "12") {
            ttt = +time + 12;
          } else if (period === "AM" && time === "12") {
            ttt = 0;
          } else {
            ttt = +time;
          }
  
          const med = params.row;
  
          if (Array.isArray(med.FrequencyIssued)) {
            const frequencyEntry = med.FrequencyIssued.find(
              (f) => +f.FrequencyIssued === ttt
            );
  
            if (frequencyEntry) {
              const { Status } = frequencyEntry;
              console.log('Status', Status);
  
              // Define a map for status to color
              const statusColorMap = {
                "Pending": 'blue',   // Example color for Pending
                "Issued": 'green',
                "Before": 'orange',
                "Delay": 'pink',
                "NotIssued": 'red'
              };
  
              return (
                <span>
                  {statusColorMap[Status] ? (
                    <span style={{ color: statusColorMap[Status] }}>
                      {Status === "Pending" ? (
                        <input
                          className="myCheckbox_Frequency"
                          type="checkbox"
                          onChange={(e) => handleInputChange(e, med, labelname)}
                        />
                      ) : (
                        <span>
                          {Status === "Issued" && (
                            <CheckCircleIcon style={{ color: statusColorMap[Status] }} />
                          )}
                          {Status === "Before" && (
                            <CheckCircleIcon style={{ color: statusColorMap[Status] }} />
                          )}
                          {Status === "Delay" && (
                            <CheckCircleIcon style={{ color: statusColorMap[Status] }} />
                          )}
                          {Status === "NotIssued" && (
                            <StopCircleIcon style={{ color: statusColorMap[Status] }} />
                          )}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="check_box_clrr">
                      <BlockIcon style={{ color: 'grey' }} />
                    </span>
                  )}
                </span>
              );
            } else {
              return "-"; // No matching time slot found
            }
          } else {
            return "-"; // FrequencyIssued is not an array or doesn't exist
          }
        },
      };
    });
  
    const actionField = {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button className="cell_btn" onClick={() => handlestopDrug(params.row)}>
          <CancelIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    };
  
    return [...staticFields, ...dynamicFields, actionField];
  };

  
  return (
    <>
      <ToastContainer />
      {TabletShow && TabletShow?.medicinedata.length !== 0 && (
        <>
          <div className="Add_items_Purchase_Master">
            <span>Regular Medicines</span>
          </div>
          {/* <div class="qwertyuio">
            <div className="IP_grid">
              <ThemeProvider theme={theme}>
                <div className="IP_grid_1">
                  <DataGrid
                    rows={TabletShow?.medicinedata.slice(
                      page * pageSize,
                      (page + 1) * pageSize
                    )} // Display only the current page's data
                    columns={dynamicColumns1()} // Use dynamic columns here
                    pageSize={10}
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
                    className="Ip_data_grid"
                  />
                  {showdown > 0 && TabletShow?.medicinedata.length > 10 && (
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
              {showdown !== 0 && TabletShow.medicinedata.length !== 0 ? null : (
                <div className="IP_norecords">
                  <span>No Records Found</span>
                </div>
              )}
            </div>

            
          </div> */}

          <ReactGrid
            columns={dynamicColumns1()}
            RowData={TabletShow?.medicinedata}
          />

          <div className="RegisForm_1">
            <label>
              Remarks <span>:</span>
            </label>

            <textarea
              value={Remarks}
              placeholder="Maximum 150 words"
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <div style={{ display: "grid", placeItems: "center", width: "100%" }}>
            <button className="btn-add" onClick={handleSubmit}>
              Save
            </button>
          </div>
        </>
      )}
      {TabletShowSOS && TabletShowSOS.length > 0 && (
        <>
          <div className="Add_items_Purchase_Master">
            <span>SOS Medicines</span>
          </div>
          {/* <div class="qwertyuio">
            <div className="IP_grid">
              <ThemeProvider theme={theme}>
                <div className="IP_grid_1">
                  <DataGrid
                    rows={TabletShowSOS.slice(
                      page1 * pageSize,
                      (page1 + 1) * pageSize
                    )} // Display only the current page's data
                    columns={dynamicColumns} // Use dynamic columns here
                    pageSize={10}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 10,
                        },
                      },
                    }}
                    pageSizeOptions={[10]}
                    onPageChange={handlePageChange1}
                    hideFooterPagination
                    hideFooterSelectedRowCount
                    className="Ip_data_grid"
                  />
                  {showdown1 > 0 && TabletShowSOS?.length > 10 && (
                    <div className="IP_grid_foot">
                      <button
                        onClick={() =>
                          setPage1((prevPage) => Math.max(prevPage - 1, 0))
                        }
                        disabled={page1 === 0}
                      >
                        Previous
                      </button>
                      Page {page1 + 1} of {totalPages1}
                      <button
                        onClick={() =>
                          setPage1((prevPage) =>
                            Math.min(prevPage + 1, totalPages1 - 1)
                          )
                        }
                        disabled={page1 === totalPages1 - 1}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </ThemeProvider>
              
      
              {showdown1 !== 0 && TabletShowSOS.length !== 0 ? null : (
                <div className="IP_norecords">
                  <span>No Records Found</span>
                </div>
              )}
            </div>
            {postdataSOS && (
              <>
                <div className="Total_input_container" style={{ width: "70%" }}>
                  <div className="inp_container_all_intakeoutput">
                    <label>
                      Time <span>:</span>
                    </label>
                    <input
                      type="time"
                      value={postdataSOS?.Completed_Time}
                      onChange={(e) =>
                        setpostdataSOS((prev) => ({
                          ...prev,
                          Completed_Time: formatRailwayTime(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="inp_container_all_intakeoutput">
                    <label>
                      Date <span>:</span>
                    </label>
                    <input
                      type="date"
                      value={postdataSOS?.Completed_Date}
                      onChange={(e) =>
                        setpostdataSOS((prev) => ({
                          ...prev,
                          Completed_Date: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="inp_container_all_intakeoutput">
                    <label>
                      Quantity <span>:</span>
                    </label>
                    <input
                      type="number"
                      onKeyDown={blockInvalidChar}
                      value={postdataSOS?.Quantity}
                      readOnly
                      onChange={(e) =>
                        setpostdataSOS((prev) => ({
                          ...prev,
                          Quantity: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="inp_container_all_intakeoutput">
                    <label>
                      Remarks <span>:</span>
                    </label>

                    <textarea
                      value={postdataSOS?.Remarks}
                      placeholder="Maximum 150 words"
                      onChange={(e) =>
                        setpostdataSOS((prev) => ({
                          ...prev,
                          Remarks: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "100%",
                  }}
                >
                  <button className="btn-add" onClick={handleSubmit}>
                    Save
                  </button>
                </div>
              </>
            )}
          </div> */}
        </>
      )}
      <CancelDrugDialog
        open={OpenDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleCancelAppointment}
        setcancelsenddata={setcancelsenddata}
        cancelsenddata={cancelsenddata}
      />
    </>
  );
};

export default IpDrugAdminister;
