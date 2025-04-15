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
// import { deleteFile, uploadFile } from "@/lib/actions/uploadthing";
import { deleteFile, uploadFile } from "@/lib/actions/minio";
import { readGeojsonFile } from "@/lib/geojson";
import { formatLabel, getFileKey } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FeatureCollection } from "geojson";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import z from "zod";
import { MapCaller } from "../leaflet/map-caller";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
  const [preview, setPreview] = useState<
    { data?: Record<string, any>; geojson?: FeatureCollection | null }[]
  >([]);
  const { data: geojsonFile, error } = useSWR(
    country.geojsonUrl ? country.geojsonUrl : null,
    fetcher,
  );

  useEffect(() => {
    if (geojsonFile) {
      try {
        setPreview([{ geojson: geojsonFile }]);
      } catch (err) {
        toast.error("Error parsing GeoJSON");
      }
    }
  }, [geojsonFile]);

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
      let geojsonUrl: string | null = null;

      const { geojson, ...datas } = values;

      if (geojson) {
        if (country.geojsonUrl && getFileKey(country.geojsonUrl)) {
          const key = getFileKey(country.geojsonUrl);
          key && (await deleteFile(key));
        }
        geojsonUrl = await uploadFile(geojson);
      }

      await updateCountry(country.id, {
        ...datas,
        geojsonUrl: geojsonUrl,
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

  const onGeojsonChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const geojson = await readGeojsonFile(file);

      setPreview([
        {
          geojson,
        },
      ]);

      console.log(preview);

      form.setValue("geojson", file);
      form.trigger("geojson");
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error", { description: error.message });
      } else {
        toast.error("Error", { description: "Something wen't wrong" });
      }
    }
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

        <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-gray-300">
          <MapCaller datas={preview} />
        </div>

        <LoadingButton isLoading={isLoading}>Submit</LoadingButton>
      </form>
    </Form>
  );
}
