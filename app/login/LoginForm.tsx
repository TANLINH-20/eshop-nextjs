"use client";

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SafeUser } from "@/types";
import { signIn } from "next-auth/react";

interface LoginFormProps {
  currentUser: SafeUser | null;
}
const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {
  const router = useRouter();
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      router.push("/cart");
      router.refresh();
    }
  }, [currentUser, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsloading(true);
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsloading(false);

      if (callback?.ok) {
        router.push("/cart");
        router.refresh();
        toast.success("Logged In");
      }
      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };


  if (currentUser) {
    return <p className="text-center">Logged in. Redirecting...</p>;
  }

  return (
    <>
      <Heading title="Sign in to E~shop" />
      <Button
        outline
        label="Continue with Google"
        icon={AiOutlineGoogle}
        onClick={()=>{signIn("google")}}
      />
      <hr className="bg-slate-300 w-full h-px" />

      <Input
        id="email"
        label="Email"
        disable={isloading}
        required
        register={register}
        errors={errors}
      />

      <Input
        id="password"
        label="Password"
        disable={isloading}
        required
        register={register}
        errors={errors}
        type="password"
      />

      <Button
        label={isloading ? "Loading..." : "Login"}
        onClick={handleSubmit(onSubmit)}
      />
      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/register" className="underline">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
