export interface ScreenOneTranslations {
  heroTag: string
  heading: string
  subheading: string
  variable: string
  fixed: string
  bestRate: string
  term: string
  lender: string
  family: string
  insurance: string
  selectBtn: string
  loading: string
  error: string
  retry: string
  insured: string
  conventional: string
  valueFlexFamily: string
  standardFamily: string
}

export interface ScreenTwoTranslations {
  stepSelect: string
  stepContact: string
  stepReview: string
  heading: string
  subheading: string
  firstName: string
  lastName: string
  email: string
  phone: string
  saveBtn: string
  saving: string
  savedMsg: string
  errorMsg: string
  product: string
  rate: string
  required: string
  invalidEmail: string
  invalidPhone: string
  invalidName: string
  applicationId: string
}

export interface ScreenThreeTranslations {
  heading: string
  subheading: string
  empty: string
  createdAt: string
  backBtn: string
  updateBtn: string
  updating: string
  updatedMsg: string
  errorMsg: string
  browseRates: string
  applicationId: string
  status: string
  complete: string
  incomplete: string
  productId: string
  applicationType: string
}

export interface Translations {
  appTitle: string
  tagline: string
  nav: { products: string; applications: string }
  screen1: ScreenOneTranslations
  screen2: ScreenTwoTranslations
  screen3: ScreenThreeTranslations
  langToggle: string
}

export const translations: Record<string, Translations> = {
  en: {
    appTitle: 'nesto',
    tagline: "Canada's smartest mortgage platform",
    nav: { products: 'Products', applications: 'My Applications' },
    screen1: {
      heroTag: "Canada's Lowest Rates",
      heading: 'Find Your Best Rate',
      subheading:
        "We've surfaced the lowest rates available — pick the mortgage type that fits your life.",
      variable: 'Variable Rate',
      fixed: 'Fixed Rate',
      bestRate: 'Best Rate',
      term: 'Term',
      lender: 'Lender',
      family: 'Family',
      insurance: 'Insurance',
      selectBtn: 'Select This Rate',
      loading: 'Loading products…',
      error: 'Could not load products. Please try again.',
      retry: 'Retry',
      insured: 'Insured',
      conventional: 'Conventional',
      valueFlexFamily: 'Value Flex',
      standardFamily: 'Standard',
    },
    screen2: {
      stepSelect: 'Select',
      stepContact: 'Contact',
      stepReview: 'Review',
      heading: 'Your Contact Info',
      subheading: 'Almost done! Tell us a little about yourself so we can get started.',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      saveBtn: 'Save & Continue',
      saving: 'Saving…',
      savedMsg: 'Information saved successfully!',
      errorMsg: 'Failed to save. Please try again.',
      product: 'Selected Product',
      rate: 'Rate',
      required: 'This field is required.',
      invalidEmail: 'Please enter a valid email address.',
      invalidPhone: 'Please enter a valid phone number.',
      invalidName: 'Please enter a valid name (letters only, min. 2 characters).',
      applicationId: 'Application ID',
    },
    screen3: {
      heading: 'Your Applications',
      subheading: 'Only complete applications with full contact info are shown below.',
      empty: 'No complete applications yet. Select a product to get started.',
      createdAt: 'Created',
      backBtn: '← Back to Products',
      updateBtn: 'Update Application',
      updating: 'Updating…',
      updatedMsg: 'Application updated successfully!',
      errorMsg: 'Failed to update. Please try again.',
      browseRates: 'Browse Rates',
      applicationId: 'Application ID',
      status: 'Status',
      complete: 'Complete',
      incomplete: 'Incomplete',
      productId: 'Product ID',
      applicationType: 'Type',
    },
    langToggle: 'FR',
  },

  fr: {
    appTitle: 'nesto',
    tagline: 'La plateforme hypothécaire la plus intelligente du Canada',
    nav: { products: 'Produits', applications: 'Mes demandes' },
    screen1: {
      heroTag: 'Les taux les plus bas du Canada',
      heading: 'Trouvez Votre Meilleur Taux',
      subheading:
        'Nous avons trouvé les taux les plus bas — choisissez le type qui vous convient.',
      variable: 'Taux Variable',
      fixed: 'Taux Fixe',
      bestRate: 'Meilleur taux',
      term: 'Terme',
      lender: 'Prêteur',
      family: 'Famille',
      insurance: 'Assurance',
      selectBtn: 'Choisir ce taux',
      loading: 'Chargement des produits…',
      error: 'Impossible de charger les produits. Veuillez réessayer.',
      retry: 'Réessayer',
      insured: 'Assuré',
      conventional: 'Conventionnel',
      valueFlexFamily: 'Valeur Flex',
      standardFamily: 'Standard',
    },
    screen2: {
      stepSelect: 'Choisir',
      stepContact: 'Contact',
      stepReview: 'Réviser',
      heading: 'Vos coordonnées',
      subheading: 'Presque terminé! Dites-nous qui vous êtes pour commencer.',
      firstName: 'Prénom',
      lastName: 'Nom de famille',
      email: 'Adresse courriel',
      phone: 'Numéro de téléphone',
      saveBtn: 'Enregistrer et continuer',
      saving: 'Enregistrement…',
      savedMsg: 'Informations enregistrées avec succès!',
      errorMsg: "Échec de l'enregistrement. Veuillez réessayer.",
      product: 'Produit sélectionné',
      rate: 'Taux',
      required: 'Ce champ est obligatoire.',
      invalidEmail: 'Veuillez entrer un courriel valide.',
      invalidPhone: 'Veuillez entrer un numéro de téléphone valide.',
      invalidName: 'Veuillez entrer un nom valide (lettres uniquement, 2 caractères min.).',
      applicationId: 'ID de demande',
    },
    screen3: {
      heading: 'Vos demandes',
      subheading:
        'Seules les demandes complètes avec toutes les coordonnées sont affichées.',
      empty:
        "Aucune demande complète pour l'instant. Sélectionnez un produit pour commencer.",
      createdAt: 'Créé le',
      backBtn: '← Retour aux produits',
      updateBtn: 'Mettre à jour',
      updating: 'Mise à jour…',
      updatedMsg: 'Demande mise à jour avec succès!',
      errorMsg: 'Échec de la mise à jour. Veuillez réessayer.',
      browseRates: 'Voir les taux',
      applicationId: 'ID de demande',
      status: 'Statut',
      complete: 'Complète',
      incomplete: 'Incomplète',
      productId: 'ID produit',
      applicationType: 'Type',
    },
    langToggle: 'EN',
  },
}
