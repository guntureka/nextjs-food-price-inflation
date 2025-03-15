"use client";

import { SelectCountry, SelectFood } from "@/db/schema";
import { getCountries } from "@/lib/actions/countries";
import { createFoodPrices } from "@/lib/actions/food-prices";
import { getFoods } from "@/lib/actions/foods";
import { ExportExcel, importExcel } from "@/lib/excel";
import { zodResolver } from "@hookform/resolvers/zod";
import { getMonth, getYear } from "date-fns";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ImportButton } from "./import-button";

const formSchema = z.object({
  file: z.instanceof(File),
  foodId: z.string().min(1, "Food is required"),
  countryId: z.string().min(1, "Country is required"),
});

// Skema validasi untuk data dalam file Excel
const excelSchema = z.array(
  z.object({
    date: z.coerce.date(),
    open: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
    low: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
    high: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
    close: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
  }),
);

type formValues = z.infer<typeof formSchema>;
type excelValues = z.infer<typeof excelSchema.element>;

interface FoodPriceImportButtonProps {
  foods: SelectFood[];
  countries: SelectCountry[];
}

export function FoodPriceImportButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: foods, isLoading: isFoodsLoading } = useSWR("foods", getFoods);
  const { data: countries, isLoading: isCountriesLoading } = useSWR(
    "countries",
    getCountries,
  );

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
      foodId: "",
      countryId: "",
    },
  });

  const onSubmit = async (values: formValues) => {
    setIsLoading(true);
    try {
      const parsedData = await importExcel(values.file);

      const result = excelSchema.safeParse(parsedData);

      if (!result.success) {
        console.log(result.error);
        throw new Error(
          "Invalid file format. Please use the correct template.",
        );
      }

      const results = result.data.map((v) => ({
        ...v,
        foodId: values.foodId,
        countryId: values.countryId,
        year: getYear(v.date),
        month: getMonth(v.date),
      }));

      await createFoodPrices(results);

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
    return ExportExcel<excelValues>("food-price-example", [
      {
        date: new Date(),
        open: 123.4,
        low: 123.4,
        high: 123.4,
        close: 123.4,
      },
    ]);
  };

  return (
    <ImportButton>
      <Button className="mb-4 w-full" type="button" onClick={onExampleClick}>
        Example
      </Button>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
          }}
          className="space-y-4"
        >
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
          <FormField
            name={"countryId"}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">Country</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries &&
                        countries.map((v, i) => (
                          <SelectItem
                            key={i}
                            value={v.id}
                            className="capitalize"
                          >
                            {v.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={"foodId"}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">Food</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a food" />
                    </SelectTrigger>
                    <SelectContent>
                      {foods &&
                        foods.map((v, i) => (
                          <SelectItem
                            key={i}
                            value={v.id}
                            className="capitalize"
                          >
                            {v.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
