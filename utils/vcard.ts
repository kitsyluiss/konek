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

export const downloadVCard = async (contact: BlockData['contactInfo']) => {
  if (!contact) return;
  const vcard = generateVCard(contact);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const name = `${contact.firstName || 'contact'}_${contact.lastName || ''}`.trim();
  const filename = `${name || 'contact'}.vcf`;

  if (isAndroid) {
    try {
      const file = new File([vcard], filename, { type: 'text/vcard' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Save Contact',
        });
        return; // Successfully shared, skip download fallback
      }
    } catch (e) {
      console.log('Share API failed, falling back to download', e);
    }

    // Fallback if Web Share API is unavailable
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } else {
    // For iOS and others, assigning to window.location directly triggers the native Contacts sheet
    const dataUri = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;
    window.location.href = dataUri;
  }
};
