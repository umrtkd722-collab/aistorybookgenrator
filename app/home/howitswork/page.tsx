'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Check, Upload, ChevronRight, ChevronLeft } from 'lucide-react';

export default function AIBookGenerator() {
  /* -------------------------------------------------
   * 1. AOS init (once)
   * ------------------------------------------------- */
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  /* -------------------------------------------------
   * 2. Step state
   * ------------------------------------------------- */
  const [currentStep, setCurrentStep] = useState(0);

  /* -------------------------------------------------
   * 3. Refs for DOM elements (progress bar)
   * ------------------------------------------------- */
  const stepsRef = useRef<HTMLDivElement[]>([]);
  const progressStepsRef = useRef<HTMLDivElement[]>([]);
  const progressLinesRef = useRef<HTMLDivElement[]>([]);

  /* -------------------------------------------------
   * 4. Show / hide logic (exact same as your vanilla JS)
   * ------------------------------------------------- */
  const showStep = useCallback((stepIndex: number) => {
    // ---- .step visibility ----
    stepsRef.current.forEach((el, i) => {
      el.classList.toggle('active', i === stepIndex);
    });

    // ---- progress circles ----
    progressStepsRef.current.forEach((el, i) => {
      el.classList.remove('active', 'completed');
      if (i < stepIndex) el.classList.add('completed');
      else if (i === stepIndex) el.classList.add('active');
    });

    // ---- progress lines ----
    progressLinesRef.current.forEach((el, i) => {
      el.classList.toggle('completed', i < stepIndex);
    });
  }, []);

  /* -------------------------------------------------
   * 5. Force DOM update after React render
   * ------------------------------------------------- */
  useEffect(() => {
    // tiny RAF makes sure the DOM is painted before we read classes
    const raf = requestAnimationFrame(() => showStep(currentStep));
    return () => cancelAnimationFrame(raf);
  }, [currentStep, showStep]);

  /* -------------------------------------------------
   * 6. Navigation
   * ------------------------------------------------- */
  const nextStep = () => {
    if (currentStep < stepsRef.current.length - 1) {
      setCurrentStep((c) => c + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((c) => c - 1);
  };

  /* -------------------------------------------------
   * 7. Form state (optional – you can send it later)
   * ------------------------------------------------- */
  const [form, setForm] = useState({
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
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* -------------------------------------------------
   * 8. Render
   * ------------------------------------------------- */
  return (
    <section className="AI-generator-sec spacer py-16 md:py-20 bg-gradient-to-b from-white to-pink-50">
      <div className="container max-w-5xl mx-auto px-4">

        {/* ── Header ── */}
        <div className="top-title text-center mb-12" data-aos="fade-up" data-aos-duration="1500">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Bring Your Story to Life with <br />
            <span className="text-[#F38DA0]">AI Book Generator</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Start writing your book in minutes. Our AI Story Generator helps you turn ideas into
            chapters—fast, easy, and creative.
          </p>
          <div className="primary-btn mt-6">
            <a
              href="#prompt-box"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#F38DA0] to-pink-600 text-white rounded-full font-medium hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg"
            >
              Start My Book
            </a>
          </div>
        </div>

        {/* ── Form ── */}
        <form id="prompt-box" className="space-y-10">

          {/* ── Book Idea (always visible) ── */}
          <div
            className="AI-generator-box bg-white rounded-3xl p-8 shadow-xl border border-pink-100"
            data-aos="zoom-in"
            data-aos-duration="1500"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Enter Your Book Idea</h3>
            <textarea
              name="bookIdea"
              value={form.bookIdea}
              onChange={handleChange}
              placeholder="e.g., A heartwarming tale of a family’s adventures with their beloved pet."
              className="w-full min-h-36 p-5 border border-pink-200 rounded-2xl focus:border-[#F38DA0] focus:ring-4 focus:ring-[#F38DA0]/20 resize-none transition-all"
            />
          </div>

          {/* ── Progress Bar (key forces re-creation) ── */}
          <div className="progressbar flex items-center justify-between" key={currentStep}>
            {[
              { label: 'Type', icon: <Check className="w-4 h-4" /> },
              { label: 'Details', icon: <Check className="w-4 h-4" /> },
              { label: 'Questions', icon: <Check className="w-4 h-4" /> },
              { label: 'Upload', icon: <Upload className="w-4 h-4" /> },
              { label: 'CheckOut', icon: <Check className="w-4 h-4" /> },
            ].map((s, i) => (
              <div key={i} className="flex items-center flex-1">
                <div
                  ref={(el) => {
                    if (el) progressStepsRef.current[i] = el;
                  }}
                  className="progress-step flex flex-col items-center"
                >
                  <div
                    className={`circle w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${
                      i < currentStep ? 'bg-green-500' : i === currentStep ? 'bg-[#F38DA0]' : 'bg-gray-200'
                    }`}
                  >
                    {i < currentStep ? <Check className="w-5 h-5" /> : s.icon}
                  </div>
                  <div className="label mt-2 text-sm font-medium text-gray-700">{s.label}</div>
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

          {/* ── Steps (only one visible) ── */}
          <div className="steps space-y-12">

            {/* ── STEP 1 – Choose book type ── */}
            <div
              ref={(el) => { if (el)  stepsRef.current[0] = el}}
              className="step active bg-white rounded-3xl p-8 shadow-lg border border-pink-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose book type</h3>
              <select
                name="bookType"
                value={form.bookType}
                onChange={handleChange}
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:border-[#F38DA0] focus:ring-4 focus:ring-[#F38DA0]/20"
              >
                <option value="">Standard 250-page</option>
                <option value="kids">Kids Illustrated</option>
              </select>
              <div className="step-buttons mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-[#F38DA0] to-pink-600 text-white rounded-full font-medium flex items-center gap-2 hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── STEP 2 – Recipient details ── */}
            <div
              ref={(el) => {if (el)  stepsRef.current[1] = el}}
              className="step bg-white rounded-3xl p-8 shadow-lg border border-pink-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recipient details</h3>
              <div className="step-input-wrapper space-y-4">
                {[
                  { label: 'Name', name: 'name' },
                  { label: 'Age', name: 'age' },
                  { label: 'Relationship', name: 'relationship' },
                  { label: 'Occasion', name: 'occasion' },
                  { label: 'Tone (funny, heartfelt, romantic etc.)', name: 'tone' },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input
                      type="text"
                      name={f.name}
                      value={(form as any)[f.name]}
                      onChange={handleChange}
                      required
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:border-[#F38DA0] focus:ring-4 focus:ring-[#F38DA0]/20"
                    />
                  </div>
                ))}
              </div>
              <div className="step-buttons mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-[#F38DA0] to-pink-600 text-white rounded-full font-medium flex items-center gap-2 hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── STEP 3 – Brainstorm Questions ── */}
            <div
              ref={(el) => {if (el)   stepsRef.current[2] = el}}
              className="step bg-white rounded-3xl p-8 shadow-lg border border-pink-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Brainstorm Questions</h3>
              <div className="step-input-wrapper space-y-4">
                {[
                  { label: 'Funny Memory Shared', name: 'funnyMemory' },
                  { label: 'Personality in three words', name: 'personality' },
                  { label: 'Favourite food/drink/TV show', name: 'favourite' },
                  { label: 'Catchphrase or habit', name: 'catchphrase' },
                  { label: 'Superpower (if they were a superhero)', name: 'superpower' },
                  { label: 'Favourite story about them', name: 'story' },
                  { label: 'Extra notes / quirks', name: 'extra' },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input
                      type="text"
                      name={f.name}
                      value={(form as any)[f.name]}
                      onChange={handleChange}
                      required
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:border-[#F38DA0] focus:ring-4 focus:ring-[#F38DA0]/20"
                    />
                  </div>
                ))}
              </div>
              <div className="step-buttons mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-[#F38DA0] to-pink-600 text-white rounded-full font-medium flex items-center gap-2 hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── STEP 4 – Upload Photos ── */}
            <div
              ref={(el) =>{ if(el)  stepsRef.current[3] = el}}
              className="step bg-white rounded-3xl p-8 shadow-lg border border-pink-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Photos</h3>
              <label
                htmlFor="fileUpload"
                className="upload-btn cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-[#F38DA0] text-white rounded-full font-medium hover:bg-pink-600 transition"
              >
                Upload <Upload className="w-5 h-5" />
                <input type="file" id="fileUpload" multiple accept="image/*" className="hidden" />
              </label>
              <div className="step-buttons mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-[#F38DA0] to-pink-600 text-white rounded-full font-medium flex items-center gap-2 hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── STEP 5 – Cover Choice ── */}
            <div
              ref={(el) => { if(el)  stepsRef.current[4] = el}}
              className="step bg-white rounded-3xl p-8 shadow-lg border border-pink-100"
            >
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Title/subtitle</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:border-[#F38DA0] focus:ring-4 focus:ring-[#F38DA0]/20"
              />
              <div className="step-buttons mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[#F38DA0] to-pink-600 text-white rounded-full font-medium hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg"
                >
                  Submit
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </section>
  );
}