import { useState } from "react";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import { BrowserWallet } from '@meshsdk/core';
import { Transaction } from '@meshsdk/core';
import { useWalletList } from '@meshsdk/react';
import { BlockfrostProvider } from '@meshsdk/core';
import { KoiosProvider } from '@meshsdk/core';
import { largestFirst } from '@meshsdk/core';
import Papa from 'papaparse';
import verifyDataSignature from '@cardano-foundation/cardano-verify-datasignature'
import { utils, address } from '@stricahq/typhonjs';
import Script from 'next/script'


import type { Asset } from '@meshsdk/core';
// import { MenuItem } from '@meshsdk/react';
// import tw, { styled } from '@meshsdk/react/src/types/twin';
// import {expect, jest, test} from '@jest/globals';

export default function Page() {
  //const verifyDataSignature = require('@cardano-foundation/cardano-verify-datasignature');
  const blockchainProvider = new BlockfrostProvider('preprodJKAacXeas0VtjmaBzen0UEhvLbnVzJnF');
  const koiosProvider = new KoiosProvider('preprod');
  const [addressInput,setAddress] = useState("");
  const [lovelaceada,setLovelaceAda] = useState<any>(null);
  const [signedInput,setSigned] = useState("");
  const [quantity,setQuantity] = useState<any>(null);
  const { connected, wallet } = useWallet();
  const [assets, setAssets] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [csvdata,setCsvData] = useState("")
  



  
  // const [balance, setBalance] = useState<null | any>(null);
  // const wallets = wallets();
  const wallets = useWalletList();

  
  async function getBalance() {
    if (wallet) {
      setLoading(true);
      // const wallet = await BrowserWallet.enable('eternl');
      const _assets = await wallet.getAssets();
      setAssets(_assets);
      setLoading(false);
      
    }
  }
  
  async function getAssets() {
    if (wallet) {
      setLoading(true);
      const _assets = await wallet.getAssets();
      setAssets(_assets);
      setLoading(false);
    }
  }

  async function connectWallet() {
    // const wallet = await BrowserWallet.enable('eternl');
    console.log('Wallet : ', wallet)
    console.log('Balance : ', wallet.getAssets())
    // const balance = await wallet.getBalance()
    // console.log(balance)
  }

  async function getWalletBalance() {
    // let wallet = await BrowserWallet.enable('eternl');
    const _balanceNew = await wallet.getBalance();
    // console.log('wallet : ', wallet)
    console.log('balance', JSON.stringify(_balanceNew, null, 2))
    // 
      console.log(wallets)
  }

  async function getWalletUtxos() {
    // let wallet = await BrowserWallet.enable('eternl');
    const _Utxos = await wallet.getUtxos();
    // console.log('wallet : ', wallet)
    console.log('Utxos', JSON.stringify(_Utxos[0].input.txHash + '#' + _Utxos[0].input.outputIndex, null, 2))
    console.log('Utxos', JSON.stringify(_Utxos, null, 2))
  }

  async function signWalletData() {
    const addresses = await wallet.getUsedAddresses();
    const signature = await wallet.signData(addresses[0], 'moshe');
    console.log('Signature', JSON.stringify(signature, null, 2))
  }

  async function signWalletTx() {
    const tx = '84a300818258208da567b8fa83a14e29104bdd43c95deadc844266b4565c8b3ea33ef92ffce1040101828258390040522e190d1a5e47585f429515ec7d1ef76d2785425bde6d4fec63544ac4b74b4138d90fb298bc4828e5fbf7ca71a9cbdba09a0ed3742bf11b00000002537043708258390054290b43ec9eb48023ae228ac36c59fc285efddeede8143c13c79af88c09ec607fe52ab47b3cafb52d64dea55a741a5030c7142421fba7341a001e8480021a0002b359a0f5f6'
    const signedTx = await wallet.signTx(tx, false);
    console.log('signTx : ', JSON.stringify(signedTx, null, 2))
  }

  async function submitWalletTx() {
    const signedTx = '84a300818258208da567b8fa83a14e29104bdd43c95deadc844266b4565c8b3ea33ef92ffce1040101828258390040522e190d1a5e47585f429515ec7d1ef76d2785425bde6d4fec63544ac4b74b4138d90fb298bc4828e5fbf7ca71a9cbdba09a0ed3742bf11b00000002537043708258390054290b43ec9eb48023ae228ac36c59fc285efddeede8143c13c79af88c09ec607fe52ab47b3cafb52d64dea55a741a5030c7142421fba7341a001e8480021a0002b359a10081825820ad9dc3c454c6bbeff8e8e048cfb97cdec406841b02ae2ba17867d190dee886805840bd1ddb04d8bfc68e49b9f42440902b969467e7ca3cfb3472985f36f589d83c122617976e93b300db6a03faabdaab4dd13838bc32098f2fae28fc8e6824bf9308f5f6'
    const txHash = await wallet.submitTx(signedTx);
    console.log('signTx : ', JSON.stringify(txHash, null, 2))
  }

  async function submitNsignWalletTx() {
    const tx = '84a300818258203b024f1d8d370cac4433b9a764d0301ed5cfb18f8ab7f619fc9c4f2fe78c17510001828258390040522e190d1a5e47585f429515ec7d1ef76d2785425bde6d4fec63544ac4b74b4138d90fb298bc4828e5fbf7ca71a9cbdba09a0ed3742bf11b00000002534f0b978258390054290b43ec9eb48023ae228ac36c59fc285efddeede8143c13c79af88c09ec607fe52ab47b3cafb52d64dea55a741a5030c7142421fba7341a001e8480021a0002b359a0f5f6'
    const signedTx = await wallet.signTx(tx, false);  
    const txHash = await wallet.submitTx(signedTx);
    console.log('submitTx : ', JSON.stringify(txHash, null, 2))
  }

  async function getRegStatus(reg: any){
    const regBool = await blockchainProvider.fetchAccountInfo(reg)
    console.log('reg status from function : ', regBool.active)
    return regBool.active
  }

  async function stakeWallettoARARE(){
    const rewardAddress = await wallet.getRewardAddresses();
    
    //const rewardAddress = 'stake_test1up9vfd6tgyudjrajnz7ys289l0mu5udfe0d6pxsw6d6zhuglxqx70';
    const poolId = 'pool1h4n2c2g6c5saatezzs0mpe0z7rknmf33txulf8sl2q9v7e72nky';
    const rewardAddressClean = rewardAddress[0];
    const regS = await getRegStatus(rewardAddressClean);
    const tx = new Transaction({ initiator: wallet });
    if (regS != true)
    {
      tx.registerStake(rewardAddressClean);
    }
      tx.delegateStake(rewardAddressClean, poolId);
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx, false);
      console.log('signTx: ',JSON.stringify(signedTx, null, 2)) 
      const txHash = await wallet.submitTx(signedTx);
      console.log('submitTx : ', JSON.stringify(txHash, null, 2))
  }

  function handleChangeAddress(e:any) {
    setAddress(e.target.value);
  }

  function handleChangeLovelace(e:any) {
    setLovelaceAda(e.target.value);
  }

  function handleChangeQuantity(e:any) {
    setQuantity(e.target.value);
  }
  
  function handleChangeSign(e:any) {
    setSigned(e.target.value);
  }


  async function submitInputTx() {
    console.log('signedTxInput : ', signedInput)
    const txHash = await wallet.submitTx(signedInput);
    console.log('submitnTx: ',JSON.stringify(txHash, null, 2)) 
    }

