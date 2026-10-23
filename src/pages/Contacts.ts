// Contact Information Constants
const EMAIL = 'eliza.barkhudaryan@gmail.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/eliza-barkhudaryan/';

export async function renderContactsPage(container: HTMLElement): Promise<void> {
  container.innerHTML = '';

  const contactCard = document.createElement('div');
  contactCard.className = 'contact-card';

  const ornamentTop = document.createElement('div');
  ornamentTop.className = 'contact-card__ornament';
  ornamentTop.innerHTML = '❧ ❧ ❧';

  const contactList = document.createElement('dl');
  contactList.className = 'contact-list';

  // Email
  const emailLabel = document.createElement('dt');
  emailLabel.className = 'contact-list__label';
  emailLabel.textContent = 'Electronic Mail';

  const emailValue = document.createElement('dd');
  emailValue.className = 'contact-list__value';
  const emailLink = document.createElement('a');
  emailLink.href = `mailto:${EMAIL}`;
  emailLink.textContent = EMAIL;
  emailValue.appendChild(emailLink);

  // Social
  const socialLabel = document.createElement('dt');
  socialLabel.className = 'contact-list__label';
  socialLabel.textContent = 'Social Networks';

  const socialValue = document.createElement('dd');
  socialValue.className = 'contact-list__value contact-list__value--social';
  socialValue.innerHTML = `
    <a href="${LINKEDIN_URL}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
  `;

  contactList.appendChild(emailLabel);
  contactList.appendChild(emailValue);
  contactList.appendChild(socialLabel);
  contactList.appendChild(socialValue);

  const ornamentBottom = document.createElement('div');
  ornamentBottom.className = 'contact-card__ornament';
  ornamentBottom.innerHTML = '❧ ❧ ❧';

  contactCard.appendChild(ornamentTop);
  contactCard.appendChild(contactList);
  contactCard.appendChild(ornamentBottom);

  container.appendChild(contactCard);
}

