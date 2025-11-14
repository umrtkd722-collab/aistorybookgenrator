// components/AIBookGenerator.tsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Check, Upload, ChevronRight, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiHandler } from '@/lib/api';
import { useAuth } from '@/lib/context/AuthContext';

interface FormData {
  bookIdea: string;
  bookType: string;
  name: string;
  age: string;
  relationship: string;
  occasion: string;
  tone: string;
  funnyMemory: string;
  personality: string;
  favourite: string;
  catchphrase: string;
  superpower: string;
  story: string;
  extra: string;
  coverStyle: string;
  title: string;
}

export default function AIBookGenerator() {
  const router = useRouter();
  const { user } = useAuth();

  // AOS
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Steps
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // NEW: Popup state

  const stepsRef = useRef<HTMLDivElement[]>([]);
  const progressStepsRef = useRef<HTMLDivElement[]>([]);
  const progressLinesRef = useRef<HTMLDivElement[]>([]);

  const showStep = useCallback((stepIndex: number) => {
    stepsRef.current.forEach((el, i) => el.classList.toggle('active', i === stepIndex));
    progressStepsRef.current.forEach((el, i) => {
      el.classList.remove('active', 'completed');
      if (i < stepIndex) el.classList.add('completed');
      else if (i === stepIndex) el.classList.add('active');
    });
    progressLinesRef.current.forEach((el, i) => {
      el.classList.toggle('completed', i < stepIndex);
    });
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => showStep(currentStep));
    return () => cancelAnimationFrame(raf);
  }, [currentStep, showStep]);

  const nextStep = () => currentStep < 4 && setCurrentStep(c => c + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(c => c - 1);

  // Form
  const [form, setForm] = useState<FormData>({
    bookIdea: '',
    bookType: '',
    name: '',
    age: '',
    relationship: '',
    occasion: '',
    tone: '',
    funnyMemory: '',
    personality: '',
    favourite: '',
    catchphrase: '',
    superpower: '',
    story: '',
    extra: '',
    coverStyle: '',
    title: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Upload Images
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.fileIds) {
        setUploadedImages(prev => [...prev, ...data.fileIds]);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // Submit with Login Check
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Agar user nahi hai → popup dikhao
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiHandler<any>({
        url: '/generatestory',
        method: 'POST',
        data: {
          ...form,
          imageFileIds: uploadedImages,
        },
      });

      router.push(`/home/preview?bookPlanId=${res.bookPlanId}`);
    } catch (error) {
      // Toast by apiHandler
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="container max-w-5xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-12" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Bring Your Story to Life with <br />
              <span className="text-[#F38DA0]">AI Book Generator</span>
            </h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Start writing your book in minutes. Our AI turns your ideas into heartfelt stories.
            </p>
            <Link
              href="#prompt-box"
              className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-[#F38DA0] to-pink-600 text-white rounded-full font-medium hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg"
            >
              Start My Book
            </Link>
          </div>

          <form id="prompt-box" onSubmit={handleSubmit} className="space-y-10">

            {/* Book Idea */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-pink-100" data-aos="zoom-in">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enter Your Book Idea</h3>
              <textarea
                name="bookIdea"
                value={form.bookIdea}
                onChange={handleChange}
                required
                placeholder="e.g., A heartwarming tale of a family’s adventures with their beloved pet."
                className="w-full min-h-36 p-5 border border-pink-200 rounded-2xl focus:border-[#F38DA0] focus:ring-4 focus:ring-[#F38DA0]/20 resize-none"
              />
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-between" key={currentStep}>
              {[
                { label: 'Type', icon: <Check className="w-4 h-4" /> },
                { label: 'Details', icon: <Check className="w-4 h-4" /> },
                { label: 'Questions', icon: <Check className="w-4 h-4" /> },
                { label: 'Upload', icon: <Upload className="w-4 h-4" /> },
                { label: 'Cover', icon: <Check className="w-4 h-4" /> },
              ].map((s, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div
                    ref={(el) => { if (el) progressStepsRef.current[i] = el; }}
                    className="progress-step flex flex-col items-center"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${
                      i < currentStep ? 'bg-green-500' : i === currentStep ? 'bg-[#F38DA0]' : 'bg-gray-200'
                    }`}>
                      {i < currentStep ? <Check className="w-5 h-5" /> : s.icon}
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-700">{s.label}</div>
                  </div>
                  {i < 4 && (
                    <div
                      ref={(el) => { if (el) progressLinesRef.current[i] = el; }}
                      className={`progress-line flex-1 h-1 mx-2 transition-all ${
                        i < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Steps */}
            <div className="space-y-12">

              {/* STEP 1 – Choose book type */}
              <div ref={(el) => { if (el) stepsRef.current[0] = el }} className="step active bg-white rounded-3xl p-8 shadow-lg border border-pink-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose book type</h3>
                <select name="bookType" value={form.bookType} onChange={handleChange} className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:border-[#F38DA0] focus:ring-4 focus:ring-[#F38DA0]/20">
                  <option value="">Standard 250-page</option>
                  <option value="kids">Kids Illustrated</option>
                </select>
                <div className="mt-6 flex justify-end">
                  <button type="button" onClick={nextStep} className="px-8 py-3 bg-gradient-to-r from-[#F38DA0] to-pink-600 text-white rounded-full font-medium flex items-center gap-2 hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg">
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* STEP 2 – Recipient details */}
              <div ref={(el) => { if (el) stepsRef.current[1] = el }} className="step bg-white rounded-3xl p-8 shadow-lg border border-pink-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recipient details</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Name', name: 'name' },
                    { label: 'Age', name: 'age' },
                    { label: 'Relationship', name: 'relationship' },
                    { label: 'Occasion', name: 'occasion' },
                    { label: 'Tone', name: 'tone' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                      <input type="text" name={f.name} value={(form as any)[f.name]} onChange={handleChange} required className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:border-[#F38DA0] focus:ring-4 focus:ring-[#F38DA0]/20" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-between">
                  <button type="button" onClick={prevStep} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition">Previous</button>
                  <button type="button" onClick={nextStep} className="px-8 py-3 bg-gradient-to-r from-[#F38DA0] to-pink-600 text-white rounded-full font-medium flex items-center gap-2 hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg">
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* STEP 3 – Brainstorm Questions */}
              <div ref={(el) => { if (el) stepsRef.current[2] = el }} className="step bg-white rounded-3xl p-8 shadow-lg border border-pink-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Brainstorm Questions</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Funny Memory Shared', name: 'funnyMemory' },
                    { label: 'Personality in three words', name: 'personality' },
                    { label: 'Favourite food/drink/TV show', name: 'favourite' },
                    { label: 'Catchphrase or habit', name: 'catchphrase' },
                    { label: 'Superpower', name: 'superpower' },
                    { label: 'Favourite story about them', name: 'story' },
                    { label: 'Extra notes', name: 'extra' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                      <input type="text" name={f.name} value={(form as any)[f.name]} onChange={handleChange} className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:border-[#F38DA0] focus:ring-4 focus:ring-[#F38DA0]/20" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-between">
                  <button type="button" onClick={prevStep} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition">Previous</button>
                  <button type="button" onClick={nextStep} className="px-8 py-3 bg-gradient-to-r from-[#F38DA0] to-pink-600 text-white rounded-full font-medium flex items-center gap-2 hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg">
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* STEP 4 – Upload Photos */}
              <div ref={(el) => { if (el) stepsRef.current[3] = el }} className="step bg-white rounded-3xl p-8 shadow-lg border border-pink-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Photos</h3>
                <label htmlFor="fileUpload" className="inline-flex items-center gap-2 px-6 py-3 bg-[#F38DA0] text-white rounded-full font-medium hover:bg-pink-600 transition cursor-pointer">
                  Upload <Upload className="w-5 h-5" />
                  <input type="file" id="fileUpload" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                {uploadedImages.length > 0 && (
                  <p className="mt-3 text-sm text-green-600">Uploaded {uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''}</p>
                )}
                <div className="mt-6 flex justify-between">
                  <button type="button" onClick={prevStep} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition">Previous</button>
                  <button type="button" onClick={nextStep} className="px-8 py-3 bg-gradient-to-r from-[#F38DA0] to-pink-600 text-white rounded-full font-medium flex items-center gap-2 hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg">
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* STEP 5 – Cover Choice */}
              <div ref={(el) => { if (el) stepsRef.current[4] = el }} className="step bg-white rounded-3xl p-8 shadow-lg border border-pink-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Cover Choice</h3>
                <select
                  name="coverStyle"
                  value={form.coverStyle}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:border-[#F38DA0] focus:ring-4 focus:ring-[#F38DA0]/20 mb-4"
                >
                  <option value="">Classic</option>
                  <option value="circle">Minimalist Circle</option>
                  <option value="vintage">Vintage Band</option>
                  <option value="comic">Comic Style</option>
                  <option value="kids">Kids Cameo</option>
                </select>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="e.g., To My Amazing Mom" className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:border-[#F38DA0] focus:ring-4 focus:ring-[#F38DA0]/20" />
                <div className="mt-6 flex justify-between">
                  <button type="button" onClick={prevStep} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition">Previous</button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-[#F38DA0] to-pink-600 text-white rounded-full font-medium flex items-center gap-2 hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>Generating <Loader2 className="w-5 h-5 animate-spin" /></>
                    ) : (
                      <>Generate Book <ChevronRight className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </section>

      {/* LOGIN POPUP */}
      {showLoginPopup && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowLoginPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-[#F38DA0]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h3>
              <p className="text-gray-600 mb-6">
                You are not logged in. Please login first to generate your book.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowLoginPopup(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <Link
                  href="/home/authPage"
                  className="px-8 py-3 bg-gradient-to-r from-[#F38DA0] to-pink-600 text-white rounded-full font-medium flex items-center gap-2 hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg"
                >
                  Login Now <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}