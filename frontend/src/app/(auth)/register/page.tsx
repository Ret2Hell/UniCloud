"use client";
import { CustomFormField } from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import FormNavigation from "@/components/auth/FormNavigation";
import AuthHeader from "@/components/auth/AuthHeader";
import React from "react";
import {
  UserRegistrationFormData,
  userRegistrationSchema,
} from "@/lib/schemas";
import { useRegisterMutation } from "@/state/api";

const RegisterPage = () => {
  const [register, { isLoading }] = useRegisterMutation();

  const methods = useForm<UserRegistrationFormData>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<UserRegistrationFormData> = async (
    data: UserRegistrationFormData
  ) => {
    try {
      const { username, email, password } = data;
      const response = await register({
        username,
        email,
        password,
      }).unwrap();
      console.log("Registration response:", response);
    } catch (error) {
      console.error("Failed to register:", error);
    }
  };

  return (
    <AuthFormContainer>
      <AuthHeader
        title="Join the community today 🚀"
        description="Register to start sharing and exploring university resources effortlessly!"
      />

      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
          className="w-full mt-8 space-y-4 "
        >
          <CustomFormField
            name="username"
            label="Username"
            type="text"
            placeholder="eg. johndoe"
          />
          <CustomFormField
            name="email"
            label="Email"
            type="email"
            placeholder="example@gmail.com"
          />
          <CustomFormField
            name="password"
            label="Password"
            type="password"
            placeholder="********"
          />
          <CustomFormField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="********"
          />

          <FormNavigation
            mainActionLabel="Sign up"
            secondaryAction={{
              label: "Already have an account?",
              href: "/login",
            }}
            isLoading={isLoading}
          />
        </form>
      </Form>
    </AuthFormContainer>
  );
};

export default RegisterPage;
