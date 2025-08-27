import { usePathname, useRouter } from "next/navigation";
import Login from "../SignUp/Login";
import SignUp from "../SignUp/SignUp";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useTheme } from "../../ThemeContext";

const SignUpPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-[100vh] ${isDarkMode ? 'bg-secondary text-black' : 'bg-secondary text-black'} flex items-center justify-center p-2 overflow-hidden`}>
      {/* <Button
        leftSection={<IconArrowLeft size={20} />}
  onClick={() => router.push("/")}
        my="md"
        color="blue.4"
        variant="light"
      >
        Home
      </Button> */}


  {pathname === '/signup' ? (
          <SignUp />
        ) : (
          <Login />
        )}
      </div>
  );
};

export default SignUpPage;

