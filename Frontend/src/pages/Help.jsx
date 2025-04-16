import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  Book,
  MessageCircle,
  FileText,
} from "lucide-react";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I create an event?",
      answer:
        'To create an event, navigate to the Dashboard and click on "Create New Event". Fill in the event details, including title, date, location, and description. You can also add images and set ticket prices if applicable.',
    },
    {
      id: 2,
      question: "How do I register as a club?",
      answer:
        'To register as a club, go to the registration page and select "Club Admin" as your role. Fill in your organization details and submit the form. A superadmin will review your request and approve it if all requirements are met.',
    },
    {
      id: 3,
      question: "How can I manage my event registrations?",
      answer:
        "As an event organizer, you can view and manage registrations from your Dashboard. You can see the list of attendees, export the data, and send communications to registered participants.",
    },
    {
      id: 4,
      question: "What payment methods are supported?",
      answer:
        "We currently support credit/debit cards, PayPal, and bank transfers for event ticket payments. More payment options will be added in the future.",
    },
    {
      id: 5,
      question: "How do I cancel or modify an event?",
      answer:
        "To cancel or modify an event, go to your Dashboard, find the event, and use the edit or cancel options. Note that cancellations may be subject to our cancellation policy.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Help Center</h1>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Book className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="font-medium">Documentation</h3>
            <p className="text-sm text-gray-600">Read our guides</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <MessageCircle className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="font-medium">Live Chat</h3>
            <p className="text-sm text-gray-600">Chat with support</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <FileText className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="font-medium">Tutorials</h3>
            <p className="text-sm text-gray-600">Watch video guides</p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="border rounded-lg">
              <button
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="text-blue-600" size={20} />
                  <span className="font-medium">{faq.question}</span>
                </div>
                {openFaq === faq.id ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {openFaq === faq.id && (
                <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Still Need Help */}
      <div className="bg-blue-50 rounded-xl p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Still Need Help?</h2>
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default Help;
