import { BlockData } from '../types';

export const generateVCard = (contact: BlockData['contactInfo']): string => {
  if (!contact) return '';

  const { firstName = '', lastName = '', phone = '', email = '', company = '', jobTitle = '', website = '' } = contact;
  const fullName = `${firstName} ${lastName}`.trim();

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${fullName}`,
  ];

  if (company) lines.push(`ORG:${company}`);
  if (jobTitle) lines.push(`TITLE:${jobTitle}`);
  if (phone) lines.push(`TEL;TYPE=CELL,VOICE:${phone}`);
  if (email) lines.push(`EMAIL;TYPE=WORK,INTERNET:${email}`);
  if (website) lines.push(`URL:${website}`);

  lines.push('END:VCARD');
  
  return lines.join('\n');
};

export const downloadVCard = (contact: BlockData['contactInfo']) => {
  if (!contact) return;
  const vcard = generateVCard(contact);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  
  const name = `${contact.firstName || 'contact'}_${contact.lastName || ''}`.trim();
  link.download = `${name || 'contact'}.vcf`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
