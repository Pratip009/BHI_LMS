import { useActivationMutation } from '@/redux/features/auth/authApi';
import { styles } from '../../styles/style';
import React, { FC, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { useSelector } from 'react-redux';

type Props = {
    setRoute: (route: string) => void;
};

type VerifyNumber = {
    "0": string;
    "1": string;
    "2": string;
    "3": string;
};

const Verification: FC<Props> = ({ setRoute }) => {
    // ✅ Fix: Correctly accessing token from Redux store
    const token = useSelector((state: any) => state.auth.token);
    console.log("Token from Redux:", token);

    const [activation, { isSuccess, error }] = useActivationMutation();
    const [invalidError, setInvalidError] = useState<boolean>(false);

    useEffect(() => {
        if (isSuccess) {
            toast.success('Account activated successfully');
            setRoute('Login');
        }
        if (error) {
            console.log('Error:', error);
            if ('data' in error) {
                const errorData = error as any;
                toast.error(errorData.data.message);
                setInvalidError(true);
            } else {
                console.log('An error occurred:', error);
            }
        }
    }, [isSuccess, error]);

    // Refs for input fields
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
        0: "",
        1: "",
        2: "",
        3: "",
    });

    const verificationHandler = async () => {
        const verificationNumber = Object.values(verifyNumber).join('');

        if (verificationNumber.length !== 4) {
            setInvalidError(true);
            return;
        }

        if (!token) {
            console.error("Error: Activation token is missing!");
            toast.error("Activation token is missing!");
            return;
        }

        console.log("Activation Request:", { activation_token: token, activation_code: verificationNumber });

        await activation({
            activation_token: token.toString(),
            activation_code: verificationNumber
        });
    };

    const handleInputChange = (index: number, value: string) => {
        setInvalidError(false);

        if (!/^\d?$/.test(value)) return; // ✅ Fix: Ensure only one digit is allowed

        const newVerifyNumber = { ...verifyNumber, [index]: value };
        setVerifyNumber(newVerifyNumber);

        if (value.length === 1 && index < inputRefs.length - 1) {
            inputRefs[index + 1].current?.focus();
        } else if (value === '' && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    return (
        <div>
            <h1 className={`${styles.title}`}>
                Verify Your Account
            </h1>
            <br />
            <div className="w-full flex items-center justify-center mt-2">
                <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
                    <VscWorkspaceTrusted size={40} />
                </div>
            </div>
            <br />
            <br />
            <div className="m-auto flex items-center justify-around">
                {Object.keys(verifyNumber).map((key, index) => (
                    <input
                        type='text' // ✅ Fix: Change to 'text' to enforce max length manually
                        key={key}
                        ref={inputRefs[index]}
                        className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[18px] 
                            flex items-center justify-center text-center 
                            text-[18px] font-Poppins text-black dark:text-white 
                            outline-none 
                            ${invalidError ? "shake border-red-500" : "dark:border-white border-[#0000004a]"}`}

                        maxLength={1} // ✅ Fix: Apply manually in handleInputChange
                        value={verifyNumber[key as keyof VerifyNumber]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                ))}
            </div>
            <br />
            <br />
            <div className="w-full flex justify-center">
                <button
                    className={`${styles.button}`}
                    onClick={verificationHandler}
                >
                    Verify OTP
                </button>
            </div>
            <br />
            <h5 className='text-center p-4 font-Poppins text-[14px] text-black dark:text-white'>
                Go back to sign in?
                <span
                    className='text-[#2190ff] pl-1 cursor-pointer'
                    onClick={() => setRoute("Login")}
                >
                    Sign in
                </span>
            </h5>
        </div>
    );
};

export default Verification;
