
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { Button } from '@mui/material';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import EditIcon from "@mui/icons-material/Edit";



const InventorySubMasters = () => {

    const [RackMasterPage, setRackMasterPage] = useState('ProductType')
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const dispatchvalue = useDispatch();

    const [PackTypeState, setPackTypeState] = useState({
        PackTypeID: '',
        PackTypeName: '',
        ProductCategoryName: '',
        SubProductCategoryName: '',
    });

    const [ProductGroupState, setProductGroupState] = useState({
        ProductGroupID: '',
        ProductGroupName: '',
        ProductCategoryName: '',
        SubProductCategoryName: '',
    });

    const [ProductTypeState, setProductTypeState] = useState({
        ProductTypeID: '',
        ProductTypeName: '',
        ProductCategoryName: '',
        SubProductCategoryName: '',
    });

    const [GenericNameState, setGenericNameState] = useState({
        GenericNameID: '',
        GenericName: '',
        ProductCategoryName: '',
        SubProductCategoryName: '',
    });


    const [CompanyNameState, setCompanyNameState] = useState({
        CompanyNameId: '',
        CompanyName: '',
        ProductCategoryName: '',
        SubProductCategoryName: '',
    });

    const [ProductTypeArray, setProductTypeArray] = useState([]);
    const [PackTypeArray, setPackTypeArray] = useState([]);
    const [ProductGroupArray, setProductGroupArray] = useState([]);
    const [GenericNameArray, setGenericNameArray] = useState([]);
    const [SubCategoryData, setSubCategoryData] = useState([]);
    const [CompanyNameArray, setCompanyNameArray] = useState([]);

    const [ProductCategoryData, setProductCategoryData] = useState([]);



    useEffect(() => {
        axios.get(`${UrlLink}Inventory/Product_Category_Product_Details_link`)
            .then((response) => {
                const data = response.data;
                console.log("setProductCategoryData", data);
                setProductCategoryData(data);
            })
            .catch((err) => {
                console.error("Error fetching Product category", err);
            })

    }, [UrlLink])



    useEffect(() => {
        let productCategoryName = "";

        if (ProductTypeState.ProductCategoryName !== "") {
            productCategoryName = ProductTypeState.ProductCategoryName;
        } else if (ProductGroupState.ProductCategoryName !== "") {
            productCategoryName = ProductGroupState.ProductCategoryName;
        } else if (GenericNameState.ProductCategoryName !== "") {
            productCategoryName = GenericNameState.ProductCategoryName;
        } else if (PackTypeState.ProductCategoryName !== "") {
            productCategoryName = PackTypeState.ProductCategoryName
        } else if (CompanyNameState.ProductCategoryName !== "") {
            productCategoryName = CompanyNameState.ProductCategoryName
        }

        if (productCategoryName !== "") {
            axios
                .get(`${UrlLink}Inventory/Sub_Product_Category_Details_by_Product?ProductCategory=${productCategoryName}`)
                .then((res) => {
                    if (Array.isArray(res.data)) {
                        setSubCategoryData(res.data);
                    } else {
                        setSubCategoryData([]);
                    }
                })
                .catch((err) => {
                    setSubCategoryData([]);
                    console.log(err);
                });
        } else {
            setSubCategoryData([]);
        }
    }, [
        ProductTypeState.ProductCategoryName,
        ProductGroupState.ProductCategoryName,
        GenericNameState.ProductCategoryName,
        PackTypeState.ProductCategoryName,
        CompanyNameState.ProductCategoryName,
        UrlLink,
    ]);
    // -----------------------------------------------------------------------


    const GetPackTypedata = useCallback(() => {
        axios.get(`${UrlLink}Masters/Pack_Type_link`)
            .then((res) => {
                console.log(res.data);
                let data = res.data

                if (Array.isArray(data) && data.length !== 0) {
                    setPackTypeArray(data)
                }
                else {
                    setPackTypeArray([])
                }

            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink])


    useEffect(() => {
        GetPackTypedata()
    }, [GetPackTypedata])


    const HandleUpdateStatusPackType = (params) => {

        let Editdata = {
            PackTypeID: params.id,
            Statusedit: true
        }

        axios.post(`${UrlLink}Masters/Pack_Type_link`, Editdata)
            .then((res) => {
                // console.log(res.data);

                let data = res.data

                let type = Object.keys(data)[0]
                let mess = Object.values(data)[0]

                const tdata = {
                    message: mess,
                    type: type,
                }
                dispatchvalue({ type: 'toast', value: tdata });

                GetPackTypedata()

            })
            .catch((err) => {
                console.log(err);
            })



    }


    const HandeleEditPackType = (params) => {
        let Editdata = params
        console.log("params", params);

        setPackTypeState((prev) => ({
            ...prev,
            PackTypeID: Editdata.id,
            PackTypeName: Editdata.PackTypeName,
            ProductCategoryName: Editdata.ProductCategory,
            SubProductCategoryName: Editdata.SubProductCategory
        }));

    }


    const PackTypeColumn = [
        {
            key: 'id',
            name: 'Pack Type Id',
            frozen: true
        },
        {
            key: 'PackTypeName',
            name: 'Pack Type Name',
            frozen: true
        },
        {
            key: 'ProductCategoryName',
            name: 'ProductCategory',
            frozen: true
        },
        {
            key: 'SubProductCategoryName',
            name: 'SubProductCategory',
            frozen: true
        },
        {
            key: 'Status',
            name: 'Status',
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleUpdateStatusPackType(params.row)}
                    >
                        {params.row.Status ? "ACTIVE" : "INACTIVE"}
                    </Button>
                </>
            )
        },
        {
            key: 'Action',
            name: 'Action',
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandeleEditPackType(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            )
        }
    ]



    const HandleSavePackType = () => {
        if (!validateFormPack()) return;

        let senddata = {
            ...PackTypeState,
            created_by: userRecord?.username || ''
        }

        axios.post(`${UrlLink}Masters/Pack_Type_link`, senddata)
            .then((res) => {
                // console.log(res.data);

                let data = res.data

                let type = Object.keys(data)[0]
                let mess = Object.values(data)[0]
                const tdata = {
                    message: mess,
                    type: type,
                }
                dispatchvalue({ type: 'toast', value: tdata });

                setPackTypeState({
                    PackTypeID: '',
                    PackTypeName: '',
                    ProductCategoryName: '',
                    SubProductCategoryName: ''
                });
                setSubCategoryData([]);

                GetPackTypedata()

            })
            .catch((err) => {
                console.log(err);
            })

    }

    // -----------------------------------------------------------------------


    const GetProductGroupdata = useCallback(() => {
        axios.get(`${UrlLink}Masters/Product_Group_Link`)
            .then((res) => {
                console.log(res.data);
                let data = res.data

                if (Array.isArray(data) && data.length !== 0) {
                    setProductGroupArray(data)
                }
                else {
                    setProductGroupArray([])
                }

            })
            .catch((err) => {
                console.log(err);
            })
    }, [])


    useEffect(() => {
        GetProductGroupdata()
    }, [GetProductGroupdata])


    const HandleUpdateStatusProduct = (params) => {

        let Editdata = {
            ProductGroupID: params.id,
            Statusedit: true
        }

        axios.post(`${UrlLink}Masters/Product_Group_Link`, Editdata)
            .then((res) => {
                // console.log(res.data);

                let data = res.data

                let type = Object.keys(data)[0]
                let mess = Object.values(data)[0]

                const tdata = {
                    message: mess,
                    type: type,
                }
                dispatchvalue({ type: 'toast', value: tdata });

                GetProductGroupdata()

            })
            .catch((err) => {
                console.log(err);
            })



    }


    const HandeleEditProductName = (params) => {
        let Editdata = params

        setProductGroupState((prev) => ({
            ...prev,
            ProductGroupID: Editdata.id,
            ProductGroupName: Editdata.ProductGroupName,
            ProductCategoryName: Editdata.ProductCategory,
            SubProductCategoryName: Editdata.SubProductCategory
        }))

    }


    const ProductGroupColumn = [
        {
            key: 'id',
            name: 'Product Group Id',
            frozen: true
        },
        {
            key: 'ProductGroupName',
            name: 'Product Group Name',
            frozen: true
        },
        {
            key: 'ProductCategoryName',
            name: 'ProductCategory',
            frozen: true
        },
        {
            key: 'SubProductCategoryName',
            name: 'SubProductCategory',
            frozen: true
        },
        {
            key: 'Status',
            name: 'Status',
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleUpdateStatusProduct(params.row)}
                    >
                        {params.row.Status ? "ACTIVE" : "INACTIVE"}
                    </Button>
                </>
            )
        },
        {
            key: 'Action',
            name: 'Action',
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandeleEditProductName(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            )
        }
    ]



    const HandleSaveProductGroup = () => {

        if (!validateFormProductGroup()) return;
        let senddata = {
            ...ProductGroupState,
            created_by: userRecord?.username || ''
        }

        axios.post(`${UrlLink}Masters/Product_Group_Link`, senddata)
            .then((res) => {
                // console.log(res.data);

                let data = res.data

                let type = Object.keys(data)[0]
                let mess = Object.values(data)[0]
                const tdata = {
                    message: mess,
                    type: type,
                }
                dispatchvalue({ type: 'toast', value: tdata });

                setProductGroupState({
                    ProductGroupID: '',
                    ProductGroupName: '',
                    ProductCategoryName: '',
                    SubProductCategoryName: '',
                });
                setSubCategoryData([]);

                GetProductGroupdata()

            })
            .catch((err) => {
                console.log(err);
            })

    }


    // ---------------------------------------------------------------------


    const GetProductTypedata = useCallback(() => {
        axios.get(`${UrlLink}Masters/ProductType_Master_lik`)
            .then((res) => {
                console.log(res.data);
                let data = res.data

                if (Array.isArray(data) && data.length !== 0) {
                    setProductTypeArray(data)
                }
                else {
                    setProductTypeArray([])
                }

            })
            .catch((err) => {
                console.log(err);
            })
    }, [])


    const HandeleEditProducttype = (params) => {
        let Editdata = params
        console.log("Editdata", Editdata);

        setProductTypeState((prev) => ({
            ...prev,
            ProductTypeID: Editdata.id,
            ProductTypeName: Editdata.ProductTypeName,
            ProductCategoryName: Editdata.ProductCategory,
            SubProductCategoryName: Editdata.SubProductCategory,
        }));

    }


    const HandleUpdateStatusPro = (params) => {

        let Editdata = {
            ProductTypeID: params.id,
            Statusedit: true
        }

        axios.post(`${UrlLink}Masters/ProductType_Master_lik`, Editdata)
            .then((res) => {
                // console.log(res.data);
                let data = res.data

                let type = Object.keys(data)[0]
                let mess = Object.values(data)[0]
                const tdata = {
                    message: mess,
                    type: type,
                }
                dispatchvalue({ type: 'toast', value: tdata });
                GetProductTypedata()
            })
            .catch((err) => {
                console.log(err);
            })


    }

    const ProductColumn = [
        {
            key: 'id',
            name: 'ProductType Id',
            frozen: true
        },
        {
            key: 'ProductTypeName',
            name: 'ProductType Name',
            frozen: true
        },

        {
            key: 'ProductCategoryName',
            name: 'ProductCategory',
            frozen: true
        },
        {
            key: 'SubProductCategoryName',
            name: 'SubProductCategory',
            frozen: true
        },
        {
            key: 'Status',
            name: 'Status',
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleUpdateStatusPro(params.row)}
                    >
                        {params.row.Status ? "ACTIVE" : "INACTIVE"}
                    </Button>
                </>
            )
        },
        {
            key: 'Action',
            name: 'Action',
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandeleEditProducttype(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            )
        }

    ]

    useEffect(() => {
        GetProductTypedata()
    }, [GetProductTypedata])

    const validateForm = () => {
        if (!ProductTypeState.ProductCategoryName && !ProductTypeState.SubProductCategoryName) {
            dispatchvalue({
                type: "toast",
                value: { message: "ProductCategory and SubProductCategory required", type: "warn" },
            });
            return false;

        }
        return true;
    }

    const validateFormPack = () => {
        if (!PackTypeState.ProductCategoryName && !PackTypeState.SubProductCategoryName) {
            dispatchvalue({
                type: "toast",
                value: { message: "ProductCategory and SubProductCategory required", type: "warn" },
            });
            return false;

        }
        return true;
    }
    const validateFormProductGroup = () => {
        if (!ProductGroupState.ProductCategoryName && !ProductGroupState.SubProductCategoryName) {
            dispatchvalue({
                type: "toast",
                value: { message: "ProductCategory and SubProductCategory required", type: "warn" },
            });
            return false;

        }
        return true;
    }
    const validateFormCompanyName = () => {
        if (!CompanyNameState.ProductCategoryName && !CompanyNameState.SubProductCategoryName) {
            dispatchvalue({
                type: "toast",
                value: { message: "ProductCategory and SubProductCategory required", type: "warn" },
            });
            return false;

        }
        return true;
    }
    const validateFormGenericName = () => {
        if (!GenericNameState.ProductCategoryName && !GenericNameState.SubProductCategoryName) {
            dispatchvalue({
                type: "toast",
                value: { message: "ProductCategory and SubProductCategory required", type: "warn" },
            });
            return false;

        }
        return true;
    }



    const HandleSaveProductType = () => {
        if (!validateForm()) return;

        let senddata = {
            ...ProductTypeState,
            created_by: userRecord?.username || ''
        }
        console.log("senddata", senddata);

        axios.post(`${UrlLink}Masters/ProductType_Master_lik`, senddata)
            .then((res) => {
                // console.log(res.data);

                let data = res.data;
                let type = Object.keys(data)[0]
                let mess = Object.values(data)[0]
                const tdata = {
                    message: mess,
                    type: type,
                }
                dispatchvalue({ type: 'toast', value: tdata });

                setProductTypeState({
                    ProductTypeID: '',
                    ProductTypeName: '',
                    ProductCategoryName: '',
                    SubProductCategoryName: '',

                })
                setSubCategoryData([]);

                GetProductTypedata()


            })
            .catch((err) => {
                console.log(err);
            })

    }




    // -------------------------Gentric Name -----------------




    const GetGenericNamedata = useCallback(() => {

        axios.get(`${UrlLink}Masters/GenericName_Master_Link`)
            .then((res) => {
                console.log(res.data);
                let data = res.data

                if (Array.isArray(data) && data.length !== 0) {
                    setGenericNameArray(data)
                }
                else {
                    setGenericNameArray([])
                }

            })
            .catch((err) => {
                console.log(err);
            })


    }, [])


    const HandleUpdateStatusGName = (params) => {

        let Editdata = {
            GenericNameID: params.id,
            Statusedit: true
        }

        axios.post(`${UrlLink}Masters/GenericName_Master_Link`, Editdata)
            .then((res) => {
                // console.log(res.data);
                let data = res.data

                let type = Object.keys(data)[0]
                let mess = Object.values(data)[0]
                const tdata = {
                    message: mess,
                    type: type,
                }
                dispatchvalue({ type: 'toast', value: tdata });
                GetGenericNamedata()
            })
            .catch((err) => {
                console.log(err);
            })

    }



    const HandeleEditGenericName = (params) => {
        let Editdata = params

        setGenericNameState({
            GenericNameID: Editdata.id,
            GenericName: Editdata.GenericName,
            ProductCategoryName: Editdata.ProductCategory,
            SubProductCategoryName: Editdata.SubProductCategory
        });

    }


    const GenericNameColumn = [

        {
            key: 'id',
            name: 'Generic Name Id',
            frozen: true
        },
        {
            key: 'GenericName',
            name: 'Generic Name',
            frozen: true
        },
        {
            key: 'ProductCategoryName',
            name: 'ProductCategory',
            frozen: true
        },
        {
            key: 'SubProductCategoryName',
            name: 'SubProductCategory',
            frozen: true
        },
        {
            key: 'Status',
            name: 'Status',
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleUpdateStatusGName(params.row)}
                    >
                        {params.row.Status ? "ACTIVE" : "INACTIVE"}
                    </Button>
                </>
            )
        },
        {
            key: 'Action',
            name: 'Action',
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandeleEditGenericName(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            )
        }

    ]


    useEffect(() => {
        GetGenericNamedata()
    }, [GetGenericNamedata])


    const HandleSaveGenericName = () => {

        if (!validateFormGenericName()) return;

        let senddata = {
            ...GenericNameState,
            created_by: userRecord?.username || ''
        }

        axios.post(`${UrlLink}Masters/GenericName_Master_Link`, senddata)
            .then((res) => {
                // console.log(res.data);

                let data = res.data

                let type = Object.keys(data)[0]
                let mess = Object.values(data)[0]
                const tdata = {
                    message: mess,
                    type: type,
                }
                dispatchvalue({ type: 'toast', value: tdata });

                setGenericNameState({
                    GenericNameID: '',
                    GenericName: '',
                    ProductCategoryName: '',
                    SubProductCategoryName: '',

                });
                setSubCategoryData([]);

                GetGenericNamedata()


            })
            .catch((err) => {
                console.log(err);
            })


    }


    // ---------------------------Company Name--------------------------------



    const GetCompanyNamedata = useCallback(() => {

        axios.get(`${UrlLink}Masters/CompanyName_Master_Link`)
            .then((res) => {
                console.log(res.data);
                let data = res.data

                if (Array.isArray(data) && data.length !== 0) {
                    setCompanyNameArray(data)
                }
                else {
                    setCompanyNameArray([])
                }

            })
            .catch((err) => {
                console.log(err);
            })


    }, [])


    useEffect(() => {
        GetCompanyNamedata()
    }, [GetCompanyNamedata])


    const HandeleEditCompanyName = (params) => {
        let Editdata = params

        setCompanyNameState({
            CompanyNameId: Editdata.id,
            CompanyName: Editdata.CompanyName,
            ProductCategoryName: Editdata.ProductCategory,
            SubProductCategoryName: Editdata.SubProductCategory
        });

    }


    const HandleUpdateStatusCompanyName = (params) => {

        let Editdata = {
            CompanyNameId: params.id,
            Statusedit: true
        }

        axios.post(`${UrlLink}Masters/CompanyName_Master_Link`, Editdata)
            .then((res) => {
                // console.log(res.data);
                let data = res.data

                let type = Object.keys(data)[0]
                let mess = Object.values(data)[0]
                const tdata = {
                    message: mess,
                    type: type,
                }
                dispatchvalue({ type: 'toast', value: tdata });
                GetCompanyNamedata()
            })
            .catch((err) => {
                console.log(err);
            })


    }


    const CompanyNameColumn = [
        {
            key: 'id',
            name: 'Company Name Id',
            frozen: true
        },
        {
            key: 'CompanyName',
            name: 'Company Name',
            frozen: true
        },
        {
            key: 'ProductCategoryName',
            name: 'ProductCategory',
            frozen: true
        },
        {
            key: 'SubProductCategoryName',
            name: 'SubProductCategory',
            frozen: true
        },
        {
            key: 'Status',
            name: 'Status',
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleUpdateStatusCompanyName(params.row)}
                    >
                        {params.row.Status ? "ACTIVE" : "INACTIVE"}
                    </Button>
                </>
            )
        },
        {
            key: 'Action',
            name: 'Action',
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandeleEditCompanyName(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            )
        }
    ]



    const HandleSaveCompanyName = () => {
        if (!validateFormCompanyName()) return;

        let senddata = {
            ...CompanyNameState,
            created_by: userRecord?.username || ''
        }

        axios.post(`${UrlLink}Masters/CompanyName_Master_Link`, senddata)
            .then((res) => {
                // console.log(res.data);

                let data = res.data

                let type = Object.keys(data)[0]
                let mess = Object.values(data)[0]
                const tdata = {
                    message: mess,
                    type: type,
                }
                dispatchvalue({ type: 'toast', value: tdata });

                setCompanyNameState({
                    CompanyNameId: '',
                    CompanyName: '',
                    ProductCategoryName: '',
                    SubProductCategoryName: '',

                });
                setSubCategoryData([]);

                GetCompanyNamedata()


            })
            .catch((err) => {
                console.log(err);
            })


    }


    const handleChangeProductTypeState = useCallback((e) => {
        const { name, value } = e.target;
        if (name === 'ProductCategoryName') {
            setProductTypeState((prev) => ({
                ...prev,
                ProductCategoryName: value,
                SubProductCategoryName: '',

            }));
        } else {
            setProductTypeState((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    }, []);

    const handleChangeProductGroup = useCallback((e) => {
        const { name, value } = e.target;
        if (name === 'ProductCategoryName') {
            setProductGroupState((prev) => ({
                ...prev,
                ProductCategoryName: value,
                SubProductCategoryName: '',


            }));
        } else {
            setProductGroupState((prev) => ({
                ...prev,
                [name]: value
            }));
        }

    }, []);



    const handleChangePackType = useCallback((e) => {
        const { name, value } = e.target;

        if (name === 'ProductCategoryName') {
            setPackTypeState((prev) => ({
                ...prev,
                ProductCategoryName: value,
                SubProductCategoryName: '',


            }));
        }
        else {
            setPackTypeState((prev) => ({
                ...prev,
                [name]: value

            }));
        }

    }, []);

    const handleChangeGenericName = useCallback((e) => {
        const { name, value } = e.target;

        if (name === 'ProductCategoryName') {
            setGenericNameState((prev) => ({
                ...prev,
                ProductCategoryName: value,
                SubProductCategoryName: '',


            }));
        }
        else {
            setGenericNameState((prev) => ({
                ...prev,
                [name]: value

            }));
        }
    }, []);

    const handleChangeCompanyName = useCallback((e) => {
        const { name, value } = e.target;

        if (name === 'ProductCategoryName') {
            setCompanyNameState((prev) => ({
                ...prev,
                ProductCategoryName: value,
                SubProductCategoryName: '',


            }));
        }
        else {
            setCompanyNameState((prev) => ({
                ...prev,
                [name]: value

            }));
        }
    }, []);













    return (
        <>
            <div className="Main_container_app">
                <h3>Inventory Masters</h3>

                <br />
                <div className="RegisterTypecon">
                    <div className="RegisterType">

                        {["ProductType", "ProductGroup", "PackType", "GenericName", "ManufacturerName"].map((p, ind) => (

                            <div className="registertypeval" key={ind}>
                                <input
                                    type="radio"
                                    id={p}
                                    name="appointment_type"
                                    checked={RackMasterPage === p}
                                    onChange={(e) => {
                                        setRackMasterPage(e.target.value)
                                    }}
                                    value={p}
                                />
                                <label htmlFor={p}>
                                    {p}
                                </label>
                            </div>
                        ))}

                    </div>
                </div>

                {/* --------------------ProductType----------------- */}

                {RackMasterPage === 'ProductType' && <>


                    <br />

                    <div className="RegisFormcon_1">

                        <div className="RegisForm_1">
                            <label>
                                Product Category <span>:</span>
                            </label>
                            <select
                                name="ProductCategoryName"
                                value={ProductTypeState.ProductCategoryName}
                                onChange={handleChangeProductTypeState} // Corrected from onchange to onChange
                            >
                                <option value="">Select</option>
                                {Array.isArray(ProductCategoryData) &&
                                    ProductCategoryData
                                        .filter((p) => p.Status === 'Active') // Filters only active categories
                                        .map((Prod, indx) => (
                                            <option key={indx} value={Prod.id}>
                                                {Prod.ProductCategory}
                                            </option>
                                        ))
                                }
                            </select>
                        </div>


                        <div className="RegisForm_1">
                            <label>
                                SubProduct Category <span>:</span>
                            </label>
                            <select
                                name="SubProductCategoryName"
                                value={ProductTypeState.SubProductCategoryName}
                                onChange={handleChangeProductTypeState} // Corrected from onchange to onChange
                            >
                                <option value="">Select</option>
                                {Array.isArray(SubCategoryData) &&
                                    SubCategoryData
                                        .filter((p) => p.Status === 'Active') // Filters only active categories
                                        .map((subProd, indx) => (
                                            <option key={indx} value={subProd.id}>
                                                {subProd.SubCategoryName}
                                            </option>
                                        ))
                                }
                            </select>
                        </div>

                        <div className="RegisForm_1">
                            <label>Product Type<span>:</span> </label>
                            <input
                                type="text"
                                name='ProductTypeName'
                                autoComplete='off'
                                required
                                value={ProductTypeState.ProductTypeName}
                                onChange={(e) => setProductTypeState((prev) => ({ ...prev, ProductTypeName: e.target.value.toUpperCase() }))}
                            />
                        </div>
                    </div>

                    <div className="Main_container_Btn">
                        <button onClick={HandleSaveProductType} >
                            {ProductTypeState.ProductTypeID ? "Update" : "Add"}
                        </button>
                    </div>

                    <ReactGrid columns={ProductColumn} RowData={ProductTypeArray} />


                </>}

                {/* -----------ProductGroup---------------- */}

                {RackMasterPage === 'ProductGroup' && <>

                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>
                                Product Category <span>:</span>
                            </label>
                            <select
                                name="ProductCategoryName"
                                value={ProductGroupState.ProductCategoryName}
                                onChange={handleChangeProductGroup} // Corrected from onchange to onChange
                            >
                                <option value="">Select</option>
                                {Array.isArray(ProductCategoryData) &&
                                    ProductCategoryData
                                        .filter((p) => p.Status === 'Active') // Filters only active categories
                                        .map((Prod, indx) => (
                                            <option key={indx} value={Prod.id}>
                                                {Prod.ProductCategory}
                                            </option>
                                        ))
                                }
                            </select>
                        </div>
                        <div className="RegisForm_1">
                            <label>
                                SubProduct Category <span>:</span>
                            </label>
                            <select
                                name="SubProductCategoryName"
                                value={ProductGroupState.SubProductCategoryName}
                                onChange={handleChangeProductGroup} // Corrected from onchange to onChange
                            >
                                <option value="">Select</option>
                                {Array.isArray(SubCategoryData) &&
                                    SubCategoryData
                                        .filter((p) => p.Status === 'Active') // Filters only active categories
                                        .map((subProd, indx) => (
                                            <option key={indx} value={subProd.id}>
                                                {subProd.SubCategoryName}
                                            </option>
                                        ))
                                }
                            </select>
                        </div>

                        <div className="RegisForm_1">
                            <label> Product Group <span>:</span> </label>
                            <input
                                type="text"
                                name='ProductGroupName'
                                autoComplete='off'
                                required
                                value={ProductGroupState.ProductGroupName}
                                onChange={(e) => setProductGroupState((prev) => ({ ...prev, ProductGroupName: e.target.value.toUpperCase() }))}
                            />
                        </div>
                    </div>

                    <div className="Main_container_Btn">
                        <button onClick={HandleSaveProductGroup} >
                            {ProductGroupState.ProductGroupID ? "Update" : "Add"}
                        </button>
                    </div>

                    <ReactGrid columns={ProductGroupColumn} RowData={ProductGroupArray} />




                </>}

                {/* -----------------packtype----------------- */}

                {RackMasterPage === 'PackType' && <>
                    <br />

                    <div className="RegisFormcon_1">


                        <div className="RegisForm_1">
                            <label>
                                Product Category <span>:</span>
                            </label>
                            <select
                                name="ProductCategoryName"
                                value={PackTypeState.ProductCategoryName}
                                onChange={handleChangePackType} // Corrected from onchange to onChange
                            >
                                <option value="">Select</option>
                                {Array.isArray(ProductCategoryData) &&
                                    ProductCategoryData
                                        .filter((p) => p.Status === 'Active') // Filters only active categories
                                        .map((Prod, indx) => (
                                            <option key={indx} value={Prod.id}>
                                                {Prod.ProductCategory}
                                            </option>
                                        ))
                                }
                            </select>
                        </div>


                        <div className="RegisForm_1">
                            <label>
                                SubProduct Category <span>:</span>
                            </label>
                            <select
                                name="SubProductCategoryName"
                                value={PackTypeState.SubProductCategoryName}
                                onChange={handleChangePackType} // Corrected from onchange to onChange
                            >
                                <option value="">Select</option>
                                {Array.isArray(SubCategoryData) &&
                                    SubCategoryData
                                        .filter((p) => p.Status === 'Active') // Filters only active categories
                                        .map((subProd, indx) => (
                                            <option key={indx} value={subProd.id}>
                                                {subProd.SubCategoryName}
                                            </option>
                                        ))
                                }
                            </select>
                        </div>

                        <div className="RegisForm_1">
                            <label>Pack Type <span>:</span> </label>
                            <input
                                type="text"
                                name='PackTypeName'
                                autoComplete='off'
                                required
                                value={PackTypeState.PackTypeName}
                                onChange={(e) => setPackTypeState((prev) => ({ ...prev, PackTypeName: e.target.value.toUpperCase() }))}
                            />
                        </div>
                    </div>

                    <div className="Main_container_Btn">
                        <button onClick={HandleSavePackType} >
                            {PackTypeState.PackTypeID ? "Update" : "Add"}
                        </button>
                    </div>

                    <ReactGrid columns={PackTypeColumn} RowData={PackTypeArray} />



                </>}
                {/* ----------------generic name--------------- */}


                {RackMasterPage === 'GenericName' && <>
                    <br />

                    <div className="RegisFormcon_1">

                        <div className="RegisForm_1">
                            <label>
                                Product Category <span>:</span>
                            </label>
                            <select
                                name="ProductCategoryName"
                                value={GenericNameState.ProductCategoryName}
                                onChange={handleChangeGenericName} // Corrected from onchange to onChange
                            >
                                <option value="">Select</option>
                                {Array.isArray(ProductCategoryData) &&
                                    ProductCategoryData
                                        .filter((p) => p.Status === 'Active') // Filters only active categories
                                        .map((Prod, indx) => (
                                            <option key={indx} value={Prod.id}>
                                                {Prod.ProductCategory}
                                            </option>
                                        ))
                                }
                            </select>
                        </div>


                        <div className="RegisForm_1">
                            <label>
                                SubProduct Category <span>:</span>
                            </label>
                            <select
                                name="SubProductCategoryName"
                                value={GenericNameState.SubProductCategoryName}
                                onChange={handleChangeGenericName} // Corrected from onchange to onChange
                            >
                                <option value="">Select</option>
                                {Array.isArray(SubCategoryData) &&
                                    SubCategoryData
                                        .filter((p) => p.Status === 'Active') // Filters only active categories
                                        .map((subProd, indx) => (
                                            <option key={indx} value={subProd.id}>
                                                {subProd.SubCategoryName}
                                            </option>
                                        ))
                                }
                            </select>
                        </div>


                        <div className="RegisForm_1">
                            <label>Generic Name<span>:</span> </label>
                            <input
                                type="text"
                                name='GenericName'
                                autoComplete='off'
                                required
                                value={GenericNameState.GenericName}
                                onChange={(e) => setGenericNameState((prev) => ({ ...prev, GenericName: e.target.value.toUpperCase() }))}
                            />
                        </div>
                    </div>

                    <div className="Main_container_Btn">
                        <button
                            onClick={HandleSaveGenericName}
                        >
                            {GenericNameState.GenericNameID ? "Update" : "Add"}
                        </button>
                    </div>

                    <ReactGrid columns={GenericNameColumn} RowData={GenericNameArray} />



                </>}

                {/* ----------------------------companyname------------------------ */}

                {RackMasterPage === 'ManufacturerName' && <>
                    <br />

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>
                                Product Category <span>:</span>
                            </label>
                            <select
                                name="ProductCategoryName"
                                value={CompanyNameState.ProductCategoryName}
                                onChange={handleChangeCompanyName} // Corrected from onchange to onChange
                            >
                                <option value="">Select</option>
                                {Array.isArray(ProductCategoryData) &&
                                    ProductCategoryData
                                        .filter((p) => p.Status === 'Active') // Filters only active categories
                                        .map((Prod, indx) => (
                                            <option key={indx} value={Prod.id}>
                                                {Prod.ProductCategory}
                                            </option>
                                        ))
                                }
                            </select>
                        </div>


                        <div className="RegisForm_1">
                            <label>
                                SubProduct Category <span>:</span>
                            </label>
                            <select
                                name="SubProductCategoryName"
                                value={CompanyNameState.SubProductCategoryName}
                                onChange={handleChangeCompanyName} // Corrected from onchange to onChange
                            >
                                <option value="">Select</option>
                                {Array.isArray(SubCategoryData) &&
                                    SubCategoryData
                                        .filter((p) => p.Status === 'Active') // Filters only active categories
                                        .map((subProd, indx) => (
                                            <option key={indx} value={subProd.id}>
                                                {subProd.SubCategoryName}
                                            </option>
                                        ))
                                }
                            </select>
                        </div>
                        <div className="RegisForm_1">
                            <label>Manufacturer Name<span>:</span> </label>
                            <input
                                type="text"
                                name='CompanyName'
                                autoComplete='off'
                                required
                                value={CompanyNameState.CompanyName}
                                onChange={(e) => setCompanyNameState((prev) => ({ ...prev, CompanyName: e.target.value.toUpperCase() }))}
                            />
                        </div>
                    </div>

                    <div className="Main_container_Btn">
                        <button
                            onClick={HandleSaveCompanyName}
                        >
                            {CompanyNameState.CompanyNameId ? "Update" : "Add"}
                        </button>
                    </div>

                    <ReactGrid columns={CompanyNameColumn} RowData={CompanyNameArray} />



                </>}






            </div>

            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    )
}

export default InventorySubMasters;
