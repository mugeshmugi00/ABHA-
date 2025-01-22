import {
  Button,
  Checkbox,
  debounce,
  FormControlLabel,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

const OtCharges = () => {
  const [otCharges, setOtCharges] = useState([]);
  const [newCharge, setNewCharge] = useState({
    serviceName: "",
    units: "",
    perHourCost: "",
    amount: "",
    id: Date.now(),
  });

  const [isConsumable, setIsConsumable] = useState(false);
  const [isConsignment, setIsConsignment] = useState(false);
  const [consumableText, setConsumableText] = useState("");
  const [consignmentText, setConsignmentText] = useState("");

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [consumableAmount, setConsumableAmount] = useState("");
  const [consumableData, setConsumableData] = useState([]);
  const [consignmentData, setConsignmentData] = useState([]);

  const [checkboxes, setCheckboxes] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [availableQuantity, setAvaibleQuantity] = useState(0);

  const [equipmentName, setequipmentName] = useState("");
  const [quantity1, setQuantity1] = useState("");
  const [amount1, setAmount1] = useState("");

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  // Debounced function to search for items as the user types
  const searchItems = debounce(async (query) => {
    if (query.trim() === "") return setSearchResults([]); // Don't search if input is empty

    try {
      const response = await axios.get(
        `${UrlLink}Masters/Inventory_Master_Search_link`,
        {
          params: { query }, // Pass the search query to your API
        }
      );
      setSearchResults(response.data); // Set the search results from the response
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }, 500);

  // Fetching the inventory items from the API
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Inventory_Master_Detials_link`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setInventoryItems(res.data);
        } else {
          console.error("API response is not an array", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching inventory data:", err);
      });
  }, [UrlLink]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCharge((prevState) => {
      const updatedCharge = { ...prevState, [name]: value };

      if (name === "units" || name === "perHourCost") {
        updatedCharge.amount = updatedCharge.units * updatedCharge.perHourCost;
      }

      return updatedCharge;
    });
  };

  const handleAddRow = () => {
    setOtCharges((prevState) => [
      ...prevState,
      {
        ...newCharge,
        isConsumable,
        isConsignment,
        consumableText,
        consignmentText,
        itemName,
        quantity,
        consumableAmount,
      },
    ]);

    setNewCharge({
      serviceName: "",
      units: "",
      perHourCost: "",
      amount: "",
      id: Date.now(),
      isEditing: false,
    });
    setIsConsumable(false);
    setIsConsignment(false);
    setConsumableText("");
    setConsignmentText("");
    setItemName("");
    setQuantity("");
    setConsumableAmount("");
  };

  const handleAddConsumable = () => {
    if (itemName && quantity && consumableAmount) {
      setConsumableData((prevData) => [
        ...prevData,
        { itemName, quantity, consumableAmount },
      ]);
      setItemName("");
      setQuantity("");
      setConsumableAmount("");
      setAvaibleQuantity(0);
    }
  };

  const handleAddConsignment = () => {
    if (equipmentName && quantity1 && amount1) {
      setConsignmentData((prevData) => [
        ...prevData,
        { equipmentName, quantity1, amount1 },
      ]);
      setequipmentName("");
      setQuantity1("");
      setAmount1("");
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 0;
    setQuantity(newQuantity);
    setCheckboxes(new Array(newQuantity).fill(false));
  };

  const handleProductSelect = (product) => {
    setItemName(product);
    setAvaibleQuantity(product);
  };

  const handleEditCharge = (rowId) => {
    setOtCharges((prevState) =>
      prevState.map((charge) =>
        charge.id === rowId ? { ...charge, isEditing: true } : charge
      )
    );
  };

  const handleSaveEdit = (index) => {
    setOtCharges((prevState) =>
      prevState.map((charge, i) =>
        i === index ? { ...charge, isEditing: false } : charge
      )
    );
  };

  const handleCancelEdit = (index) => {
    setOtCharges((prevState) =>
      prevState.map((charge, i) =>
        i === index ? { ...charge, isEditing: false } : charge
      )
    );
  };

  const handleEditConsumable = (index) => {
    const updatedData = [...consumableData];
    updatedData[index].isEditing = true;
    setConsumableData(updatedData);
  };

  const handleSaveConsumable = (index) => {
    const updatedData = [...consumableData];
    updatedData[index].isEditing = false;
    setConsumableData(updatedData);
  };

  const handleCancelConsumable = (index) => {
    const updatedData = [...consumableData];
    updatedData[index].isEditing = false;
    setConsumableData(updatedData);
  };

  const handleEditConsignment = (index) => {
    const updatedData = [...consignmentData];
    updatedData[index].isEditing = true;
    setConsignmentData(updatedData);
  };

  const handleSaveConsignment = (index) => {
    const updatedData = [...consignmentData];
    updatedData[index].isEditing = false;
    setConsignmentData(updatedData);
  };

  const handleCancelConsignment = (index) => {
    const updatedData = [...consignmentData];
    updatedData[index].isEditing = false;
    setConsignmentData(updatedData);
  };

  const handleItemChange = (e) => {
    const input = e.target.value;
    setItemName(input);
    searchItems(input);
  };

  const handleCheckboxChange = (e, rowIndex, checkboxIndex) => {
    const updatedData = [...consumableData];
    const isChecked = e.target.checked;
    if (!updatedData[rowIndex].checkboxes) {
      updatedData[rowIndex].checkboxes = [];
    }

    updatedData[rowIndex].checkboxes[checkboxIndex] = isChecked;

    setConsumableData(updatedData);
  };

  return (
    <div className="Main_container_app">
      <h4>OT Charges</h4>

      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label>
            Service Name<span>:</span>
          </label>
          <select
            name="serviceName"
            value={newCharge.serviceName}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Service</option>
            <option value="PRIMARY SURGEN">PRIMARY SURGEN FEE</option>
            <option value="ASSISTING SURGEN">ASSISTING SURGEN FEE</option>
            <option value="ANESTHETIST">ANESTHETIST FEE</option>
            <option value="PHYSICIAN">PHYSICIAN FEE</option>
            <option value="CONSULTANT">CONSULTANT FEE</option>
            <option value="NURSE">NURSE FEE</option>
            <option value="TECHNICIAN">TECHNICIAN FEE</option>
            <option value="OPERATION THEATER">OPERATION THEATER CHARGES</option>
            <option value="EQUBIPMENT">EQUBIPMENT CHARGES</option>
            <option value="BLOOD">BLOOD</option>
            <option value="OXYGEN/OTHER GAS">OXYGEN/OTHER GAS</option>
            <option value="SURGICAL APPLIANCE">
              SURGICAL APPLIANCE CHARGE
            </option>
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            No. of Units<span>:</span>
          </label>
          <input
            type="number"
            name="units"
            value={newCharge.units}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Per Hour Cost<span>:</span>
          </label>
          <input
            type="number"
            name="perHourCost"
            value={newCharge.perHourCost}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Amount<span>:</span>
          </label>
          <input
            type="number"
            name="amount"
            value={newCharge.amount}
            readOnly
          />
        </div>
      </div>

      <div className="Main_container_Btn">
        <Button onClick={handleAddRow}>
          <AddIcon />
        </Button>
      </div>

      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Service Name</th>
              <th>No. of Units</th>
              <th>Per Hour Cost</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {otCharges.map((charge, index) => (
              <tr key={charge.id}>
                <td>{index + 1}</td>
                <td>
                  {charge.isEditing ? (
                    <input
                      type="text"
                      name="serviceName"
                      value={charge.serviceName}
                      onChange={(e) => {
                        const updatedCharges = [...otCharges];
                        updatedCharges[index].serviceName = e.target.value;
                        setOtCharges(updatedCharges);
                      }}
                    />
                  ) : (
                    charge.serviceName
                  )}
                </td>
                <td>
                  {charge.isEditing ? (
                    <input
                      type="number"
                      name="units"
                      value={charge.units}
                      onChange={(e) => {
                        const updatedCharges = [...otCharges];
                        updatedCharges[index].units = e.target.value;
                        updatedCharges[index].amount =
                          updatedCharges[index].units *
                          updatedCharges[index].perHourCost;
                        setOtCharges(updatedCharges);
                      }}
                    />
                  ) : (
                    charge.units
                  )}
                </td>
                <td>
                  {charge.isEditing ? (
                    <input
                      type="number"
                      name="perHourCost"
                      value={charge.perHourCost}
                      onChange={(e) => {
                        const updatedCharges = [...otCharges];
                        updatedCharges[index].perHourCost = e.target.value;
                        updatedCharges[index].amount =
                          updatedCharges[index].units *
                          updatedCharges[index].perHourCost;
                        setOtCharges(updatedCharges);
                      }}
                    />
                  ) : (
                    charge.perHourCost
                  )}
                </td>
                <td>
                  {charge.isEditing ? (
                    <input type="number" value={charge.amount} readOnly />
                  ) : (
                    charge.amount
                  )}
                </td>
                <td>
                  {charge.isEditing ? (
                    <>
                      <Button onClick={() => handleSaveEdit(index)}>
                        <CheckIcon />
                      </Button>
                      <Button onClick={() => handleCancelEdit(index)}>
                        <CancelIcon />
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEditCharge(charge.id)}>
                      <EditIcon />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="Main_container_app">
        <FormControlLabel
          control={
            <Checkbox
              checked={isConsumable}
              onChange={() => setIsConsumable(!isConsumable)}
            />
          }
          label="Consumable"
        />
        {isConsumable && (
          <div className="Main_container_app">
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Item Name/Code<span>:</span>
                </label>
                <select
                  name="ItemNameCode"
                  value={itemName}
                  onChange={handleItemChange}
                >
                  <option value="">Select Item</option>{" "}
                  {/* Placeholder option */}
                  {searchResults.map((product, idx) => (
                    <option key={idx} value={product.code}>
                      {product.name} - {product.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="RegisForm_1">
                <label>Available Quantity:</label>
                <input
                  type="number"
                  value={availableQuantity}
                  readOnly
                  disabled
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  Quantity<span>:</span>
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  max={availableQuantity} // Limit max quantity to available quantity
                  required
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Amount<span>:</span>
                </label>
                <input
                  type="number"
                  name="Amount"
                  value={consumableAmount}
                  onChange={(e) => setConsumableAmount(e.target.value)}
                  required
                />
              </div>
              <div className="Main_container_Btn">
                <Button onClick={handleAddConsumable}>
                  <AddIcon />
                </Button>
              </div>
            </div>
          </div>
        )}
        {consumableData.length > 0 && (
          <div className="Selected-table-container">
            <h4>Consumable Table</h4>
            <div className="Selected-table-container">
              <table className="selected-medicine-table2">
                <thead>
                  <tr>
                    <th>Item Name/Code</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {consumableData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {item.isEditing ? (
                          <input
                            type="text"
                            value={item.itemName}
                            onChange={(e) => {
                              const updatedData = [...consumableData];
                              updatedData[index].itemName = e.target.value;
                              setConsumableData(updatedData);
                            }}
                          />
                        ) : (
                          item.itemName
                        )}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: "5px",
                          }}
                        >
                          {item.isEditing ? (
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const updatedData = [...consumableData];
                                updatedData[index].quantity = e.target.value;
                                updatedData[index].consumableAmount =
                                  updatedData[index].quantity *
                                  updatedData[index].consumableAmountPerUnit;
                                setConsumableData(updatedData);
                              }}
                            />
                          ) : (
                            item.quantity
                          )}

                          <div style={{ display: "flex", flex: "warp" }}>
                            {Array.from({ length: item.quantity }, (_, i) => (
                              <label key={i}>
                                <Checkbox
                                  type="checkbox"
                                  name={`checkbox-${index}-${i}`}
                                  checked={
                                    item.checkboxes ? item.checkboxes[i] : true
                                  }
                                  onChange={(e) =>
                                    handleCheckboxChange(e, index, i)
                                  }
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td>
                        {item.isEditing ? (
                          <input
                            type="number"
                            value={item.consumableAmount}
                            onChange={(e) => {
                              const updatedData = [...consumableData];
                              updatedData[index].consumableAmount =
                                e.target.value;
                              setConsumableData(updatedData);
                            }}
                          />
                        ) : (
                          item.consumableAmount
                        )}
                      </td>
                      <td>
                        {item.isEditing ? (
                          <>
                            <Button onClick={() => handleSaveConsumable(index)}>
                              <CheckIcon />
                            </Button>
                            <Button
                              onClick={() => handleCancelConsumable(index)}
                            >
                              <CancelIcon />
                            </Button>
                          </>
                        ) : (
                          <Button onClick={() => handleEditConsumable(index)}>
                            <EditIcon />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={isConsignment}
              onChange={() => setIsConsignment(!isConsignment)}
            />
          }
          label="Consignment"
        />
        {isConsignment && (
          <div className="Main_container_app">
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Equipment Name<span>:</span>
                </label>
                <input
                  type="text"
                  name="equipmentName"
                  value={equipmentName}
                  onChange={(e) => setequipmentName(e.target.value)}
                  // required
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Quantity<span>:</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={quantity1}
                  onChange={(e) => setQuantity1(e.target.value)}
                  // required
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Amount<span>:</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={amount1}
                  onChange={(e) => setAmount1(e.target.value)}
                  // required
                />
              </div>

              <div className="Main_container_Btn">
                <Button onClick={handleAddConsignment}>
                  <AddIcon />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {consignmentData?.length > 0 && (
        <div className="Selected-table-container">
          <h4>Consignment Table</h4>
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th>Equipment Name</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {consignmentData?.map((item1, index1) => (
                  <tr key={index1}>
                    <td>
                      {item1.isEditing ? (
                        <input
                          type="text"
                          value={item1.equipmentName}
                          onChange={(e) => {
                            const updatedData = [...consumableData];
                            updatedData[index1].equipmentName = e.target.value;
                            setConsumableData(updatedData);
                          }}
                        />
                      ) : (
                        item1.equipmentName
                      )}
                    </td>
                    <td>
                      {item1.isEditing ? (
                        <input
                          type="number"
                          value={item1.quantity1}
                          onChange={(e) => {
                            const updatedData = [...consumableData];
                            updatedData[index1].quantity = e.target.value;
                            updatedData[index1].consumableAmount =
                              updatedData[index1].quantity *
                              updatedData[index1].consumableAmountPerUnit;
                            setConsumableData(updatedData);
                          }}
                        />
                      ) : (
                        item1.quantity1
                      )}
                    </td>
                    <td>
                      {item1.isEditing ? (
                        <input
                          type="number"
                          value={item1.amount1}
                          onChange={(e) => {
                            const updatedData = [...consumableData];
                            updatedData[index1].amount1 = e.target.value;
                            setConsumableData(updatedData);
                          }}
                        />
                      ) : (
                        item1.amount1
                      )}
                    </td>
                    <td>
                      {item1.isEditing ? (
                        <>
                          <Button onClick={() => handleSaveConsignment(index1)}>
                            <CheckIcon />
                          </Button>
                          <Button
                            onClick={() => handleCancelConsignment(index1)}
                          >
                            <CancelIcon />
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => handleEditConsignment(index1)}>
                          <EditIcon />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtCharges;
