const fs = require("node:fs");

const indexPath = "index.html";
let content = fs.readFileSync(indexPath, "utf8");

function replaceOnce(before, after, label) {
  if (content.includes(after)) {
    return;
  }

  if (!content.includes(before)) {
    throw new Error(`Could not find expected ${label} block in index.html`);
  }

  content = content.replace(before, after);
}

replaceOnce(
  `<div class="grid-2" style="gap: 20px;"><div class="form-group"><label for="nom" data-i18n="form.nameLabel">Nom Complet *</label><input id="nom" name="nom" type="text" placeholder="Jean Dupont" data-i18n-placeholder="form.namePlaceholder" autocomplete="name" required></div><div class="form-group"><label for="entreprise" data-i18n="form.companyLabel">Entreprise</label><input id="entreprise" name="entreprise" type="text" placeholder="Nom de votre PME" data-i18n-placeholder="form.companyPlaceholder" autocomplete="organization"></div></div>
            <div class="form-group"><label for="email" data-i18n="form.emailLabel">Courriel Professionnel *</label><input id="email" name="email" type="email" placeholder="nom@entreprise.ca" data-i18n-placeholder="form.emailPlaceholder" autocomplete="email" required></div>`,
  `<div class="grid-2" style="gap: 20px;"><div class="form-group"><label for="prenom" data-i18n="form.firstNameLabel">Prénom *</label><input id="prenom" name="prenom" type="text" placeholder="Jean" data-i18n-placeholder="form.firstNamePlaceholder" autocomplete="given-name" required></div><div class="form-group"><label for="nom" data-i18n="form.lastNameLabel">Nom *</label><input id="nom" name="nom" type="text" placeholder="Dupont" data-i18n-placeholder="form.lastNamePlaceholder" autocomplete="family-name" required></div></div>
            <div class="grid-2" style="gap: 20px;"><div class="form-group"><label for="entreprise" data-i18n="form.companyLabel">Entreprise</label><input id="entreprise" name="entreprise" type="text" placeholder="Nom de votre PME" data-i18n-placeholder="form.companyPlaceholder" autocomplete="organization"></div><div class="form-group"><label for="telephone" data-i18n="form.phoneLabel">Téléphone</label><input id="telephone" name="telephone" type="tel" placeholder="450-712-1562" data-i18n-placeholder="form.phonePlaceholder" autocomplete="tel"></div></div>
            <div class="form-group"><label for="email" data-i18n="form.emailLabel">Courriel Professionnel *</label><input id="email" name="email" type="email" placeholder="nom@entreprise.ca" data-i18n-placeholder="form.emailPlaceholder" autocomplete="email" required></div>`,
  "contact form fields"
);

const replacements = [
  [`"form.nameLabel": "Nom Complet *",
        "form.namePlaceholder": "Jean Dupont",`, `"form.firstNameLabel": "Prénom *",
        "form.firstNamePlaceholder": "Jean",
        "form.lastNameLabel": "Nom *",
        "form.lastNamePlaceholder": "Dupont",`],
  [`"form.companyPlaceholder": "Nom de votre PME",
        "form.emailLabel": "Courriel Professionnel *",`, `"form.companyPlaceholder": "Nom de votre PME",
        "form.phoneLabel": "Téléphone",
        "form.phonePlaceholder": "450-712-1562",
        "form.emailLabel": "Courriel Professionnel *",`],
  [`"privacy.collectText": "Lorsque vous utilisez le formulaire, nous pouvons collecter votre nom, le nom de votre entreprise, votre adresse courriel, votre message et votre consentement à cette politique. Des renseignements techniques nécessaires au fonctionnement du site peuvent aussi être traités par nos fournisseurs, par exemple l'adresse IP, le navigateur utilisé et les pages consultées.",`, `"privacy.collectText": "Lorsque vous utilisez le formulaire, nous pouvons collecter votre prénom, votre nom, le nom de votre entreprise, votre numéro de téléphone, votre adresse courriel, votre message et votre consentement à cette politique. Des renseignements techniques nécessaires au fonctionnement du site peuvent aussi être traités par nos fournisseurs, par exemple l'adresse IP, le navigateur utilisé et les pages consultées.",`],
  [`"form.nameLabel": "Full Name *",
        "form.namePlaceholder": "John Smith",`, `"form.firstNameLabel": "First Name *",
        "form.firstNamePlaceholder": "John",
        "form.lastNameLabel": "Last Name *",
        "form.lastNamePlaceholder": "Smith",`],
  [`"form.companyPlaceholder": "Your SME name",
        "form.emailLabel": "Professional Email *",`, `"form.companyPlaceholder": "Your SME name",
        "form.phoneLabel": "Phone",
        "form.phonePlaceholder": "450-712-1562",
        "form.emailLabel": "Professional Email *",`],
  [`"privacy.collectText": "When you use the form, we may collect your name, company name, email address, message and consent to this policy. Technical information necessary for the site to operate may also be processed by our providers, such as IP address, browser used and pages visited.",`, `"privacy.collectText": "When you use the form, we may collect your first name, last name, company name, phone number, email address, message and consent to this policy. Technical information necessary for the site to operate may also be processed by our providers, such as IP address, browser used and pages visited.",`],
];

for (const [before, after] of replacements) {
  replaceOnce(before, after, before.slice(0, 40));
}

fs.writeFileSync(indexPath, content);
