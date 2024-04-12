import { DOCS_URL, BLOG_URL } from '../../shared/constants';
import daBoiAvatar from '../static/da-boi.png';
import avatarPlaceholder from '../static/avatar-placeholder.png';

export const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Chat', href: '/chat' },
  { name: 'Pricing', href: '/pricing' },
];
export const features = [
  {
    name: 'Intelligent Strategy Customization',
    description: 'FastAgency tailors campaigns to your business goals using AI that understands your audience.',
    icon: '🤖', //'🤝',
    href: '',
  },
  {
    name: '360° Campaign Management',
    description:
      'Our specialized AI agents manage everything from keyword selection to budget optimization, keeping your campaigns at peak efficiency.',
    icon: '👍', //'🔐',
    href: '',
  },
  {
    name: 'Data Privacy First',
    description:
      'Your data remains secure. We offer real-time processing and optional chat history storage to ensure maximum privacy and security for your business information.',
    icon: '🔐',
    href: '',
  },
  {
    name: 'Seamless Integration',
    description:
      'FastAgency seamlessly integrates with your current workflows, beginning with Google Ads and quickly extending to more platforms.',
    icon: '🤝', //'💸',
    href: '',
  },
];
export const testimonials = [
  {
    name: 'Da Boi',
    role: 'Wasp Mascot',
    avatarSrc: daBoiAvatar,
    socialUrl: 'https://twitter.com/wasplang',
    quote: "I don't even know how to code. I'm just a plushie.",
  },
  {
    name: 'Mr. Foobar',
    role: 'Founder @ Cool Startup',
    avatarSrc: avatarPlaceholder,
    socialUrl: '',
    quote: 'This product makes me cooler than I already am.',
  },
  {
    name: 'Jamie',
    role: 'Happy Customer',
    avatarSrc: avatarPlaceholder,
    socialUrl: '#',
    quote: 'My cats love it!',
  },
];

export const faqs = [
  {
    id: 1,
    question: 'Whats the meaning of life?',
    answer: '42.',
    href: 'https://en.wikipedia.org/wiki/42_(number)',
  },
];
export const footerNavigation = {
  // app: [
  //   { name: 'Documentation', href: DOCS_URL },
  //   { name: 'Blog', href: BLOG_URL },
  // ],
  company: [
    { name: 'About', href: 'https://airt.ai/' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms of Service', href: '/toc' },
  ],
};
