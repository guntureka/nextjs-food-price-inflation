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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/loading-button";
import { useState } from "react";
import { toast } from "sonner";
import { SelectFood } from "@/db/schema";
import { updateFood } from "@/lib/actions/foods";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type formValues = z.infer<typeof formSchema>;

interface UpdateFoodFormProps {
  food: SelectFood;
}

export function UpdateFoodForm({ food }: UpdateFoodFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: food.name,
      description: food.description ?? "",
    },
  });

  const onSubmit = async (values: formValues) => {
    setIsLoading(true);
    try {
      await updateFood(food.id, values);

      toast.success("Succes");
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error", { description: error.message });
      } else {
        toast.error("Error", { description: "Something wen't wrong." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8")}>
        <div className="flex w-full flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-primary">Update Food</h1>
        </div>

        {(["name", "description"] as const).map((name, i) => (
          <FormField
            key={i}
            name={name}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">{field.name}</FormLabel>
                <FormControl>
                  {name == "description" ? (
                    <Textarea placeholder="Banana is ..." {...field} />
                  ) : (
                    <Input type="text" placeholder="Banana" {...field} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <LoadingButton isLoading={isLoading}>Submit</LoadingButton>
      </form>
    </Form>
  );
}
