import SignUpForm from "../../components/auth-comps/SignupForm";
import ImageSlider from "../../components/auth-comps/ImageSlider";

export default function Signup() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left: Form */}
      <div className="flex-1">
        <SignUpForm />
      </div>

      {/* Right: Image Slider */}
      <div className="hidden md:flex flex-1 bg-blue-100">
        <ImageSlider />
      </div>
    </div>
  );
}
