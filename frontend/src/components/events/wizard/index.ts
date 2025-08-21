// Composant principal du wizard
export { default as EventWizard } from './EventWizard';

// Types
export type { EventFormData } from './EventWizard';

// Composants de navigation
export { default as WizardStep } from './WizardStep';
export { default as WizardProgress } from './WizardProgress';
export { default as WizardNavigation } from './WizardNavigation';

// Étapes du wizard
export { default as Step1BasicInfo } from './steps/Step1BasicInfo';
export { default as Step2DateTime } from './steps/Step2DateTime';
export { default as Step3Location } from './steps/Step3Location';
export { default as Step4Pricing } from './steps/Step4Pricing';
export { default as Step5Enrichment } from './steps/Step5Enrichment';
export { default as Step6Validation } from './steps/Step6Validation';