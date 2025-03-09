"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { LoadingButton } from "../loading-button";
import { useState } from "react";
import { toast } from "sonner";

// const formSchema = z.object({
//   open: z.number().or(z.string().pipe(z.number())),
//   low: z.number().or(z.string().pipe(z.number())),
//   high: z.number().or(z.string().pipe(z.number())),
//   close: z.number().or(z.string().pipe(z.number())),
//   date: z.date(),
//   year: z.number(),
//   month: z.number(),
//   foodId: z.string(),
//   countryId: z.string(),
// });

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type formValues = z.infer<typeof formSchema>;

export function CreateFoodForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: formValues) => {
    setIsLoading(true);
    console.log(values);
    toast.success("Success");
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8")}>
        <div className="flex w-full flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-primary">Create Food</h1>
        </div>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{field.name}</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Banana" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{field.name}</FormLabel>
              <FormControl>
                <Textarea placeholder="Banana is ..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <LoadingButton isLoading={isLoading}>Submit</LoadingButton>
      </form>
    </Form>
  );
}
