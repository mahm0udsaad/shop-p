"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight, ArrowLeft, ShoppingCart, ShoppingBag, X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Product } from "@/types/template-types"

interface CartItem extends Product {
  quantity: number
}

interface OrderFormData {
  name: string
  email: string
  phone: string
  address: string
  message: string
}

interface CartSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  cart: CartItem[]
  totalItems: number
  totalPrice: number
  accentColor: string
  updateCartItemQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  handleOrderSubmit: (e: React.FormEvent) => void
}

export function CartSidebar({
  isOpen,
  setIsOpen,
  cart,
  totalItems,
  totalPrice,
  accentColor,
  updateCartItemQuantity,
  removeFromCart,
  handleOrderSubmit,
}: CartSidebarProps) {
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "order">("cart")
  const [orderFormData, setOrderFormData] = useState<OrderFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  })
  const [orderNote, setOrderNote] = useState("")

  const handleCheckout = () => {
    setCheckoutStep("order")
  }

  const handleBackToCart = () => {
    setCheckoutStep("cart")
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // Reset to cart view when closing
          setCheckoutStep("cart")
        }
        setIsOpen(open)
      }}
    >
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <div className="flex-1 flex flex-col">
          {/* Cart View */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 transform ${
              checkoutStep === "cart"
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0 absolute inset-0 pointer-events-none"
            }`}
          >
            <SheetHeader>
              <SheetTitle className="text-xl flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Your Cart
              </SheetTitle>
              <SheetDescription>
                {totalItems === 0
                  ? "Your cart is empty"
                  : `${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart`}
              </SheetDescription>
            </SheetHeader>

            {cart.length > 0 ? (
              <>
                <ScrollArea className="flex-1 my-4 pr-4">
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 py-3 border-b">
                        <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500 mb-2">${item.price}</p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 ml-auto"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <SheetFooter className="border-t pt-4">
                  <div className="w-full space-y-4">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <Button className="w-full" style={{ backgroundColor: accentColor }} onClick={handleCheckout}>
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </SheetFooter>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                <ShoppingBag className="h-16 w-16 text-gray-300" />
                <p className="text-gray-500">Your cart is empty</p>
                <SheetClose asChild>
                  <Button variant="outline">Continue Shopping</Button>
                </SheetClose>
              </div>
            )}
          </div>

          {/* Order Form View */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 transform ${
              checkoutStep === "order"
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0 absolute inset-0 pointer-events-none"
            }`}
          >
            <SheetHeader>
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="mr-2 -ml-2" onClick={handleBackToCart}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <SheetTitle className="text-xl">Complete Your Order</SheetTitle>
              </div>
              <SheetDescription>
                {`You're ordering ${totalItems} item${totalItems !== 1 ? "s" : ""} for $${totalPrice.toFixed(2)}`}
              </SheetDescription>
            </SheetHeader>

            <ScrollArea className="flex-1 pr-4 mt-4">
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="order-name">Full Name</Label>
                  <Input
                    id="order-name"
                    placeholder="John Doe"
                    value={orderFormData.name}
                    onChange={(e) => setOrderFormData({ ...orderFormData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order-email">Email Address</Label>
                  <Input
                    id="order-email"
                    type="email"
                    placeholder="john@example.com"
                    value={orderFormData.email}
                    onChange={(e) => setOrderFormData({ ...orderFormData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order-phone">Phone Number</Label>
                  <Input
                    id="order-phone"
                    placeholder="+1 (555) 123-4567"
                    value={orderFormData.phone}
                    onChange={(e) => setOrderFormData({ ...orderFormData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order-address">Shipping Address</Label>
                  <Textarea
                    id="order-address"
                    placeholder="123 Main St, City, State, 12345"
                    value={orderFormData.address}
                    onChange={(e) => setOrderFormData({ ...orderFormData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order-note">Additional Notes (Optional)</Label>
                  <Textarea
                    id="order-note"
                    placeholder="Any special requests or questions?"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-md space-y-3 mt-4">
                  <h4 className="font-medium">Order Summary</h4>
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>${(Number.parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full" style={{ backgroundColor: accentColor }}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Place Order
                  </Button>
                </div>
              </form>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
