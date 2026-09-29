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

  // Use a data URI to force native OS handling (especially for iOS Safari)
  // which will immediately open the Contacts app instead of the Downloads folder.
  const dataUri = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;

  // By omitting the 'download' attribute and using target='_blank', 
  // mobile devices will typically open the contact card immediately instead of downloading a file.
  const link = document.createElement('a');
  link.href = dataUri;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  // Deliberately omitting link.download so the browser opens it instead of saving it to Files

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
