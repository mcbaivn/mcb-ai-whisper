import type { JSX } from "react";
import AuthenticationStep from "./AuthenticationStep";
import type { OnboardingAuthDraft } from "./onboarding/flow";
interface Props{ onContinueWithoutAccount?:()=>void; onAuthComplete:()=>void; autoContinue?:boolean; onSignOut?:()=>void; resumeState?:OnboardingAuthDraft; onResumeStateChange?:(s:Partial<OnboardingAuthDraft>)=>void; }
export function CompactAuthenticationFlow(props: Props): JSX.Element {
  return <AuthenticationStep {...props} onNeedsVerification={() => props.onAuthComplete()} />;
}
