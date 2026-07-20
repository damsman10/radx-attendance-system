import LoginForm from "../../components/auth-comps/LoginForm";
import ImageSlider from "../../components/auth-comps/ImageSlider";

export default function Login() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left: Form */}
      <div className="flex-1">
        <LoginForm />
      </div>

      {/* Right: Image Slider */}
      <div className="hidden md:block md:w-1/2 relative">
        <ImageSlider />
      </div>
    </div>
  );
}
