"use client";
import { CustomFormField } from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import FormNavigation from "@/components/auth/FormNavigation";
import AuthHeader from "@/components/auth/AuthHeader";
import React from "react";
import { UserLoginFormData, userLoginSchema } from "@/lib/schemas";
import { useLoginMutation } from "@/state/api";

const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();

  const methods = useForm<UserLoginFormData>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<UserLoginFormData> = async (
    data: UserLoginFormData
  ) => {
    try {
      const response = await login(data).unwrap();
      console.log("Login response:", response);
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  return (
    <AuthFormContainer>
      <AuthHeader
        title="Welcome to UniCloud! 👋"
        description="Sign in to access and share study materials with your peers."
      />

      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
          className="w-full mt-8 space-y-4 "
        >
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

          <FormNavigation
            mainActionLabel="Sign up"
            secondaryAction={{
              label: "New on our platform?",
              href: "/register",
            }}
            isLoading={isLoading}
          />
        </form>
      </Form>
    </AuthFormContainer>
  );
};

export default LoginPage;
