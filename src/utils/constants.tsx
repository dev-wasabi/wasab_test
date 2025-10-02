
export const SOLANA_DEVNET_URL = "https://solana-devnet.wasabi.xyz";
export const SEPOLIA_URL = "https://backend-sepolia.wasabi.xyz";
export const GATEWAY_URL = "https://test-gateway.wasabi.xyz";

export const getBaseURL = (chainId: number) => {
    if (chainId == 901) {
        return SOLANA_DEVNET_URL;
    } else {
        return SEPOLIA_URL;
    }
}