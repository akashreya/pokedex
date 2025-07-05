import React, { useState, useEffect } from "react";
import ReactGA from "react-ga4";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xldnknqy"; // TODO: Replace with your Formspree endpoint

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "loading" | "success" | "error">(
    null
  );

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email }),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("");
        setEmail("");
        ReactGA.event({
          category: "Feedback",
          action: "Submit",
          label: "Success",
        });
      } else {
        setStatus("error");
        ReactGA.event({
          category: "Feedback",
          action: "Submit",
          label: "Error",
        });
      }
    } catch {
      setStatus("error");
      ReactGA.event({
        category: "Feedback",
        action: "Submit",
        label: "Error",
      });
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur p-4">
      <div className="bg-[#EFD09E] text-[#272727] dark:bg-[#272727] dark:text-[#EFD09E] border-4 border-[#D4AA7D] dark:border-[#D4AA7D] rounded-2xl shadow-2xl p-8 font-montserrat w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-[#272727] dark:text-[#EFD09E] hover:bg-[#D4AA7D] rounded-full transition-colors w-8 h-8 flex items-center justify-center text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl md:text-2xl font-bold mb-2 font-montserrat text-[#272727] dark:text-[#EFD09E]">
          Send Feedback
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            className="border-2 border-[#D4AA7D] rounded-2xl p-2 w-full min-h-[80px] bg-transparent text-[#272727] dark:text-[#EFD09E] font-montserrat focus:outline-none focus:ring-2 focus:ring-[#D4AA7D]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your feedback..."
            required
          />
          <input
            className="border-2 border-[#D4AA7D] rounded-2xl p-2 w-full bg-transparent text-[#272727] dark:text-[#EFD09E] font-montserrat focus:outline-none focus:ring-2 focus:ring-[#D4AA7D]"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email (optional)"
          />
          <button
            type="submit"
            className="bg-[#272727] text-[#D4AA7D] border-2 border-[#EFD09E] 
            font-extrabold px-4 py-2 rounded-2xl transition-all disabled:opacity-50 
            disabled:cursor-not-allowed font-montserrat 
            hover:bg-[#D4AA7D] hover:text-[#272727] dark:bg-[#EFD09E] dark:text-[#272727] dark:hover:bg-[#D4AA7D] dark:hover:text-[#272727]"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sending..." : "Share Feedback & Ideas"}
          </button>
          {status === "success" && (
            <p className="text-green-600 font-montserrat">
              Thank you for your feedback!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 font-montserrat">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
