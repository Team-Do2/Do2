import "./LoginPage.css";
import { useAuthStore } from "../../stores/authStore";

function LoginPage() {
  const logIn = useAuthStore((state) => state.logIn);
  return (
    <>
      <p>Login Page Works!</p>
      <button onClick={logIn}>Log In</button>
    </>
  );
}

export default LoginPage;
