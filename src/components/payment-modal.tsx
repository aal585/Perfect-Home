"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, CreditCard, Smartphone, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  title: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  title,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Close after showing success
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 2000);
    }, 2000);
  };

  const paymentMethods = [
    {
      id: "credit-card",
      name: language === "ar" ? "بطاقة ائتمان" : "Credit Card",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: "vodafone-cash",
      name: "Vodafone Cash",
      icon: <Smartphone className="h-5 w-5" />,
    },
    {
      id: "fawry",
      name: "Fawry",
      icon: <Check className="h-5 w-5" />,
    },
    {
      id: "instapay",
      name: "InstaPay",
      icon: <Check className="h-5 w-5" />,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === "ar" ? "معالجة الدفع" : "Process Payment"}
          </DialogTitle>
          <DialogDescription>
            {language === "ar"
              ? `دفع ${amount} مقابل ${title}`
              : `Pay ${amount} for ${title}`}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {language === "ar" ? "تم الدفع بنجاح!" : "Payment Successful!"}
            </h3>
            <p className="text-gray-500 text-center">
              {language === "ar"
                ? "تم معالجة الدفع الخاص بك بنجاح."
                : "Your payment has been processed successfully."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="payment-method">
                  {language === "ar" ? "طريقة الدفع" : "Payment Method"}
                </Label>
                <RadioGroup
                  id="payment-method"
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-2 gap-4"
                >
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center">
                      <RadioGroupItem
                        value={method.id}
                        id={method.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={method.id}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        {method.icon}
                        <span className="mt-2 text-sm">{method.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {paymentMethod === "credit-card" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">
                        {language === "ar" ? "رقم البطاقة" : "Card Number"}
                      </Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-name">
                        {language === "ar"
                          ? "الاسم على البطاقة"
                          : "Name on Card"}
                      </Label>
                      <Input id="card-name" placeholder="John Doe" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">
                        {language === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}
                      </Label>
                      <Input id="expiry" placeholder="MM/YY" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">
                        {language === "ar" ? "رمز الأمان" : "CVV"}
                      </Label>
                      <Input id="cvv" placeholder="123" required />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === "vodafone-cash" && (
                <div className="space-y-2">
                  <Label htmlFor="phone-number">
                    {language === "ar" ? "رقم الهاتف" : "Phone Number"}
                  </Label>
                  <Input
                    id="phone-number"
                    placeholder="+20 1xx xxx xxxx"
                    required
                  />
                  <p className="text-sm text-muted-foreground flex items-center mt-2">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {language === "ar"
                      ? "سيتم إرسال رمز التحقق إلى هذا الرقم"
                      : "A verification code will be sent to this number"}
                  </p>
                </div>
              )}

              {paymentMethod === "fawry" && (
                <div className="space-y-2">
                  <Label htmlFor="fawry-code">
                    {language === "ar" ? "رقم الهاتف" : "Phone Number"}
                  </Label>
                  <Input
                    id="fawry-code"
                    placeholder="+20 1xx xxx xxxx"
                    required
                  />
                  <p className="text-sm text-muted-foreground flex items-center mt-2">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {language === "ar"
                      ? "سيتم إرسال رمز فوري إلى هذا الرقم"
                      : "A Fawry code will be sent to this number"}
                  </p>
                </div>
              )}

              {paymentMethod === "instapay" && (
                <div className="space-y-2">
                  <Label htmlFor="instapay-account">
                    {language === "ar" ? "حساب إنستاباي" : "InstaPay Account"}
                  </Label>
                  <Input
                    id="instapay-account"
                    placeholder="account@example.com"
                    required
                  />
                  <p className="text-sm text-muted-foreground flex items-center mt-2">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {language === "ar"
                      ? "سيتم تحويلك إلى صفحة إنستاباي"
                      : "You will be redirected to InstaPay page"}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isProcessing} className="w-full">
                {isProcessing ? (
                  <>
                    <span className="mr-2">
                      {language === "ar" ? "جاري المعالجة..." : "Processing..."}
                    </span>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  </>
                ) : language === "ar" ? (
                  "إتمام الدفع"
                ) : (
                  "Complete Payment"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
