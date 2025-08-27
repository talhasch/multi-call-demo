import { contractPrincipalCV, cvToJSON, hexToCV, principalCV, serializeCV } from '@stacks/transactions';
import { useState } from 'react';
import incentives from './lp-incentives';

const user = "SP3XD84X3PE79SHJAZCDW1V5E9EA8JSKRBPEKAEK7";

const calls = [
  ["SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc", "get-name"],
  ["SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc", "get-symbol"],
  ["SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc", "get-decimals"],
  ["SP35E2BBMDT2Y1HB0NTK139YBGYV3PAPK3WA8BRNA.state-v1", "get-name"],
  ["SP35E2BBMDT2Y1HB0NTK139YBGYV3PAPK3WA8BRNA.state-v1", "get-symbol"],
  ["SP35E2BBMDT2Y1HB0NTK139YBGYV3PAPK3WA8BRNA.state-v1", "get-decimals"],
  ["SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token", "get-name"],
  ["SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token", "get-symbol"],
  ["SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token", "get-decimals"],
  ["SP35E2BBMDT2Y1HB0NTK139YBGYV3PAPK3WA8BRNA.state-v1", "get-collateral", serializeCV(contractPrincipalCV("SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4", "sbtc-token"))],
  ["SP35E2BBMDT2Y1HB0NTK139YBGYV3PAPK3WA8BRNA.state-v1", "get-lp-params"],
  ["SP35E2BBMDT2Y1HB0NTK139YBGYV3PAPK3WA8BRNA.state-v1", "get-debt-params"],
  ["SP3Y6GFKWN50HPA8RKRXMY0EXAJR9VXPY899P88JN.state-v1", "get-accrue-interest-params"],
  ["SP35E2BBMDT2Y1HB0NTK139YBGYV3PAPK3WA8BRNA.state-v1", "free-liquidity"],
  ["SP35E2BBMDT2Y1HB0NTK139YBGYV3PAPK3WA8BRNA.state-v1", "get-reserve-balance"],
  ["SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token", "get-balance", serializeCV(contractPrincipalCV("SP35E2BBMDT2Y1HB0NTK139YBGYV3PAPK3WA8BRNA", "state-v1"))],
  ["SP35E2BBMDT2Y1HB0NTK139YBGYV3PAPK3WA8BRNA.state-v1", "get-user-collateral", serializeCV(principalCV(user)), serializeCV(contractPrincipalCV("SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4", "sbtc-token"))],
  ["SP35E2BBMDT2Y1HB0NTK139YBGYV3PAPK3WA8BRNA.state-v1", "get-user-position", serializeCV(principalCV(user))],
  ["SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc", "get-balance", serializeCV(principalCV(user))],
  ["SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token", "get-balance", serializeCV(principalCV(user))],
  ["SP35E2BBMDT2Y1HB0NTK139YBGYV3PAPK3WA8BRNA.linear-kinked-ir-v1", "get-ir-params"],
  ["SP3BJR4P3W2Y9G22HA595Z59VHBC9EQYRFWSKG743.withdrawal-caps-v1", "get-lp-cap-factor"],
  ["SP3BJR4P3W2Y9G22HA595Z59VHBC9EQYRFWSKG743.withdrawal-caps-v1", "get-debt-cap-factor"],
  ["SP3BJR4P3W2Y9G22HA595Z59VHBC9EQYRFWSKG743.withdrawal-caps-v1", "get-collateral-cap-factor", serializeCV(contractPrincipalCV("SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4", "sbtc-token"))],
  ["SP3BJR4P3W2Y9G22HA595Z59VHBC9EQYRFWSKG743.withdrawal-caps-v1", "get-lp-bucket"],
  ["SP3BJR4P3W2Y9G22HA595Z59VHBC9EQYRFWSKG743.withdrawal-caps-v1", "get-debt-bucket"],
  ["SP3BJR4P3W2Y9G22HA595Z59VHBC9EQYRFWSKG743.withdrawal-caps-v1", "get-collateral-bucket", serializeCV(contractPrincipalCV("SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4", "sbtc-token"))],
  ...incentives.map(i => [`${i.contract.principal}.${i.contract.id}`, "get-user-rewards", serializeCV(principalCV(user))])
];


