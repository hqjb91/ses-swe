"use client";

import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import POSConfirmationDialog from "../POSConfirmationDialog/POSConfirmationDialog";
import Link from "next/link";

const POSGrid = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [content, setContent] = useState('');
  const [consolidatedOrders, setConsolidatedOrders] = useState([]);
  const [inputRow, setInputRow] = useState({ status: "New" });
  const [products, setProducts] = useState([])
  const [productsPriceMap, setProductsPriceMap] = useState({});
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([
    {
      field: "product",
      editable: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: products,
      },
    },
    { field: "price", editable: false },
    { field: "quantity", editable: false },
    { field: "status", editable: false },
  ]);

  /**
   * Initialise the row data and product dropdown
   */
  useEffect(() => {
    if (gridApi) {
      getOrdersFromDB();
      getProductsFromDB();
    }
  }, [gridApi]);

  const getOrdersFromDB = async () => {
    const data = await fetch(`/api/order`);
    const response = await data.json();
    const mapResponseToRows = response.map(data => {
                                                    return {
                                                    "product": data['product_name'],
                                                    "price": data['price'],
                                                    "quantity": data['quantity'],
                                                    "status": 'Bought'
                                                  }});
    setRowData(mapResponseToRows);
  };

  const getProductsFromDB = async () => {
    const data = await fetch(`/api/product`);
    const response = await data.json();
    populateProductsPriceMap(response);
    const mapResponseToProductsArray = response.map(data => data['product_name']);
    setProducts(mapResponseToProductsArray);

    // Refresh the cell editor drop down values
    setColDefs([
      {
        field: "product",
        editable: (params) => params.node.rowPinned === 'top',
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: mapResponseToProductsArray,
        },
      },
      { field: "price", editable: false },
      { field: "quantity", editable: (params) => params.node.rowPinned === 'top' },
      { field: "status", editable: false },
    ]);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const isPinnedRowDataCompleted = (params) => {
    if (params.rowPinned !== "top") return; // Check if edited row is pinned row
    return colDefs.every((def) => inputRow[def.field]);
  };

  const onCellEditingStopped = (params) => {

    // If pinned row is completed we create a new empty pinned row and move row down
    if (isPinnedRowDataCompleted(params)) {
      setRowData([inputRow, ...rowData]);
      createInputRow({ status: "New" });
    }

    // If drop down list is selected we populate the price accordingly via product price map
    if (params.rowPinned === "top" && params.column.getColId() === "product" ) {
      setInputRow({...inputRow, price: productsPriceMap[params.newValue]});
    }
  };

  const createInputRow = (newData) => {
    setInputRow(newData);
    gridApi.setPinnedTopRowData([inputRow]);
  };

  const handleSubmit = () => {
    const inputs = rowData.filter((row) => row.status === "New"); // e.g. [{product: 'Apple', quantity: 20}, {product: 'Pineapple', quantity 1}]
    const consolidateOrders = inputs.reduce((accumulator, currentValue) => {
      const existingProduct = accumulator.find(item => item.product === currentValue.product);
    
      if (existingProduct) {
        existingProduct.quantity += currentValue.quantity;
      } else {
        accumulator.push({ product: currentValue.product, quantity: currentValue.quantity });
      }
    
      return accumulator;
    }, []);

    console.log('Consolidated Orders are : ')
    console.log(consolidateOrders)

    setConsolidatedOrders(consolidateOrders);

    let consolidateOrdersToSentence = '';
    let totalPrice = 0;
    consolidateOrders.forEach(order => {
      consolidateOrdersToSentence += ` ${order.quantity} quantities of ${order.product} at $${productsPriceMap[order.product]}`;
      totalPrice += (order.quantity * productsPriceMap[order.product])
    });
    setContent(`Please confirm that you have ordered the following :${consolidateOrdersToSentence}. For a total of $${totalPrice}.`);
    setDialogOpen(true);
  }
  
  const handleClose = () => {
    setDialogOpen(false);
  }

  const handleAgree = async () => {
    const data = await fetch(`/api/order`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(consolidatedOrders)
    });
    const response = await data.json();
    // console.log(response);
    getOrdersFromDB();

    setDialogOpen(false);
  };

  const populateProductsPriceMap = (productListFromDatabase) => {
    const result = {};
    productListFromDatabase.forEach(product => result[product['product_name']] = product['price']);
    setProductsPriceMap(result);
  }

  return (
    <>
    <POSConfirmationDialog title={'Confirmation of Orders'} content={content} handleAgree={handleAgree} open={dialogOpen} handleClose={handleClose} />
    <Grid container direction="column" alignItems="center" justifyContent="center" spacing={2}>
      <Grid item xs={12}>
          <h1>Point of Sales</h1>
      </Grid>
      <Grid item xs={12}>
          <div className="ag-theme-alpine" style={{ height: 400, width: 830 }}>
            <AgGridReact
              pagination={true}
              paginationPageSize={5}
              pinnedTopRowData={[inputRow]}
              rowData={rowData}
              columnDefs={colDefs}
              onGridReady={onGridReady}
              onCellEditingStopped={onCellEditingStopped}
            ></AgGridReact>
          </div>
      </Grid>
      <Grid item xs={12}>
          <Link href="/">
            <Button variant="outlined">
              Back
            </Button>
          </Link>
          <Button sx={{ ml: '1rem' }} variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
      </Grid>
    </Grid>
    </>
  );
};

export default POSGrid;
