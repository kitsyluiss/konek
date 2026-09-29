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

  // Use a data URI to force native OS handling
  const dataUri = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;
  const link = document.createElement('a');
  link.href = dataUri;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  // Android requires the download attribute to properly trigger the file download
  // manager, which then prompts the user to open it in Contacts.
  // iOS Safari works best WITHOUT the download attribute, opening the contact sheet natively.
  const isAndroid = /Android/i.test(navigator.userAgent);
  if (isAndroid) {
    const name = `${contact.firstName || 'contact'}_${contact.lastName || ''}`.trim();
    link.download = `${name || 'contact'}.vcf`;
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
