'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import imagesLoaded from 'imagesloaded';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './photographyhero.module.css';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, ScrollSmoother, SplitText);

// ========== TYPE DEFINITIONS ==========

type CarouselCard = {
  front: string;
  back: string;
  alt?: string;
};

type GridImage = {
  src: string;
  caption?: string;
  title?: string;
};

type Scene = {
  id: string;
  title: string;
  cards: CarouselCard[];
  gridImages: GridImage[];
  radius?: number;
};

// ========== COMPONENT ==========

export default function PhotographyHero() {
  // ========== STATE & REFS ==========
  const [isAnimating, setIsAnimating] = useState(false);
  const [_activePreviewId, setActivePreviewId] = useState<string | null>(null);
  const [imagesReady, setImagesReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [lightboxSceneId, setLightboxSceneId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneWrapperRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const carouselRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const titleRefs = useRef<Map<string, HTMLHeadingElement>>(new Map());
  const previewRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const timelinesRef = useRef<Map<string, gsap.core.Timeline>>(new Map());
  const splitTextInstancesRef = useRef<Map<Element, SplitText>>(new Map());

  // ========== DATA ==========
  // Memoize scenes to prevent useGSAP cleanup on every render
  const scenes: Scene[] = useMemo(() => [
    {
      id: 'scene-1',
      title: 'SHOOTING',
      radius: 500,
      cards: [
        {
          front: '/assets/images/allimages-avif/36fd3634-9c88-485c-8471-d1db949db739_rw_1920fba9.avif',
          back: '/assets/images/allimages-avif/89c3a35e-87da-48bf-b60a-7594f92058e6_rw_1920a7e8.avif',
        },
        {
          front: '/assets/images/allimages-avif/96cb3024-0846-44ab-b1c3-fe73009ce80b_rwc_0x251x3069x4087x3069e47b.avif',
          back: '/assets/images/allimages-avif/6785377c-6f6d-470a-984a-512b8f994d04_rw_1920d928.avif',
        },
        {
          front: '/assets/images/allimages-avif/d91cc4e7-1d00-4b49-b89d-77218dc1951a_car_3x4c80d.avif',
          back: '/assets/images/allimages-avif/1d10e477-37ef-47cf-a510-e03a81f9688f_rwc_251x0x1537x2048x153788ee.avif',
        },
        {
          front: '/assets/images/allimages-avif/5abebc21-ede7-4ea7-966b-b9a54771309ffa57.avif',
          back: '/assets/images/allimages-avif/0bcef382-a25f-4c6f-a859-4242af5e185d_rw_192077de.avif',
        },
      ],
      gridImages: [
        { src: '/assets/images/allimages-avif/53b0e3a5-c710-4bff-a056-afcc7b57288f84b0.avif' },
        { src: '/assets/images/allimages-avif/fc680d2b-0895-4c98-9643-67a31b0bf668_rwc_220x220x570x540x4096fd86.avif' },
        { src: '/assets/images/allimages-avif/00905856-e07e-4415-83bd-cfb98af6bec4_rw_384084e4.avif' },
        { src: '/assets/images/allimages-avif/be7a6723-9479-4e40-8a5c-a7229d957cc7_car_3x45634.avif' },
        { src: '/assets/images/allimages-avif/810477c6-3cbc-43a5-9c3f-91bea7d214e9_rw_1920d091.avif' },
        { src: '/assets/images/allimages-avif/afc7b3cf-0487-447c-9ae3-eb59e15d310f6bb8.avif' },
        { src: '/assets/images/allimages-avif/3cc03b89-813a-4bf7-9ff6-91fbd3790b9f_rw_192002a4.avif' },
      ],
    },
    {
      id: 'scene-2',
      title: 'MATRIMONI',
      radius: 520,
      cards: [
        {
          front: '/assets/images/allimages-avif/7835f660-97eb-4cfd-a83f-b548d9763784b572.avif',
          back: '/assets/images/allimages-avif/67efe321-ce92-406d-936f-4340c4ff4fef_rw_192097b0.avif',
        },
        {
          front: '/assets/images/allimages-avif/57a84844-057e-4625-92d9-8c0f4a92302a717e.avif',
          back: '/assets/images/allimages-avif/1d996cf4-ca34-428c-bf3b-b5b9a30bfa82810b.avif',
        },
        {
          front: '/assets/images/allimages-avif/3969d532-25ad-4012-82b6-a8da803fdab0f324.avif',
          back: '/assets/images/allimages-avif/01271632-3c3d-47b1-989b-d8725d425288_rw_3840f351.avif',
        },
        {
          front: '/assets/images/allimages-avif/b6e71cb5-3d1a-4868-a227-5c4031953cc1_rwc_0x117x1365x1817x1365ef28.avif',
          back: '/assets/images/allimages-avif/0540d16f-f5f9-4418-be0b-8aef4fe3b546_rw_1920d41f.avif',
        },
      ],
      gridImages: [
        { src: '/assets/images/allimages-avif/b1265959-fc25-4dd6-9c40-f153b2c72f3178ba.avif' },
        { src: '/assets/images/allimages-avif/e39c91b9-e876-4a8d-98e9-4b484a8cc63ada27.avif' },
        { src: '/assets/images/allimages-avif/89d2b57f-743c-4718-853f-7c8f00b49d21_rwc_0x111x1366x1819x1366965a.avif' },
        { src: '/assets/images/allimages-avif/6436f8e7-8d09-4623-816b-4ca955a4f025_rw_19207fd3.avif' },
        { src: '/assets/images/allimages-avif/37d6de80-cca3-49d2-95af-19e622df5802_rw_1920e367.avif' },
        { src: '/assets/images/allimages-avif/e12ec16d-3006-44af-8162-03ace4b7d6ee_rw_19200d56.avif' },
        { src: '/assets/images/allimages-avif/c888c38d-58f6-4e1a-b91e-111baa07a19772bf.avif' },
      ],
    },
    {
      id: 'scene-3',
      title: 'FOOD & DRINK',
      radius: 540,
      cards: [
        {
          front: '/assets/images/allimages-avif/6ff895bc-e829-44ab-8895-d5e2c069ff6a_rw_38400696.avif',
          back: '/assets/images/allimages-avif/b55f1e5b-c2c1-4b66-bd88-27e0db32e83399d0.avif',
        },
        {
          front: '/assets/images/allimages-avif/3cfea3cd-fcb1-4a0b-86c0-322695c02749_rw_38401bac.avif',
          back: '/assets/images/allimages-avif/2f5a6fcd-b426-467d-a7d3-a4aa52b7e78b423f.avif',
        },
        {
          front: '/assets/images/allimages-avif/28fa44fa-42cc-44f6-9ee0-7eedcfdbc440_rw_1920b67a.avif',
          back: '/assets/images/allimages-avif/0df95003-185c-4339-9b8c-d4b673e48b97_rw_1920b178.avif',
        },
        {
          front: '/assets/images/allimages-avif/6aba57d1-0671-4f34-b2a6-4345d50608cc_rw_1920951d.avif',
          back: '/assets/images/allimages-avif/a08f6904-438d-4da5-bf71-5363b7091b40_rw_1920e90c.avif',
        },
      ],
      gridImages: [
        { src: '/assets/images/allimages-avif/6a2f7d0b-c56e-4ed9-b07b-4c703515a4a6_rw_192037ff.avif' },
        { src: '/assets/images/allimages-avif/80aa9833-eca3-4d3f-ba35-cf9af5819be5f9b5.avif' },
        { src: '/assets/images/allimages-avif/0c058f88-5402-4054-8fc2-41da42c4d2c5_rw_38409365.avif' },
        { src: '/assets/images/allimages-avif/cd602d01-f6b9-4c37-a073-9e8da9905d9d861f.avif' },
        { src: '/assets/images/allimages-avif/9a6ef875-ab32-42f1-ac01-d05e59fecfc14247.avif' },
        { src: '/assets/images/allimages-avif/256c9026-32a5-49e5-88cb-34fd67345f80_rw_3840c224.avif' },
        { src: '/assets/images/allimages-avif/ef3cc19e-8607-40e0-a33c-6f19b846b0e53b43.avif' },
      ],
    },
    {
      id: 'scene-4',
      title: 'DRONE',
      radius: 560,
      cards: [
        {
          front: '/assets/images/allimages-avif/6ddd1eb6-c2bc-49ae-bf8b-c01d9eafa9decb05.avif',
          back: '/assets/images/allimages-avif/e963ef3c-6cd5-425d-9cad-5d5c98894215d191.avif',
        },
        {
          front: '/assets/images/allimages-avif/ea994c3d-d1b2-4b74-b8e1-0617c8450809_rw_3840e835.avif',
          back: '/assets/images/allimages-avif/c1844888-e8c6-42cd-8441-9a7ad9cd8e22b33f.avif',
        },
        {
          front: '/assets/images/allimages-avif/aea2fcd3-5a88-49b3-8a8f-526a31d6a241_rw_3840944f.avif',
          back: '/assets/images/allimages-avif/7b603c57-7b66-459a-98f2-76a0cd29bd49a95a.avif',
        },
        {
          front: '/assets/images/allimages-avif/9d4c78b8-d7f1-4cfa-aaf7-14b6167164ceafac.avif',
          back: '/assets/images/allimages-avif/ed4457b9-3777-47d4-b531-af6d664a2f6d_car_3x488e3.avif',
        },
      ],
      gridImages: [
        { src: '/assets/images/allimages-avif/9fdc323c-0872-48d7-8e81-bea2588d59e2_rw_3840a898.avif' },
        { src: '/assets/images/allimages-avif/fe12425f-7171-410c-83c1-8d41fd8b0887ac62.avif' },
        { src: '/assets/images/allimages-avif/74fd07c8-d692-4a14-8e9f-bb197bb9f8b1fba3.avif' },
        { src: '/assets/images/allimages-avif/a44049ab-b234-4ebb-94f3-3fa95e10d1ebb315.avif' },
        { src: '/assets/images/allimages-avif/0df90000-5a6c-424e-8d03-64eed1be95ee_rw_3840afe1.avif' },
        { src: '/assets/images/allimages-avif/e8024508-b323-472c-9248-ad80f86e30f7_rw_38407645.avif' },
        { src: '/assets/images/allimages-avif/8a3a34a5-31b9-4e45-8a84-e75e9a9e86d3bb13.avif' },
      ],
    },
    {
      id: 'scene-5',
      title: 'ALLESTIMENTI',
      radius: 480,
      cards: [
        {
          front: '/assets/images/allimages-avif/8412afca-77ad-4cb8-b251-e97870a647334b51.avif',
          back: '/assets/images/allimages-avif/5d22ae43-d57e-448b-a15d-c834100e0f94627a.avif',
        },
        {
          front: '/assets/images/allimages-avif/3f1a79d6-231f-4483-b6a6-2eb8c11a4fc2_rwc_0x143x1657x2206x16578a61.avif',
          back: '/assets/images/allimages-avif/c2671603-a04e-4780-b812-3979e489366b72b9.avif',
        },
        {
          front: '/assets/images/allimages-avif/7c0095f7-6a6a-42f2-8920-cd6bfb7cd242_rw_19205ea8.avif',
          back: '/assets/images/allimages-avif/521bf560-6b45-43d3-8f20-b22d725c5deef1a8.avif',
        },
        {
          front: '/assets/images/allimages-avif/71f919f8-89ec-4e85-884c-32adc62056ea_rwc_0x111x1366x1819x13664cfa.avif',
          back: '/assets/images/allimages-avif/c2ca9494-dfac-4db0-814c-9a4fe1d87644_rw_19203726.avif',
        },
      ],
      gridImages: [
        { src: '/assets/images/allimages-avif/5dc0716b-d000-4cd3-ab3b-a788f81030d2_rw_38401fca.avif' },
        { src: '/assets/images/allimages-avif/0905f762-10ab-4f65-992b-8b5ab4984763_rw_19203cab.avif' },
        { src: '/assets/images/allimages-avif/a01e780d-0b86-4d80-aaf5-071f7639c6fa_rw_1920cb76.avif' },
        { src: '/assets/images/allimages-avif/97c15e57-8e6f-4c85-b8e6-9028e3fc4f3d_rw_384066c9.avif' },
        { src: '/assets/images/allimages-avif/988a23c5-bc3c-4298-93b5-11a3caf14b89_rw_19205fde.avif' },
        { src: '/assets/images/allimages-avif/cbb114c0-be2e-4303-95e1-8ea508935cbd_rw_38404f84.avif' },
        { src: '/assets/images/allimages-avif/abfaaf89-b152-4206-9e20-4be5862e9119_rw_192049ed.avif' },
      ],
    },
    {
      id: 'scene-6',
      title: 'EVENTI',
      radius: 510,
      cards: [
        {
          front: '/assets/images/allimages-avif/899965db-a0db-442a-be5c-119f019e4112_rw_3840e833.avif',
          back: '/assets/images/allimages-avif/e52ad656-0e80-4f31-b944-2e6449712a2efb29.avif',
        },
        {
          front: '/assets/images/allimages-avif/00ec2765-9ebd-47dc-b02a-f4aa0dd5a1b3_rw_192064e2.avif',
          back: '/assets/images/allimages-avif/0be97eea-1d47-4d0f-b9c9-745264c6a328_rw_1920a93e.avif',
        },
        {
          front: '/assets/images/allimages-avif/e01fdbed-5aaa-490b-a514-f8892d305095998e.avif',
          back: '/assets/images/allimages-avif/b7195640-fdbe-4964-9b28-12ccc2afeee07490.avif',
        },
        {
          front: '/assets/images/allimages-avif/83dba54e-2357-4857-a591-336d2941d09dc20c.avif',
          back: '/assets/images/allimages-avif/d8a7f1b3-45f0-4c72-a7a9-e393bd1abf65_rw_38403ef3.avif',
        },
      ],
      gridImages: [
        { src: '/assets/images/allimages-avif/53c9c768-8380-4850-8b3f-b43f6cf07b8f6c9d.avif' },
        { src: '/assets/images/allimages-avif/bed90b78-ab84-4521-8013-884324b73e5f_car_3x4f19e.avif' },
        { src: '/assets/images/allimages-avif/d5f68f18-cdd8-49e8-b63e-c46b542f65c2_rw_192041e8.avif' },
        { src: '/assets/images/allimages-avif/10ecd26b-f13d-4d45-8bb2-e0f4822f7eba_rw_38407ced.avif' },
        { src: '/assets/images/allimages-avif/f4c7c670-849a-4ceb-963c-fd73af0816e0fa7b.avif' },
        { src: '/assets/images/allimages-avif/f6b0a97d-d371-47ac-a477-f54ecd35ccbdeea3.avif' },
        { src: '/assets/images/allimages-avif/b929b23a-f5d7-4881-a8c0-c8b03e4bb739_rw_1920cdf0.avif' },
      ],
    },
    {
      id: 'scene-7',
      title: 'PARTY',
      radius: 530,
      cards: [
        {
          front: '/assets/images/allimages-avif/a3047eab-72ef-4f76-b2f8-e93dc1166d95_rw_1920325a.avif',
          back: '/assets/images/allimages-avif/3037dcbd-8d4e-4d12-8269-9da7e4f2e3104313.avif',
        },
        {
          front: '/assets/images/allimages-avif/25734bcc-e120-48fb-9f59-424df6b5a1ca_rwc_512x0x1024x1365x1024cde2.avif',
          back: '/assets/images/allimages-avif/d44ba255-156f-473e-a0cb-d0e66279dd1a_rw_1920b3d6.avif',
        },
        {
          front: '/assets/images/allimages-avif/06c876b0-e101-4926-b86d-7e6c5674a310dc3f.avif',
          back: '/assets/images/allimages-avif/b104355c-c737-4802-9db4-f0fa63b2267b8b39.avif',
        },
        {
          front: '/assets/images/allimages-avif/a54eca41-7ae4-40bd-99cc-41663b9139d00a49.avif',
          back: '/assets/images/allimages-avif/f95ccdf2-6642-411e-8977-d1734e28b4fdeeb1.avif',
        },
      ],
      gridImages: [
        { src: '/assets/images/allimages-avif/17703902-a4f5-480c-9e90-262e76cd18c1696e.avif' },
        { src: '/assets/images/allimages-avif/f3c869a4-bca8-4d63-b78f-56a12f04bb8f8ade.avif' },
        { src: '/assets/images/allimages-avif/b401720b-3db0-4a2a-a5a2-aef4086b2d27723d.avif' },
        { src: '/assets/images/allimages-avif/906794b6-9b67-462c-9478-b9dde0548a48383e.avif' },
        { src: '/assets/images/allimages-avif/15ffedb1-3aa1-4a95-bdff-0fc87e589fe1_rwc_251x0x1537x2048x1537cd71.avif' },
        { src: '/assets/images/allimages-avif/8695b5ee-7268-4910-91f3-141c376631f91e6a.avif' },
        { src: '/assets/images/allimages-avif/6a22b447-9629-4b3e-94ac-107c83acc1df_rw_38406889.avif' },
      ],
    },
    {
      id: 'scene-8',
      title: 'SPORT',
      radius: 550,
      cards: [
        {
          front: '/assets/images/allimages-avif/fca350ae-e988-408f-b48d-295c227f5627_rw_1920bc33.avif',
          back: '/assets/images/allimages-avif/f5b926a5-da2c-4d50-8806-0718ff659a57_rw_1200739b.avif',
        },
        {
          front: '/assets/images/allimages-avif/abd84fa4-2f95-4f8d-b1a3-651b6538f4b57cab.avif',
          back: '/assets/images/allimages-avif/9f568ab3-2f54-48b7-9b16-1e6550abe560_rwc_512x0x1024x1364x1024bcab.avif',
        },
        {
          front: '/assets/images/allimages-avif/825d9c1d-4fde-4858-8fa0-e868ef684be2c556.avif',
          back: '/assets/images/allimages-avif/47ec7a5e-99bf-4a47-8922-d5dd3461cf3f1a36.avif',
        },
        {
          front: '/assets/images/allimages-avif/3bb608aa-851c-474b-9b2d-c114375a51ed6806.avif',
          back: '/assets/images/allimages-avif/273522b2-0063-443e-9473-af879a47d581_rw_1920474d.avif',
        },
      ],
      gridImages: [
        { src: '/assets/images/allimages-avif/c005ac82-5214-475e-92a2-09604052fa1d_rwc_0x186x1365x1817x136562d7.avif' },
        { src: '/assets/images/allimages-avif/62a73e53-e709-445b-83b3-ec4283ab3fe731f5.avif' },
        { src: '/assets/images/allimages-avif/22794f0d-13b9-465d-aafd-b9ffec87607d_rwc_0x111x1366x1819x1366bf3a.avif' },
        { src: '/assets/images/allimages-avif/188d4629-6a8d-4be0-b287-8034f999b2c3_rw_1920b2ce.avif' },
        { src: '/assets/images/allimages-avif/2f5a6fcd-b426-467d-a7d3-a4aa52b7e78b_rw_38403330.avif' },
        { src: '/assets/images/allimages-avif/52bbe3c7-d7c0-4d42-8e31-ec583e8f034277ea.avif' },
        { src: '/assets/images/allimages-avif/93fcdb5e-d2f8-425b-af35-f2c466a6edf61ac2.avif' },
      ],
    },
  ], []); // Empty deps: scenes data is static

  // ========== UTILITY FUNCTIONS ==========

  /**
   * Returns transform strings to position carousel cells in 3D circle
   */
  const getCarouselCellTransforms = (count: number, radius: number): string[] => {
    const angleStep = 360 / count;
    return Array.from({ length: count }, (_, i) => {
      const angle = i * angleStep;
      return `rotateY(${angle}deg) translateZ(${radius}px)`;
    });
  };

  /**
   * Apply 3D transforms to carousel cells
   */
  const setupCarouselCells = (carousel: HTMLDivElement, radius: number) => {
    const cells = carousel.querySelectorAll<HTMLDivElement>(`.${styles.carouselCell}`);
    const transforms = getCarouselCellTransforms(cells.length, radius);
    cells.forEach((cell, i) => {
      const transform = transforms[i];
      if (transform) {
        cell.style.transform = transform;
      }
    });
  };

  /**
   * Returns interpolated rotation values based on scroll progress
   */
  const getInterpolatedRotation = (progress: number) => ({
    rotationY: gsap.utils.interpolate(0, -180, progress),
    rotationX: gsap.utils.interpolate(3, -3, progress),
    rotationZ: gsap.utils.interpolate(3, -3, progress),
  });

  /**
   * Prevent default scroll behavior
   */
  const preventScroll = (e: Event) => {
    e.preventDefault();
  };

  /**
   * Prevent arrow key scrolling
   */
  const preventArrowScroll = (e: KeyboardEvent) => {
    const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
    if (keys.includes(e.key)) {
      e.preventDefault();
    }
  };

  /**
   * Lock user scroll during transitions
   */
  const lockUserScroll = () => {
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventArrowScroll, false);
  };

  /**
   * Unlock user scroll
   */
  const unlockUserScroll = () => {
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
    window.removeEventListener('keydown', preventArrowScroll);
  };

  // ========== GRID ANIMATIONS ==========

  /**
   * Animates a single grid item in
   */
  const animateGridItemIn = (
    el: HTMLElement,
    dx: number,
    dy: number,
    rotationY: number,
    delay: number,
  ) => {
    gsap.fromTo(
      el,
      {
        transformOrigin: `50% 50% ${dx > 0 ? -dx * 0.8 : dx * 0.8}px`,
        autoAlpha: 0,
        y: dy * 0.5,
        scale: 0.5,
        rotationY: dx < 0 ? rotationY : rotationY,
      },
      {
        y: 0,
        scale: 1,
        rotationY: 0,
        autoAlpha: 1,
        duration: 0.4,
        ease: 'sine',
        delay: delay + 0.1,
      },
    );

    gsap.fromTo(
      el,
      { z: -3500 },
      {
        z: 0,
        duration: 0.3,
        ease: 'expo',
        delay,
      },
    );
  };

  /**
   * Animates a single grid item out
   */
  const animateGridItemOut = (
    el: HTMLElement,
    dx: number,
    dy: number,
    rotationY: number,
    delay: number,
    isLast: boolean,
    onComplete?: () => void,
  ) => {
    gsap.to(el, {
      startAt: {
        transformOrigin: `50% 50% ${dx > 0 ? -dx * 0.8 : dx * 0.8}px`,
      },
      y: dy * 0.4,
      rotationY: dx < 0 ? rotationY : rotationY,
      scale: 0.4,
      autoAlpha: 0,
      duration: 0.4,
      ease: 'sine.in',
      delay,
    });

    gsap.to(el, {
      z: -3500,
      duration: 0.4,
      ease: 'expo.in',
      delay: delay + 0.9,
      onComplete: isLast ? onComplete : undefined,
    });
  };

  /**
   * Animates all grid items in or out with distance-based stagger
   */
  const animateGridItems = ({
    items,
    centerX,
    centerY,
    direction = 'in',
    onComplete,
  }: {
    items: NodeListOf<HTMLElement>;
    centerX: number;
    centerY: number;
    direction?: 'in' | 'out';
    onComplete?: () => void;
  }) => {
    const itemData = Array.from(items).map((el) => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;
      const dx = centerX - elCenterX;
      const dy = centerY - elCenterY;
      const dist = Math.hypot(dx, dy);
      const isLeft = elCenterX < centerX;
      return { el, dx, dy, dist, isLeft };
    });

    const maxDist = Math.max(...itemData.map(d => d.dist));
    const totalStagger = 0.025 * (itemData.length - 1);

    let latest = { delay: -1, el: null as HTMLElement | null };

    itemData.forEach(({ el, dx, dy, dist, isLeft }) => {
      const norm = maxDist ? dist / maxDist : 0;
      const exponential = (direction === 'in' ? 1 - norm : norm) ** 1;
      const delay = exponential * totalStagger;
      const rotationY = isLeft ? 100 : -100;

      if (direction === 'in') {
        animateGridItemIn(el, dx, dy, rotationY, delay);
      } else {
        if (delay > latest.delay) {
          latest = { delay, el };
        }
        animateGridItemOut(el, dx, dy, rotationY, delay, false, onComplete);
      }
    });

    // Ensure onComplete runs only after the last item finishes
    if (direction === 'out' && latest.el) {
      const lastData = itemData.find(d => d.el === latest.el);
      if (lastData) {
        const { el, dx, dy, isLeft } = lastData;
        const rotationY = isLeft ? 100 : -100;
        animateGridItemOut(el, dx, dy, rotationY, latest.delay, true, onComplete);
      }
    }
  };

  /**
   * Animates preview grid in
   */
  const animatePreviewGridIn = (preview: HTMLDivElement) => {
    const items = preview.querySelectorAll<HTMLElement>('.grid__item');
    gsap.set(items, { clearProps: 'all' });

    animateGridItems({
      items,
      centerX: window.innerWidth / 2,
      centerY: window.innerHeight / 2,
      direction: 'in',
    });
  };

  /**
   * Animates preview grid out
   */
  const animatePreviewGridOut = (preview: HTMLDivElement) => {
    const items = preview.querySelectorAll<HTMLElement>('.grid__item');
    const onComplete = () => gsap.set(preview, { pointerEvents: 'none', autoAlpha: 0 });

    animateGridItems({
      items,
      centerX: window.innerWidth / 2,
      centerY: window.innerHeight / 2,
      direction: 'out',
      onComplete,
    });
  };

  // ========== TEXT ANIMATIONS ==========

  /**
   * Animates text characters in or out
   */
  const animateChars = (
    chars: HTMLElement[],
    direction: 'in' | 'out' = 'in',
  ) => {
    gsap.fromTo(
      chars,
      { autoAlpha: direction === 'in' ? 0 : 1 },
      {
        autoAlpha: direction === 'in' ? 1 : 0,
        duration: 0.02,
        ease: 'none',
        stagger: { each: 0.04, from: direction === 'in' ? 'start' : 'end' },
      },
    );
  };

  /**
   * Animates preview title and close button
   */
  const animatePreviewTexts = (
    preview: HTMLDivElement,
    direction: 'in' | 'out' = 'in',
  ) => {
    preview.querySelectorAll('.preview__title span, .preview__close').forEach((el) => {
      const split = splitTextInstancesRef.current.get(el);
      if (split?.chars) {
        animateChars(split.chars as HTMLElement[], direction);
      }
    });
  };

  // ========== EVENT HANDLERS ==========

  const { contextSafe } = useGSAP({ scope: containerRef });

  /**
   * Handle title click: transition from carousel to preview
   */
  const handleTitleClick = contextSafe((e: React.MouseEvent<HTMLHeadingElement>) => {
    if (isAnimating) {
      return;
    }

    setIsAnimating(true);

    const titleEl = e.currentTarget;
    // Find sceneId directly from titleRefs since titleEl is already in the map
    const sceneId = Array.from(titleRefs.current.entries()).find(
      ([, el]) => el === titleEl,
    )?.[0];

    if (!sceneId) {
      return;
    }

    setActivePreviewId(sceneId);

    const scene = sceneRefs.current.get(sceneId);
    const carousel = carouselRefs.current.get(sceneId);
    const previewSelector = titleEl.querySelector('a')?.getAttribute('href');
    const preview = previewSelector
      ? document.querySelector<HTMLDivElement>(previewSelector)
      : null;
    const titleSpan = titleEl.querySelector('span');

    if (!scene || !carousel || !preview || !titleSpan) {
      return;
    }

    const split = splitTextInstancesRef.current.get(titleSpan);
    const chars = (split?.chars as HTMLElement[]) || [];
    const cards = carousel.querySelectorAll(`.${styles.card}`);

    // Calculate scroll position to center the scene
    const offsetTop = scene.getBoundingClientRect().top + window.scrollY;
    const targetY = offsetTop - window.innerHeight / 2 + scene.offsetHeight / 2;

    // Disable ScrollTriggers during animation
    ScrollTrigger.getAll().forEach(t => t.disable(false));

    gsap.timeline({
      defaults: { duration: 1.5, ease: 'power2.inOut' },
      onComplete: () => {
        setIsAnimating(false);
        ScrollTrigger.getAll().forEach(t => t.enable());
        const timeline = timelinesRef.current.get(sceneId);
        if (timeline?.scrollTrigger) {
          timeline.scrollTrigger.scroll(targetY);
        }
      },
    })
      .to(window, {
        onStart: lockUserScroll,
        onComplete: () => {
          unlockUserScroll();
          const smoother = ScrollSmoother.get();
          if (smoother) {
            smoother.paused(true);
          }
        },
        scrollTo: { y: targetY, autoKill: true },
      })
      .to(
        chars,
        {
          autoAlpha: 0,
          duration: 0.02,
          ease: 'none',
          stagger: { each: 0.04, from: 'end' },
        },
        0,
      )
      .to(carousel, { rotationX: 90, rotationY: -360, z: -2000 }, 0)
      .to(
        carousel,
        {
          duration: 2.5,
          ease: 'power3.inOut',
          z: 1500,
          rotationZ: 270,
          onComplete: () => {
            if (sceneWrapperRef.current) {
              gsap.set(sceneWrapperRef.current, { autoAlpha: 0 });
            }
          },
        },
        0.7,
      )
      .to(cards, { rotationZ: 0 }, 0)
      .add(() => {
        gsap.set(preview, { pointerEvents: 'auto', autoAlpha: 1 });
        animatePreviewGridIn(preview);
        animatePreviewTexts(preview, 'in');
      }, '<+=1.9');
  });

  /**
   * Helper: Get scene elements from preview using refs instead of DOM queries
   */
  const getSceneElementsFromPreview = (previewEl: HTMLElement) => {
    // Extract sceneId from preview ID (e.g., "preview-scene-1" -> "scene-1")
    const sceneId = previewEl.id.replace('preview-', '');

    // Get elements from refs
    const wrapper = sceneRefs.current.get(sceneId);
    const carousel = carouselRefs.current.get(sceneId);
    const titleEl = titleRefs.current.get(sceneId);

    if (!wrapper || !carousel || !titleEl) {
      return null;
    }

    // Get cards from carousel using CSS Module class
    const cards = carousel.querySelectorAll(`.${styles.card}`) as NodeListOf<HTMLElement>;
    const span = titleEl.querySelector('span') as HTMLElement;
    const split = splitTextInstancesRef.current.get(span);
    const chars = (split?.chars as HTMLElement[]) || [];

    return { wrapper, carousel, cards, span, chars };
  };

  /**
   * Handle close click: transition from preview back to carousel
   */
  const handleCloseClick = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) {
      return;
    }

    setIsAnimating(true);
    setActivePreviewId(null);

    const preview = e.currentTarget.closest('.preview') as HTMLDivElement;
    if (!preview) {
      setIsAnimating(false);
      return;
    }

    const elements = getSceneElementsFromPreview(preview);
    if (!elements) {
      setIsAnimating(false);
      return;
    }

    const { carousel, cards, chars } = elements;

    animatePreviewTexts(preview, 'out');
    animatePreviewGridOut(preview);

    gsap.set(sceneWrapperRef.current, { autoAlpha: 1 });

    const progress = 0.5;
    const { rotationX, rotationY, rotationZ } = getInterpolatedRotation(progress);

    gsap
      .timeline({
        delay: 0.7,
        defaults: { duration: 1.3, ease: 'expo' },
        onComplete: () => {
          const smoother = ScrollSmoother.get();
          if (smoother) {
            smoother.paused(false);
          }
          setIsAnimating(false);
        },
      })
      .fromTo(
        chars,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.02,
          ease: 'none',
          stagger: { each: 0.04, from: 'start' },
        },
      )
      .fromTo(
        carousel,
        {
          z: -550,
          rotationX,
          rotationY: -720,
          rotationZ,
          yPercent: 300,
        },
        {
          rotationY,
          yPercent: 0,
        },
        0,
      )
      .fromTo(cards, { autoAlpha: 0 }, { autoAlpha: 1 }, 0.3);
  });

  // ========== IMAGE PRELOADING ==========

  /**
   * Check if component is mounted and preview-wrapper exists (for portal)
   */
  useEffect(() => {
    // Wait for preview-wrapper to be in DOM
    const checkWrapper = () => {
      const wrapper = document.getElementById('preview-wrapper');
      if (wrapper) {
        setIsMounted(true);
      } else {
        // Retry after a short delay
        requestAnimationFrame(checkWrapper);
      }
    };

    checkWrapper();
  }, []);

  /**
   * Wait for all grid images to load before initializing animations
   */
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    // Wait for preview-wrapper to be in DOM
    const previewWrapper = document.getElementById('preview-wrapper');
    if (!previewWrapper) {
      return;
    }

    const gridImages = previewWrapper.querySelectorAll('.grid__item-image');
    if (gridImages.length > 0) {
      const imgLoad = imagesLoaded(gridImages);
      imgLoad.on('always', () => {
        setImagesReady(true);
      });
    } else {
      // No images to load, proceed
      setImagesReady(true);
    }
  }, [isMounted]);

  /**
   * Navigate lightbox images
   */
  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!lightboxSceneId) {
      return;
    }

    const scene = scenes.find(s => s.id === lightboxSceneId);
    if (!scene) {
      return;
    }

    const totalImages = scene.gridImages.length;
    let newIndex = lightboxIndex;

    if (direction === 'next') {
      newIndex = (lightboxIndex + 1) % totalImages;
    } else {
      newIndex = (lightboxIndex - 1 + totalImages) % totalImages;
    }

    const newImage = scene.gridImages[newIndex];
    if (newImage) {
      setLightboxIndex(newIndex);
      setLightboxImage(newImage.src);
    }
  };

  /**
   * Handle keyboard navigation in lightbox
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxImage || !lightboxSceneId) {
        return;
      }

      if (e.key === 'Escape') {
        setLightboxImage(null);
        setLightboxSceneId(null);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateLightbox('prev');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateLightbox('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, lightboxSceneId, lightboxIndex, navigateLightbox]);

  // ========== INITIALIZATION ==========

  /**
   * Setup carousels and scroll animations
   */
  useGSAP(
    () => {
      if (!imagesReady) {
        return;
      }

      scenes.forEach((scene) => {
        const carousel = carouselRefs.current.get(scene.id);
        const sceneEl = sceneRefs.current.get(scene.id);
        const title = titleRefs.current.get(scene.id);
        const preview = previewRefs.current.get(scene.id);

        if (!carousel || !sceneEl || !title || !preview) {
          return;
        }

        // Initialize SplitText for this scene's title span
        const titleSpan = title.querySelector('span');
        if (titleSpan) {
          const titleSplit = SplitText.create(titleSpan, {
            type: 'chars',
            charsClass: 'char',
          });
          splitTextInstancesRef.current.set(titleSpan, titleSplit);
        }

        // Initialize SplitText for preview texts
        preview.querySelectorAll('.preview__title span, .preview__close').forEach((el) => {
          const split = SplitText.create(el as HTMLElement, {
            type: 'chars',
            charsClass: 'char',
          });
          splitTextInstancesRef.current.set(el, split);
        });

        // Setup 3D carousel cells
        setupCarouselCells(carousel, scene.radius || 500);

        // Create scroll-linked animation
        const cards = carousel.querySelectorAll(`.${styles.card}`);
        const titleSplitInstance = titleSpan ? splitTextInstancesRef.current.get(titleSpan) : null;
        const chars = (titleSplitInstance?.chars as HTMLElement[]) || [];

        const timeline = gsap.timeline({
          defaults: { ease: 'sine.inOut' },
          scrollTrigger: {
            trigger: sceneEl,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });

        timeline
          .fromTo(carousel, { rotationY: 0 }, { rotationY: -180 }, 0)
          .fromTo(
            carousel,
            { rotationZ: 3, rotationX: 3 },
            { rotationZ: -3, rotationX: -3 },
            0,
          )
          .fromTo(
            cards,
            { filter: 'brightness(250%)' },
            { filter: 'brightness(80%)', ease: 'power3' },
            0,
          )
          .fromTo(cards, { rotationZ: 10 }, { rotationZ: -10, ease: 'none' }, 0);

        // Animate title characters on scroll
        if (chars.length > 0) {
          gsap.fromTo(
            chars,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: 0.15,
              ease: 'power2.out',
              stagger: { each: 0.08, from: 'start' },
              scrollTrigger: {
                trigger: sceneEl,
                start: 'top center',
                toggleActions: 'play none none reverse',
              },
            },
          );
        }

        timelinesRef.current.set(scene.id, timeline);
      });

      // Refresh ScrollTrigger on window resize
      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        // Revert all SplitText instances
        splitTextInstancesRef.current.forEach((split) => {
          split.revert();
        });
        splitTextInstancesRef.current.clear();
      };
    },
    { scope: containerRef, dependencies: [scenes, imagesReady] },
  );

  // ========== RENDER ==========

  // Render previews separately for React Portal
  const previewsContent = (
    <>
      {scenes.map(scene => (
        <div
          key={`preview-${scene.id}`}
          id={`preview-${scene.id}`}
          ref={(el) => {
            if (el) {
              previewRefs.current.set(scene.id, el);
            }
          }}
          className="preview"
        >
          {/* Preview Header */}
          <div className="preview__header">
            <h2 className="preview__title">
              <span>{scene.title}</span>
            </h2>
            <button
              type="button"
              className="preview__close"
              onClick={e => handleCloseClick(e)}
            >
              CLOSE
            </button>
          </div>

          {/* Grid */}
          <div className="grid">
            {scene.gridImages.map((img, imgIndex) => (
              <div
                key={imgIndex}
                className="grid__item"
              >
                <div
                  className="grid__item-image"
                  onClick={() => {
                    setLightboxImage(img.src);
                    setLightboxIndex(imgIndex);
                    setLightboxSceneId(scene.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setLightboxImage(img.src);
                      setLightboxIndex(imgIndex);
                      setLightboxSceneId(scene.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${img.title || `image ${imgIndex + 1}`} in fullscreen`}
                >
                  <Image
                    src={img.src}
                    alt={img.title || `Grid image ${imgIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                {img.caption && (
                  <div className="grid__item-caption">
                    <h3>{img.caption}</h3>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Lightbox */}
      <div className={`lightbox ${lightboxImage ? 'active' : ''}`}>
        {lightboxImage && lightboxSceneId && (
          <>
            <Image
              src={lightboxImage}
              alt="Fullscreen view"
              className="lightbox__image"
              width={1920}
              height={1080}
              style={{ objectFit: 'contain' }}
            />
            <button
              type="button"
              className="lightbox__close"
              onClick={() => {
                setLightboxImage(null);
                setLightboxSceneId(null);
              }}
              aria-label="Close lightbox"
            >
              ✕ CLOSE
            </button>
            <button
              type="button"
              className="lightbox__nav lightbox__nav--prev"
              onClick={() => navigateLightbox('prev')}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              className="lightbox__nav lightbox__nav--next"
              onClick={() => navigateLightbox('next')}
              aria-label="Next image"
            >
              ›
            </button>
            <div className="lightbox__counter">
              {lightboxIndex + 1}
              {' '}
              /
              {scenes.find(s => s.id === lightboxSceneId)?.gridImages.length || 0}
            </div>
          </>
        )}
      </div>
    </>
  );

  return (
    <>
      <div ref={containerRef} className={styles.photographyHero}>
        {/* Scene Wrapper */}
        <div ref={sceneWrapperRef} className={styles.sceneWrapper}>
          {scenes.map(scene => (
            <div
              key={scene.id}
              ref={(el) => {
                if (el) {
                  sceneRefs.current.set(scene.id, el);
                }
              }}
              className={styles.scene}
              data-radius={scene.radius || 500}
            >
              {/* Scene Title */}
              <h2
                ref={(el) => {
                  if (el) {
                    titleRefs.current.set(scene.id, el);
                  }
                }}
                className={styles.sceneTitle}
                data-speed="0.7"
                onClick={(e) => {
                  e.preventDefault(); // Prevent hash navigation FIRST
                  handleTitleClick(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.currentTarget.click();
                  }
                }}
              >
                <a href={`#preview-${scene.id}`}>
                  <span>{scene.title}</span>
                </a>
              </h2>

              {/* Carousel */}
              <div
                ref={(el) => {
                  if (el) {
                    carouselRefs.current.set(scene.id, el);
                  }
                }}
                className={styles.carousel}
              >
                {scene.cards.map((card, cardIndex) => (
                  <div
                    key={cardIndex}
                    className={styles.carouselCell}
                  >
                    <div className={styles.card}>
                      {/* Front Face */}
                      <div className={styles.cardFace}>
                        <Image
                          src={card.front}
                          alt={card.alt || `Card ${cardIndex + 1} front`}
                          fill
                          sizes="350px"
                        />
                      </div>
                      {/* Back Face */}
                      <div className={`${styles.cardFace} ${styles.cardFaceBack}`}>
                        <Image
                          src={card.back}
                          alt={card.alt || `Card ${cardIndex + 1} back`}
                          fill
                          sizes="350px"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Render previews in portal outside smooth-content */}
      {isMounted && typeof document !== 'undefined' && document.getElementById('preview-wrapper')
        && createPortal(previewsContent, document.getElementById('preview-wrapper')!)}
    </>
  );
}
