export { site } from "./site";
export {
  services,
  serviceProcess,
  getService,
  type Service,
  type CatalogueGroup,
  type CatalogueItem,
  type SpecRow,
  type Faq,
  type ProcessStep,
  type CopySection,
} from "./services";
export {
  packages,
  monthlyPlans,
  alaCarte,
  formatPrice,
  pricingTerms,
  comparisonRows,
  type Package,
  type MonthlyPlan,
  type AddOn,
  type DeliverableGroup,
  type ComparisonRow,
} from "./packages";
export { stats, type Stat } from "./stats";
export { testimonials, type Testimonial } from "./testimonials";
export { industries, type Industry } from "./industries";
export { cities, getCity, type City } from "./cities";

export {
  localServices,
  localPages,
  livePages,
  getLocalService,
  getLocalPage,
  siblingServicesIn,
  sameServiceNearby,
  liveCities,
  validateLocalPages,
  type LocalService,
  type LocalPage,
} from "./local-pages";
