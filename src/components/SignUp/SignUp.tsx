import {
  Group,
  LoadingOverlay,
  rem,
  Divider,
} from "@mantine/core";
import { IconAt, IconCheck, IconLock, IconUser, IconEye, IconEyeOff, IconMoonStars, IconSun } from "@tabler/icons-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser, sendVerificationEmail } from "../../Services/UserService";
import { SignUpValidation } from "../../Services/FormValidation";
import { notifications } from "@mantine/notifications";
import { errorNotification } from "../../Services/NotificationService";
import { GoogleButton } from "./GoogleButton";
import { oauthLogin } from "../../Services/AuthService";
import { useTheme } from "@/ThemeContext";
import { GithubButton } from "./GithubButton";

const initialFormState: Record<string, string> = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  accountType: "APPLICANT",
};

const SignUp = () => {
  const [formData, setFormData] = useState<Record<string, string>>(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (event: any) => {
    if (typeof event === "string") {
      setFormData({ ...formData, accountType: event });
      return;
    }

    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    const error = SignUpValidation(name, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
      confirmPassword:
        name === "password" && formData.confirmPassword && formData.confirmPassword !== value
          ? "Passwords do not match"
          : name === "confirmPassword" && formData.password && formData.password !== value
          ? "Passwords do not match"
          : "",
    }));
  };

  const handleSubmit = async () => {
    const newFormErrors: Record<string, string> = {};
    let isValid = true;

    for (const key in formData) {
      if (key === "accountType") continue;

      if (key === "confirmPassword") {
        if (formData[key] !== formData.password) {
          newFormErrors[key] = "Passwords do not match";
          isValid = false;
        }
      } else {
        const error = SignUpValidation(key, formData[key]);
        if (error) {
          newFormErrors[key] = error;
          isValid = false;
        }
      }
    }

    setFormErrors(newFormErrors);

    if (!termsAccepted) {
      errorNotification("You must accept the terms and conditions to register.", "Error");
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      try {
        const response = await registerUser(formData);
        // Send verification email
        await sendVerificationEmail(formData.email);

        notifications.show({
          title: "Registration successful",
          message: "A verification email has been sent. Please verify your email before logging in.",
          icon: <IconCheck style={{ width: "90%", height: "90%" }} />,
          color: "green",
          withBorder: true,
          className: "!border-green-500",
        });

        setTimeout(() => {
          setLoading(false);
          router.push("/verify-email"); // Redirect to verification page
        }, 3000);
      } catch (error: any) {
        setLoading(false);
        if (error.response?.data?.errorMessage) {
          errorNotification(error.response.data.errorMessage, "Error");
        } else {
          errorNotification("An unexpected error occurred.", "Error");
        }
      }
    }
  };

  return (
    <>
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <div className="min-h-screen w-full py-20 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-secondary dark:bg-[var(--color-third)] transition-colors">
        <div className={`w-full max-w-xl p-8 rounded-2xl shadow-xl border transition-all ${isDarkMode ? "bg-[var(--color-third)]/70 border-white/10 text-white" : "bg-white border-black/5 text-black"}`}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Create Account</h1>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-white/70' : 'text-lightBlack'}`}>Join CareerCrush to find jobs, hackathons and more.</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`inline-flex items-center justify-center h-9 w-14 sm:w-9 rounded-full border transition-colors ${
                isDarkMode ? 'border-white/15 bg-white/5 hover:bg-white/10' : 'border-black/10 bg-white hover:bg-black/5'
              }`}
            >
              {isDarkMode ? <IconSun size={18} className="text-primary" /> : <IconMoonStars size={18} className="text-primary" />}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Full Name */}
            <div>
              <label className={`mb-1 block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>Full Name</label>
              <div className="relative">
                <IconUser style={{ width: rem(16), height: rem(16) }} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/70' : 'text-black/60'}`} />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={`w-full rounded-lg pl-10 pr-3 py-2 border text-sm outline-none transition-colors ${isDarkMode ? 'bg-white/5 text-white placeholder-white/60 border-white/10 focus:border-primary' : 'bg-white text-black placeholder-black/50 border-black/10 focus:border-primary'}`}
                />
              </div>
              {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={`mb-1 block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>Email</label>
              <div className="relative">
                <IconAt style={{ width: rem(16), height: rem(16) }} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/70' : 'text-black/60'}`} />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Your email"
                  className={`w-full rounded-lg pl-10 pr-3 py-2 border text-sm outline-none transition-colors ${isDarkMode ? 'bg-white/5 text-white placeholder-white/60 border-white/10 focus:border-primary' : 'bg-white text-black placeholder-black/50 border-black/10 focus:border-primary'}`}
                />
              </div>
              {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className={`mb-1 block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>Password</label>
              <div className="relative">
                <IconLock style={{ width: rem(18), height: rem(18) }} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/70' : 'text-black/60'}`} />
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={`w-full rounded-lg pl-10 pr-10 py-2 text-sm border outline-none transition-colors ${isDarkMode ? 'bg-white/5 text-white placeholder-white/60 border-white/10 focus:border-primary' : 'bg-white text-black placeholder-black/50 border-black/10 focus:border-primary'}`}
                />
                <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(p => !p)} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md ${isDarkMode ? 'text-white/70 hover:text-white' : 'text-black/60 hover:text-black'}`}>
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
              {formErrors.password && <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`mb-1 block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>Confirm Password</label>
              <div className="relative">
                <IconLock style={{ width: rem(18), height: rem(18) }} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/70' : 'text-black/60'}`} />
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm password"
                  className={`w-full rounded-lg pl-10 pr-10 py-2 text-sm border outline-none transition-colors ${isDarkMode ? 'bg-white/5 text-white placeholder-white/60 border-white/10 focus:border-primary' : 'bg-white text-black placeholder-black/50 border-black/10 focus:border-primary'}`}
                />
                <button type="button" aria-label={showConfirm ? 'Hide password' : 'Show password'} onClick={() => setShowConfirm(p => !p)} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md ${isDarkMode ? 'text-white/70 hover:text-white' : 'text-black/60 hover:text-black'}`}>
                  {showConfirm ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
              {formErrors.confirmPassword && <p className="mt-1 text-xs text-red-500">{formErrors.confirmPassword}</p>}
            </div>

            {/* Account Type */}
            <div>
              <label className={`mb-1 block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>You are?</label>
              <div className="flex items-center gap-6 sm-mx:flex-col sm-mx:items-start sm-mx:gap-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="accountType"
                    value="APPLICANT"
                    checked={formData.accountType === 'APPLICANT'}
                    onChange={handleChange}
                    className="accent-[var(--color-primary)]"
                  />
                  <span className={isDarkMode ? 'text-white' : 'text-black'}>Applicant</span>
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="accountType"
                    value="COMPANY"
                    checked={formData.accountType === 'COMPANY'}
                    onChange={handleChange}
                    className="accent-[var(--color-primary)]"
                  />
                  <span className={isDarkMode ? 'text-white' : 'text-black'}>Company</span>
                </label>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.currentTarget.checked)}
                className="accent-[var(--color-primary)]"
              />
              <span className={isDarkMode ? 'text-white' : 'text-black'}>
                I accept <a href="/terms-of-service" className="text-primary underline hover:opacity-80" target="_blank" rel="noopener noreferrer">terms &amp; conditions</a>
              </span>
            </label>


            <button onClick={handleSubmit} disabled={loading} className="!bg-primary text-sm px-4 py-2 rounded-md !text-white hover:!opacity-90">
              {loading ? 'Signing up...' : 'Sign up'}
            </button>

            <Divider label="Or continue with" labelPosition="center" my="lg" className={isDarkMode ? '!opacity-70' : ''} />

            <Group grow mb="xl">
              <GoogleButton radius="xl" size="sm" onClick={() => oauthLogin('google')} className={`${isDarkMode ? '!bg-white/5 !text-white !border !border-white/10 hover:!bg-white/10' : '!bg-white !text-black !border !border-black/10 hover:!bg-black/5'}`}>
                Google
              </GoogleButton>
              <GithubButton radius="xl" size="sm" onClick={() => oauthLogin('github')} className={`${isDarkMode ? '!bg-white/5 !text-white !border !border-white/10 hover:!bg-white/10' : '!bg-white !text-black !border !border-black/10 hover:!bg-black/5'}`}>
                Github
              </GithubButton>
            </Group>

            <div className="text-center text-sm">
              Have an account? <Link href="/login" className="text-primary hover:opacity-80">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
