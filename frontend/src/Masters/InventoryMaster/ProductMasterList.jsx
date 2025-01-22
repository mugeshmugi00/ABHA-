import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoupeIcon from "@mui/icons-material/Loupe";
import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import EditIcon from "@mui/icons-material/Edit";
import ListIcon from '@mui/icons-material/List';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { formatunderscoreLabel } from '../../OtherComponent/OtherFunctions';


const ProductMasterList = () => {


    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);

    const navigate = useNavigate();
    const dispatchvalue = useDispatch();
    const [SearchQuery, setSearchQuery] = useState({
        ProductCategory: '',
        SubCategory: '',
        ItemId: '',
        ItemName: '',
        GenericName: '',
        CompanyName: '',
        HSNCode: '',

    });
    const [ProductArray, setProductArray] = useState([])
    const [CategoryArray, setCategoryArray] = useState([])
    const [SubCategoryArray, setSubCategoryArray] = useState([])
    const [GenericNameData, setGenericNameData] = useState([])
    const [ManufactureData, setManufactureData] = useState([])
    const [getdata, setgetdata] = useState(false)
    const [ProductColumn, setProductColumn] = useState([])
    const [ProductDrugSegment, setProductDrugSegment] = useState({})


    useEffect(() => {
        const fetchdata = async () => {
            try {
                const [data1, data2, data3] = await Promise.all([
                    axios.get(`${UrlLink}Inventory/Product_Category_Product_Details_link`),
                    axios.get(`${UrlLink}Masters/CompanyName_Master_Link`),
                ])

                setCategoryArray(data1.data)
           
                setManufactureData(data3.data)
            } catch (error) {
                console.error(error);

            }
        }
        fetchdata()
    }, [UrlLink])

    
    
    useEffect(() => {
      const fetchdatachange = async () => {
        if (SearchQuery.ProductCategory && SearchQuery.SubCategory) {
          try {
            // Use Promise.all with proper syntax
            const [data4, data5] = await Promise.all([
              axios.get(
                `${UrlLink}Masters/GenericName_by_Product_SubProduct?ProductCategory=${SearchQuery.ProductCategory}&SubProductCategory=${SearchQuery.SubCategory}`
              ),
              axios.get(
                `${UrlLink}Masters/CompanyName_by_Product_SubProduct?ProductCategory=${SearchQuery.ProductCategory}&SubProductCategory=${SearchQuery.SubCategory}`
              ),
            ]);
    
            // Set state with the fetched data
            setGenericNameData(data4.data);
            
            setManufactureData(data5.data);
            console.log("data5.data",data5.data)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      };
    
      fetchdatachange();
    }, [UrlLink, SearchQuery.ProductCategory, SearchQuery.SubCategory]);
    



    useEffect(() => {
        if (SearchQuery.ProductCategory) {
            axios.get(`${UrlLink}Masters/SubCategory_Master_link?ProductCategory=${SearchQuery.ProductCategory}`)
                .then((res) => {
                    let data = res.data

                    if (Array.isArray(data) && data.length !== 0) {
                        setSubCategoryArray(data)
                    }
                    else {
                        setSubCategoryArray([])
                    }

                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            setSubCategoryArray([])
        }

    }, [UrlLink, SearchQuery.ProductCategory])




    useEffect(() => {

        axios.get(`${UrlLink}Inventory/product_master_Detials_link`, { params: SearchQuery })
            .then((res) => {
                let data = res.data

                if (Array.isArray(data) && data.length !== 0) {
                    setProductArray(data)
                }
                else {
                    setProductArray([])
                }

            })
            .catch((err) => {
                console.log(err)
            })

    }, [UrlLink, SearchQuery, getdata])



    const handelStatuseditdata = useCallback((params) => {
        axios.post(`${UrlLink}Inventory/Update_product_master_status`, {
            ItemCode: params.Item_Code
        })
            .then((ress) => {
                const data = ress.data

                let type = Object.keys(data)[0]
                let mess = Object.values(data)[0]
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
    }, [UrlLink,dispatchvalue])

    const handleviewDrugSegment = useCallback((params) => {
        if (params?.Drug_Segment.length === 0) {
            const tdata = {
                message: `${params.Item_Code} - ${params.Item_Name} is currently inactive. You need to activate it before editing.`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });
        } else {
            axios.get(`${UrlLink}Inventory/get_Drug_segments`)
                .then((ress) => {
                    const data = ress.data.filter(f => params?.Drug_Segment?.includes(f.id))
                    console.log(ress.data);
                    console.log(data);

                    setProductDrugSegment({
                        Item_Code: params.Item_Code,
                        Item_Name: params.Item_Name,
                        data
                    })
                })
                .catch((err) => {
                    console.log(err);

                })
        }
    }, [UrlLink,dispatchvalue])

    const handelEditdata = useCallback((params) => {

        dispatchvalue({ type: 'MedicalProductMaster', value: {} });


        if (params?.Status === 'Active') {

            dispatchvalue({ type: 'MedicalProductMaster', value: { ...params } });
            navigate('/Home/Productmaster');
        } else {
            const tdata = {
                message: `${params.Item_Code} - ${params.Item_Name} is currently inactive. You need to activate it before editing.`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }

    }, [dispatchvalue,navigate])




    useEffect(() => {
        const ProductMasterFields = [
            'Item_Code',
            'Item_Name',
            'Product_Category',
            'Sub_Category',
            'Generic_Name',
            'Manufacturer_Name',
            'HSN_Code',
            'Product_Type',
            'Product_Group',
            'Strength',
            'Strength_Type',
            'Volume',
            'Volume_Type',
            'Pack_Type',
            'Pack_Quantity',
            'Minimum_Quantity',
            'Maximum_Quantity',
            'Re_order_Level',
            'Is_Reusable',
            'Re_Usable_Times',
            'Is_Sellable',
            'Least_Sellable_Unit',
            'Is_Partial_Use',
            'Is_Perishable',
            'Perishable_Duration',
            'Perishable_Duration_Type',
            'Product_Description',
            'Drug_Segment',
            'Status',
            'Action',
        ]
        const colname = [
            { key: 'id', name: 'S.No' },
            ...ProductMasterFields.map(field => {
                if (['Is_Reusable', 'Is_Sellable', 'Is_Partial_Use', 'Is_Perishable', 'Status', 'Drug_Segment', 'Action'].includes(field)) {
                    return {
                        key: field,
                        name: formatunderscoreLabel(field),
                        renderCell: (params) => {
                            if (field === 'Status') {
                                return (
                                    <Button className="cell_btn" onClick={() => handelStatuseditdata(params.row)}>
                                        {params.row.Status}
                                    </Button>
                                )
                            } else if (field === 'Drug_Segment') {
                                return (
                                    <Button className="cell_btn" onClick={() => handleviewDrugSegment(params.row)}>
                                        <ListIcon className="check_box_clrr_cancell" />
                                    </Button>
                                )
                            } else if (field === 'Action') {

                                return (
                                    <Button className="cell_btn" onClick={() => handelEditdata(params.row)}>
                                        <EditIcon className="check_box_clrr_cancell" />
                                    </Button>
                                )

                            } else {
                                return (
                                    params.row[field] 
                                )
                            }

                        }
                    }
                } else {
                    return {
                        key: field,
                        name: formatunderscoreLabel(field)

                    }
                }
            })
        ]
        setProductColumn(colname)
    }, [handelStatuseditdata, handleviewDrugSegment, handelEditdata])





    const handleNewMaster = () => {

        dispatchvalue({ type: 'MedicalProductMaster', value: {} });
        navigate('/Home/Productmaster');
    };

    return (
        <>
            <div className="Main_container_app">
                <h3> Product Master List</h3>
                <div className="RegisFormcon_1">
                    {
                        Object.keys(SearchQuery).map((field, indx) => (
                            <div className="RegisForm_1" key={indx + 'key'}>
                                <label htmlFor={field}>
                                    {field}
                                    <span>:</span>
                                </label>
                                {
                                    ['ProductCategory', 'SubCategory', 'GenericName', 'CompanyName'].includes(field) ?
                                        <select
                                            id={field}
                                            name={field}
                                            value={SearchQuery[field]}
                                            onChange={(e) => setSearchQuery(prev => ({ ...prev, [field]: e.target.value }))}
                                        >
                                            <option value="">Select</option>
                                            {field === 'ProductCategory' &&
                                                CategoryArray.map((ele, ind) => (
                                                    <option key={ind} value={ele.id}>{ele.ProductCategory}</option>
                                                ))}
                                            {field === 'SubCategory' &&
                                                SubCategoryArray.map((ele, ind) => (
                                                    <option key={ind} value={ele.id}>{ele.SubCategoryName}</option>
                                                ))
                                            }
                                            {field === 'GenericName' &&
                                                GenericNameData.map((ele, ind) => (
                                                    <option key={ind} value={ele.id}>{ele.GenericName}</option>
                                                ))
                                            }
                                            {field === 'CompanyName' &&
                                                ManufactureData.map((ele, ind) => (
                                                    <option key={ind} value={ele.id}>{ele.CompanyName}</option>
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
                <div className="Main_container_Btn">
                    <button onClick={handleNewMaster}>
                        <LoupeIcon />
                    </button>
                </div>
                <ReactGrid columns={ProductColumn} RowData={ProductArray} />

            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />

            {Object.keys(ProductDrugSegment).length !== 0 && (
                <div className='loader' onClick={() => setProductDrugSegment({})}>
                    <div
                        className='loader_register_roomshow'
                        onClick={e => e.stopPropagation()}
                    >
                        <br />

                        <div className='common_center_tag'>
                            <span>Selected Drug Segments for '{ProductDrugSegment?.Item_Code} - {ProductDrugSegment?.Item_Name} '</span>
                        </div>
                        <br />
                        <br />
                        <div className='displayuseraccess'>
                            {ProductDrugSegment?.data
                                .map((p, indx) => (
                                    <div className='displayuseraccess_child' key={indx}>
                                        <label
                                            htmlFor={`${indx}_${p?.Segment}`}
                                            className='par_acc_lab'
                                            title={p?.Description}
                                        >
                                            {`${indx + 1}. ${p?.Segment}`}
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductMasterList;