import { BlockData } from '../types';

export const generateVCard = (contact: BlockData['contactInfo']): string => {
  if (!contact) return '';

  const {
    firstName = '',
    lastName = '',
    phone = '',
    email = '',
    company = '',
    jobTitle = '',
    website = '',
  } = contact;
  const fullName = `${firstName} ${lastName}`.trim();

  const lines = ['BEGIN:VCARD', 'VERSION:3.0', `N:${lastName};${firstName};;;`, `FN:${fullName}`];

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
  const isAndroid = /Android/i.test(navigator.userAgent);

  if (isAndroid) {
    // Android is very strict about data URIs, so we use a standard Blob URL
    // which reliably triggers the Android Download Manager
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const name = `${contact.firstName || 'contact'}_${contact.lastName || ''}`.trim();
    link.download = `${name || 'contact'}.vcf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } else {
    // For iOS and others, assigning to window.location directly triggers the native Contacts sheet
    // without popping up a file download prompt in most browsers.
    const dataUri = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;
    window.location.href = dataUri;
  }
};
