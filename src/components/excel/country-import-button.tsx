"use client";

import { createCountries } from "@/lib/actions/countries";
import { ExportExcel, importExcel } from "@/lib/excel";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { LoadingButton } from "../loading-button";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ImportButton } from "./import-button";

const formSchema = z.object({
  file: z.instanceof(File),
});

// Skema validasi untuk data dalam file Excel
const excelSchema = z.array(
  z.object({
    name: z.string().min(1, "Name is required"),
    countryCode: z
      .string()
      .min(1, "Country Code is required")
      .max(3, "Max char 3"),
    currency: z
      .string()
      .min(1, "Currency Code is required")
      .max(3, "Max char 3"),
  }),
);

type formValues = z.infer<typeof formSchema>;
type excelValues = z.infer<typeof excelSchema.element>;

export function CountryImportButton() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = async (values: formValues) => {
    setIsLoading(true);
    try {
      const parsedData = await importExcel(values.file);
      console.log(parsedData);

      const result = excelSchema.safeParse(parsedData);

      if (!result.success) {
        console.log(result.error);
        throw new Error(
          "Invalid file format. Please use the correct template.",
        );
      }

      await createCountries(result.data);

      toast.success("Success");
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

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    form.setValue("file", file);
    form.trigger("file");
  };

  const onExampleClick = () => {
    return ExportExcel<excelValues>("country-example", [
      {
        name: "",
        countryCode: "",
        currency: "",
      },
    ]);
  };

  return (
    <ImportButton>
      <Button className="mb-4 w-full" onClick={onExampleClick}>
        Example
      </Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="file"
            render={() => (
              <FormItem>
                <FormLabel className="capitalize">file</FormLabel>
                <FormControl>
                  <Input type="file" onChange={onFileChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton isLoading={isLoading}>Submit</LoadingButton>
        </form>
      </Form>
    </ImportButton>
  );
}
