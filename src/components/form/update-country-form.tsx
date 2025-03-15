"use client";

import { LoadingButton } from "@/components/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectCountry } from "@/db/schema";
import { updateCountry } from "@/lib/actions/countries";
import { deleteFile, uploadFile } from "@/lib/actions/uploadthing";
import { formatLabel, getFileKey } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UploadedFileData } from "uploadthing/types";
import z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  countryCode: z
    .string()
    .min(3, "Country code is required")
    .max(3, "Country code max 3 char.ISO 3"),
  currency: z
    .string()
    .min(3, "Currency is required")
    .max(3, "Currency max 3 char"),
  geojson: z.instanceof(File).optional(),
});

type formValues = z.infer<typeof formSchema>;

interface UpdateCountryFormProps {
  country: SelectCountry;
}

export function UpdateCountryForm({ country }: UpdateCountryFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: country.name,
      countryCode: country.countryCode,
      currency: country.currency,
      geojson: undefined,
    },
  });

  const onSubmit = async (values: formValues) => {
    setIsLoading(true);

    try {
      let geojsonUrl: UploadedFileData | null = null;

      const { geojson, ...datas } = values;

      if (geojson) {
        if (country.geojsonUrl && getFileKey(country.geojsonUrl)) {
          await deleteFile(country.geojsonUrl);
        }
        geojsonUrl = await uploadFile(geojson);
      }

      await updateCountry(country.id, {
        ...datas,
        geojsonUrl: geojsonUrl?.ufsUrl,
      });

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

  const onGeojsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    form.setValue("geojson", file);
    form.trigger("geojson");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8")}>
        <div className="flex w-full flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-primary">Update Country</h1>
        </div>

        {(["name", "countryCode", "currency"] as const).map((name, i) => (
          <FormField
            key={i}
            name={name}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">
                  {formatLabel(name)}
                </FormLabel>
                <FormControl>
                  <Input type="text" placeholder="fill..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <FormField
          name={"geojson"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{field.name}</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".geojson"
                  placeholder="Banana"
                  onChange={onGeojsonChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton isLoading={isLoading}>Submit</LoadingButton>
      </form>
    </Form>
  );
}
