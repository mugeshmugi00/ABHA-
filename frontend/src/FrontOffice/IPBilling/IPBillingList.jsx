import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import LoupeIcon from "@mui/icons-material/Loupe";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const IPBillingList = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [Filterdata, setFilterdata] = useState([]);
  const [SearchQuery, setSearchQuery] = useState({
    searchBy: "",
    Status: "Pending",
  });

  useEffect(() => {
    axios.get(`${UrlLink}Frontoffice/Get_IP_Billing_Details`, { params: { ...SearchQuery,location:UserData?.location } })
        .then((res) => {
            const ress = res.data;

            if (Array.isArray(ress)) {
              console.log('billllll',ress);
              
                setFilterdata(ress);
            } else {
                setFilterdata([]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}, [UrlLink, SearchQuery, UserData?.location]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlenewDocRegister = () => {
    dispatchvalue({ type: "IPBillingData", value: {type:'IP'} });
    dispatchvalue({ type: "OPBillingData", value: {} });
    navigate("/Home/OverAllQuickBilling");
  };

  const PatientOPRegisterColumns = [
    {
      key: "id",
      name: "ID",
    },
    {
      key: "Date",
      name: "Date",
    },
    {
      key: "PatientId",
      name: "Patient Id",
    },
    {
      key: "Patient_Name",
      name: "Patient Name",
    },
    {
      key: "PhoneNo",
      name: "PhoneNo",
    },
    {
      key: "Doctor_ShortName",
      name: "Doctor Name",
    },
    {
      key: "PatientCategory",
      name: "Patient Category",
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => {
        return params.row.Status === "Pending" ? (
          <Button
            className="cell_btn"
            onClick={() => HandleMovedatatobill(params.row)}
          >
            <ArrowForwardIcon className="check_box_clrr_cancell" />
          </Button>
        ) : (
          "No Action"
        );
      },
    },
  ];

  const HandleMovedatatobill = (params) => {
    console.log('IPBillingData',params);
    
    dispatchvalue({ type: "IPBillingData", value: params });
    dispatchvalue({ type: "OPBillingData", value: {} });
    navigate("/Home/QuickBilling");
  };

  return (
    <>
      <>
        <div className="Main_container_app">
          <h3>IP Billing Queue List</h3>
          <div className="search_div_bar">
            <div className=" search_div_bar_inp_1">
              <label htmlFor="">
                Search Here
                <span>:</span>
              </label>
              <input
                type="text"
                name="searchBy"
                value={SearchQuery.searchBy}
                placeholder="Patient ID or Name or PhoneNo "
                onChange={(e) => handleSearchChange(e)}
              />
            </div>
            <div className=" RegisForm_1">
              <label htmlFor="">
                Status
                <span>:</span>
              </label>
              <select
                id=""
                name="Status"
                value={SearchQuery.Status}
                onChange={handleSearchChange}
              >
                <option value="">Select</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button
              className="search_div_bar_btn_1"
              onClick={handlenewDocRegister}
              title="New Doctor Register"
            >
              <LoupeIcon />
            </button>
          </div>
          <ReactGrid columns={PatientOPRegisterColumns} RowData={Filterdata} />
        </div>
        <ToastAlert Message={toast.message} Type={toast.type} />
      </>
    </>
  );
};

export default IPBillingList;
