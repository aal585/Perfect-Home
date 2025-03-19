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
          ? "مرحبًا! أنا المساعد الافتراضي لسكن مصر. كيف يمكنني مساعدتك اليوم؟"
          : "Hello! I'm SakanEgypt's virtual assistant. How can I help you today?";

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

    if (
      userInput.includes("property") ||
      userInput.includes("house") ||
      userInput.includes("apartment") ||
      userInput.includes("عقار") ||
      userInput.includes("منزل") ||
      userInput.includes("شقة")
    ) {
      messageType = "property";
    } else if (
      userInput.includes("furniture") ||
      userInput.includes("sofa") ||
      userInput.includes("table") ||
      userInput.includes("أثاث") ||
      userInput.includes("كنبة") ||
      userInput.includes("طاولة")
    ) {
      messageType = "furniture";
    } else if (
      userInput.includes("maintenance") ||
      userInput.includes("repair") ||
      userInput.includes("fix") ||
      userInput.includes("صيانة") ||
      userInput.includes("إصلاح") ||
      userInput.includes("تصليح")
    ) {
      messageType = "maintenance";
    } else if (
      userInput.includes("payment") ||
      userInput.includes("pay") ||
      userInput.includes("money") ||
      userInput.includes("دفع") ||
      userInput.includes("دفعة")
    ) {
      messageType = "payment";
    }

    // Process response based on message type
    setTimeout(() => {
      processResponse(input, messageType);
    }, 1000);
  };

  const processResponse = (userInput: string, messageType: string) => {
    let responseContent = "";
    let responseActions: { label: string; action: () => void }[] = [];

    switch (messageType) {
      case "property":
        responseContent =
          language === "ar"
            ? "يمكنني مساعدتك في العثور على العقار المناسب. ما هي المنطقة التي تبحث عنها؟"
            : "I can help you find the right property. What area are you looking for?";
        responseActions = [
          {
            label: language === "ar" ? "تصفح العقارات" : "Browse properties",
            action: () => router.push("/properties"),
          },
          {
            label: language === "ar" ? "البحث المتقدم" : "Advanced search",
            action: () => router.push("/properties?advanced=true"),
          },
        ];
        break;

      case "furniture":
        responseContent =
          language === "ar"
            ? "لدينا مجموعة واسعة من الأثاث لتناسب منزلك الجديد. هل تبحث عن شيء محدد؟"
            : "We have a wide range of furniture to suit your new home. Are you looking for something specific?";
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
        break;

      case "maintenance":
        responseContent =
          language === "ar"
            ? "نقدم خدمات صيانة موثوقة لمنزلك. ما نوع الخدمة التي تحتاجها؟"
            : "We offer reliable maintenance services for your home. What type of service do you need?";
        responseActions = [
          {
            label: language === "ar" ? "خدمات السباكة" : "Plumbing services",
            action: () => router.push("/maintenance?type=plumbing"),
          },
          {
            label: language === "ar" ? "خدمات الكهرباء" : "Electrical services",
            action: () => router.push("/maintenance?type=electrical"),
          },
          {
            label: language === "ar" ? "جميع الخدمات" : "All services",
            action: () => router.push("/maintenance"),
          },
        ];
        break;

      case "payment":
        responseContent =
          language === "ar"
            ? "نحن ندعم العديد من خيارات الدفع المحلية بما في ذلك فودافون كاش وفوري وInstaPay وبطاقات الائتمان."
            : "We support many local payment options including Vodafone Cash, Fawry, InstaPay, and credit cards.";
        responseActions = [
          {
            label: language === "ar" ? "معرفة المزيد" : "Learn more",
            action: () => router.push("/payment-options"),
          },
        ];
        break;

      default:
        responseContent =
          language === "ar"
            ? "شكرًا على رسالتك. هل يمكنني مساعدتك في شيء آخر؟"
            : "Thank you for your message. Can I help you with something else?";
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
