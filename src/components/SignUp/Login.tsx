import {Button,PasswordInput,rem,TextInput,Group,Divider,LoadingOverlay} from "@mantine/core";
import { IconAt, IconLock, IconCheck, IconX, IconMoonStars, IconSun, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { GoogleButton } from "./GoogleButton";
import { useDisclosure } from "@mantine/hooks";
import ResetPassword from "./ResetPassword";
import { useDispatch } from "react-redux";
import { setUser } from "../../Slices/UserSlices";
import { setJwt } from "../../Slices/JwtSlice";
import { loginUser, oauthLogin } from "../../Services/AuthService";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "@/ThemeContext";
import { GithubButton } from "./GithubButton";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value: string) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
    },    
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const response = await loginUser(values);

      notifications.show({
        title: "Login successful:",
        message: "Redirecting to dashboard...",
        icon: <IconCheck style={{ width: "90%", height: "90%" }} />,
        color: "green",
        withBorder: true,
        className: "!border-green-500",
      });

      dispatch(setJwt(response.jwt));
      const decoded=jwtDecode(response.jwt);
      dispatch(setUser({...decoded,email:decoded.sub}));

      setTimeout(() => {
        router.push("/");
      }, 2000); 
    } catch (error:any) {
      notifications.show({
        title: "Login failed:",
        message: error.response.data.errorMessage,
        icon: <IconX style={{ width: "90%", height: "90%" }} />,
        color: "red",
        withBorder: true,
        className: "!border-red-500",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    
        <><LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-secondary dark:bg-[var(--color-third)] transition-colors">
        <div
          className={`w-full max-w-md p-8 rounded-2xl shadow-xl border transition-all ${
            isDarkMode ? "bg-[var(--color-third)]/70 border-white/10 text-white" : "bg-white border-black/5 text-black"
          }`}
        >
        <div className="flex items-center justify-between mb-6">
          <div className="text-2xl font-semibold tracking-tight">Login</div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`inline-flex items-center justify-center h-9 w-9 rounded-full border transition-colors ${
              isDarkMode ? "border-white/15 bg-white/5 hover:bg-white/10" : "border-black/10 bg-white hover:bg-black/5"
            }`}
          >
            {isDarkMode ? <IconSun size={18} className="text-primary" /> : <IconMoonStars size={18} className="text-primary" />}
          </button>
        </div>
        <p className={`mb-6 text-sm ${isDarkMode ? "text-white/70" : "text-lightBlack"}`}>
          Welcome back! Please sign in to continue.
        </p>

        <Group grow mb="xl">
          <GoogleButton radius="xl" size="sm" onClick={() => oauthLogin("google")} className={`${isDarkMode ? "!bg-white/5 !text-white !border !border-white/10 hover:!bg-white/10" : "!bg-white !text-black !border !border-black/10 hover:!bg-black/5"}`}>
            Google
          </GoogleButton>
          <GithubButton radius="xl" size="sm" onClick={() => oauthLogin("github")} className={`${isDarkMode ? "!bg-white/5 !text-white !border !border-white/10 hover:!bg-white/10" : "!bg-white !text-black !border !border-black/10 hover:!bg-black/5"}`}>
            Github
          </GithubButton>
        </Group>

        <Divider label="Or login with email" labelPosition="center" mb="lg" className={isDarkMode ? "opacity-70" : ""} />
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className={`mb-1 block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>Email</label>
              <div className="relative">
                <IconAt style={{ width: rem(16), height: rem(16) }} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/70' : 'text-black/60'}`} />
                <input
                  type="email"
                  placeholder="Your email"
                  className={`w-full rounded-lg pl-10 text-sm pr-3 py-2 border outline-none transition-colors ${
                    isDarkMode
                      ? 'bg-white/5 text-white placeholder-white/60 border-white/10 focus:border-primary'
                      : 'bg-white text-black placeholder-black/50 border-black/10 focus:border-primary'
                  }`}
                  {...form.getInputProps('email')}
                />
              </div>
              {form.errors.email && (
                <p className="mt-1 text-xs text-red-500">{String(form.errors.email)}</p>
              )}
            </div>

            <div>
              <label className={`mb-1 block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>Password</label>
              <div className="relative">
                <IconLock style={{ width: rem(18), height: rem(18) }} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/70' : 'text-black/60'}`} />

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={`w-full rounded-lg pl-10 text-sm pr-10 py-2 border outline-none transition-colors ${

                    isDarkMode
                      ? 'bg-white/5 text-white placeholder-white/60 border-white/10 focus:border-primary'
                      : 'bg-white text-black placeholder-black/50 border-black/10 focus:border-primary'
                  }`}
                  {...form.getInputProps('password')}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((p) => !p)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md ${isDarkMode ? 'text-white/70 hover:text-white' : 'text-black/60 hover:text-black'}`}
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
              {form.errors.password && (
                <p className="mt-1 text-xs text-red-500">{String(form.errors.password)}</p>
              )}
            </div>
          </div>

          <Group justify="space-between" mt="md">
            <div onClick={open} className="text-primary text-sm hover:opacity-80 cursor-pointer">Forgot password?</div>
            <ResetPassword opened={opened} close={close} />
            <button type="submit"  className="!bg-primary text-sm px-4 py-2 rounded-md !text-white hover:!opacity-90">
              Login
            </button>
          </Group>
        </form>

        <div className="text-center mt-6 text-sm">
          <span>Don&apos;t have an account? </span>
          <Link href="/signup" className="text-primary hover:opacity-80">
            Sign Up
          </Link>
        </div>
      </div>
    </div></>
  );
};

export default Login;
