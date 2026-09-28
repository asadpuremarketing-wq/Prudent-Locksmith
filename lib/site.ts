export const SITE = {
  name: 'Prudent Locksmith and Garage Door Services',
  description:
    'Premium locksmith and garage door services with fast response, clear pricing, and dependable technicians.',
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://www.purdentlocksmith.ca',
  sitemapBaseUrl: 'https://www.purdentlocksmith.ca',
  phoneDisplay: '+1 289-556-6332',
  phoneHref: 'tel:+12895566332',
  email: 'info@purdentlocksmith.ca',
  province: 'Ontario',
  country: 'Canada',
  serviceAreaPrimary: 'Hamilton, ON',
  serviceAreaCities: [
    'Hamilton', 'Burlington', 'Oakville', 'Mississauga',
    'Stoney Creek', 'Ancaster', 'Dundas', 'Waterdown', 'Milton', 'Brampton'
  ],
  hours: 'Monday–Sunday, 24/7 emergency availability',
  licenseNote: 'Operates in compliance with applicable Ontario trade and business regulations. Technicians carry general liability insurance.'
};

