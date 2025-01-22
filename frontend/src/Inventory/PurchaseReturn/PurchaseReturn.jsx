import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';


const PurchaseReturn = () => {
    
    const dispatchvalue = useDispatch();

    const navigate = useNavigate();
    
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const userRecord = useSelector((state) => state.userRecord?.UserData);

    const EdittData = useSelector((state) => state.Inventorydata?.PurchaseReturnList);
    
    // console.log('EdittData',EdittData);
    
    
    const[supplierArray,setsupplierArray]=useState([])

    const [LocationData, setLocationData] = useState([]);

    const [StoreData, setStoreData] = useState([])

    const[GRNDetailState,setGRNDetailState]=useState([])

    const[GRNItemState,setGRNItemState]=useState([])

    const[ReturnItemList,setReturnItemList]=useState([])

    // console.log('ReturnItemList',ReturnItemList);
    
    const[SupplierDetailes,setSupplierDetailes]=useState({
        ReturnDate:currentDate,
        SupplierCode:'',
        SupplierName:'',
        SupplierMailId: '',
        SupplierContactNumber: '',
        SupplierContactPerson: '',
        Location:'',
        StoreLocation:'',
    })

    const[ReturnItemState,setReturnItemState]=useState({
        GRNInvoiceNo:'',
        GRNDate:'',
        SupplierBillNo:'',
        SupplierBillDate:'',
        Reason:'',
        ItemCode:'',
        ItemName:'',

    })

    const [ReturnQtyState,setReturnQtyState]=useState({
        PurchaseAmount:'',
        AvailablePackQuantity:'',
        ReturnQuantity:'',
        ReturnPackQuantity:'',
        ReturnQuantityAmount:'',
        Remarks:'',
    })
  
    const [FinalState,setFinalState]=useState({
        ReturnTotalItem:'',
        ReturnTotalQuantity:'',
        ReturnTotalAmount:'',
    })

    const Clear_setReturnItemState=()=>{

        setReturnItemState({
            GRNInvoiceNo:'',
            GRNDate:'',
            SupplierBillNo:'',
            SupplierBillDate:'',
            Reason:'',
            ItemCode:'',
            ItemName:'',
        })

    }

    const Clear_setReturnQtyState=()=>{

        setReturnQtyState({
            PurchaseAmount:'',
            AvailablePackQuantity:'',
            ReturnQuantity:'',
            ReturnPackQuantity:'',
            ReturnQuantityAmount:'',
            Remarks:'',
        })
    }

    const clear_finalstate=()=>{

        setReturnItemList([])
        setFinalState({
            ReturnTotalItem:'',
            ReturnTotalQuantity:'',
            ReturnTotalAmount:'',
        })
    }
  
  
    const formatLabel = (label) => {

        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (str) => str.toUpperCase());
        } else {
            return label;
        }
    };


    useEffect(()=>{
        if(ReturnItemList && ReturnItemList.length !==0){

            let TotalQty = ReturnItemList.reduce((acc,item)=> acc + (+item.ReturnQuantity || 0),0)

            let TotalNetAmount =ReturnItemList.reduce((acc,item)=> acc + (+item.ReturnQuantityAmount || 0),0)

            setFinalState({
                ReturnTotalItem:ReturnItemList.length,
                ReturnTotalQuantity:TotalQty,
                ReturnTotalAmount:TotalNetAmount,
            })
        }
        else{
            setFinalState({
                ReturnTotalItem:'',
                ReturnTotalQuantity:'',
                ReturnTotalAmount:'',
            })
        }
    },[ReturnItemList])



    useEffect(()=>{
    axios.get(`${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierTwo=${true}`)
    .then((res)=>{
        console.log('pppp----',res.data);
        let Rdata=res.data
        if(Array.isArray(Rdata)){                       
            setsupplierArray(Rdata)
       
        }
    })
    .catch((err)=>{
        console.log(err);
        
    })


    axios.get(`${UrlLink}Masters/Location_Detials_link`)
    .then((res) => {
        const ress = res.data
        setLocationData(ress)
    })
    .catch((err) => {
        console.log(err);
    })

    },[UrlLink])
  
    useEffect(()=>{

        if(SupplierDetailes.Location && SupplierDetailes.Location !== ''){
    
                axios.get(`${UrlLink}Inventory/get_ward_store_detials_by_loc?Location=${SupplierDetailes.Location}&IsFromWardStore=${false}`)
                    .then((res) => {
                        const ress = res.data || []
                        setStoreData(ress)
    
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
      
      },[SupplierDetailes.Location])


      useEffect(()=>{

        if(SupplierDetailes?.SupplierCode !=='' && SupplierDetailes?.StoreLocation !==''){
        
            axios.get(`${UrlLink}Inventory/GRN_Details_GET_For_PurchseReturn?SupplierCode=${SupplierDetailes.SupplierCode}&StoreLocation=${SupplierDetailes.StoreLocation}`)
            .then((res)=>{
                console.log(res.data);     
                let data=res.data
                setGRNDetailState(data  && Array.isArray(data) ? data : [])           
            })
            .catch((err)=>{
                console.log(err);                
            })
        }

      },[SupplierDetailes.SupplierCode,SupplierDetailes.StoreLocation])

      useEffect(()=>{

        if(SupplierDetailes?.SupplierCode !=='' && SupplierDetailes?.StoreLocation !==''){
        
            axios.get(`${UrlLink}Inventory/GRN_Details_GET_For_PurchseReturn?SupplierCode=${SupplierDetailes.SupplierCode}&StoreLocation=${SupplierDetailes.StoreLocation}`)
            .then((res)=>{
                console.log(res.data);     
                let data=res.data
                setGRNDetailState(data  && Array.isArray(data) ? data : [])           
            })
            .catch((err)=>{
                console.log(err);                
            })
        }

      },[SupplierDetailes.SupplierCode,SupplierDetailes.StoreLocation])

      



      useEffect(()=>{

        if(ReturnItemState.GRNInvoiceNo !=='' && ReturnItemState.Reason !==''){
        axios.get(`${UrlLink}Inventory/GRN_Details_GET_For_PurchseReturn?GRNInvoiceNo=${ReturnItemState.GRNInvoiceNo}&Reason=${ReturnItemState.Reason}`)
            .then((res)=>{
                console.log(res.data);     
                let data=res.data
                setGRNItemState(data  && Array.isArray(data) ? data : [])           
            })
            .catch((err)=>{
                console.log(err);                
            })
        }
      },[ReturnItemState.GRNInvoiceNo,ReturnItemState.Reason])



    //   ------------


    useEffect(()=>{
        if(EdittData && Object.keys(EdittData).length !==0){
            console.log('EdittData',EdittData);
            
            setSupplierDetailes({
                // PurchaseReturnNumber:EdittData.id,
                ReturnDate:EdittData.ReturnDate,
                SupplierCode:EdittData.SupplierCode,
                SupplierName:EdittData.SupplierName,
                SupplierMailId:EdittData.SupplierMailId,
                SupplierContactNumber:EdittData.SupplierContactNumber,
                SupplierContactPerson: EdittData.SupplierContactPerson,
                Location:EdittData.Location_id,
                StoreLocation:EdittData.StoreLocation_id,
            })

            setFinalState({
                ReturnTotalItem:EdittData.ReturnTotalItem,
                ReturnTotalQuantity:EdittData.ReturnTotalQuantity,
                ReturnTotalAmount:EdittData.ReturnTotalAmount,
            })


            setReturnItemList(EdittData.Items?EdittData.Items:[])
        }
    },[EdittData])
    

      const Getsinglesupp = async (SupplierId) => {

        try {
            const res = await axios.get(`${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierId=${SupplierId}`);
            const result = res.data;
            if (result && Object.values(result).length !== 0) {
                // console.log('result-----', result);
                return result;
            }

        }
        catch (err) {
            console.log(err);
            return '';
        }

    }

    const HandleonchangeSupplierState = async (e)=>{
        
        const{name , value} = e.target;

        Clear_setReturnItemState()
        Clear_setReturnQtyState()
        clear_finalstate()

        if (name === 'SupplierCode'){
        
            setSupplierDetailes((prev)=>({
                ...prev,
                [name]:value,
                SupplierName:'',
                SupplierMailId: '',
                SupplierContactNumber: '',
                SupplierContactPerson: '',
                Location:'',
                StoreLocation:'',
            }))
            

        }
        else if (name === 'SupplierName'){

                setSupplierDetailes((prev)=>({
                    ...prev,
                    [name]:value,
                    SupplierCode:'',
                    SupplierMailId: '',
                    SupplierContactNumber: '',
                    SupplierContactPerson: '',
                    Location:'',
                    StoreLocation:'',
                }))            

        }
        else if(name === 'Location'){

            setSupplierDetailes((prev)=>({
                ...prev,
                [name]:value,
                StoreLocation:'',
                
            }))

        }
        else{
            setSupplierDetailes((prev)=>({
                ...prev,
                [name]:value,
            }))
        }

    }



    const HandelOnchaneItemState=(e)=>{
        const{name,value}=e.target
        Clear_setReturnQtyState()

        if (name === 'Reason'){

            setReturnItemState((prev)=>({
                GRNInvoiceNo: prev.GRNInvoiceNo,
                GRNDate:prev.GRNDate,
                SupplierBillNo:prev.SupplierBillNo,
                SupplierBillDate:prev.SupplierBillDate,
                [name]:value,
                ItemCode:'',
                ItemName: '',
            }))

        }
        else if(name === 'GRNInvoiceNo'){


          
            setReturnItemState({
                GRNInvoiceNo:value,
                GRNDate:'',
                SupplierBillNo:'',
                SupplierBillDate:'',
                Reason:'',
                ItemCode: '',
                ItemName: '',
            })
           
        }

        else if(name === 'ItemCode'){
                
        setReturnItemState((prev)=>({
            GRNInvoiceNo:prev.GRNInvoiceNo,
            GRNDate:prev.GRNDate,
            SupplierBillNo:prev.SupplierBillNo,
            SupplierBillDate:prev.SupplierBillDate,
            Reason:prev.Reason,
            [name]:value,
            ItemName:'',
        }))  
            
            
        }

        else if(name === 'ItemName'){
            
        setReturnItemState((prev)=>({
            GRNInvoiceNo:prev.GRNInvoiceNo,
            GRNDate:prev.GRNDate,
            SupplierBillNo:prev.SupplierBillNo,
            SupplierBillDate:prev.SupplierBillDate,
            Reason:prev.Reason,
            ItemCode:'',
            [name]:value,
        }))  
            
        }
        
        else{
            setReturnItemState((prev)=>({
                ...prev,
                [name]:value
            }))
        }

    }
  

    const HandelOnchaneReturnQty =(e)=>{
        const {name,value} =e.target;

       if (name === 'ReturnQuantity'){

        if (+value * +ReturnItemState?.PackQuantity > ReturnQtyState.AvailablePackQuantity)
        {
            const tdata = {
                message: `Return Quantity Greater than Available Quantity`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });

        }
        else{
            setReturnQtyState((prev)=>({
                ...prev,
                [name]:value,
                ReturnPackQuantity:+value * +ReturnItemState?.PackQuantity,
                ReturnQuantityAmount:(+value * +ReturnQtyState?.PurchaseAmount).toFixed(2),
            }))
        }

       }else{
        setReturnQtyState((prev)=>({
            ...prev,
            [name]:value,
        }))
       }
    }


    const handleSearchSupplierlist = async (conditions)=>{

        if (conditions === 'SupplierCode'){

            let find = supplierArray.find(ele =>ele.id === SupplierDetailes.SupplierCode);

            if (find){
                let getobj = await Getsinglesupp(SupplierDetailes.SupplierCode)


                setSupplierDetailes((prev)=>({
                    ...prev,
                    SupplierName:find.SupplierName,
                    SupplierMailId: getobj?.EmailAddress || '',
                    SupplierContactNumber: getobj?.ContactNumber || '',
                    SupplierContactPerson: getobj?.ContactPerson || '',
                    Location:'',
                    StoreLocation:'',
                }))
            }
            else{

                const tdata = {
                    message: `Supplier Was Not Found`,
                    type: 'warn',
                }
                dispatchvalue({ type: 'toast', value: tdata });

            }
        }

        else if (conditions === 'SupplierName'){

            let find = supplierArray.find(ele =>ele.SupplierName === SupplierDetailes.SupplierName);

            if (find){

                let getobj = await Getsinglesupp(find?.id)

                setSupplierDetailes((prev)=>({
                    ...prev,
                    SupplierCode:find.id,
                    SupplierMailId: getobj?.EmailAddress || '',
                    SupplierContactNumber: getobj?.ContactNumber || '',
                    SupplierContactPerson: getobj?.ContactPerson || '',
                    Location:'',
                    StoreLocation:'',
                }))
            }
            else{

                const tdata = {
                    message: `Supplier Was Not Found`,
                    type: 'warn',
                }
                dispatchvalue({ type: 'toast', value: tdata });

            }

        }
        
    }


    const handleSearchGRNdetailes=()=>{
        
        let find = GRNDetailState.find(ele => ''+ele.GRNNumber === ''+ReturnItemState.GRNInvoiceNo) 

        if(find){

            setReturnItemState({
                GRNInvoiceNo:find.GRNNumber,
                GRNDate:find.GrnDate,
                SupplierBillNo:find.SupplierBillNumber,
                SupplierBillDate:find.SupplierBillDate,
                Reason:'',
                ItemCode: '',
                ItemName: '',
            })

           }
           else{

            const tdata = {
                message: `GRN Was Not Found`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });

        }
    }

    const handleSearchItemDetails =(condition)=>{

        if (condition === 'ItemCode'){

            let find =GRNItemState.find(ele => ''+ele.ItemCode === ''+ReturnItemState.ItemCode)

            if(find){

                const {ItemCode ,ItemName,AvailableQuantity,SingleProductPurchaseAmount, ...prevlist} =find

                setReturnItemState((prev)=>({
                    GRNInvoiceNo:prev.GRNInvoiceNo,
                    GRNDate:prev.GRNDate,
                    SupplierBillNo:prev.SupplierBillNo,
                    SupplierBillDate:prev.SupplierBillDate,
                    Reason:prev.Reason,
                    ItemCode:ItemCode,
                    ItemName:ItemName,
                    ...prevlist,                    
                }))

                if(AvailableQuantity){
                    setReturnQtyState((prev)=>({
                        ...prev,
                        PurchaseAmount:SingleProductPurchaseAmount,
                        AvailablePackQuantity:AvailableQuantity,
                    }))
                }


            }
            else{
                
                const tdata = {
                    message: `GRN Item Was Not Found`,
                    type: 'warn',
                }
                dispatchvalue({ type: 'toast', value: tdata });
    
            }

        }
        else if (condition === 'ItemName'){

            let find =GRNItemState.find(ele => ele.ItemName === ReturnItemState.ItemName)

            if(find){
                const {ItemCode ,ItemName,AvailableQuantity,SingleProductPurchaseAmount, ...prevlist} =find
                
                setReturnItemState((prev)=>({
                    GRNInvoiceNo:prev.GRNInvoiceNo,
                    GRNDate:prev.GRNDate,
                    SupplierBillNo:prev.SupplierBillNo,
                    SupplierBillDate:prev.SupplierBillDate,
                    Reason:prev.Reason,
                    ItemCode:ItemCode,
                    ItemName:ItemName,
                    ...prevlist,                    
                }))

                if(AvailableQuantity){
                    setReturnQtyState((prev)=>({
                        ...prev,
                        PurchaseAmount:SingleProductPurchaseAmount,
                        AvailablePackQuantity:AvailableQuantity,
                    }))
                }
            }
            else{

                const tdata = {
                    message: `GRN Item Was Not Found`,
                    type: 'warn',
                }
                dispatchvalue({ type: 'toast', value: tdata });
    
            }
        
        }
        

    }

    const SavePurchaseReturnItem =()=>{

        let requiredFields = [
            'PurchaseAmount',
            'AvailablePackQuantity',
            'ReturnQuantity',
            'ReturnPackQuantity',
            'ReturnQuantityAmount',
            'Remarks',
        ]
        let missingFields = requiredFields.filter(
            (field) => !ReturnQtyState[field]
        )

        const CheckDub = ReturnItemList.some(
            (product) => ''+product.ItemCode === ''+ReturnItemState.ItemCode
                && product?.id !== ReturnItemState?.id && product?.GRNInvoiceNo === ReturnItemState.GRNInvoiceNo
            && product.BatchNo === ReturnItemState?.BatchNo)

        if (missingFields.length !== 0) {

            const tdata = {
                message: `Please fill out all required fields: ${missingFields.join(", ")}`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });

        }
        else if (CheckDub) {

            const tdata = {
                message: `This Item Already Entered GRNInvoiceNo :${ReturnItemState.GRNInvoiceNo},ItemName :${ReturnItemState.ItemName} and BatchNo:${ReturnItemState.BatchNo}`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
        else{
            
            if (ReturnItemState.id){

                setReturnItemList((prev)=>
                    prev.map((product)=>
                    product.id === ReturnItemState.id ? {...ReturnItemState,...ReturnQtyState} : product)
                )

                Clear_setReturnItemState()
                Clear_setReturnQtyState()

            }

            else{

                setReturnItemList((prev)=>
                    [...prev,{...ReturnItemState,...ReturnQtyState,id:prev.length+1}]
                    )
                    
                    Clear_setReturnItemState()
                    Clear_setReturnQtyState()

            }

            

        }
        
    }


    const handleDeleteItem = (row) => {

        Clear_setReturnItemState()
        Clear_setReturnQtyState()

        const updatedArray = ReturnItemList.filter((ele) => ele.id !== row.id);

        const reindexedArray = updatedArray.map((item, index) => ({
            ...item,
            id: index + 1,
        }));

        setReturnItemList(reindexedArray)

        const tdata = {
            message: `${row.ItemName} has been deleted successfully.`,
            type: 'success'
        };
        dispatchvalue({ type: 'toast', value: tdata });

    }


    const HandelEditdata = (row) => {
       
        const {id,PurchaseAmount,
            AvailablePackQuantity,
            ReturnQuantity,
            ReturnPackQuantity,
            ReturnQuantityAmount,
            Remarks,...rest } = row;

            setReturnItemState({
                id:id,
                ...rest
            })  

            setReturnQtyState({
                PurchaseAmount:PurchaseAmount,
                AvailablePackQuantity:AvailablePackQuantity,
                ReturnQuantity:ReturnQuantity,
                ReturnPackQuantity:ReturnPackQuantity,
                ReturnQuantityAmount:ReturnQuantityAmount,
                Remarks:Remarks,
            })


    }

    const ProductListColumn = [

        {
            key: 'id',
            name: 'S.No',
            frozen: true
        },
        {
            key: 'GRNInvoiceNo',
            name: 'GRNInvoiceNo',
            frozen: true
        },
        {
            key: 'ItemCode',
            name: 'Item Code',
            frozen: true
        },
        {
            key: 'ItemName',
            name: 'Item Name',
            frozen: true
        },
        {
            key: 'GenericName',
            name: 'Generic Name'
        },
        {
            key: 'CompanyName',
            name: 'Manufacturer Name'
        },
        {
            key: 'HSNCode',
            name: 'HSN Code'
        },
        {
            key: 'Strength',
            name: 'Strength'
        },
        {
            key: 'Volume',
            name: 'Volume',
        },
        {
            key: 'PackType',
            name: 'Pack Type',
        },
        {
            key: 'PackQuantity',
            name: 'Pack Quantity',
        },
        {
            key: 'PurchaseRateWithTax',
            name: 'Purchase Rate With Tax'
        },
        {
            key: 'PurchaseQuantity',
            name: 'Purchase Quantity'
        },
        {
            key: 'TotalAmount',
            name: 'Total Amount'
        },
        {
            key:'PurchaseAmount',
            name:'PurchaseAmount',

        },
        {
            key:'ReturnQuantity',
            name:'Return Quantity',
        },
        {
            key:'ReturnQuantityAmount',
            name:'ReturnQuantityAmount'
        },
        {
            key: 'Action',
            name: 'Action',
            renderCell: (Params) => (
                <>
                    <Button className="cell_btn"
                        onClick={() => HandelEditdata(Params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                    <Button className="cell_btn"
                        onClick={() => handleDeleteItem(Params.row)}
                    >
                        <DeleteOutlineIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            )
        }


    ]



    const SavePurchaseReturn =()=>{

        console.log('ReturnItemList',ReturnItemList);

        let requiredFields = [
            'ReturnDate',
            'SupplierCode',
            'StoreLocation',
        ]

        const missingFields  = requiredFields.filter(
            (field) => ! SupplierDetailes[field]
        )


        let requiredFields2 = [
            'ReturnTotalItem',
            'ReturnTotalQuantity',
            'ReturnTotalAmount',
        ]

        const missingFields2  =requiredFields2.filter(
            (field) => ! FinalState[field]
        )

        if(missingFields.length > 0 || missingFields2.length >0){
            
            let allmissingFields=[...missingFields,...missingFields2]

            const tdata = {
                message: `Please fill out all required fields: ${allmissingFields.join(", ")}`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });

        }
        else if (ReturnItemList.length ===0){
            const tdata = {
                message: `Please Entry Return Items`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
        else{

            let SendItems

            if (EdittData && Object.keys(EdittData).length !==0){
            
                SendItems={
                    SupplierDetailes:{...SupplierDetailes,...FinalState,PurchaseReturnNumber:EdittData.id},
                    ReturnItemList:ReturnItemList,
                    Create_by: userRecord?.username,
                }

            }
            else{
                SendItems={
                    SupplierDetailes:{...SupplierDetailes,...FinalState},
                    ReturnItemList:ReturnItemList,
                    Create_by: userRecord?.username,
                }
            }
            

            console.log('SendItems',SendItems);

            axios.post(`${UrlLink}Inventory/PurcchaseReturn_Link`,SendItems)
            .then((res)=>{
                console.log(res.data);  
                
                let resdata = res.data
                    let type = Object.keys(resdata)[0]
                    let mess = Object.values(resdata)[0]
                    const tdata = {
                        message: mess,
                        type: type,
                    }
                    dispatchvalue({ type: 'toast', value: tdata });
                    if (type === 'success') {
                        navigate('/Home/PurchaseReturnList');
                        dispatchvalue({ type: 'PurchaseReturnList', value: {} })
                    }
            })
            .catch((err)=>{
                console.log(err);                
            })
            
        }

        
    }

  return (
    <>
      <div className="Main_container_app">
                <h3>Purchase Return</h3>

                <br />

                <div className="RegisFormcon_1">

                {
                Object.entries(SupplierDetailes).map(([StateName,value],index)=>(
                    <div className="RegisForm_1" key={index + 'key'}>
                       <label htmlFor={StateName}>{formatLabel(StateName)} <span>:</span></label> 
                        
                        {['Location','StoreLocation'].includes(StateName) ?

                        <select
                        id={StateName}
                        name={StateName}
                        value={SupplierDetailes[StateName]}
                        onChange={HandleonchangeSupplierState}
                        disabled={(SupplierDetailes.SupplierCode === '' && StateName==='Location') ||
                            (SupplierDetailes.Location === '' && StateName==='StoreLocation')}
                        >
                        <option value=''>Select</option>
                        {
                            
                            StateName === 'Location' ?

                            LocationData.map((ele,ind)=>(
                                <option key={ind+'key'} value={ele.id} >{ele.locationName}</option>
                            ))
                            
                            :

                            StoreData.map((ele,ind)=>(
                                <option key={ind+'key'} value={ele.id} >{ele.StoreName}</option>
                            ))
                            
                        }
                        </select>

                        :
                        <div className='Search_patient_icons'>

                        
                        <input
                        type={StateName === 'ReturnDate' ?'date':'text'}
                        id={StateName}
                        name={StateName}
                        value={SupplierDetailes[StateName]}
                        list={StateName+'list'}
                        onChange={HandleonchangeSupplierState}
                        disabled={['SupplierMailId','SupplierContactNumber','SupplierContactPerson'].includes(StateName)}
                        />
                        {
                        ['SupplierCode','SupplierName'].includes(StateName) ?
                        <>
                        <datalist id={StateName+'list'}>
                        {
                            supplierArray.map((ele,ind)=>(
                            <option key={ind+'key'} value={StateName === 'SupplierCode' ? ele.id : ele.SupplierName}></option>
                            )) 
                        }
                        </datalist>
                        <span onClick={(e)=>handleSearchSupplierlist(StateName ==='SupplierCode' ? 'SupplierCode' : 'SupplierName')}>
                        <ManageSearchIcon />
                        </span>
                        </>
                        :<></>
                        }
                        </div>

                        }

                        

                    </div>
                ))
                }

                

                </div>

                <br/>

                <div className="common_center_tag">
                <span>ITEM DETAILES</span>
                </div> 
                <br/>

                <div className="RegisFormcon_1">
                {
                Object.keys(ReturnItemState).filter(ele => ele !== 'id').map((StateName,index)=>(
                    <div className="RegisForm_1" key={index + 'key'}>
                       <label htmlFor={StateName}>{formatLabel(StateName)} <span>:</span></label> 
                        

                       {StateName==='Reason' ? 

                            <select
                            id={StateName}
                            name={StateName}
                            value={ReturnItemState[StateName]}
                            onChange={HandelOnchaneItemState}
                            disabled={ReturnItemState.SupplierBillNo ===''  && StateName ==='Reason'}
                            >
                            <option value=''>Select</option>
                            <option value='QualityIssue'>Quality Issue</option>
                            <option value='ExcessItems'>Excess Items</option>
                            <option value='Damage'>Damage</option>
                            <option value='ExpiredReturn'>Expired Return</option>
                            </select>

                            :

                            <div className='Search_patient_icons'>
                            <input
                                type={['GRNDate', 'SupplierBillDate'].includes(StateName) ? 'date' : 'text'}
                                id={StateName}
                                name={StateName}
                                value={ReturnItemState[StateName]}
                                disabled={!['GRNInvoiceNo', 'ItemCode', 'ItemName'].includes(StateName) ||
                                    (SupplierDetailes.StoreLocation ==='' && StateName ==='GRNInvoiceNo') ||
                                    (ReturnItemState.Reason ==='' && ['ItemCode','ItemName'].includes(StateName))
                                }
                                onChange={HandelOnchaneItemState}
                                list={`${StateName}list`}
                                autoComplete='off'

                            />
                            
                            {StateName === 'GRNInvoiceNo' ? (
                                <>
                                <datalist id={`${StateName}list`}>
                                    {GRNDetailState.map((ele, ind) => (
                                        <option key={`${ind}key`} value={`${ele.GRNNumber}`}>
                                            {`GRN Date: ${ele.GrnDate} | S.Bill No: ${ele.SupplierBillNumber} | S.Bill Date: ${ele.SupplierBillDate}`}
                                        </option>
                                    ))}
                                </datalist>
                                <span  onClick={handleSearchGRNdetailes}>
                                <ManageSearchIcon />
                                </span>
                                </>
                            ) : ['ItemCode', 'ItemName'].includes(StateName) ? (
                                <>
                                <datalist id={`${StateName}list`}>
                                    {GRNItemState.map((ele, ind) => (
                                        <option key={`${ind}key`} value={StateName === 'ItemCode' ? ele.ItemCode : ele.ItemName}>
                                            {StateName === 'ItemCode' ? `Item Name: ${ele.ItemName} | BatchNo: ${ele.BatchNo} | Received Quantity: ${ele.PurchaseQuantity}` 
                                            :`Item Code: ${ele.ItemCode} | BatchNo: ${ele.BatchNo} | Received Quantity: ${ele.PurchaseQuantity}` }
                                        </option>
                                    ))}
                                </datalist>
                                <span onClick={(e)=>{handleSearchItemDetails(StateName === 'ItemCode' ? 'ItemCode' : 'ItemName')}}>
                                <ManageSearchIcon />
                                </span>
                                </>
                            ) : null}
                            </div>
                        }

                    </div>
                ))
                }
                </div>

                <br/>

                { ReturnQtyState.AvailablePackQuantity !=='' &&<div className="RegisFormcon_1">
                {
                Object.entries(ReturnQtyState).map(([StateName,value],index)=>(
                    <div className="RegisForm_1" key={index + 'key'}>
                       <label htmlFor={StateName}>{formatLabel(StateName)} <span>:</span></label> 
                        
                    { 

                        StateName ==='Remarks' ? 

                        <textarea
                        id={StateName}
                        name={StateName}
                        value={ReturnQtyState[StateName]}
                        onChange={HandelOnchaneReturnQty}
                        >

                        </textarea>

                        :
                        <>
                        <input
                        type='number'
                        id={StateName}
                        name={StateName}
                        value={ReturnQtyState[StateName]}
                        onChange={HandelOnchaneReturnQty}
                        disabled={!['ReturnQuantity'].includes(StateName)}
                        />
                        </>


                    }
                    </div>
                ))
                }
                </div>}

                
                <br />
                {ReturnQtyState.AvailablePackQuantity &&
                    <div className="Main_container_Btn">
                        <button onClick={SavePurchaseReturnItem}>
                            {ReturnItemState.id? 'Update' :  'Add'}
                        </button>
                    </div>
                }
                <br />


                {ReturnItemList.length !==0 &&
                <div className='RegisFormcon_1 jjxjx_'>
                <ReactGrid columns={ProductListColumn} RowData={ReturnItemList} />
                </div> 
                }
                
                <br />

                {
                    ReturnItemList.length !==0 && 
                        <div className="RegisFormcon_1">
                        {
                        Object.keys(FinalState).map((StateName,index)=>(
                        <div className="RegisForm_1" key={index + 'key'}>
                        <label htmlFor={StateName}>{formatLabel(StateName)} <span>:</span></label> 
                        <input
                        type='number'
                        id={StateName}
                        name={StateName}
                        value={FinalState[StateName]}
                        disabled
                        />
                        </div>
                        ))
                        }
                        </div>
                }
                
                <br />
                
                {ReturnItemList.length !==0 &&
                    <div className="Main_container_Btn">
                        <button onClick={SavePurchaseReturn} >
                            {Object.keys(EdittData).length !==0 ? 'Update' :'Save' }
                        </button>
                    </div>
                }

                </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
            
    </>
  )
}

export default PurchaseReturn;
