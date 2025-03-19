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
import { Calendar, Clock, Check } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface BookViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
}

export default function BookViewingModal({
  isOpen,
  onClose,
  propertyTitle,
}: BookViewingModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("morning");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset form after success
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setName("");
        setEmail("");
        setPhone("");
        setDate("");
        setTimeSlot("morning");
      }, 2000);
    }, 1500);
  };

  const timeSlots = [
    {
      id: "morning",
      label: { en: "Morning (8AM - 12PM)", ar: "صباحًا (8 ص - 12 م)" },
    },
    {
      id: "afternoon",
      label: { en: "Afternoon (12PM - 4PM)", ar: "ظهرًا (12 م - 4 م)" },
    },
    {
      id: "evening",
      label: { en: "Evening (4PM - 8PM)", ar: "مساءً (4 م - 8 م)" },
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === "ar" ? "حجز معاينة" : "Book a Viewing"}
          </DialogTitle>
          <DialogDescription>
            {language === "ar"
              ? `حجز معاينة لـ ${propertyTitle}`
              : `Schedule a viewing for ${propertyTitle}`}
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
                ? "سيتواصل معك أحد ممثلينا قريبًا لتأكيد موعدك."
                : "One of our representatives will contact you soon to confirm your appointment."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {language === "ar" ? "الاسم" : "Name"}
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === "ar" ? "الاسم الكامل" : "Full Name"}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  {language === "ar" ? "البريد الإلكتروني" : "Email"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    language === "ar" ? "البريد الإلكتروني" : "Email Address"
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  {language === "ar" ? "رقم الهاتف" : "Phone Number"}
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 1xx xxx xxxx"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">
                    {language === "ar" ? "التاريخ" : "Date"}
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">
                    {language === "ar" ? "الوقت" : "Time"}
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      id="time"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full pl-10 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          {language === "ar" ? slot.label.ar : slot.label.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">
                  {language === "ar" ? "ملاحظات" : "Notes"}
                </Label>
                <textarea
                  id="notes"
                  className="w-full p-2 border border-gray-300 rounded-md h-24"
                  placeholder={
                    language === "ar"
                      ? "أي معلومات إضافية تود مشاركتها"
                      : "Any additional information you'd like to share"
                  }
                ></textarea>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
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
