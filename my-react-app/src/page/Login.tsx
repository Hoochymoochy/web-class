import BlurText from "./../Components/BlurText";


function Login() {
    return (
        <div className="flex justify-center items-center">
            <BlurText
            text="Login"
            delay={200}
            animateBy="words"
            direction="top"
            className="text-2xl mb-8"
            />
        </div>
    );
}

export default Login