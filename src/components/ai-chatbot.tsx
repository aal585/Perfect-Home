"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Bot,
  X,
  Minimize2,
  Maximize2,
  Home,
  Sofa,
  Wrench,
  CreditCard,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  actions?: {
    label: string;
    action: () => void;
  }[];
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  const router = useRouter();

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      const greeting =
        language === "ar"
          ? "أهلاً بك! أنا المساعد الذكي لسكن مصر. كيف أقدر أساعدك النهاردة؟ ممكن تسألني عن الشقق والفلل في أي منطقة زي التجمع أو الشيخ زايد، أو عن الأثاث والديكور، أو خدمات الصيانة."
          : "Hello! I'm SakanEgypt's virtual assistant. How can I help you today? You can ask me about apartments and villas in any area like New Cairo or Sheikh Zayed, or about furniture and decor, or maintenance services.";

      setMessages([
        {
          id: "greeting",
          content: greeting,
          role: "assistant",
          timestamp: new Date(),
          actions: [
            {
              label: language === "ar" ? "البحث عن عقار" : "Find a property",
              action: () => {
                handleQuickReply("property");
              },
            },
            {
              label: language === "ar" ? "استكشاف الأثاث" : "Explore furniture",
              action: () => {
                handleQuickReply("furniture");
              },
            },
            {
              label:
                language === "ar" ? "خدمات الصيانة" : "Maintenance services",
              action: () => {
                handleQuickReply("maintenance");
              },
            },
            {
              label: language === "ar" ? "خيارات الدفع" : "Payment options",
              action: () => {
                handleQuickReply("payment");
              },
            },
          ],
        },
      ]);
    }
  }, [language, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  const handleQuickReply = (type: string) => {
    let userMessage = "";

    switch (type) {
      case "property":
        userMessage =
          language === "ar"
            ? "أريد البحث عن عقار"
            : "I want to find a property";
        break;
      case "furniture":
        userMessage =
          language === "ar"
            ? "أريد استكشاف الأثاث"
            : "I want to explore furniture";
        break;
      case "maintenance":
        userMessage =
          language === "ar"
            ? "أحتاج خدمات صيانة"
            : "I need maintenance services";
        break;
      case "payment":
        userMessage =
          language === "ar"
            ? "ما هي خيارات الدفع؟"
            : "What are the payment options?";
        break;
    }

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    // Process response
    setTimeout(() => {
      processResponse(userMessage, type);
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Determine message type
    const userInput = input.toLowerCase();
    let messageType = "default";

    // Enhanced Arabic language detection including Egyptian dialect terms
    const propertyTerms = {
      english: [
        "property",
        "house",
        "apartment",
        "flat",
        "villa",
        "real estate",
        "home",
        "condo",
      ],
      arabic: [
        "عقار",
        "منزل",
        "شقة",
        "فيلا",
        "بيت",
        "سكن",
        "عمارة",
        "دور",
        "شاليه",
        "روف",
        "دوبلكس",
        "استوديو",
      ],
    };

    const furnitureTerms = {
      english: [
        "furniture",
        "sofa",
        "table",
        "chair",
        "bed",
        "cabinet",
        "desk",
        "wardrobe",
      ],
      arabic: [
        "أثاث",
        "كنبة",
        "طاولة",
        "كرسي",
        "سرير",
        "دولاب",
        "مكتب",
        "ترابيزة",
        "انتريه",
        "مطبخ",
        "سفرة",
      ],
    };

    const maintenanceTerms = {
      english: [
        "maintenance",
        "repair",
        "fix",
        "service",
        "plumbing",
        "electrical",
        "broken",
      ],
      arabic: [
        "صيانة",
        "إصلاح",
        "تصليح",
        "خدمة",
        "سباكة",
        "كهرباء",
        "عطل",
        "مكسور",
        "بايظ",
        "عطلان",
        "مش شغال",
      ],
    };

    const paymentTerms = {
      english: [
        "payment",
        "pay",
        "money",
        "cash",
        "installment",
        "loan",
        "mortgage",
        "price",
      ],
      arabic: [
        "دفع",
        "دفعة",
        "فلوس",
        "كاش",
        "قسط",
        "أقساط",
        "تقسيط",
        "قرض",
        "رهن",
        "سعر",
        "تمن",
        "تكلفة",
      ],
    };

    const locationTerms = {
      english: [
        "location",
        "area",
        "neighborhood",
        "district",
        "city",
        "address",
      ],
      arabic: [
        "موقع",
        "منطقة",
        "حي",
        "مدينة",
        "عنوان",
        "مكان",
        "التجمع",
        "الشيخ زايد",
        "المعادي",
        "مدينة نصر",
        "المهندسين",
        "الدقي",
      ],
    };

    // Check if input contains any of the terms
    if (
      propertyTerms.english.some((term) => userInput.includes(term)) ||
      propertyTerms.arabic.some((term) => userInput.includes(term))
    ) {
      messageType = "property";
    } else if (
      furnitureTerms.english.some((term) => userInput.includes(term)) ||
      furnitureTerms.arabic.some((term) => userInput.includes(term))
    ) {
      messageType = "furniture";
    } else if (
      maintenanceTerms.english.some((term) => userInput.includes(term)) ||
      maintenanceTerms.arabic.some((term) => userInput.includes(term))
    ) {
      messageType = "maintenance";
    } else if (
      paymentTerms.english.some((term) => userInput.includes(term)) ||
      paymentTerms.arabic.some((term) => userInput.includes(term))
    ) {
      messageType = "payment";
    } else if (
      locationTerms.english.some((term) => userInput.includes(term)) ||
      locationTerms.arabic.some((term) => userInput.includes(term))
    ) {
      messageType = "property"; // Redirect location queries to property search
    }

    // Process response based on message type
    setTimeout(() => {
      processResponse(input, messageType);
    }, 1000);
  };

  const processResponse = (userInput: string, messageType: string) => {
    let responseContent = "";
    let responseActions: { label: string; action: () => void }[] = [];

    // Check for specific location mentions in Egyptian context
    const egyptianLocations = [
      "التجمع",
      "الشيخ زايد",
      "المعادي",
      "مدينة نصر",
      "المهندسين",
      "الدقي",
      "الرحاب",
      "6 أكتوبر",
      "العاصمة الإدارية",
      "العبور",
      "الشروق",
      "بدر",
      "المقطم",
      "حلوان",
      "المنصورية",
      "الهرم",
      "فيصل",
      "العجوزة",
      "الزمالك",
      "جاردن سيتي",
      "المنيل",
      "المرج",
    ];

    // Check for property types in Egyptian context
    const egyptianPropertyTypes = [
      "شقة",
      "فيلا",
      "دوبلكس",
      "روف",
      "بنتهاوس",
      "استوديو",
      "شاليه",
      "توين هاوس",
      "تاون هاوس",
    ];

    // Check if the user mentioned a specific location or property type
    const mentionedLocation = egyptianLocations.find((location) =>
      userInput.toLowerCase().includes(location.toLowerCase()),
    );

    const mentionedPropertyType = egyptianPropertyTypes.find((type) =>
      userInput.toLowerCase().includes(type.toLowerCase()),
    );

    switch (messageType) {
      case "property":
        if (mentionedLocation) {
          responseContent =
            language === "ar"
              ? `نعم، لدينا عدة خيارات في منطقة ${mentionedLocation}. هل تبحث عن نوع معين من العقارات؟`
              : `Yes, we have several options in ${mentionedLocation}. Are you looking for a specific type of property?`;
        } else if (mentionedPropertyType) {
          responseContent =
            language === "ar"
              ? `لدينا مجموعة متنوعة من ${mentionedPropertyType} في مناطق مختلفة. هل هناك منطقة معينة تفضلها؟`
              : `We have a variety of ${mentionedPropertyType} in different areas. Is there a specific area you prefer?`;
        } else {
          responseContent =
            language === "ar"
              ? "يمكنني مساعدتك في العثور على العقار المناسب. ما هي المنطقة التي تبحث عنها؟ لدينا خيارات في التجمع والشيخ زايد ومدينة نصر والمعادي وغيرها."
              : "I can help you find the right property. What area are you looking for? We have options in New Cairo, Sheikh Zayed, Nasr City, Maadi and others.";
        }

        responseActions = [
          {
            label: language === "ar" ? "تصفح العقارات" : "Browse properties",
            action: () => router.push("/properties"),
          },
          {
            label: language === "ar" ? "البحث المتقدم" : "Advanced search",
            action: () => router.push("/properties?advanced=true"),
          },
          {
            label: language === "ar" ? "عقارات جديدة" : "New listings",
            action: () => router.push("/properties?sort=newest"),
          },
        ];
        break;

      case "furniture":
        // Check for specific furniture mentions
        const isSofaMentioned =
          userInput.toLowerCase().includes("كنبة") ||
          userInput.toLowerCase().includes("انتريه") ||
          userInput.toLowerCase().includes("sofa");

        const isBedroomMentioned =
          userInput.toLowerCase().includes("سرير") ||
          userInput.toLowerCase().includes("غرفة نوم") ||
          userInput.toLowerCase().includes("bed") ||
          userInput.toLowerCase().includes("bedroom");

        const isDiningMentioned =
          userInput.toLowerCase().includes("سفرة") ||
          userInput.toLowerCase().includes("طاولة طعام") ||
          userInput.toLowerCase().includes("dining");

        if (isSofaMentioned) {
          responseContent =
            language === "ar"
              ? "لدينا تشكيلة واسعة من الكنب والانتريهات بأنماط عصرية وكلاسيكية. هل تفضل نمط معين؟"
              : "We have a wide selection of sofas and living room sets in modern and classic styles. Do you prefer a specific style?";
          responseActions = [
            {
              label: language === "ar" ? "تصفح الكنب" : "Browse sofas",
              action: () => router.push("/furniture?category=sofas"),
            },
          ];
        } else if (isBedroomMentioned) {
          responseContent =
            language === "ar"
              ? "نوفر مجموعة متنوعة من أثاث غرف النوم بتصاميم مختلفة تناسب جميع الأذواق."
              : "We provide a variety of bedroom furniture with different designs to suit all tastes.";
          responseActions = [
            {
              label:
                language === "ar"
                  ? "تصفح أثاث غرف النوم"
                  : "Browse bedroom furniture",
              action: () => router.push("/furniture?category=bedroom"),
            },
          ];
        } else if (isDiningMentioned) {
          responseContent =
            language === "ar"
              ? "لدينا طاولات سفرة بأحجام مختلفة تناسب المساحات الصغيرة والكبيرة."
              : "We have dining tables in various sizes suitable for both small and large spaces.";
          responseActions = [
            {
              label:
                language === "ar"
                  ? "تصفح طاولات السفرة"
                  : "Browse dining tables",
              action: () => router.push("/furniture?category=dining"),
            },
          ];
        } else {
          responseContent =
            language === "ar"
              ? "لدينا مجموعة واسعة من الأثاث لتناسب منزلك الجديد. هل تبحث عن أثاث غرفة معينة مثل غرفة المعيشة أو غرفة النوم أو السفرة؟"
              : "We have a wide range of furniture to suit your new home. Are you looking for furniture for a specific room like living room, bedroom, or dining room?";
          responseActions = [
            {
              label: language === "ar" ? "تصفح الأثاث" : "Browse furniture",
              action: () => router.push("/furniture"),
            },
            {
              label:
                language === "ar"
                  ? "تجربة وضع الأثاث الافتراضي"
                  : "Try virtual placement",
              action: () => router.push("/furniture?virtual=true"),
            },
          ];
        }
        break;

      case "maintenance":
        // Check for specific maintenance issues
        const isPlumbingMentioned =
          userInput.toLowerCase().includes("سباكة") ||
          userInput.toLowerCase().includes("مياه") ||
          userInput.toLowerCase().includes("تسريب") ||
          userInput.toLowerCase().includes("حنفية") ||
          userInput.toLowerCase().includes("plumbing") ||
          userInput.toLowerCase().includes("water") ||
          userInput.toLowerCase().includes("leak");

        const isElectricalMentioned =
          userInput.toLowerCase().includes("كهرباء") ||
          userInput.toLowerCase().includes("كهربائي") ||
          userInput.toLowerCase().includes("electrical") ||
          userInput.toLowerCase().includes("electric");

        const isACMentioned =
          userInput.toLowerCase().includes("تكييف") ||
          userInput.toLowerCase().includes("مكيف") ||
          userInput.toLowerCase().includes("ac") ||
          userInput.toLowerCase().includes("air condition");

        if (isPlumbingMentioned) {
          responseContent =
            language === "ar"
              ? "نقدم خدمات سباكة احترافية لإصلاح التسريبات وصيانة الحنفيات والمواسير. هل تحتاج إلى خدمة طارئة؟"
              : "We provide professional plumbing services to fix leaks and maintain faucets and pipes. Do you need an emergency service?";
          responseActions = [
            {
              label:
                language === "ar" ? "حجز خدمة سباكة" : "Book plumbing service",
              action: () => router.push("/maintenance?type=plumbing"),
            },
          ];
        } else if (isElectricalMentioned) {
          responseContent =
            language === "ar"
              ? "فنيو الكهرباء لدينا مؤهلون لإصلاح جميع المشاكل الكهربائية بأمان وكفاءة."
              : "Our electricians are qualified to fix all electrical problems safely and efficiently.";
          responseActions = [
            {
              label:
                language === "ar"
                  ? "حجز خدمة كهرباء"
                  : "Book electrical service",
              action: () => router.push("/maintenance?type=electrical"),
            },
          ];
        } else if (isACMentioned) {
          responseContent =
            language === "ar"
              ? "نقدم خدمات صيانة وإصلاح أجهزة التكييف لجميع الماركات."
              : "We provide maintenance and repair services for air conditioners of all brands.";
          responseActions = [
            {
              label: language === "ar" ? "حجز خدمة تكييف" : "Book AC service",
              action: () => router.push("/maintenance?type=ac"),
            },
          ];
        } else {
          responseContent =
            language === "ar"
              ? "نقدم خدمات صيانة موثوقة لمنزلك. ما نوع الخدمة التي تحتاجها؟ لدينا خدمات سباكة وكهرباء وتكييف ونجارة وغيرها."
              : "We offer reliable maintenance services for your home. What type of service do you need? We have plumbing, electrical, AC, carpentry and other services.";
          responseActions = [
            {
              label: language === "ar" ? "خدمات السباكة" : "Plumbing services",
              action: () => router.push("/maintenance?type=plumbing"),
            },
            {
              label:
                language === "ar" ? "خدمات الكهرباء" : "Electrical services",
              action: () => router.push("/maintenance?type=electrical"),
            },
            {
              label: language === "ar" ? "جميع الخدمات" : "All services",
              action: () => router.push("/maintenance"),
            },
          ];
        }
        break;

      case "payment":
        // Check for specific payment methods
        const isInstallmentMentioned =
          userInput.toLowerCase().includes("تقسيط") ||
          userInput.toLowerCase().includes("أقساط") ||
          userInput.toLowerCase().includes("installment");

        const isCashMentioned =
          userInput.toLowerCase().includes("كاش") ||
          userInput.toLowerCase().includes("نقدي") ||
          userInput.toLowerCase().includes("cash");

        const isMobileMentioned =
          userInput.toLowerCase().includes("فودافون كاش") ||
          userInput.toLowerCase().includes("موبايل") ||
          userInput.toLowerCase().includes("vodafone") ||
          userInput.toLowerCase().includes("mobile");

        if (isInstallmentMentioned) {
          responseContent =
            language === "ar"
              ? "نعم، نقدم خيارات تقسيط مرنة تصل إلى 60 شهرًا مع بنوك مختلفة. هل تريد معرفة المزيد عن خطط التقسيط المتاحة؟"
              : "Yes, we offer flexible installment options up to 60 months with various banks. Would you like to know more about available installment plans?";
        } else if (isCashMentioned) {
          responseContent =
            language === "ar"
              ? "بالتأكيد، نقبل الدفع النقدي ونقدم خصومات خاصة للدفع الفوري."
              : "Certainly, we accept cash payments and offer special discounts for immediate payment.";
        } else if (isMobileMentioned) {
          responseContent =
            language === "ar"
              ? "نعم، يمكنك الدفع باستخدام فودافون كاش وغيرها من خدمات الدفع عبر الموبايل مثل اتصالات كاش وأورانج كاش."
              : "Yes, you can pay using Vodafone Cash and other mobile payment services like Etisalat Cash and Orange Cash.";
        } else {
          responseContent =
            language === "ar"
              ? "نحن ندعم العديد من خيارات الدفع المحلية بما في ذلك فودافون كاش وفوري وInstaPay وبطاقات الائتمان والتقسيط البنكي حتى 60 شهرًا."
              : "We support many local payment options including Vodafone Cash, Fawry, InstaPay, credit cards, and bank installments up to 60 months.";
        }

        responseActions = [
          {
            label: language === "ar" ? "معرفة المزيد" : "Learn more",
            action: () => router.push("/payment-options"),
          },
          {
            label: language === "ar" ? "خطط التقسيط" : "Installment plans",
            action: () => router.push("/payment-options?type=installment"),
          },
        ];
        break;

      default:
        responseContent =
          language === "ar"
            ? "شكرًا على رسالتك. هل يمكنني مساعدتك في البحث عن عقار أو أثاث أو خدمات صيانة؟ أنا هنا للإجابة على جميع استفساراتك."
            : "Thank you for your message. Can I help you find a property, furniture, or maintenance services? I'm here to answer all your inquiries.";
        responseActions = [
          {
            label: language === "ar" ? "البحث عن عقار" : "Find a property",
            action: () => handleQuickReply("property"),
          },
          {
            label: language === "ar" ? "استكشاف الأثاث" : "Explore furniture",
            action: () => handleQuickReply("furniture"),
          },
          {
            label: language === "ar" ? "خدمات الصيانة" : "Maintenance services",
            action: () => handleQuickReply("maintenance"),
          },
          {
            label: language === "ar" ? "خيارات الدفع" : "Payment options",
            action: () => handleQuickReply("payment"),
          },
        ];
    }

    const botResponse: Message = {
      id: Date.now().toString(),
      content: responseContent,
      role: "assistant",
      timestamp: new Date(),
      actions: responseActions,
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsLoading(false);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div
          className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 mb-2 ${isMinimized ? "w-72 h-12" : "w-80 sm:w-96 h-[500px]"}`}
        >
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <h3 className="font-medium">
                {language === "ar" ? "مساعد سكن مصر" : "SakanEgypt Assistant"}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={minimizeChat}
                className="text-white hover:text-gray-200 focus:outline-none"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-200 focus:outline-none"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="p-3 h-[400px] overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${message.role === "user" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      <p>{message.content}</p>
                    </div>
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2 justify-start">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={action.action}
                            className="text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="flex space-x-1">
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                    <span className="text-sm">
                      {language === "ar" ? "يكتب..." : "Typing..."}
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t p-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center space-x-2"
                >
                  <Input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      language === "ar"
                        ? "اكتب رسالتك هنا..."
                        : "Type your message here..."
                    }
                    className="flex-grow"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center"
          aria-label="Open chat assistant"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
