// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import pkg from '../../../package.json';
import { CandyMint } from '../../components/CandyMint';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';
import { Footer } from 'components/Footer';
import { Footer2 } from 'components/Footer2';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (
    <div id="bgC" className="w-full mx-auto flex flex-col items-center">
      <div className="w-full flex flex-col items-center">
        <div className='mt-6 w-full flex justify-center'>
          <h1 id="mainT" className="text-center text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
            Optimus BadAssBots
          </h1>
        </div>

        <div className="w-full text-center">
          <h4 id="subCon" className="text-2xl md:text-4xl text-slate-300 my-2">
            On this page you can mint your BadAssBot NFT.
          </h4>
          <p className='text-slate-500 text-2xl leading-relaxed' id="subP">
            Connect your wallet and click on Mint. Then a new NFT is mined by a random generator and transferred to your wallet.
            Here you can find the already mined collection. You can then offer your NFT there if you want to sell it.
          </p>
        </div>

        <img id="tickerPC" className="w-full -mt-10" src="https://optimusassets.pages.dev/imgs/ticker.png" />
        <img id="tickerMob" className="w-full -mt-10" src="https://optimusassets.pages.dev/imgs/ticker.png" />


      </div>
      <Footer />

      <div id="amountSol">
        <CandyMint />
      </div>

      <Footer2 />

    </div>
  );
};