async function buildTx() {
  const tx = new Transaction({ initiator: wallet })
  .sendLovelace(
    addressInput,
    lovelaceada
  )
  ;
  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx, false);
  console.log('signTx: ',JSON.stringify(signedTx, null, 2)) 
  const txHash = await wallet.submitTx(signedTx);
  console.log('submitnTx: ',JSON.stringify(txHash, null, 2)) 
  }

  async function buildTxToken() {
    const utxos = await wallet.getUtxos();
    const costLovelace = '10000000';
    const selectedUtxos = largestFirst(costLovelace, utxos, true);
    console.log(selectedUtxos);
    const tx = new Transaction({ initiator: wallet })
    .sendLovelace(
      addressInput,
      "1400000"
    )
    .sendAssets(
      addressInput,
      [
        {
          unit: '9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe5368656e5f746573744d6963726f555344',
          quantity: quantity
        }
      ]
    )
    ;
    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx, false);
    console.log('signTx: ',JSON.stringify(signedTx, null, 2)) 
    const txHash = await wallet.submitTx(signedTx);
    console.log('submitnTx: ',JSON.stringify(txHash, null, 2)) 
    }

  const [data, setData] = useState([]);
  const [hideMenuList, setHideMenuList] = useState(true);

  const handleUpload = (e:any) => {
    let file = e.target.files[0];
    console.log(file.name)
    var placeHo =  document.getElementById('filePlaceHo').setAttribute("data-text", file.name);
    Papa.parse(file, {
      header: false,
      complete: (results) => {
        const resutlsData:any = results.data
        setData(resutlsData);
        console.log(results)
        console.log("Result lenght: ", results.data.length)
        for(let i=0; i<results.data.length; i++){
          console.log("Address : ", resutlsData[i][0]); //use i instead of 0
          console.log("Lovelace : ", resutlsData[i][1]); //use i instead of 0
      }
      }
    });
  }

  async function buildTxCSV() {
    let tx = new Transaction({ initiator: wallet })
    for(let i=0; i<data.length; i++){
    tx.sendLovelace(
      data[i][0],
      data[i][1]
    )
        }
    ;
    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx, false);
    console.log('signTx: ',JSON.stringify(signedTx, null, 2)) 
    const txHash = await wallet.submitTx(signedTx);
    console.log('submitnTx: ',JSON.stringify(txHash, null, 2)) 
    }

  async function verifySign(){
      const key =
        'a4010103272006215820ad9dc3c454c6bbeff8e8e048cfb97cdec406841b02ae2ba17867d190dee88680';
      const signature =
        '845846a20127676164647265737358390040522e190d1a5e47585f429515ec7d1ef76d2785425bde6d4fec63544ac4b74b4138d90fb298bc4828e5fbf7ca71a9cbdba09a0ed3742bf1a166686173686564f4456d6f73686558401bada4b1fb5db39f028ebae60364ce78e9af571510493b4fc83dffaa2d53a3812d8ad2b05a1cbf6854da59b59393f78b5055be2290b2f76c96a1451559fecd01';
      const message = 'moshe';
      const address = 'addr_test1qpq9ytsep5d9u36ctapf290v0500wmf8s4p9hhndflkxx4z2cjm5ksfcmy8m9x9ufq5wt7lhefc6nj7m5zdqa5m590cst4s7qq';

      var boole = verifyDataSignature(signature, key, message, address)
      console.log('verifySign boole ', boole);
      return boole;

  }

  async function verifyStake(){
    var boole = false; 
    const realStake = 'stake_test1up9vfd6tgyudjrajnz7ys289l0mu5udfe0d6pxsw6d6zhuglxqx70';
    const Network = {
      MAINNET: 1,
      TESTNET: 0,
    };
   // let network = Network.MAINNET;
    let network = Network.TESTNET;
      const paymentAddress = utils.getAddressFromBech32(
        "addr_test1qpq9ytsep5d9u36ctapf290v0500wmf8s4p9hhndflkxx4z2cjm5ksfcmy8m9x9ufq5wt7lhefc6nj7m5zdqa5m590cst4s7qq"
      ) as BaseAddress;
      //console.log(paymentAddress)
      const rewardAddressMainnet = new address.RewardAddress(network, paymentAddress.stakeCredential).getBech32();

      //log output (true or false)
      console.log(rewardAddressMainnet, realStake);
      if (rewardAddressMainnet == realStake)
      {
        boole = true; 
      }
        console.log(boole); 
        return boole;
    }

    async function verifyBoth(){
      var StakeVerify = await verifyStake();
      var SignVerify = await verifySign();
      var boole = false;
      if(StakeVerify == true && SignVerify == true){
        boole = true;
      }
      console.log('StakeVerify : ', StakeVerify)
      console.log('SignVerify : ', SignVerify)
      console.log(boole)
    }

    const [showTokenImg, setshowTokenImg] = useState()
    let displayData
    async function checkTokenIMG() {
      console.log('checkTokenIMG function')
      const urlFe = 'https://preprod.koios.rest/api/v0/asset_info?_asset_policy=9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe&_asset_name=5368656e5f746573744d6963726f555344'
      //const assetFingerPrint = 'ce5b9e0f8a88255b65f2e4d065c6e716e9fa9a8a86dfb86423dd1ac0'
      const response = await fetch(urlFe)
      const responseData = await response.json()
      console.log(responseData[0].token_registry_metadata.logo)
      const tokenLogo = responseData[0].token_registry_metadata.logo
      displayData = 'data:image/png;base64,'+tokenLogo
      console.log(responseData)
      setshowTokenImg(displayData)
      setHideMenuList(!hideMenuList);
      
        // console.log(responseData[0].token_registry_metadata.logo);
        // setshowTokenImg(displayData)
 
      //const testFetch = await fetch('https://preprod.koios.rest/api/v0/asset_info?_asset_policy=ce5b9e0f8a88255b65f2e4d065c6e716e9fa9a8a86dfb86423dd1ac0&_asset_name=44494e47')
      //console.log('fetch', testFetch)

    //console.log('Token : ', assetFingerFetch)
    // return 
    }

  return (
<div id="cent">
      <h1>Connect Wallet</h1>
       <CardanoWallet />
     {connected && (
        <>
          <br/><br/><br/><h1>Wallet functions</h1>
          {assets ? (
            <pre>
              <code className="language-js">
                {JSON.stringify(getWalletBalance())}  
              </code>
            </pre>
          ) : (
              <main>
                <div className="rotate">
                  
            
                  <button type="button" style={{}} onClick={async () => getWalletBalance() }>Get Balance</button>
                  <button type="button" style={{}} onClick={async () => getWalletUtxos() }>Get Utxos</button>
                  <button type="button" style={{}} onClick={async () => signWalletData() }>Sign Data</button>
                  <button type="button" style={{}} onClick={async () => signWalletTx() }>Sign Tx</button>
                  <button type="button" style={{}} onClick={async () => submitWalletTx() }>Submit Tx</button>
                  <button type="button" id="button" style={{}} onClick={async () => submitNsignWalletTx() }>Sign and Submit Tx</button>
                  
            
                </div>
            <br></br><br></br>
            <h1>Submit input signed</h1>
            <div className="h3">
              <h3>SignedTx: {signedInput}</h3>
              <span className="input">
              <input type="text" id="signedInput" placeholder="signedTx" onChange={handleChangeSign} />
              <span></span>
              </span>
            </div>
            <button type="button" style={{}} onClick={async () => submitInputTx() }>input Submit Tx</button>



            <h1>Stake to ARARE (preprod)</h1>
            <button type="button" id="button" style={{}} onClick={async () => stakeWallettoARARE() }>Stake to ARARE</button>
            <button type="button" id="button" style={{}} onClick={async () => getRegStatus('stake_test1up9vfd6tgyudjrajnz7ys289l0mu5udfe0d6pxsw6d6zhuglxqx70') }>Reg status</button>
            <br></br>
            <br></br>
            
            <h1>Send lovelace to an Address</h1>
            <div className="h3">
              <h3>Address: {addressInput}</h3>
              <span className="input">
              <input type="text" id="addressInput" placeholder="addr..." onChange={handleChangeAddress} />
              <span></span>
              </span>

              <h3>Lovelace: {lovelaceada}</h3>
              <span className="input">
                <input type="number" id="lovelace" placeholder="1000000 lovelace" onChange={handleChangeLovelace}></input>
                <span></span>
              </span>  
            </div>
            <button type="button" class="bn632-hover bn19" style={{}} onClick={async () => buildTx() }>Build Tx</button>
            <br/>
            <br/>
            <br/>

            <h1>Send asset to an Address</h1>
            <div className="h3">
              <h3>Address: {addressInput}</h3>
              <span className="input">
              <input type="text" id="addressInput" placeholder="addr..." onChange={handleChangeAddress} />
              <span></span>
              </span>

              <h3>quantity: {quantity}</h3>
              <span className="input">
                <input type="number" id="lovelace" placeholder="1 SHEN" onChange={handleChangeQuantity}></input>
                <span></span>
              </span>
              <button type="button" class="bn632-hover bn19" style={{}} onClick={async () => checkTokenIMG() }>Check Token Image</button>
              <div style={{width:50}}>
              <img src={showTokenImg} width="100%"/>
              </div>
            </div>
            <button type="button" class="bn632-hover bn19" style={{}} onClick={async () => buildTxToken() }>Build Tx Token</button>
            <br/>
            <br/>
            <br/>
            <h1>Send multi :</h1>
            <h2> Upload CSV (Address:lovelace)</h2> 
            <form class="form">
              <div id="filePlaceHo" class="file-upload-wrapper" data-text="Select your file!" >
                <input name="file-upload-field" type="file" class="file-upload-field" value=""  onChange={handleUpload}/>
              </div>
            </form>
            <br />
            <button type="button" class="bn632-hover bn19" style={{}} onClick={async () => buildTxCSV() }>Build Tx CSV file</button>
            <br />



            <br></br><h1>Verify functions</h1>
            <button type="button" style={{}} onClick={async () => verifySign() }>Verify Sign</button>
            <button type="button" style={{}} onClick={async () => verifyStake() }>Verify Stake</button>
            <button type="button" style={{}} onClick={async () => verifyBoth() }>Verify Both</button>
            <br />
            </main>
          
          )}
        
        </>
      )}
    </div>

        )};