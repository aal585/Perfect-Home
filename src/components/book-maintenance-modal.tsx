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
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Check, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { createClient } from "../../supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface BookMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
  providerName?: string;
}

export default function BookMaintenanceModal({
  isOpen,
  onClose,
  serviceType,
  providerName,
}: BookMaintenanceModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("morning");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { language } = useLanguage();
  const supabase = createClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: language === "ar" ? "يرجى تسجيل الدخول" : "Please sign in",
          description:
            language === "ar"
              ? "يجب عليك تسجيل الدخول لحجز خدمة"
              : "You need to be signed in to book a service",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Call the API to book the service
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceType,
          date,
          time,
          notes,
          providerName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book service");
      }

      setIsSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setDate("");
        setTime("morning");
        setNotes("");
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error booking service:", error);
      toast({
        title: language === "ar" ? "حدث خطأ" : "Error",
        description:
          language === "ar"
            ? "حدث خطأ أثناء محاولة حجز الخدمة"
            : "An error occurred while trying to book the service",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === "ar" ? "حجز خدمة صيانة" : "Book Maintenance Service"}
          </DialogTitle>
          <DialogDescription>
            {language === "ar"
              ? `حجز خدمة ${serviceType}${providerName ? ` مع ${providerName}` : ""}`
              : `Book ${serviceType} service${providerName ? ` with ${providerName}` : ""}`}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {language === "ar" ? "تم الحجز بنجاح!" : "Booking Successful!"}
            </h3>
            <p className="text-gray-500 text-center">
              {language === "ar"
                ? "تم حجز خدمة الصيانة الخاصة بك بنجاح. سنتصل بك قريبًا لتأكيد الموعد."
                : "Your maintenance service has been booked successfully. We'll contact you soon to confirm the appointment."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="service-date">
                  {language === "ar" ? "تاريخ الخدمة" : "Service Date"}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="service-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-time">
                  {language === "ar" ? "وقت الخدمة" : "Service Time"}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="service-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="morning">
                      {language === "ar"
                        ? "صباحًا (8 ص - 12 م)"
                        : "Morning (8AM - 12PM)"}
                    </option>
                    <option value="afternoon">
                      {language === "ar"
                        ? "ظهرًا (12 م - 4 م)"
                        : "Afternoon (12PM - 4PM)"}
                    </option>
                    <option value="evening">
                      {language === "ar"
                        ? "مساءً (4 م - 8 م)"
                        : "Evening (4PM - 8PM)"}
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">
                  {language === "ar" ? "ملاحظات إضافية" : "Additional Notes"}
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "أي تفاصيل إضافية عن الخدمة المطلوبة..."
                      : "Any additional details about the service needed..."
                  }
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <p>
                  {language === "ar"
                    ? "سيتم تأكيد الحجز بعد مراجعة الطلب. قد يتم الاتصال بك لتأكيد التفاصيل."
                    : "Booking will be confirmed after review. You may be contacted to confirm details."}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <span className="mr-2">
                      {language === "ar" ? "جاري الحجز..." : "Booking..."}
                    </span>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  </>
                ) : language === "ar" ? (
                  "تأكيد الحجز"
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
