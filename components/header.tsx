'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Container } from '@/components/ui/container';
import { PhoneLink } from '@/components/phone-link';
import { getEmergencyServices, servicesConfig } from '@/lib/services';
import { IMAGES } from '@/lib/images';
import { SITE } from '@/lib/site';

export function Header() {
  const pathname = usePathname();
  const servicesActive = pathname?.startsWith('/services') ?? false;
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path) ?? false;
  };

  return (
    <div className="sticky top-0 z-[90]">
      {/* Urgency Announcement Bar */}
      <div className="announcement-bar">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="pulse-dot pulse-dot-teal flex-shrink-0" aria-hidden="true" />
            <span className="font-medium text-white">Live Dispatch — Available Now</span>
            <span className="hidden sm:inline text-slate-400">·</span>
            <span className="hidden sm:inline text-slate-300">Hamilton &amp; GTA</span>
          </div>
          <PhoneLink className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors">
            {SITE.phoneDisplay}
          </PhoneLink>
        </div>
      </div>

      {/* Main Header */}
      <header className="border-b border-slate-200/70 bg-header-gradient backdrop-blur">
        <Container>
          <div className="flex items-center justify-between py-3.5">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="relative">
                <Image src={IMAGES.brand.logoMark} alt="Prudent" width={36} height={36} className="transition-transform duration-200 group-hover:scale-105" />
              </div>
              <div>
                <span className="block text-lg font-bold font-display text-ink-950 leading-tight tracking-tight">Prudent</span>
                <span className="block text-[10px] font-medium text-ink-600 leading-tight uppercase tracking-wider">Locksmith &amp; Garage Door</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 text-sm font-medium text-ink-700 lg:flex">
              <Link
                href="/"
                className={clsx(
                  'inline-flex min-h-[40px] items-center rounded-full px-3 py-1.5 transition-all hover:text-ink-950 hover:bg-slate-100',
                  isActive('/') && 'bg-slate-100 text-ink-950'
                )}
              >
                Home
              </Link>
              <Link
                href="/emergency"
                className={clsx(
                  'inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 py-1.5 transition-all hover:text-red-700 hover:bg-red-50',
                  isActive('/emergency') ? 'bg-red-50 text-red-700' : 'text-ink-700'
                )}
              >
                <span className="pulse-dot flex-shrink-0" aria-hidden="true" style={{ width: 6, height: 6 }} />
                Emergency
              </Link>
              <ServicesMenu active={servicesActive} />
              <Link
                href="/service-areas"
                className={clsx(
                  'inline-flex min-h-[40px] items-center rounded-full px-3 py-1.5 transition-all hover:text-ink-950 hover:bg-slate-100',
                  isActive('/service-areas') && 'bg-slate-100 text-ink-950'
                )}
              >
                Service Areas
              </Link>
              <Link
                href="/about"
                className={clsx(
                  'inline-flex min-h-[40px] items-center rounded-full px-3 py-1.5 transition-all hover:text-ink-950 hover:bg-slate-100',
                  isActive('/about') && 'bg-slate-100 text-ink-950'
                )}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={clsx(
                  'inline-flex min-h-[40px] items-center rounded-full px-3 py-1.5 transition-all hover:text-ink-950 hover:bg-slate-100',
                  isActive('/contact') && 'bg-slate-100 text-ink-950'
                )}
              >
                Contact
              </Link>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <PhoneLink asButton size="sm" className="shadow-glow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                Call Now
              </PhoneLink>
            </div>

            {/* Mobile hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <PhoneLink asButton size="sm" className="hidden sm:inline-flex">
                Call Now
              </PhoneLink>
              <MobileMenu />
            </div>
          </div>
        </Container>
      </header>
    </div>
  );
}

function ServicesMenu({ active }: { active: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(96);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const topServices = getEmergencyServices().slice(0, 4);

  useEffect(() => {
    function measureHeader() {
      const sticky = document.querySelector('[data-header-wrapper]') as HTMLElement | null ?? document.querySelector('header')?.parentElement;
      const header = document.querySelector('header');
      const bar = document.querySelector('.announcement-bar');
      const total = (header?.getBoundingClientRect().height ?? 56) + (bar?.getBoundingClientRect().height ?? 36);
      setHeaderHeight(total);
    }
    measureHeader();
    window.addEventListener('resize', measureHeader);
    return () => window.removeEventListener('resize', measureHeader);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (!wrapperRef.current?.contains(target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  function openMenu() {
    if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null; }
    setOpen(true);
  }
  function scheduleClose() {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => setOpen(false), 120);
  }
  function onBlur() {
    requestAnimationFrame(() => {
      const activeEl = document.activeElement;
      if (activeEl && wrapperRef.current?.contains(activeEl)) return;
      scheduleClose();
    });
  }

  return (
    <div ref={wrapperRef} className="relative" onMouseEnter={openMenu} onMouseLeave={scheduleClose} onFocus={openMenu} onBlur={onBlur}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="services-mega-menu"
        aria-label="Services menu"
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          'inline-flex min-h-[40px] items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600',
          active ? 'bg-teal-50 text-teal-700' : 'text-ink-700 hover:text-ink-950 hover:bg-slate-100'
        )}
      >
        Services
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={clsx('transition-transform duration-200', open && 'rotate-180')}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      <div
        id="services-mega-menu"
        role="menu"
        className={clsx(
          'fixed left-0 right-0 z-40 mt-2 overflow-y-auto opacity-0 pointer-events-none transition-all duration-200 motion-safe:translate-y-2',
          open && 'opacity-100 pointer-events-auto motion-safe:translate-y-0'
        )}
        style={{ top: headerHeight + 4, maxHeight: `calc(100vh - ${headerHeight}px - 16px)` }}
      >
        <div className="mega-menu-gradient mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 p-6 shadow-card-hover">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_0.9fr]">
            {servicesConfig.map((category) => (
              <div key={category.slug} className="border-l-2 border-slate-100 pl-4">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600">{category.label}</p>
                <p className="mt-1.5 text-sm font-semibold text-ink-950">{category.name}</p>
                <ul className="mt-3 space-y-1 text-sm text-ink-700">
                  {category.services.map((service) => {
                    const href = `/services/${category.slug}/${service.slug}`;
                    const isCurrent = pathname === href;
                    return (
                      <li key={service.id}>
                        <Link
                          href={href}
                          className={clsx(
                            'relative block truncate rounded-lg px-3 py-1.5 transition-all hover:bg-teal-50 hover:text-teal-700',
                            isCurrent && 'bg-teal-50 text-teal-700 font-semibold'
                          )}
                        >
                          {isCurrent && (
                            <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-teal-600" aria-hidden="true" />
                          )}
                          {service.shortLabel}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <div className="order-first rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-rose-100 p-4 lg:order-last">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="pulse-dot flex-shrink-0" style={{ width: 7, height: 7 }} aria-hidden="true" />
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">Emergency Priority</p>
              </div>
              <p className="text-sm font-semibold text-ink-950">Top urgent services</p>
              <ul className="mt-3 space-y-1 text-sm text-ink-700">
                {topServices.map((service) => {
                  const href = `/services/${service.category.slug}/${service.slug}`;
                  const isCurrent = pathname === href;
                  return (
                    <li key={service.id}>
                      <Link
                        href={href}
                        className={clsx(
                          'relative block truncate rounded-lg px-3 py-1.5 transition-all hover:bg-white hover:text-red-700',
                          isCurrent && 'bg-white text-red-700 font-semibold'
                        )}
                      >
                        {service.shortLabel}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link href="/services" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-600 transition-colors">
                View all services
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenu() {
  const pathname = usePathname();
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path) ?? false;
  };
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu-drawer"
        aria-label="Open menu"
        className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-ink-950 shadow-sm hover:bg-slate-50 transition-all"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
        <span className="ml-2 hidden xs:inline" aria-hidden="true">Menu</span>
      </button>

      {mounted && open
        ? createPortal(
          <div className="fixed inset-0 z-[200] lg:hidden">
            <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" aria-hidden="true" onClick={() => setOpen(false)} />
            <div
              ref={panelRef}
              id="mobile-menu-drawer"
              role="dialog"
              aria-modal="true"
              className="fixed inset-y-0 right-0 z-[210] w-[88vw] max-w-sm overflow-y-auto bg-white shadow-card-hover"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Image src={IMAGES.brand.logoMark} alt="Prudent" width={28} height={28} />
                  <span className="font-bold font-display text-ink-950">Prudent</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-ink-700 hover:bg-slate-50 transition-all"
                  aria-label="Close menu"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
              </div>

              {/* Emergency CTA */}
              <div className="mx-4 mt-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-rose-100 p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="pulse-dot flex-shrink-0" style={{ width: 7, height: 7 }} aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600">Emergency Available</span>
                </div>
                <PhoneLink asButton className="w-full mt-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  Call {SITE.phoneDisplay}
                </PhoneLink>
              </div>

              {/* Nav links */}
              <nav className="mt-4 flex flex-col gap-0.5 px-4 pb-8 text-sm font-medium">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/emergency', label: 'Emergency', urgent: true },
                  { href: '/service-areas', label: 'Service Areas' },
                  { href: '/about', label: 'About' },
                  { href: '/contact', label: 'Contact' }
                ].map(({ href, label, urgent }) => (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      'flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all',
                      isActive(href)
                        ? 'bg-teal-50 text-teal-700 font-semibold'
                        : urgent
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-ink-700 hover:bg-slate-50 hover:text-ink-950'
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {urgent && <span className="pulse-dot flex-shrink-0" style={{ width: 7, height: 7 }} aria-hidden="true" />}
                    {label}
                  </Link>
                ))}

                {/* Top services accordion */}
                <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-500 px-1">Top Services</p>
                  <ul className="mt-2 space-y-0.5">
                    {getEmergencyServices().slice(0, 5).map((service) => (
                      <li key={service.id}>
                        <Link
                          href={`/services/${service.category.slug}/${service.slug}`}
                          className="block rounded-lg px-3 py-2 text-ink-700 hover:bg-white hover:text-ink-950 transition-all"
                          onClick={() => setOpen(false)}
                        >
                          {service.shortLabel}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/services"
                    className="mt-2 inline-flex items-center gap-1 px-3 text-xs font-semibold text-teal-700"
                    onClick={() => setOpen(false)}
                  >
                    All services →
                  </Link>
                </div>
              </nav>
            </div>
          </div>,
          document.body
        )
        : null}
    </>
  );
}
