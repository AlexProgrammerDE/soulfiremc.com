import {
  Building2,
  Gift,
  Globe,
  Heart,
  Home,
  Infinity as InfinityIcon,
  Smartphone,
  Star,
  Wifi,
} from "lucide-react";

export type FilterableBadge =
  | "residential"
  | "datacenter"
  | "isp"
  | "mobile"
  | "free-tier"
  | "unlimited-bandwidth"
  | "budget-friendly"
  | "enterprise"
  | "high-quality";

export type Badge = FilterableBadge | "sponsor";

export type SponsorTheme = {
  ring: string;
  bg: string;
  badge: string;
};

export type Provider = {
  name: string;
  logo?: string;
  testimonial: string;
  url: string;
  badges: Badge[];
  sponsor?: boolean;
  sponsorTheme?: string;
  couponCode?: string;
  couponDiscount?: string;
};

export const SPONSOR_THEMES: Record<string, SponsorTheme> = {
  pink: {
    ring: "ring-pink-500/50",
    bg: "bg-gradient-to-r from-pink-500/5 to-purple-500/5",
    badge: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  amber: {
    ring: "ring-amber-500/50",
    bg: "bg-gradient-to-r from-amber-500/5 to-orange-500/5",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
};

export const BADGE_CONFIG: Record<
  Badge,
  {
    label: string;
    className: string;
    description: string;
    icon: React.ReactNode;
  }
> = {
  "free-tier": {
    label: "Free Tier",
    className: "bg-green-500/10 text-green-600 dark:text-green-400",
    description:
      "This provider offers a free tier, allowing you to test their service before committing to a paid plan.",
    icon: <Gift className="h-3 w-3" />,
  },
  "high-quality": {
    label: "High Quality",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    description:
      "Premium proxies with high reliability, fast speeds, and excellent uptime. Best for demanding use cases.",
    icon: <Star className="h-3 w-3" />,
  },
  residential: {
    label: "Residential",
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    description:
      "Real residential IP addresses from ISPs. Harder to detect and block, ideal for realistic testing scenarios.",
    icon: <Home className="h-3 w-3" />,
  },
  datacenter: {
    label: "Datacenter",
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    description:
      "Fast and affordable proxies from data centers. Great for high-volume testing where speed matters most.",
    icon: <Building2 className="h-3 w-3" />,
  },
  "unlimited-bandwidth": {
    label: "Unlimited Bandwidth",
    className: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    description:
      "No data caps or bandwidth limits. Perfect for extensive bot testing without worrying about usage.",
    icon: <InfinityIcon className="h-3 w-3" />,
  },
  sponsor: {
    label: "Sponsor",
    className: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    description:
      "This provider sponsors SoulFire monthly, helping fund the development of the project.",
    icon: <Heart className="h-3 w-3 fill-current" />,
  },
  "budget-friendly": {
    label: "Budget Friendly",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    description:
      "Affordable pricing with good value for money. Great for smaller projects or those on a tight budget.",
    icon: <Globe className="h-3 w-3" />,
  },
  enterprise: {
    label: "Enterprise",
    className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    description:
      "Enterprise-grade solution with advanced features, compliance certifications, and dedicated support.",
    icon: <Building2 className="h-3 w-3" />,
  },
  isp: {
    label: "ISP",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    description:
      "Static ISP proxies that combine datacenter speed with residential trust levels.",
    icon: <Wifi className="h-3 w-3" />,
  },
  mobile: {
    label: "Mobile",
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    description:
      "Mobile carrier IP addresses. Highest trust level, ideal for mobile app testing.",
    icon: <Smartphone className="h-3 w-3" />,
  },
};

export const FILTER_BADGES: FilterableBadge[] = [
  "residential",
  "datacenter",
  "isp",
  "mobile",
  "free-tier",
  "unlimited-bandwidth",
  "budget-friendly",
  "enterprise",
  "high-quality",
];

export const PROVIDERS: Provider[] = [
  // Sponsor always first
  {
    name: "Thordata",
    logo: "/providers/thordata.png",
    testimonial:
      "60M+ residential IPs across 190+ countries with 99.9% uptime. Offers residential, mobile, datacenter, and static ISP proxies.",
    url: "https://affiliate.thordata.com/soulfire",
    badges: ["sponsor", "high-quality", "residential", "mobile", "isp"],
    sponsor: true,
    sponsorTheme: "pink",
    couponCode: "THORDATA",
    couponDiscount: "20% off",
  },
  {
    name: "Proxy-Seller",
    logo: "/providers/proxyseller.svg",
    testimonial:
      "Dedicated datacenter proxies in 40+ countries. Unlimited bandwidth with 72-hour refund policy. From $0.9/IP.",
    url: "https://proxy-seller.com/?partner=GRJY71PA3XWPPP",
    badges: [
      "sponsor",
      "budget-friendly",
      "datacenter",
      "isp",
      "mobile",
      "residential",
    ],
    sponsor: true,
    sponsorTheme: "amber",
    couponCode: "SOULFIREMC",
    couponDiscount:
      "15% off IPv4/IPv6/ISP - 39% off Residential - 10% off Mobile proxies",
  },
  // Higher recommends
  {
    name: "Webshare",
    logo: "/providers/webshare.svg",
    testimonial:
      "80M+ rotating residential IPs from 195 countries, plus fast datacenter proxies. Offers 10 free proxies to get started.",
    url: "https://www.webshare.io/?referral_code=36gneippfiwt",
    badges: ["free-tier", "residential", "datacenter", "budget-friendly"],
  },
  {
    name: "ProxyScrape",
    logo: "/providers/proxyscrape.svg",
    testimonial:
      "55M+ residential IPs with 99.9% success rate. Unlimited bandwidth plans available for high-volume bot testing.",
    url: "https://proxyscrape.com/?ref=mge4mtc",
    badges: ["unlimited-bandwidth", "residential"],
  },
  // User recommendation
  {
    name: "PYPROXY",
    logo: "/providers/pyproxy.png",
    testimonial:
      "90M+ residential IPs across 190+ countries with 99% availability. Offers residential, datacenter, and ISP proxies starting at $0.60/GB.",
    url: "https://www.pyproxy.com/reg/?ref=1Pcpve",
    badges: ["residential", "datacenter", "isp", "budget-friendly"],
    couponCode: "SOULFIRE9",
    couponDiscount: "10% off",
  },
  {
    name: "PlainProxies",
    logo: "/providers/plainproxies.png",
    testimonial:
      "German provider with 10M+ IPs. 10Gbps datacenter proxies and unlimited residential options with rate-limit free rotation.",
    url: "https://dashboard.plainproxies.com/?ref=wTOIS7dS",
    badges: ["unlimited-bandwidth", "residential", "datacenter", "isp"],
  },
  // Enterprise tier
  {
    name: "Bright Data",
    logo: "/providers/brightdata.png",
    testimonial:
      "Market leader with 770K+ datacenter IPs and massive residential network. ISO 27001 & SOC 2 certified with 99.99% uptime.",
    url: "https://get.brightdata.com/soulfire",
    badges: [
      "enterprise",
      "high-quality",
      "residential",
      "datacenter",
      "mobile",
    ],
  },
  {
    name: "Oxylabs",
    logo: "/providers/oxylabs.png",
    testimonial:
      "175M+ residential IPs across 195+ countries. Largest proxy network globally with 99.95% success rate and 0.6s avg response time.",
    url: "https://oxylabs.go2cloud.org/aff_c?offer_id=7&aff_id=1896&url_id=144",
    badges: ["enterprise", "high-quality", "residential", "datacenter"],
  },
  // Mid tier
  {
    name: "Decodo (formerly Smartproxy)",
    logo: "/providers/decodo.svg",
    testimonial:
      "115M+ ethically-sourced residential IPs across 195+ locations. User-friendly with 99.86% success rate. Great for SMBs.",
    url: "https://visit.decodo.com/K0rr7e",
    badges: ["high-quality", "residential", "datacenter"],
  },
  {
    name: "IPRoyal",
    logo: "/providers/iproyal.svg",
    testimonial:
      "32M+ residential IPs across 195+ countries. Non-expiring traffic with unlimited bandwidth and threads. Great value.",
    url: "https://iproyal.com/?r=soulfire",
    badges: ["budget-friendly", "residential", "datacenter", "isp"],
  },
  {
    name: "NetNut",
    logo: "/providers/netnut.svg",
    testimonial:
      "85M+ residential IPs with ISP-based network for fast speeds. Direct ISP connectivity reduces latency.",
    url: "https://netnut.io?ref=odblmzc",
    badges: ["high-quality", "residential", "isp"],
  },
];
