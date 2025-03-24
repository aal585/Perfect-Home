"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import { CreditCard, Smartphone, Receipt, Calendar } from "lucide-react";

type PaymentMethod = "credit-card" | "mobile-payment" | "fawry" | "installment";

export default function PaymentGateway({
  amount,
  itemName,
  onSuccess,
  onCancel,
}: {
  amount: number;
  itemName: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [installmentMonths, setInstallmentMonths] = useState("12");
  const [bank, setBank] = useState("cib");
  const { language } = useLanguage();

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6 text-center">
        {language === "ar" ? "إتمام الدفع" : "Complete Payment"}
      </h2>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">
            {language === "ar" ? "المبلغ" : "Amount"}
          </span>
          <span className="font-bold">
            {amount.toLocaleString(language === "ar" ? "ar-EG" : "en-US", {
              style: "currency",
              currency: "EGP",
            })}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            {language === "ar" ? "المنتج" : "Item"}
          </span>
          <span>{itemName}</span>
        </div>
      </div>

      <Tabs
        defaultValue="credit-card"
        className="w-full"
        onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger
            value="credit-card"
            className="flex flex-col items-center py-2"
          >
            <CreditCard className="h-5 w-5 mb-1" />
            <span className="text-xs">
              {language === "ar" ? "بطاقة" : "Card"}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="mobile-payment"
            className="flex flex-col items-center py-2"
          >
            <Smartphone className="h-5 w-5 mb-1" />
            <span className="text-xs">
              {language === "ar" ? "موبايل" : "Mobile"}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="fawry"
            className="flex flex-col items-center py-2"
          >
            <Receipt className="h-5 w-5 mb-1" />
            <span className="text-xs">Fawry</span>
          </TabsTrigger>
          <TabsTrigger
            value="installment"
            className="flex flex-col items-center py-2"
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs">
              {language === "ar" ? "تقسيط" : "Installment"}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="credit-card">
          <form onSubmit={handlePayment}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-number">
                  {language === "ar" ? "رقم البطاقة" : "Card Number"}
                </Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">
                    {language === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}
                  </Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isProcessing}
            >
              {isProcessing
                ? language === "ar"
                  ? "جاري المعالجة..."
                  : "Processing..."
                : language === "ar"
                  ? "إتمام الدفع"
                  : "Complete Payment"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="mobile-payment">
          <form onSubmit={handlePayment}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="mobile-payment-type">
                  {language === "ar"
                    ? "اختر خدمة الدفع"
                    : "Select Payment Service"}
                </Label>
                <RadioGroup defaultValue="vodafone" className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vodafone" id="vodafone" />
                    <Label htmlFor="vodafone">Vodafone Cash</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="etisalat" id="etisalat" />
                    <Label htmlFor="etisalat">Etisalat Cash</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="orange" id="orange" />
                    <Label htmlFor="orange">Orange Cash</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="mobile-number">
                  {language === "ar" ? "رقم الموبايل" : "Mobile Number"}
                </Label>
                <Input
                  id="mobile-number"
                  placeholder="01xxxxxxxxx"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isProcessing}
            >
              {isProcessing
                ? language === "ar"
                  ? "جاري المعالجة..."
                  : "Processing..."
                : language === "ar"
                  ? "إتمام الدفع"
                  : "Complete Payment"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="fawry">
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="font-medium mb-2">
                {language === "ar" ? "كود الدفع الخاص بك" : "Your Payment Code"}
              </p>
              <p className="text-2xl font-bold font-mono">9358 7621 0483</p>
              <p className="text-sm text-gray-500 mt-2">
                {language === "ar"
                  ? "استخدم هذا الكود للدفع عبر أي منفذ فوري"
                  : "Use this code to pay at any Fawry outlet"}
              </p>
            </div>
            <div className="text-sm">
              <p className="mb-2">
                {language === "ar" ? "تعليمات الدفع:" : "Payment Instructions:"}
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>
                  {language === "ar"
                    ? "توجه إلى أقرب منفذ فوري"
                    : "Visit the nearest Fawry outlet"}
                </li>
                <li>
                  {language === "ar"
                    ? "اطلب دفع فاتورة سكن مصر"
                    : "Ask to pay a SakanEgypt bill"}
                </li>
                <li>
                  {language === "ar"
                    ? "قدم كود الدفع المذكور أعلاه"
                    : "Provide the payment code shown above"}
                </li>
                <li>
                  {language === "ar"
                    ? "ادفع المبلغ المطلوب"
                    : "Pay the required amount"}
                </li>
              </ol>
            </div>
            <Button
              onClick={onSuccess}
              className="w-full mt-6"
              variant="outline"
            >
              {language === "ar" ? "تم الدفع بالفعل" : "I've Already Paid"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="installment">
          <form onSubmit={handlePayment}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bank-selection">
                  {language === "ar" ? "اختر البنك" : "Select Bank"}
                </Label>
                <RadioGroup
                  defaultValue="cib"
                  className="mt-2"
                  onValueChange={setBank}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cib" id="cib" />
                    <Label htmlFor="cib">CIB</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="qnb" id="qnb" />
                    <Label htmlFor="qnb">QNB</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nbe" id="nbe" />
                    <Label htmlFor="nbe">NBE</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="installment-period">
                  {language === "ar" ? "فترة التقسيط" : "Installment Period"}
                </Label>
                <RadioGroup
                  defaultValue="12"
                  className="mt-2"
                  onValueChange={setInstallmentMonths}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6" id="months-6" />
                    <Label htmlFor="months-6">
                      {language === "ar" ? "6 أشهر" : "6 Months"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="12" id="months-12" />
                    <Label htmlFor="months-12">
                      {language === "ar" ? "12 شهر" : "12 Months"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="24" id="months-24" />
                    <Label htmlFor="months-24">
                      {language === "ar" ? "24 شهر" : "24 Months"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="36" id="months-36" />
                    <Label htmlFor="months-36">
                      {language === "ar" ? "36 شهر" : "36 Months"}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>
                    {language === "ar" ? "القسط الشهري" : "Monthly Payment"}
                  </span>
                  <span className="font-bold">
                    {(amount / parseInt(installmentMonths)).toLocaleString(
                      language === "ar" ? "ar-EG" : "en-US",
                      {
                        style: "currency",
                        currency: "EGP",
                        maximumFractionDigits: 0,
                      },
                    )}
                  </span>
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isProcessing}
            >
              {isProcessing
                ? language === "ar"
                  ? "جاري المعالجة..."
                  : "Processing..."
                : language === "ar"
                  ? "المتابعة للدفع"
                  : "Continue to Payment"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <Button variant="ghost" className="w-full mt-4" onClick={onCancel}>
        {language === "ar" ? "إلغاء" : "Cancel"}
      </Button>
    </div>
  );
}
