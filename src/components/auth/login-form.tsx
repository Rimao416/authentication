  "use client";
  import * as z from "zod";
  import { useForm } from "react-hook-form";
  import { CardWrapper } from "./card-wrapper";
  import { zodResolver } from "@hookform/resolvers/zod";
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { LoginSchema } from "@/schemas";
  import { Input } from "../ui/input";
  import { Button } from "../ui/button";
  import { FormError } from "../form-error";
  import { login } from "../../../actions/login";
  import { useState, useTransition } from "react";
  import { FormSuccess } from "../form-success";
  import { useSearchParams } from "next/navigation";
  import Link from "next/link";
  export const LoginForm = () => {
    const searchParams = useSearchParams();
    const urlError =
      searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use"
        : "";
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof LoginSchema>>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
      setError("");
      setSuccess("");
      startTransition(() => {
        login(values)
          .then((data) => {
            if (data?.error) {
              setError(data.error);
              form.reset();
            }
            if (data?.success) {
              form.reset();
              setSuccess(data.success);
            }
            if (data?.twoFactor) {
              setShowTwoFactor(true);
            }
          })
          .catch((err) => console.log(err));
      });
    };
    return (
      <CardWrapper
        headerLabel="Welcome back"
        backButtonLabel="Don't have an account ?"
        backButtonHref="/auth/register"
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Code"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!showTwoFactor && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email"
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Password"
                            type="password"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <Button size="sm" variant="link" asChild>
                          <Link href="/auth/reset" className="px-0 font-normal">
                            Forgot Password
                          </Link>
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!form.formState.isValid}
            >
              {showTwoFactor ? "Submit" : "Login"}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    );
  };
