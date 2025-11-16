'use client';

import { useTranslations } from 'next-intl';

export default function GearTools() {
  const t = useTranslations('AboutPage');

  return (
    <section className="w-full bg-white py-12 md:py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 md:mb-10 font-bacasime">
          {t('gear.title')}
        </h2>

        {/* Gear List */}
        <div className="flex flex-col">
          {/* Camera */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 py-4 md:py-5 border-b border-gray-200">
            <h3 className="text-[15px] md:text-base font-medium text-black">
              {t('gear.items.camera.name')}
            </h3>
            <p className="text-[15px] md:text-base text-gray-600">
              {t('gear.items.camera.description')}
            </p>
          </div>

          {/* Lens 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 py-4 md:py-5 border-b border-gray-200">
            <h3 className="text-[15px] md:text-base font-medium text-black">
              {t('gear.items.lens1.name')}
            </h3>
            <p className="text-[15px] md:text-base text-gray-600">
              {t('gear.items.lens1.description')}
            </p>
          </div>

          {/* Lens 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 py-4 md:py-5 border-b border-gray-200">
            <h3 className="text-[15px] md:text-base font-medium text-black">
              {t('gear.items.lens2.name')}
            </h3>
            <p className="text-[15px] md:text-base text-gray-600">
              {t('gear.items.lens2.description')}
            </p>
          </div>

          {/* Gimbal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 py-4 md:py-5 border-b border-gray-200">
            <h3 className="text-[15px] md:text-base font-medium text-black">
              {t('gear.items.gimbal.name')}
            </h3>
            <p className="text-[15px] md:text-base text-gray-600">
              {t('gear.items.gimbal.description')}
            </p>
          </div>

          {/* Tripod */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 py-4 md:py-5 border-b border-gray-200">
            <h3 className="text-[15px] md:text-base font-medium text-black">
              {t('gear.items.tripod.name')}
            </h3>
            <p className="text-[15px] md:text-base text-gray-600">
              {t('gear.items.tripod.description')}
            </p>
          </div>

          {/* Editing 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 py-4 md:py-5 border-b border-gray-200">
            <h3 className="text-[15px] md:text-base font-medium text-black">
              {t('gear.items.editing1.name')}
            </h3>
            <p className="text-[15px] md:text-base text-gray-600">
              {t('gear.items.editing1.description')}
            </p>
          </div>

          {/* Editing 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 py-4 md:py-5 border-b border-gray-200">
            <h3 className="text-[15px] md:text-base font-medium text-black">
              {t('gear.items.editing2.name')}
            </h3>
            <p className="text-[15px] md:text-base text-gray-600">
              {t('gear.items.editing2.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
