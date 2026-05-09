export interface Template {
  id: string;
  name: string;
  category: 'professional' | 'creative' | 'minimalist' | 'executive';
  description: string;
  colorSchemes: string[];
  features: string[];
  bestFor: string[];
}

export const templates: Template[] = [
  {
    id: 'professional',
    name: 'Professional',
    category: 'professional',
    description: 'Clean and modern two-column layout perfect for corporate positions',
    colorSchemes: ['blue', 'navy', 'teal', 'gray'],
    features: ['ATS-friendly', 'Two-column', 'Photo optional', 'Easy to scan'],
    bestFor: ['Corporate', 'Finance', 'Consulting', 'Sales']
  },
  {
    id: 'modern',
    name: 'Modern',
    category: 'professional',
    description: 'Contemporary design with geometric elements and accent colors',
    colorSchemes: ['blue', 'teal', 'indigo', 'purple'],
    features: ['Contemporary', 'Geometric', 'Visual bars', 'ATS-friendly'],
    bestFor: ['Technology', 'Engineering', 'Product', 'Operations']
  },
  {
    id: 'classic',
    name: 'Classic',
    category: 'professional',
    description: 'Timeless single-column traditional layout',
    colorSchemes: ['black', 'navy', 'gray', 'charcoal'],
    features: ['Traditional', 'One-column', 'Conservative', 'Formal'],
    bestFor: ['Law', 'Government', 'Banking', 'Insurance']
  },
  {
    id: 'executive',
    name: 'Executive',
    category: 'executive',
    description: 'Premium serif design for senior-level positions',
    colorSchemes: ['navy', 'charcoal', 'burgundy', 'forest'],
    features: ['Sophisticated', 'Elegant', 'Serif fonts', 'Premium'],
    bestFor: ['Executive', 'Management', 'Director', 'C-Level']
  },
  {
    id: 'creative',
    name: 'Creative',
    category: 'creative',
    description: 'Bold and colorful design for creative professionals',
    colorSchemes: ['purple', 'orange', 'pink', 'cyan'],
    features: ['Eye-catching', 'Colorful', 'Unique layout', 'Photo included'],
    bestFor: ['Design', 'Marketing', 'Media', 'Arts']
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    category: 'minimalist',
    description: 'Clean and simple design with maximum white space',
    colorSchemes: ['black', 'gray', 'blue', 'green'],
    features: ['Clean lines', 'White space', 'Simple', 'Elegant'],
    bestFor: ['Tech', 'Startups', 'Academic', 'Research']
  },
  {
    id: 'corporate',
    name: 'Corporate',
    category: 'professional',
    description: 'Traditional corporate format with strong emphasis on professionalism',
    colorSchemes: ['navy', 'charcoal', 'gray', 'blue'],
    features: ['Structured', 'Border accents', 'Formal', 'ATS-friendly'],
    bestFor: ['Corporate', 'Business', 'Administration', 'Legal']
  },
  {
    id: 'technical',
    name: 'Technical',
    category: 'professional',
    description: 'Code-inspired monospace design optimized for tech professionals',
    colorSchemes: ['indigo', 'teal', 'cyan', 'purple'],
    features: ['Monospace font', 'Sidebar layout', 'Skill bars', 'Modern'],
    bestFor: ['Software', 'IT', 'Development', 'Data Science']
  },
  {
    id: 'academic',
    name: 'Academic',
    category: 'professional',
    description: 'Scholarly format with centered layout for academic positions',
    colorSchemes: ['navy', 'charcoal', 'burgundy', 'forest'],
    features: ['Serif fonts', 'Centered', 'Publication focus', 'Formal'],
    bestFor: ['Academia', 'Research', 'Education', 'Science']
  },
  {
    id: 'sales',
    name: 'Sales',
    category: 'creative',
    description: 'Dynamic and achievement-focused design for sales professionals',
    colorSchemes: ['orange', 'purple', 'cyan', 'pink'],
    features: ['Metrics focus', 'Achievement highlights', 'Bold', 'Energetic'],
    bestFor: ['Sales', 'Business Development', 'Account Management', 'Marketing']
  },
  {
    id: 'designer',
    name: 'Designer',
    category: 'creative',
    description: 'Portfolio-style layout with visual emphasis and creative flair',
    colorSchemes: ['purple', 'pink', 'cyan', 'orange'],
    features: ['Visual design', 'Gradient sidebar', 'Photo ready', 'Portfolio style'],
    bestFor: ['Design', 'UX/UI', 'Creative', 'Art Direction']
  },
  {
    id: 'startup',
    name: 'Startup',
    category: 'creative',
    description: 'Modern and flexible design for dynamic startup environments',
    colorSchemes: ['purple', 'cyan', 'orange', 'indigo'],
    features: ['Flexible layout', 'Modern cards', 'Visual sections', 'Dynamic'],
    bestFor: ['Startups', 'Entrepreneurship', 'Innovation', 'Product']
  },
  {
    id: 'consultant',
    name: 'Consultant',
    category: 'executive',
    description: 'Professional consulting format with emphasis on experience',
    colorSchemes: ['navy', 'charcoal', 'burgundy', 'indigo'],
    features: ['Executive style', 'Timeline focus', 'Professional', 'Strategic'],
    bestFor: ['Consulting', 'Advisory', 'Strategy', 'Business']
  },
  {
    id: 'manager',
    name: 'Manager',
    category: 'executive',
    description: 'Leadership-focused design for management and director roles',
    colorSchemes: ['navy', 'purple', 'burgundy', 'forest'],
    features: ['Leadership focus', 'Gradient header', 'Strong hierarchy', 'Professional'],
    bestFor: ['Management', 'Director', 'Team Lead', 'Operations']
  },
];

export const colorSchemes = {
  blue: { primary: '#2563eb', secondary: '#60a5fa' },
  navy: { primary: '#1e3a8a', secondary: '#3b82f6' },
  teal: { primary: '#0d9488', secondary: '#14b8a6' },
  gray: { primary: '#4b5563', secondary: '#9ca3af' },
  purple: { primary: '#7c3aed', secondary: '#a78bfa' },
  orange: { primary: '#ea580c', secondary: '#fb923c' },
  pink: { primary: '#db2777', secondary: '#f472b6' },
  cyan: { primary: '#0891b2', secondary: '#22d3ee' },
  black: { primary: '#000000', secondary: '#404040' },
  green: { primary: '#059669', secondary: '#10b981' },
  burgundy: { primary: '#881337', secondary: '#be123c' },
  forest: { primary: '#14532d', secondary: '#166534' },
  charcoal: { primary: '#18181b', secondary: '#3f3f46' },
  indigo: { primary: '#4f46e5', secondary: '#818cf8' },
  violet: { primary: '#7c2d12', secondary: '#a855f7' },
  brown: { primary: '#78350f', secondary: '#92400e' },
};

export const fontFamilies = [
  { id: 'inter', name: 'Inter', class: 'font-sans' },
  { id: 'roboto', name: 'Roboto', class: 'font-sans' },
  { id: 'lato', name: 'Lato', class: 'font-sans' },
  { id: 'opensans', name: 'Open Sans', class: 'font-sans' },
  { id: 'merriweather', name: 'Merriweather', class: 'font-serif' },
];
