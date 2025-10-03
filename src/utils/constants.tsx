
export const SOLANA_DEVNET_URL = "https://solana-devnet.wasabi.xyz";
export const SEPOLIA_URL = "https://backend-sepolia.wasabi.xyz";
export const GATEWAY_URL = "https://test-gateway.wasabi.xyz";

// Contract addresses
export const WASABI_LONG_POOL = "0xC2800d278BDCBe7e1b3e3B440F1539358344B021";
export const WASABI_SHORT_POOL = "0x9Ab6A574af97C1Af8074eA11bCD6d5C68c6D562F";
export const TEST_USDC = "0x92ea09e6f1cc933baac19cd6414b64a9d84cc135";

export const getBaseURL = (chainId: number) => {
    if (chainId == 901) {
        return SOLANA_DEVNET_URL;
    } else {
        return SEPOLIA_URL;
    }
}