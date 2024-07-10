import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback, useMemo, useState, useEffect } from 'react';
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, transactionBuilder, publicKey, some } from '@metaplex-foundation/umi';
import { TokenPaymentMintArgs, fetchCandyMachine, mintV2, mplCandyMachine, safeFetchCandyGuard } from "@metaplex-foundation/mpl-candy-machine";
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import * as bs58 from 'bs58';
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox';



const quicknodeEndpoint = process.env.NEXT_PUBLIC_RPC/* || clusterApiUrl('devnet')*/;
const candyMachineAddress = publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID);
const treasury = publicKey(process.env.NEXT_PUBLIC_TREASURY);
const tokenMint = publicKey(process.env.NEXT_PUBLIC_TOKEN_MINT);
const destinationAta = publicKey(process.env.NEXT_PUBLIC_DESTINATION_ATA);

export const CandyMint: FC = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const { getUserSOLBalance } = useUserSOLBalanceStore();
    const [_itemsRedeemed, setItemsRedeemed] = useState(0);
    const [_itemsLoaded, setTotalSupply] = useState(0);
    const [showMintOptions, setShowMintOptions] = useState(false);

    const handleMintClick = () => {
        setShowMintOptions(true);
    };


    const umi = useMemo(() =>
        createUmi(quicknodeEndpoint)
            .use(walletAdapterIdentity(wallet))
            .use(mplCandyMachine())
            .use(mplTokenMetadata()),
        [wallet, mplCandyMachine, walletAdapterIdentity, mplTokenMetadata, quicknodeEndpoint, createUmi]
    );

    async function candyTime() {
        // Fetch the Candy Machine.
        const candyMachine = await fetchCandyMachine(
            umi,
            candyMachineAddress,
        );

        // Fetch the Candy Guard.

        const itemsAvailable = candyMachine.itemsLoaded;
        setTotalSupply(Number(itemsAvailable));

        const itemsRedeemed = candyMachine.itemsRedeemed;
        console.log("itemsRedeemed :" + itemsRedeemed);
        setItemsRedeemed(Number(itemsRedeemed));

        const mintAuthority = candyMachine.mintAuthority;
        console.log("mintAuthority :" + mintAuthority);
        // setMintAuthority(mintAuthority);

        const authority = candyMachine.authority;
        console.log("authority :" + authority);
        // setMintAuthority(mintAuthority);


        // Fetch the Candy Guard.
        const candyGuard = await safeFetchCandyGuard(
            umi,
            candyMachine.mintAuthority,
        );

        console.log("SOL Payment :" + (candyGuard.guards.solPayment.__option));

    }

    useEffect(() => {
        if (wallet.publicKey) {
            console.log(wallet.publicKey.toBase58())
            getUserSOLBalance(wallet.publicKey, connection)

            candyTime();

        }
    }, [wallet.publicKey, connection, getUserSOLBalance])

    return (

        <div className="mintDetails">
            {showMintOptions ? (
                <>
                    <button className='gradient-button-sub' onClick={onClickToken}>Mint with $OPT</button>
                    <button className='gradient-button-sub' onClick={onClick}>Mint with SOL</button>
                </>
            ) : (
                <button className='gradient-button' onClick={handleMintClick}>Mint NFT</button>
            )}


            <div className='others'>
                <span className='othersT'>Price</span> 0.2 SOL / 1M <span className='othersT'>$OPT</span>
            </div>
            <div className='others'>
                <span className='othersT'>Minted</span> {_itemsRedeemed}/1,000
            </div>
        </div>

    );
};

function getAssociatedTokenAddress(tokenMint: PublicKey, publicKey: PublicKey) {
    throw new Error('Function not implemented.');
}

