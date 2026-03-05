import BlurText from "./../Components/BlurText";

function Register() {
    return (
        <div className="flex justify-center items-center flex-col font-serif min-h-screen">
            <BlurText
                text="Sign up for an account"
                delay={200}
                animateBy="words"
                direction="top"
                className="text-2xl mb-8"
            />

            <div className="flex flex-col space-y-4 p-4 w-full max-w-md bg-white/10 rounded-sm border-white/20 border">
                <label className="text-xl">Email</label>    
                <input type="email" className="bg-white/10 border-black/10 border-2 p-2" />
                <label>Password</label>
                <input type="password" className="bg-white/10 border-black/10 border-2 p-2" />
                <label>Repeat Password</label>
                <input type="password" className="bg-white/10 border-black/10 border-2 p-2" />
                <button className="bg-black/10 rounded-md p-2">Sign up</button>

                <div className="flex justify-between items-center">
                    <p>Have an account?</p>
                    <a className="flex items-center gap-1 cursor-pointer">
                        Login in
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                    </a>
                </div>
            </div>


        </div>
    );
}

export default Register