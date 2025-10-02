import "./SettingsPage.css";
import { useAuthStore } from "../../stores/authStore";

function SettingsPage() {
  const logOut = useAuthStore((state) => state.logOut);

  return (
    <>
      <p>Settings Page Works!</p>
      <button onClick={logOut}>Log Out</button>
    </>
  );
}

export default SettingsPage;
