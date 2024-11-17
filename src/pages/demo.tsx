'use client'

import * as React from "react"
import { ArrowDownCircle, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

const tokens = [
  { symbol: "ETH", name: "Ethereum", icon: "/base.webp" },
  { symbol: "USDC", name: "USD Coin", icon: "/usdc.png" },
  { symbol: "OP", name: "Optimism", icon: "/op.png" },
]

const chains = [
  {name: "optimism", icon: "/op.png"},
  {name: "base", icon: "/base.webp"},
  {name: "mainnet", icon: "/unichain.png"},
]

export default function Component() {
  const { toast } = useToast()
  const [fromAmount, setFromAmount] = React.useState("10000")
  const [toAmount, setToAmount] = React.useState("0.0")
  const [fromChain, setFromChain] = React.useState(chains[0])
  const [toChain, setToChain] = React.useState(chains[1])
  const [fromToken, setFromToken] = React.useState(tokens[0])
  const [toToken, setToToken] = React.useState(tokens[2])
  const [isLoading, setIsLoading] = React.useState(false)
  const [showSuccessModal, setShowSuccessModal] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Simple calculation for demonstration purposes
    const calculatedAmount = parseFloat(fromAmount) * 0.95 // Assuming 5% fee
    setToAmount(calculatedAmount.toFixed(2))
  }, [fromAmount])

  const checkEthereumProvider = () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      return window.ethereum
    }
    throw new Error("Ethereum provider not detected. Please install MetaMask or another web3 wallet.")
  }

  const handleSwap = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const provider = checkEthereumProvider()
      console.log('Sending', fromAmount)
      await executeSwap(fromAmount, provider)
    } catch (error) {
      console.error('Swap failed:', error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      toast({
        title: "Swap Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function executeSwap(fromAmount: string, provider: any) {
    console.log('Executing swap with amount:', fromAmount)
    
    // Request account access
    await provider.request({ method: 'eth_requestAccounts' })
    
    // Simulate a delay for the swap process
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    setShowSuccessModal(true)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-[477px] bg-[#222222] rounded-[36px] p-4 relative shadow-[0px_14px_22px_0px_rgba(255,0,200,0.03)]">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-0 relative">
          {/* From Chain Box */}
          <div className="w-full bg-[#323232] rounded-[36px] p-4 shadow-[0px_4px_22px_0px_rgba(0,0,0,0.07)] mb-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-400">from</span>
              <Select
                value={fromChain.name}
                onValueChange={(value) => setFromChain(chains.find(c => c.name === value) || chains[0])}
              >
                <SelectTrigger className="w-[120px] bg-transparent text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#444444] border-none">
                  {chains.map((chain) => (
                    <SelectItem key={chain.name} value={chain.name} className="text-white hover:bg-[#555555]">
                      <div className="flex items-center gap-2">
                        <Image src={chain.icon} alt={chain.name} width={20} height={20} />
                        <span>{chain.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="bg-transparent text-4xl text-white outline-none w-full"
              />
              <Select
                value={fromToken.symbol}
                onValueChange={(value) => setFromToken(tokens.find(t => t.symbol === value) || tokens[0])}
              >
                <SelectTrigger className="w-[80px] bg-transparent border border-gray-600 text-white px-2 py-1 rounded-full">
                  <div className="flex items-center gap-1">
                    <Image src={fromToken.icon} alt={fromToken.name} width={20} height={20} />
                    <span className="text-sm">{fromToken.symbol.toLowerCase()}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#444444] border-none">
                  {tokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol} className="text-white hover:bg-[#555555]">
                      <div className="flex items-center gap-2">
                        <Image src={token.icon} alt={token.name} width={20} height={20} />
                        <span>{token.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <button className="w-[57px] h-[57px] rounded-full bg-[#FF30B0] flex items-center justify-center hover:bg-[#F615B9] transition-colors">
              <ArrowDownCircle className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* To Token Box */}
          <div className="w-full bg-[#323232] rounded-[36px] p-4 shadow-[0px_4px_22px_0px_rgba(0,0,0,0.07)] mt-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-400">to</span>
              <Select
                value={toChain.name}
                onValueChange={(value) => setToChain(chains.find(c => c.name === value) || chains[1])}
              >
                <SelectTrigger className="w-[120px] bg-transparent border border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#444444] border-none">
                  {chains.map((chain) => (
                    <SelectItem key={chain.name} value={chain.name} className="text-white hover:bg-[#555555]">
                      <div className="flex items-center gap-2">
                        <Image src={chain.icon} alt={chain.name} width={20} height={20} />
                        <span>{chain.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={toAmount}
                readOnly
                className="bg-transparent text-4xl text-white outline-none w-full"
              />
              <Select
                value={toToken.symbol}
                onValueChange={(value) => setToToken(tokens.find(t => t.symbol === value) || tokens[2])}
              >
                <SelectTrigger className="w-[80px] bg-transparent border border-gray-600 text-white px-2 py-1 rounded-full">
                  <div className="flex items-center gap-1">
                    <Image src={toToken.icon} alt={toToken.name} width={20} height={20} />
                    <span className="text-sm">{toToken.symbol.toLowerCase()}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#444444] border-none">
                  {tokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol} className="text-white hover:bg-[#555555]">
                      <div className="flex items-center gap-2">
                        <Image src={token.icon} alt={token.name} width={20} height={20} />
                        <span>{token.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Swap Action Button */}
        <button 
          onClick={handleSwap}
          disabled={isLoading}
          className="w-full h-[59px] bg-[#FF30B0] hover:bg-[#F615B9] transition-colors rounded-[32px] text-white font-['DotGothic16'] text-base mt-4 mx-auto block border border-[#F615B9] shadow-[0px_4px_22px_0px_rgba(0,0,0,0.07)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Swapping...
            </div>
          ) : (
            'Swap'
          )}
        </button>
      </div>
      <Toaster />

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-[#222222] text-white">
          <DialogHeader>
            <DialogTitle>Swap Successful</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Successfully swapped {fromAmount} {fromToken.symbol} for {toAmount} {toToken.symbol}</p>
          </div>
          <Button onClick={() => setShowSuccessModal(false)} className="bg-[#FF30B0] hover:bg-[#F615B9]">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}