'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

// Register GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function ContactClient() {
  const t = useTranslations('ContactPage');

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  // GSAP animations (title animation removed - now uses TextGenerateEffect)
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Sequential fade-in animation
        tl.from(badgeRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
        })
          .from(subtitleRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.6,
          }, '-=0.2')
          .from(formRef.current, {
            opacity: 0,
            y: 40,
            duration: 0.8,
          }, '-=0.3');
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('form.name.error');
    }

    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = t('form.email.error');
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('form.subject.error');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('form.message.error');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('sending');

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');

      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen safe-top safe-bottom">
      <div className="container mx-auto px-4 py-[var(--space-16)] md:py-[var(--space-20)]">
        <div className="mx-auto max-w-3xl">
          {/* Hero Section */}
          <div className="mb-[var(--space-12)] text-center md:mb-[var(--space-16)]">
            {/* Badge */}
            <div
              ref={badgeRef}
              className="mb-[var(--space-8)] inline-flex items-center justify-center"
            >
              <span className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-medium text-neutral-600">
                {t('info.response')}
              </span>
            </div>

            {/* Title with letter-by-letter animation */}
            <h1 className="mb-[var(--space-4)] flex justify-center">
              <TextGenerateEffect
                words={t('heading')}
                className="whitespace-nowrap font-lavener text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[0.95] tracking-tight text-neutral-900"
                animateBy="letter"
                duration={0.5}
                staggerDelay={0.08}
                initialDelay={0.8}
                filter={true}
              />
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="mx-auto max-w-2xl text-[var(--text-lg)] leading-relaxed text-neutral-600"
            >
              {t('description')}
            </p>
          </div>

          {/* Form Section */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mx-auto max-w-2xl space-y-4"
            noValidate
          >
            {/* Name & Email Row */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Name Input */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('form.name.placeholder')}
                  className={`w-full rounded-2xl border-2 bg-neutral-50 px-5 py-4 text-base text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none ${
                    errors.name ? 'border-red-500' : 'border-transparent'
                  }`}
                  aria-label={t('form.name.label')}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-2 text-sm text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('form.email.placeholder')}
                  className={`w-full rounded-2xl border-2 bg-neutral-50 px-5 py-4 text-base text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none ${
                    errors.email ? 'border-red-500' : 'border-transparent'
                  }`}
                  aria-label={t('form.email.label')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Subject Input (hidden in design, but exists in translations) */}
            <input
              type="hidden"
              name="subject"
              value={formData.subject || 'Contact Form Submission'}
              onChange={handleChange}
            />

            {/* Message Textarea */}
            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('form.message.placeholder')}
                rows={6}
                className={`w-full resize-none rounded-2xl border-2 bg-neutral-50 px-5 py-4 text-base text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none ${
                  errors.message ? 'border-red-500' : 'border-transparent'
                }`}
                aria-label={t('form.message.label')}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && (
                <p id="message-error" className="mt-2 text-sm text-red-600">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-2xl bg-neutral-900 px-8 py-4 text-base font-medium text-white transition-all hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'sending' ? t('form.sending') : t('form.submit')}
            </button>

            {/* Success/Error Messages */}
            {status === 'success' && (
              <div className="rounded-2xl bg-green-50 p-4 text-center text-sm text-green-800">
                {t('form.success')}
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-2xl bg-red-50 p-4 text-center text-sm text-red-800">
                {t('form.error')}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