function App() {
  const [resp, setResp] = useState({});
  const [took, setTook] = useState(0);
  const [loading, setLoading] = useState(false)

  const fetchClicked = async () => {
    setTook(0);
    setLoading(true);

    const t1 = Date.now();

    let resp;

    try {
      resp = await fetch('https://multi-call.talha.locker/v1/call', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ calls })
      }).then(r => r.json() as any);
    } catch {
      setLoading(false)
      return;
    }

    const took = resp.took;

    const marketAssetName = cvToJSON(hexToCV(resp.calls[0].result)).value.value;
    const marketAssetSymbol = cvToJSON(hexToCV(resp.calls[1].result)).value.value;
    const marketAssetDecimals = cvToJSON(hexToCV(resp.calls[2].result)).value.value;
    const shareTokenName = cvToJSON(hexToCV(resp.calls[3].result)).value.value;
    const shareTokenSymbol = cvToJSON(hexToCV(resp.calls[4].result)).value.value;
    const shareTokenDecimals = cvToJSON(hexToCV(resp.calls[5].result)).value.value;
    const collateralName = cvToJSON(hexToCV(resp.calls[6].result)).value.value;
    const collateralSymbol = cvToJSON(hexToCV(resp.calls[7].result)).value.value;
    const collateralDecimals = cvToJSON(hexToCV(resp.calls[8].result)).value.value;
    const collateralSettings = cvToJSON(hexToCV(resp.calls[9].result)).value.value;
    const maxLTV = collateralSettings["max-ltv"].value;
    const liquidationLTV = collateralSettings["liquidation-ltv"].value;
    const liquidationPremium = collateralSettings["liquidation-premium"].value;
    const lpParams = cvToJSON(hexToCV(resp.calls[10].result)).value;
    const totalAssets = lpParams["total-assets"].value;
    const totalShares = lpParams["total-shares"].value;
    const debtParams = cvToJSON(hexToCV(resp.calls[11].result)).value;
    const openInterest = debtParams["open-interest"].value;
    const totalDebtShares = debtParams["total-debt-shares"].value;
    const accrueInterestParams = cvToJSON(hexToCV(resp.calls[12].result)).value;
    const lastInterestAccruedBlockTime = accrueInterestParams.value["last-accrued-block-time"].value;
    const freeLiquidity = cvToJSON(hexToCV(resp.calls[13].result)).value;
    const reserveBalance = cvToJSON(hexToCV(resp.calls[14].result)).value;
    const collateralBalance = cvToJSON(hexToCV(resp.calls[15].result)).value.value;
    const collateralsDepositedBalance = cvToJSON(hexToCV(resp.calls[16].result)).value.value.amount.value;
    const userPosition = cvToJSON(hexToCV(resp.calls[17].result)).value.value;
    const userDebtShares = userPosition["debt-shares"].value;
    const userLpShares = userPosition["borrowed-amount"].value;
    const marketAssetWalletBalance = cvToJSON(hexToCV(resp.calls[18].result)).value.value;
    const collateralsWalletBalance = cvToJSON(hexToCV(resp.calls[19].result)).value.value;
    const irParams = cvToJSON(hexToCV(resp.calls[20].result)).value;
    const baseIr = irParams["base-ir"].value;
    const irSlope1 = irParams["ir-slope-1"].value;
    const irSlope2 = irParams["ir-slope-2"].value;
    const utilizationKink = irParams["utilization-kink"].value;
    const lpCapFactor = cvToJSON(hexToCV(resp.calls[21].result)).value;
    const debtCapFactor = cvToJSON(hexToCV(resp.calls[22].result)).value;
    const collateralCapFactor = cvToJSON(hexToCV(resp.calls[23].result)).value;
    const lpBucket = cvToJSON(hexToCV(resp.calls[24].result)).value;
    const debtBucket = cvToJSON(hexToCV(resp.calls[25].result)).value;
    const collateralBucket = cvToJSON(hexToCV(resp.calls[26].result)).value;
    const lpIncentives = resp.calls.slice(27).map((i: any, x: number) => {
      const startDate = new Date(incentives[x].startDate * 1000).toLocaleDateString("en-US", { month: 'long', day: 'numeric' });
      const endDate = new Date(incentives[x].endDate * 1000).toLocaleDateString("en-US", { month: 'long', day: 'numeric' })

      let rewards = null;

      const inner = cvToJSON(hexToCV(i.result)).value.value;
      if (inner !== null) {
        rewards = {
          "claimedRewards": inner.value["claimed-rewards"].value,
          "earnedRewards": inner.value["earned-rewards"].value,
        };
      }

      return {
        key: incentives[x].startDate,
        date: `${startDate}-${endDate}`,
        rewards
      }
    })
    console.log(lpIncentives)

    setResp({
      marketAsset: {
        name: marketAssetName,
        symbol: marketAssetSymbol,
        decimals: marketAssetDecimals
      },
      shareToken: {
        name: shareTokenName,
        symbol: shareTokenSymbol,
        decimals: shareTokenDecimals
      },
      collateral: {
        name: collateralName,
        symbol: collateralSymbol,
        decimals: collateralDecimals,
        maxLTV,
        liquidationLTV,
        liquidationPremium,
      },
      marketState: {
        totalAssets,
        totalShares,
        openInterest,
        totalDebtShares,
        lastInterestAccruedBlockTime,
        freeLiquidity,
        reserveBalance,
        collateralBalance
      },
      userState: {
        user,
        collateralsDepositedBalance,
        debtShares: userDebtShares,
        lpShares: userLpShares,
        marketAssetWalletBalance,
        collateralsWalletBalance
      },
      irParams: {
        baseIr,
        irSlope1,
        irSlope2,
        utilizationKink
      },
      caps: {
        lpCapFactor,
        debtCapFactor,
        collateralCapFactor,
        lpBucket,
        debtBucket,
        collateralBucket
      },
      lpIncentives
    });

    setTook(took);
    setLoading(false);
  }

  return (
    <>
      <button onClick={fetchClicked}>{loading ? '...' : 'fetch state'}</button>
      <br /><br />
      {took > 0 ?
        <div>
          {calls.length} contract calls, took {took}ms <br /><br />
          <pre>{JSON.stringify(resp, null, 2)}</pre>
        </div>
        : null}
    </>
  )
}

export default App
