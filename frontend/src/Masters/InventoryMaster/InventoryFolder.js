import React, { useState, useEffect } from "react";
import InventoryLocation from "./InventoryLocation";
import Medicine_rack_Master from "./Medicine_rack_Master";
import Productcategory from "./Productcategory";
import InventorySubMasters from "./InventorySubMasters";
import ProductMasterList from "./ProductMasterList";
import TrayManagementList from "./TrayManagementList";
import SupplierMasterList from "./SupplierMasterList";
import MedicalStockInsertmaster from "./MedicalStockInsertmaster";
import PurchaseOrderList from "../../Inventory/PurchaseOrder/PurchaseOrderList";
import GoodsReceiptNoteList from "../../Inventory/GRN/GoodsReceiptNoteList";
import QuickGoodsRecieptNote from "../../Inventory/GRN/QuickGoodsRecieptNote";
import SerialNoQuelist from "../../Inventory/SerialNoForProduct/SerialNoQuelist";
import SerialNoReport from "../../Inventory/SerialNoForProduct/SerialNoReport";
import ItemMinimumMaximum from "../../Inventory/ItemMinimumMaximumQty/ItemMinimumMaximum";
import OldGrnQueList from "../../Inventory/GRN/OldGrnQueList";
import SupplierPayList from "../../Inventory/SupplierPay/SupplierPayList";
import SupplierPaidList from "../../Inventory/SupplierPay/SupplierPaidList";
import IndentRaiseList from "../../Inventory/Indent/Raise/IndentRaiseList";
import IndentIssueList from "../../Inventory/Indent/Issue/IndentIssueList";
import StockList from "../../Inventory/StockDetials/StockList";
import PurchaseReturnList from "../../Inventory/PurchaseReturn/PurchaseReturnList";
import ItemwisePurchaseOrder from "../../Inventory/PurchaseOrder/ItemwisePurchaseOrder";
import IndentRecieveList from "../../Inventory/Indent/Recieve/IndentRecieveList";

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const InventoryFolder = () => {

   const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 
    const dispatchvalue = useDispatch()
    
  const [activeFolder, setActiveFolder] = useState("InventoryLocation");
  const [showFolders, setShowFolders] = useState(false);


  const UserData = useSelector(state => state.userRecord?.UserData)
            
  const [subAccess, setSubAccess] = useState([])
    
  useEffect(() => {
    console.log(UserData, 'UserData')

    if (UserData) {
      
      const setAccess2 =
        (UserData.AccessTwo &&
          UserData.AccessTwo.split(',').map(item => item.trim())) ||
        []

      setSubAccess(setAccess2) // Update state for sub access
    }
  }, [UserData]) // Dependency array
         

 const handleFolderClick = (folderName) => {
    setActiveFolder(folderName); // Update the state to show the clicked folder's content
    dispatchvalue({ type: "showMenu", value: false }); // Close menu on folder click
  };
  // Trigger folder boxes animation when the component mounts
  // useEffect(() => {
  //   setShowFolders(true);
  // }, []);
  useEffect(() => {
    console.log(activeHrFolder, 'activeHrFolder');

    if (activeHrFolder !== "") {
      setActiveFolder(activeHrFolder)
      dispatchvalue({ type: 'HrFolder', value: '' })
    }
    setShowFolders(true);
  }, [activeHrFolder]);

  const renderFolderContent = () => {
    switch (activeFolder) {
      case "InventoryLocation":
        return <InventoryLocation />;
      case "Medicine_rack_Master":
        return <Medicine_rack_Master />;
      case "Productcategory":
        return <Productcategory />;
      case "InventorySubMasters":
        return <InventorySubMasters />;
      case "ProductMasterList":
        return <ProductMasterList />;
      case "MedicalStockInsertmaster":
        return <MedicalStockInsertmaster />;
      case "TrayManagementList":
        return <TrayManagementList />;
      case "SupplierMasterList":
        return <SupplierMasterList />;
      case "PurchaseOrderList":
        return <PurchaseOrderList />;
      case "ItemwisePurchaseOrder":
        return <ItemwisePurchaseOrder />;
      case "GoodsReceiptNoteList":
        return <GoodsReceiptNoteList />;
      case "QuickGoodsRecieptNote":
        return <QuickGoodsRecieptNote />;
      case "SerialNoQuelist":
        return <SerialNoQuelist />;
      case "SerialNoReport":
        return <SerialNoReport />;
      case "ItemMinimumMaximum":
        return <ItemMinimumMaximum />;
      case "OldGrnQueList":
        return <OldGrnQueList />;
      case "SupplierPayList":
        return <SupplierPayList />;
      case "SupplierPaidList":
        return <SupplierPaidList />;
      case "IndentRaiseList":
        return <IndentRaiseList />;
      case "IndentIssueList":
        return <IndentIssueList />;
      case "IndentRecieveList":
        return <IndentRecieveList />;
      case "StockList":
        return <StockList />;
      case "PurchaseReturnList":
        return <PurchaseReturnList />;
      
      default:
        return null;
    }
  };
  return (
    <div className="folder-container">
      {/* <h2>Inventory Master</h2> */}
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

     {showMenu && subAccess.includes('K11-1') && (
        <div  onClick={() => handleFolderClick("InventoryLocation")}
              className="folder-box" > Inventory Location </div>
      )}

     {showMenu && subAccess.includes('K11-2') && (

        <div  onClick={() => handleFolderClick("Medicine_rack_Master")}
              className="folder-box" > Medicine Rack Master </div>
      )}


     {showMenu && subAccess.includes('K11-7') && (


      <div  onClick={() => handleFolderClick("TrayManagementList")}
            className="folder-box" > Tray Management</div>

      )}


     {showMenu && subAccess.includes('K11-3') && (

          <div  onClick={() => handleFolderClick("Productcategory")}
              className="folder-box" > Product Category</div>
      )}

 {showMenu && subAccess.includes('K11-4') && (
        
        <div  onClick={() => handleFolderClick("InventorySubMasters")}
              className="folder-box" > Product Field Master</div>
)}

 {showMenu && subAccess.includes('K11-5') && (


        <div  onClick={() => handleFolderClick("ProductMasterList")}
              className="folder-box" > Product Master</div>
)}


 {showMenu && subAccess.includes('K11-8') && (


<div  onClick={() => handleFolderClick("SupplierMasterList")}
      className="folder-box" > Supplier Master</div>
)}






 {showMenu && subAccess.includes('K11-9') && (

        <div  onClick={() => handleFolderClick("PurchaseOrderList")}
              className="folder-box" > Purchase Order List</div>
)}


 {showMenu && subAccess.includes('K11-9') && (

<div  onClick={() => handleFolderClick("ItemwisePurchaseOrder")}
      className="folder-box" > Itemwise PurchaseOrder</div>
)}

 {showMenu && subAccess.includes('K11-10') && (

        
        <div  onClick={() => handleFolderClick("GoodsReceiptNoteList")}
              className="folder-box" > Goods Receipt Note List</div>
)}
 {showMenu && subAccess.includes('K11-11') && (


        <div  onClick={() => handleFolderClick("QuickGoodsRecieptNote")}
              className="folder-box" > Quick Goods Reciept Note</div>
)}



 {showMenu && subAccess.includes('K11-21') && (

<div  onClick={() => handleFolderClick("PurchaseReturnList")}
      className="folder-box" >Purchase Return List</div>
)}


 {showMenu && subAccess.includes('K11-15') && (

<div  onClick={() => handleFolderClick("OldGrnQueList")}
      className="folder-box" > Old GRN QueList</div>
)}



 {showMenu && subAccess.includes('K11-18') && (

<div  onClick={() => handleFolderClick("IndentRaiseList")}
      className="folder-box" >Indent Raise List</div>
)}
 {showMenu && subAccess.includes('K11-19') && (


<div  onClick={() => handleFolderClick("IndentIssueList")}
      className="folder-box" >Indent Issue List</div>
)}


 {showMenu && subAccess.includes('K11-19') && (


<div  onClick={() => handleFolderClick("IndentRecieveList")}
      className="folder-box" >Indent Recieve List</div>
)}



 {showMenu && subAccess.includes('K11-12') && (

        <div  onClick={() => handleFolderClick("SerialNoQuelist")}
              className="folder-box" > Serial Number Quelist</div>
)}

 {showMenu && subAccess.includes('K11-13') && (

        <div  onClick={() => handleFolderClick("SerialNoReport")}
              className="folder-box" > Serial Number Report</div>
)}

 {showMenu && subAccess.includes('K11-14') && (

        <div  onClick={() => handleFolderClick("ItemMinimumMaximum")}
              className="folder-box" > Item (Min-Max) List</div>
)}



 {showMenu && subAccess.includes('K11-16') && (


        <div  onClick={() => handleFolderClick("SupplierPayList")}
              className="folder-box" >Supplier Pay QueList</div>
)}

 {showMenu && subAccess.includes('K11-17') && (

        <div  onClick={() => handleFolderClick("SupplierPaidList")}
              className="folder-box" >Supplier Paid List</div>
)}


 {showMenu && subAccess.includes('K11-20') && (

<div  onClick={() => handleFolderClick("StockList")}
      className="folder-box" >Stock List</div>
)}



 {showMenu && subAccess.includes('K11-6') && (

       
<div  onClick={() => handleFolderClick("MedicalStockInsertmaster")}
className="folder-box" > Medical Stock</div>

)}





      </div>

      {renderFolderContent()}
    </div>
  );
};

export default InventoryFolder;
