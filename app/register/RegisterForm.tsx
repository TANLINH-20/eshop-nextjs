"use client";

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";
import { signIn } from "next-auth/react";
interface RegisterFormProps {
  currentUser: SafeUser | null;
}
const RegisterForm: React.FC<RegisterFormProps> = ({ currentUser }) => {
  const router = useRouter();
  useEffect(() => {
    if (currentUser) {
      router.push("/cart");
      router.refresh();
    }
  }, [currentUser, router]);
  const [isloading, setIsloading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsloading(true);
    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("Account created");

        signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        }).then((callback) => {
          if (callback?.ok) {
            router.push("/cart");
            router.refresh();
            toast.success("Logged In");
          }
          if (callback?.error) {
            toast.error(callback.error);
          }
        });
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsloading(false);
      });
  };
  if (currentUser) {
    return <p className="text-center">Logged in. Redirecting...</p>;
  }
  return (
    <>
      <Heading title="Sign up for E~shop" />
      <Button
        outline
        label="Continue with Google"
        icon={AiOutlineGoogle}
        onClick={() => signIn("google")}
      />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="name"
        label="Name"
        disable={isloading}
        required
        register={register}
        errors={errors}
      />

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
        label={isloading ? "Loading..." : "Sign Up"}
        onClick={handleSubmit(onSubmit)}
      />
      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log In
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
