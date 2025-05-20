// Define the internal editor data structure
export interface TemplateData {
  navbar: {
    logo?: string;
    title: string;
    links: Array<{
      text: string;
      url: string;
      isButton?: boolean;
    }>;
    sticky?: boolean;
    transparent?: boolean;
  };
  hero: {
    title: string;
    tagline: string;
    description: string;
    cta: { text: string; url: string };
    image?: string;
  };
  about: {
    title: string;
    description: string;
    image?: string;
    features: string[];
  };
  whyChoose: {
    title: string;
    subtitle: string;
    benefits: Array<string | { text: string; icon?: string }>;
  };
  features: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  };
  pricing: {
    title: string;
    subtitle: string;
    currency: string;
    plans: Array<{
      name: string;
      price: number;
      period: string;
      features: string[];
      isFeatured?: boolean;
      discountNote?: string;
    }>;
  };
  faq: {
    title: string;
    subtitle: string;
    items: Array<{ question: string; answer: string }>;
  };
  testimonials: Array<{
    name: string;
    role: string;
    content: string;
    image?: string;
  }>;
  media: { images: string[]; video?: string };
  brand: { name: string; contactEmail: string; socialLinks: { twitter?: string; facebook?: string; linkedin?: string } };
  theme: { primaryColor: string; secondaryColor: string; fontFamily?: string };
  footer?: string;
  customFields?: Record<string, any>;
}

export interface SectionProps {
  data: TemplateData;
  updateData: (path: string, value: any) => void;
}

export interface EditableCardProps<T> {
  item: T;
  index: number;
  onEdit: (index: number, item: T) => void;
  onDelete: (index: number) => void;
  renderPreview: (item: T, onEditClick: () => void) => React.ReactNode;
  renderEditor: (item: T, onDoneClick: () => void, onDeleteClick: () => void) => React.ReactNode;
} 