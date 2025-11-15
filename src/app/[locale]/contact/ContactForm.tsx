'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

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

export default function ContactForm() {
  const t = useTranslations('ContactPage.form');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('name.error');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('email.error');
    } else if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('email.error');
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('subject.error');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('message.error');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In production, replace with actual API call:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      //
      // if (!response.ok) throw new Error('Failed to send message');

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Name Field */}
      <div className="space-y-2">
        {/* FIX 3: Form labels with whitespace-nowrap */}
        <label
          htmlFor="name"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap"
        >
          {t('name.label')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t('name.placeholder')}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.name
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-neutral-300 dark:border-neutral-700 focus:border-neutral-500 focus:ring-neutral-500'
          } bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-offset-0 transition-colors`}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-red-600 dark:text-red-400 text-wrap-pretty">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        {/* FIX 3: Form labels with whitespace-nowrap */}
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap"
        >
          {t('email.label')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t('email.placeholder')}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.email
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-neutral-300 dark:border-neutral-700 focus:border-neutral-500 focus:ring-neutral-500'
          } bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-offset-0 transition-colors`}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-red-600 dark:text-red-400 text-wrap-pretty">
            {errors.email}
          </p>
        )}
      </div>

      {/* Subject Field */}
      <div className="space-y-2">
        {/* FIX 3: Form labels with whitespace-nowrap */}
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap"
        >
          {t('subject.label')}
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder={t('subject.placeholder')}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.subject
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-neutral-300 dark:border-neutral-700 focus:border-neutral-500 focus:ring-neutral-500'
          } bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-offset-0 transition-colors`}
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="text-sm text-red-600 dark:text-red-400 text-wrap-pretty">
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        {/* FIX 3: Form labels with whitespace-nowrap */}
        <label
          htmlFor="message"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap"
        >
          {t('message.label')}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t('message.placeholder')}
          rows={6}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.message
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-neutral-300 dark:border-neutral-700 focus:border-neutral-500 focus:ring-neutral-500'
          } bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-offset-0 transition-colors resize-y`}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-red-600 dark:text-red-400 text-wrap-pretty">
            {errors.message}
          </p>
        )}
        {/* FIX 5: Help text with text-wrap-pretty */}
        <p className="text-sm text-neutral-500 dark:text-neutral-500 text-wrap-pretty">
          {t('message.help')}
        </p>
      </div>

      {/* Submit Button */}
      {/* FIX 4: Submit button with btn-fluid min-w-fit whitespace-nowrap */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-fluid min-w-fit whitespace-nowrap w-full md:w-auto px-8 py-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isSubmitting ? t('sending') : t('submit')}
      </button>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200 text-wrap-pretty">
            {t('success')}
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200 text-wrap-pretty">
            {t('error')}
          </p>
        </div>
      )}
    </form>
  );
}
