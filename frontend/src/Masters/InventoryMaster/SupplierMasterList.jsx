import React, { useCallback, useEffect, useState } from 'react'
import { formatLabel, HandelViewFiledata } from '../../OtherComponent/OtherFunctions';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoupeIcon from "@mui/icons-material/Loupe";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListIcon from '@mui/icons-material/List';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ModelContainer from '../../OtherComponent/ModelContainer/ModelContainer';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';


const SupplierMasterList = () => {

    const dispatchvalue = useDispatch();
    const toast = useSelector(state => state.userRecord?.toast);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const navigate = useNavigate();

    const [SearchQuery, setSearchQuery] = useState({
        FilterBy: 'Supplier',
        SupplierId: '',
        SupplierName: '',
        SupplierType: '',
        ContactNumber: '',
        ItemCode: '',
        ItemName: '',
        ProductCategory: '',
        SubCategory: ''
    });
    const [ProductCategory, setProductCategory] = useState([])
    const [SubCategory, setSubCategory] = useState([])
    const [Listcolumns, setListcolumns] = useState([])
    const [ListcolumnsData, setListcolumnsData] = useState([])
    const [selectRoom, setselectRoom] = useState(false);
    const [selectRoom2, setselectRoom2] = useState(false);
    const [getdata, setgetdata] = useState(false);
    const [Banklist, setBanklist] = useState([])
    const [SupplierItemList, setSupplierItemList] = useState([])
    const [ItemWiseSupplierData, setItemWiseSupplierData] = useState(null)


    useEffect(() => {
        dispatchvalue({ type: 'SupplierMasterStore', value: {} });
    }, [dispatchvalue])



    const handleNewMaster = () => {
        dispatchvalue({ type: 'SupplierMasterStore', value: {} });
        navigate('/Home/SupplierMaster');
    };

    useEffect(() => {

        axios.get(`${UrlLink}Inventory/Supplier_Master_Link`, { params: { ...SearchQuery, forfilter: true } })
            .then((res) => {
                let Rdata = res.data
                if (Array.isArray(Rdata) && Rdata.length !== 0) {
                    setListcolumnsData(Rdata)
                } else {
                    setListcolumnsData([])
                }
            })
            .catch((err) => {
                console.log(err);
                setListcolumnsData([])
            })


    }, [UrlLink, getdata, SearchQuery])
    useEffect(() => {
        axios.get(`${UrlLink}Inventory/Product_Category_Product_Details_link`)
            .then((res) => {
                setProductCategory(res.data)
            })
            .catch((err) => {
                console.error(err);
            })
    }, [UrlLink])


    useEffect(() => {
        if (SearchQuery.ProductCategory) {
            axios.get(`${UrlLink}Masters/SubCategory_Master_link?ProductCategory=${SearchQuery.ProductCategory}`)
                .then((res) => {
                    setSubCategory(res.data)
                })
                .catch((err) => {
                    console.error(err);
                })
        } else {
            setSubCategory([])
        }
    }, [SearchQuery.ProductCategory])

    const handlestatuschange = useCallback((datas) => {
        axios.post(`${UrlLink}Inventory/Supplier_Master_Link`, { SupplierId: datas.SupplierId, StatusEdit: true })
            .then((res) => {
                console.log(res.data);
                let resdata = res.data
                let type = Object.keys(resdata)[0]
                let mess = Object.values(resdata)[0]
                const tdata = {
                    message: mess,
                    type: type,
                }
                dispatchvalue({ type: 'toast', value: tdata });
                setgetdata(prev => !prev)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const HandelViewFiledata = useCallback((fileval) => {


        if (fileval) {
            let tdata = {
                Isopen: false,
                content: null,
                type: 'image/jpg'
            };
            if (['data:image/jpeg;base64', 'data:image/jpg;base64'].includes(fileval?.split(',')[0])) {
                tdata = {
                    Isopen: true,
                    content: fileval,
                    type: 'image/jpeg'
                };
            } else if (fileval?.split(',')[0] === 'data:image/png;base64') {
                tdata = {
                    Isopen: true,
                    content: fileval,
                    type: 'image/png'
                };
            } else if (fileval?.split(',')[0] === 'data:application/pdf;base64') {
                tdata = {
                    Isopen: true,
                    content: fileval,
                    type: 'application/pdf'
                };
            }


            dispatchvalue({ type: 'modelcon', value: tdata });
        } else {
            const tdata = {
                message: 'There is no file to view.',
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });
        }


    }, [dispatchvalue])


    const ItemView = useCallback((params) => {
        axios.get(`${UrlLink}Inventory/Supplier_product_Mapping_link?SupplierId=${params?.SupplierId}`)
            .then((res) => {
                const resdata = res.data
                if (Array.isArray(resdata) && resdata.length !== 0) {
                    setselectRoom(true)
                    setSupplierItemList(resdata)

                } else {
                    setSupplierItemList([])
                    const tdata = {
                        message: 'There is no Product List to view.',
                        type: 'warn'
                    };
                    dispatchvalue({ type: 'toast', value: tdata });
                }
            })
            .catch((err) => {
                console.log(err);
                setSupplierItemList([])

            })
    }, [])


    const AddProductsList = useCallback((params) => {
        if (params.Status === 'Inactive') {
            const tdata = {
                message: `${params.SupplierId} - ${params.SupplierName} is currently inactive. You need to activate it before editing.`,
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });
        } else {
            const {
                Bank_Details,
                Status,
                id,
                ...rest
            } = params;
            dispatchvalue({ type: 'SupplierMasterStore', value: { ...rest, ...Bank_Details[0] } });
            navigate('/Home/SupplierProductMap');
        }
    }, [])



    const BankView = useCallback((row) => {

        let Item = row.Bank_Details

        if (Item && Item.length !== 0) {
            setselectRoom2(true)
            setBanklist(Item)
        }
        else {

            const tdata = {
                message: 'There is no data to view.',
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });

        }

    }, [dispatchvalue])


    const HandelEditdata = useCallback((row) => {
        if (row.Status === 'Inactive') {
            const tdata = {
                message: `${row.SupplierId} - ${row.SupplierName} is currently inactive. You need to activate it before editing.`,
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });
        } else {
            const {
                Bank_Details,
                Status,
                id,
                ...rest
            } = row;
            dispatchvalue({ type: 'SupplierMasterStore', value: { ...rest, ...Bank_Details[0] } });
            navigate('/Home/SupplierMaster');
        }
    }, [dispatchvalue, navigate])

    const SupplierWiseItemView = useCallback((params) => {
        axios.get(`${UrlLink}Inventory/Product_wise_supplier_getdata?ItemCode=${params?.ItemCode}`)
            .then((res) => {
                const { data, Suppliers } = res.data
                if (Array.isArray(Suppliers) && Suppliers.length !== 0) {
                    const suppcolumn = [
                        { key: 'id', name: 'S.No' },
                        { key: 'AmountType', name: 'AmountType' },
                        ...Suppliers.map(field => {
                            return {
                                key: field.id,
                                name: field.Name
                            }
                        })
                    ]
                    setItemWiseSupplierData({ data, column: suppcolumn })

                } else {
                    setItemWiseSupplierData(null)
                    const tdata = {
                        message: 'There is no Supplier Mapped on this Product to view.',
                        type: 'warn'
                    };
                    dispatchvalue({ type: 'toast', value: tdata });
                }
            })
            .catch((err) => {
                console.log(err);
                setSupplierItemList([])

            })
    }, [])
    useEffect(() => {
        setSearchQuery(prev => ({
            ...prev,
            SupplierId: '',
            SupplierName: '',
            SupplierType: '',
            ContactNumber: '',
            ItemCode: '',
            ItemName: '',
            ProductCategory: '',
            SubCategory: ''
        }))


        const suppliercolumns = [
            {
                key: 'id',
                name: 'S.No',
            },
            {
                key: 'SupplierId',
                name: 'Supplier Id',
            },
            {
                key: 'SupplierName',
                name: 'Supplier Name',
            },
            {
                key: 'SupplierType',
                name: 'Supplier Type',
            },
            {
                key: 'ContactPerson',
                name: 'Contact Person',
            }, {
                key: 'ContactNumber',
                name: 'Contact Number',
            }, {
                key: 'EmailAddress',
                name: ' Email',
            }, {
                key: 'Address',
                name: 'Address',
            }, {
                key: 'RegistrationNumber',
                name: 'Registr No',
            }, {
                key: 'GSTNumber',
                name: 'GST Number',
            }, {
                key: 'PANNumber',
                name: 'PAN Number',
            }, {
                key: 'PaymentTerms',
                name: 'Payment Terms',
            }, {
                key: 'CreditLimit',
                name: 'Credit Limit',
            }, {
                key: 'LeadTime',
                name: 'Lead Time',
            }, {
                key: 'Status',
                name: 'Status',
                renderCell: (params) => (
                    <Button className="cell_btn"
                        onClick={() => handlestatuschange(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                )
            }, {
                key: 'Notes',
                name: 'Notes',
            }, {
                key: 'FileAttachment',
                name: 'Document',
                renderCell: (params) => (
                    <>
                        <Button className="cell_btn"
                            onClick={() => HandelViewFiledata(params.row.FileAttachment)}
                        >
                            <VisibilityIcon className="check_box_clrr_cancell" />
                        </Button>
                    </>
                )
            }, {
                key: 'Item_details',
                name: 'Item List',
                renderCell: (params) => (
                    <>
                        <Button className="cell_btn"
                            onClick={() => ItemView(params.row)}
                            title='View Products'

                        >
                            <ListIcon className="check_box_clrr_cancell" />
                        </Button>
                        <Button className="cell_btn"
                            onClick={() => AddProductsList(params.row)}
                            title='Add new Products'
                        >
                            <PlaylistAddIcon className="check_box_clrr_cancell" />
                        </Button>
                    </>
                )
            }, {
                key: 'Bank_Details',
                name: 'Bank Details',
                renderCell: (params) => (
                    <>
                        <Button className="cell_btn"
                            onClick={() => BankView(params.row)}
                        >
                            <ListIcon className="check_box_clrr_cancell" />
                        </Button>
                    </>
                )
            }, {
                key: 'Action',
                name: 'Action',
                renderCell: (params) => (
                    <>
                        <Button className="cell_btn"
                            onClick={() => HandelEditdata(params.row)}
                        >
                            <EditIcon className="check_box_clrr_cancell" />
                        </Button>
                    </>
                )
            }
        ]
        const ItemsColumns = [
            {
                key: 'id',
                name: 'S.No',
            },
            {
                key: 'ItemCode',
                name: 'Item Code',
            },
            {
                key: 'ItemName',
                name: 'Item Name',
            },
            {
                key: 'ProductCategory',
                name: 'Product Category',
            },
            {
                key: 'SubCategory',
                name: 'Sub Category',
            },
            {
                key: 'Supplier Detials',
                name: 'Supplier Details',
                renderCell: (params) => (
                    <>
                        <Button className="cell_btn"
                            onClick={() => SupplierWiseItemView(params.row)}
                        >
                            <ListIcon className="check_box_clrr_cancell" />
                        </Button>
                    </>
                )
            },
        ]

        if (SearchQuery.FilterBy === 'Supplier') {
            setListcolumns(suppliercolumns)
        } else {
            setListcolumns(ItemsColumns)
        }
    }, [
        SearchQuery.FilterBy,
        handlestatuschange,
        HandelViewFiledata,
        ItemView, AddProductsList,
        BankView, HandelEditdata,
        SupplierWiseItemView
    ])


    const BankColumn = [
        {
            key: 'id',
            name: 'Id',
        }, {
            key: 'BankName',
            name: 'Bank Name',
        }, {
            key: 'AccountNumber',
            name: 'AccountNumber',
        }, {
            key: 'IFSCCode',
            name: 'IFSC Code',
        }, {
            key: 'BankBranch',
            name: 'Bank Branch',
        },

    ]


    const SupplierProductListColumn = [
        { key: 'id', name: 'S.No' },
        { key: 'ItemCode', name: 'ItemCode' },
        { key: 'ItemName', name: 'Item Name' },
        { key: 'ProductCategory', name: 'Product Category' },
        { key: 'SubCategory', name: 'Sub Category' },
        { key: 'ManufacturerName', name: 'Manufacturer Name' },
        { key: 'GenericName', name: 'Generic Name' },
        { key: 'HSNCode', name: 'HSN Code' },
        { key: 'MRP', name: 'MRP' },
        { key: 'PurchaseRateBeforeGST', name: 'Purchase Rate Before GST', width: 180 },
        { key: 'GST', name: 'GST' },
        { key: 'PurchaseRateAfterGST', name: 'Purchase Rate After GST', width: 180 },
        { key: 'Status', name: 'Status' },

    ]
    return (
        <>
            <div className="Main_container_app">
                <h3>Supplier Master List</h3>
                <br />
                <div className="RegisFormcon_1">
                    {
                        Object.keys(SearchQuery).filter(f => {
                            if (f === 'FilterBy') {
                                return true;
                            }

                            if (SearchQuery.FilterBy === 'Supplier' && ['SupplierId', 'SupplierName', 'SupplierType', 'ContactNumber'].includes(f)) {
                                return true;
                            }
                            if (SearchQuery.FilterBy !== 'Supplier' && !['SupplierId', 'SupplierName', 'SupplierType', 'ContactNumber'].includes(f)) {
                                return true;
                            }
                        }).map((field, indx) => (
                            <div className="RegisForm_1" key={indx + 'key'}>
                                <label htmlFor={field}>
                                    {formatLabel(field)}
                                    <span>:</span>
                                </label>
                                {
                                    ['SupplierType', 'FilterBy', 'ProductCategory', 'SubCategory'].includes(field) ?
                                        <select
                                            id={field}
                                            name={field}
                                            value={SearchQuery[field]}
                                            onChange={(e) => setSearchQuery(prev => ({ ...prev, [field]: e.target.value }))}

                                        >
                                            {field !== 'FilterBy' && <option value="">Select</option>}
                                            {field === 'SupplierType' &&
                                                ['Manufacturer', 'Distributor', 'Wholesaler', 'Retailer', 'OEM', 'Vendor'].map((ele, ind) => (
                                                    <option key={ind} value={ele}>{ele === 'OEM' ? 'Original Equipment Manufacturer' : ele}</option>
                                                ))
                                            }
                                            {field === 'FilterBy' &&
                                                ['Supplier', 'Item'].map((ele, ind) => (
                                                    <option key={ind} value={ele}>{ele} wise</option>
                                                ))
                                            }
                                            {
                                                field === 'ProductCategory' &&
                                                ProductCategory.map((ele, ind) => (
                                                    <option key={ind} value={ele.id}>{ele.ProductCategory}</option>
                                                ))
                                            }
                                            {
                                                field === 'SubCategory' &&
                                                SubCategory.map((ele, ind) => (
                                                    <option key={ind} value={ele.id}>{ele.SubCategoryName}</option>
                                                ))
                                            }

                                        </select>
                                        :
                                        < input
                                            type={'text'}
                                            id={field}
                                            name={field}
                                            value={SearchQuery[field]}
                                            onChange={(e) => setSearchQuery(prev => ({ ...prev, [field]: e.target.value }))}
                                        />
                                }
                            </div>
                        ))
                    }
                </div>
                <br />

                <div className="Main_container_Btn">
                    <button onClick={handleNewMaster}>
                        <LoupeIcon />
                    </button>
                </div>
                <br />
                <ReactGrid columns={Listcolumns} RowData={ListcolumnsData} />

            </div>


            {selectRoom && SupplierItemList.length !== 0 && (
                <div className="loader" onClick={() => setselectRoom(false)}>
                    <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
                        <br />

                        <div className="common_center_tag">
                            <span>Item List Details</span>
                        </div>
                        <br />
                        <br />
                        <ReactGrid columns={SupplierProductListColumn} RowData={SupplierItemList} />
                    </div>
                </div>
            )}
            {selectRoom2 && Banklist.length !== 0 && (
                <div className="loader" onClick={() => setselectRoom2(false)}>
                    <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
                        <br />

                        <div className="common_center_tag">
                            <span>Bank Details</span>
                        </div>
                        <br />
                        <br />


                        <ReactGrid columns={BankColumn} RowData={Banklist} />
                    </div>
                </div>
            )}
            {ItemWiseSupplierData && (
                <div className="loader" onClick={() => setItemWiseSupplierData(null)}>
                    <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
                        <br />

                        <div className="common_center_tag">
                            <span>Supplier Wise Product Rate</span>
                        </div>
                        <br />
                        <br />


                        <ReactGrid columns={ItemWiseSupplierData?.column} RowData={ItemWiseSupplierData?.data} />
                    </div>
                </div>
            )}



            <ToastAlert Message={toast.message} Type={toast.type} />
            <ModelContainer />
        </>
    )
}

export default SupplierMasterList;