'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, BookOpen, Users, Clock, MapPin, Award, DollarSign } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const MathologyPage = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    grade: '',
    email: '',
    phone: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const faqItems: FAQItem[] = [
    {
      question: 'What is Mathology?',
      answer: 'Mathology is a comprehensive mathematics workshop designed for students in grades 7, 8, and 9. It combines conceptual understanding with practical problem-solving techniques to make mathematics engaging and easier to comprehend.',
    },
    {
      question: 'What is so special about Mathology?',
      answer: 'Mathology offers personalized learning with expert guidance, interactive teaching methods, and a focus on building strong mathematical foundations. Our approach helps students not just memorize formulas but understand the concepts deeply, leading to better performance in board exams and competitive exams.',
    },
    {
      question: 'What are the credentials of the teacher(s)?',
      answer: 'Our teachers are experienced educators with expertise in CBSE mathematics curriculum. They hold relevant qualifications and have years of experience in teaching students of grades 7-9, with a proven track record of student success.',
    },
    {
      question: 'What is the fees for this?',
      answer: 'Our fees are competitive and structured to provide excellent value. We offer various payment options and batch plans. Please contact us directly for detailed pricing information based on your preferred batch and duration.',
    },
    {
      question: 'Would you teach anything apart from the CBSE course?',
      answer: 'Yes! We cover the CBSE curriculum comprehensively while also including additional topics like logical reasoning, advanced problem-solving techniques, and preparation for competitive exams like NSO and IMO to enhance overall mathematical proficiency.',
    },
    {
      question: 'My child is in State Board, can I enroll him/her for this?',
      answer: 'While our curriculum is primarily aligned with CBSE standards, State Board students can definitely enroll. The fundamental mathematical concepts are similar, and our teachers can provide necessary guidance for State Board-specific topics. We recommend reaching out to discuss your child\'s specific curriculum.',
    },
    {
      question: 'Where is your center?',
      answer: 'Our center is located in a convenient, well-equipped facility designed specifically for mathematics learning. Please contact us for the exact address and directions. We also provide transportation guidance and parking facilities.',
    },
    {
      question: 'Would you also teach science?',
      answer: 'Currently, our primary focus is on mathematics. However, we are expanding our offerings. Please get in touch to learn about any integrated science programs or partnerships we may have.',
    },
    {
      question: 'What will be the timings for these classes?',
      answer: 'We offer flexible class timings to accommodate different school schedules. Classes are scheduled on weekdays and weekends with multiple batches available. Specific timings will be discussed during enrollment based on your child\'s availability.',
    },
    {
      question: 'How many students will be there in one batch?',
      answer: 'We maintain a small batch size to ensure personalized attention. Each batch typically has 8-15 students, allowing our teachers to focus on individual learning needs and provide quality education.',
    },
    {
      question: 'What improvements do we expect in our child?',
      answer: 'Students typically show significant improvements in: (1) Conceptual clarity and confidence in mathematics, (2) Better performance in school exams, (3) Improved problem-solving abilities, (4) Enhanced logical thinking, (5) Greater interest and enthusiasm for the subject. Most students see visible improvement within 2-3 months of enrollment.',
    },
    {
      question: 'Will these classes be online? No!',
      answer: 'Correct! All our Mathology classes are conducted in-person at our center. We believe in the importance of direct interaction, real-time doubt clearing, and a dedicated learning environment to ensure the best learning outcomes for our students.',
    },
  ];

  const grades = [
    { id: '7', label: 'Grade 7', description: 'Foundation Building' },
    { id: '8', label: 'Grade 8', description: 'Concept Strengthening' },
    { id: '9', label: 'Grade 9', description: 'Board Exam Preparation' },
  ];

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Expert Curriculum',
      description: 'Comprehensive CBSE aligned curriculum with additional topics',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Small Batches',
      description: 'Limited to 8-15 students per batch for personalized attention',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Flexible Timings',
      description: 'Multiple batches with weekday and weekend options',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Offline Classes',
      description: 'In-person classes at our well-equipped center',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Proven Results',
      description: '90%+ students show improvement within 2-3 months',
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Affordable Fees',
      description: 'Competitive pricing with flexible payment options',
    },
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        parentName: '',
        studentName: '',
        grade: '',
        email: '',
        phone: '',
        message: '',
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Mathology
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mathology Workshop</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Master Mathematics for Grades 7, 8 & 9
          </p>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Expert guidance, small batches, proven results. Transform your child's relationship with mathematics.
          </p>
        </div>
      </section>

      {/* Grade Selection */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Choose Your Grade
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {grades.map((grade) => (
              <div
                key={grade.id}
                onClick={() => setSelectedGrade(grade.id)}
                className={`p-8 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedGrade === grade.id
                    ? 'border-blue-600 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{grade.label}</h3>
                <p className="text-gray-600">{grade.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Why Choose Mathology?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Form */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
            Enroll Your Child Today
          </h2>
          
          {formSubmitted && (
            <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              Thank you for your interest! We'll contact you soon to confirm enrollment and discuss further details.
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="bg-gray-50 p-8 rounded-lg shadow-md">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Parent/Guardian Name *
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Name *
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter student's name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Grade *
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Grade</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter email"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message / Additional Information
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Tell us about your child's current performance and expectations"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Submit Enrollment Request
            </button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 text-left">{item.question}</h3>
                  <div className="text-blue-600 flex-shrink-0 ml-4">
                    {expandedFAQ === index ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </div>
                </button>

                {expandedFAQ === index && (
                  <div className="px-6 py-4 bg-blue-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Child's Math Skills?</h2>
          <p className="text-lg opacity-90 mb-8">
            Join hundreds of students who have improved their mathematical abilities with Mathology
          </p>
          <button
            onClick={() => document.getElementById('enrollment-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Enroll Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Mathology</h4>
              <p className="text-gray-400">Transforming mathematics education for grades 7, 8, and 9 students.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="text-gray-400 space-y-2">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Info</h4>
              <p className="text-gray-400">Email: info@mathology.com</p>
              <p className="text-gray-400">Phone: +91 XXXX-XXXX-XXXX</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Mathology. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MathologyPage;
