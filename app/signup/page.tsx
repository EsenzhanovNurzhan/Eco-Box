'use client';

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { LanguageSwitcher, useLocale } from "../i18n";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

const allowedStudentDomains = ["aogu.edu.kz"];
const demoVerificationCode = "246810";
const faculties = [
  "Нефтегазовый факультет",
  "Индустриально-технологический факультет",
  "Факультет информационных технологий",
  "Институт нефтехимической инженерии и экологии",
];

type SignupStage = "details" | "verify" | "complete";

export default function SignupPage() {
  const { t } = useLocale();
  const [stage, setStage] = useState<SignupStage>("details");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    faculty: "",
    course: "",
    password: "",
  });
  const [normalizedEmail, setNormalizedEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function submitDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const domain = email.split("@").at(-1) ?? "";

    if (!allowedStudentDomains.includes(domain)) {
      setError(t("signupDomainError"));
      return;
    }

    setNormalizedEmail(email);
    setStage("verify");
    setError("");
  }

  function submitVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (verificationCode !== demoVerificationCode) {
      setError(t("wrongCode"));
      return;
    }

    setForm((current) => ({ ...current, password: "" }));
    setStage("complete");
    setError("");
  }

  function editEmail() {
    setVerificationCode("");
    setError("");
    setStage("details");
  }

  return (
    <main className="signup-shell">
      <header className="signup-header">
        <Link className="signup-brand" href="/" aria-label="Вернуться в EcoBox">
          <Image src="/ecobox-logo.jpg" alt="" width={768} height={768} className="ecobox-logo" />
        </Link>
        <div className="signup-header-actions"><LanguageSwitcher /><Link className="signup-back" href="/"><ArrowLeft size={15} />{t("backToShowcase")}</Link></div>
      </header>

      <div className="signup-layout">
        <section className="signup-story">
          <span className="eyebrow"><span className="eyebrow-dot" />{t("signupEyebrow")}</span>
          <h1>{t("signupHeadlineA")}<br /><em>{t("signupHeadlineB")}</em></h1>
          <p>{t("signupBody")}</p>
          <div className="signup-points">
            <span><Check size={15} />{t("signupBenefitEmail")}</span>
            <span><Check size={15} />{t("signupBenefitBooking")}</span>
            <span><Check size={15} />{t("signupBenefitKarma")}</span>
          </div>
          <div className="signup-campus-mark">
            <span className="signup-campus-icon"><BadgeCheck size={20} /></span>
            <span><small>{t("universityLabel")}</small><strong>{t("universityName")}</strong></span>
          </div>
        </section>

        <section className="signup-panel" aria-labelledby="signup-title">
          <div className="signup-panel-heading">
            <div>
              <span className="eyebrow">{stage === "details" ? t("signupStepOne") : stage === "verify" ? t("signupStepTwo") : t("signupDone")}</span>
              <h2 id="signup-title">{stage === "details" ? t("signupTitle") : stage === "verify" ? t("signupVerifyTitle") : t("signupWelcome")}</h2>
            </div>
            {stage !== "complete" && <span className="signup-step-indicator">0{stage === "details" ? 1 : 2}<i />02</span>}
          </div>

          {stage === "details" && (
            <form className="signup-form" onSubmit={submitDetails}>
              <div className="signup-name-fields">
                <label>{t("firstName")}<input autoComplete="given-name" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} required maxLength={80} placeholder={t("placeholderFirst")} /></label>
                <label>{t("lastName")}<input autoComplete="family-name" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} required maxLength={80} placeholder={t("placeholderLast")} /></label>
              </div>

              <label className="signup-full-field">{t("studentEmail")}
                <span className="signup-input-wrap"><Mail size={17} /><input type="email" autoComplete="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} required maxLength={254} placeholder={t("placeholderEmail")} /></span>
              </label>

              <div className="signup-name-fields">
                <label>{t("faculty")}<select value={form.faculty} onChange={(event) => updateField("faculty", event.target.value)} required><option value="" disabled>{t("chooseFaculty")}</option>{faculties.map((faculty, index) => <option value={faculty} key={faculty}>{t(["facultyOil", "facultyTech", "facultyIT", "facultyNadirov"][index] as "facultyOil" | "facultyTech" | "facultyIT" | "facultyNadirov")}</option>)}</select></label>
                <label>{t("course")}<input type="number" inputMode="numeric" min={1} max={8} value={form.course} onChange={(event) => updateField("course", event.target.value)} required placeholder={t("courseRange")} /></label>
              </div>

              <label className="signup-full-field">{t("password")}
                <span className="signup-input-wrap"><LockKeyhole size={17} /><input type={passwordVisible ? "text" : "password"} autoComplete="new-password" minLength={12} maxLength={128} value={form.password} onChange={(event) => updateField("password", event.target.value)} required placeholder={t("passwordLength")} /><button className="password-visibility" type="button" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? t("hidePassword") : t("showPassword")}>{passwordVisible ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
              </label>

              {error && <p className="signup-error" role="alert">{error}</p>}
              <p className="signup-demo-note">{t("signupDemoMode")}</p>
              <button className="primary-button signup-submit" type="submit">{t("continue")} <ArrowRight size={16} /></button>
            </form>
          )}

          {stage === "verify" && (
            <form className="signup-form verification-form" onSubmit={submitVerification}>
              <span className="verification-icon"><Mail size={22} /></span>
              <p className="verification-copy">{t("verificationCopy").replace("{email}", normalizedEmail)}</p>
              <label className="signup-full-field">{t("verificationCode")}<input className="verification-code-input" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={verificationCode} onChange={(event) => { setVerificationCode(event.target.value.replace(/\D/g, "")); setError(""); }} required placeholder={t("sixDigits")} /></label>
              <p className="signup-demo-note">{t("demoCode")} <strong>{demoVerificationCode}</strong></p>
              {error && <p className="signup-error" role="alert">{error}</p>}
              <button className="primary-button signup-submit" type="submit">{t("confirmEmail")} <ArrowRight size={16} /></button>
              <button className="signup-edit-email" type="button" onClick={editEmail}>{t("editDetails")}</button>
            </form>
          )}

          {stage === "complete" && (
            <div className="signup-complete">
              <span className="signup-complete-icon"><Check size={25} /></span>
              <p><strong>{t("profileReady").replace("{name}", form.firstName)}</strong> {t("accountNotSaved")}</p>
              <Link className="primary-button signup-submit" href="/">{t("returnToEcoBox")} <ArrowRight size={16} /></Link>
            </div>
          )}
        </section>
      </div>
      <footer className="signup-footer"><UserRound size={14} />{t("signupFooter")}</footer>
    </main>
  );
}