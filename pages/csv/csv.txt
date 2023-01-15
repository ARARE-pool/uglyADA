// import React, { useState } from 'react';
import { useState } from "react";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import { BrowserWallet } from '@meshsdk/core';
import { Transaction } from '@meshsdk/core';
import { useWalletList } from '@meshsdk/react';
import { BlockfrostProvider } from '@meshsdk/core';
import Papa from 'papaparse';

const UploadCSV = () => {
  const [data, setData] = useState([]);

  const handleUpload = (e:any) => {
    let file = e.target.files[0];
    
    Papa.parse(file, {
      header: false,
      complete: (results) => {
        const resultStore = typeof results.data === 'string' 
        ? results.data : []
        setData(typeof results.data === 'string' 
        ? results.data : []);
        console.log(results)
        console.log("Result lenght: ", results.data.length)
        for(let i=0; i<results.data.length; i++){
          console.log("Address : ", resultStore[i][0]); //use i instead of 0
          console.log("Lovelace : ", resultStore[i][1]); //use i instead of 0
      }
      }
    });
  }



  return (
    <div>
      <input type="file" onChange={handleUpload} />
      <table>
        <tbody>
          {data.map((row, index) => (
            // <tr key={index}>
            //   {Object.values(row).map((cell, index) => (
            //     <td key={index}>{cell}</td>
            //   ))}
            // </tr>
          ))}
        </tbody>
      </table>
      <br/><br/><br/><br/>
      <p>{data.map((col,
                  idx) => <div key={idx}>{col[0]}{col[1]}</div>)}</p>
    </div>
  )
}

export default UploadCSV;